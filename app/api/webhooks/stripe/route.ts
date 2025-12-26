import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import DB from "@/lib/prisma";
import {
  getCustomerByClerkUserId,
  getCustomerByEmail,
  createCustomer,
  updateCustomerClerkUserId,
} from "@/dao/customerDao";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const stripePaymentId = session.payment_intent as string;

  try {
    if (!stripePaymentId) {
      console.error("Missing payment_intent in checkout session");
      return;
    }

    // Idempotency check: prevent duplicate processing on webhook retries
    const existingOrder = await DB.order.findUnique({
      where: { stripePaymentId },
      select: { id: true },
    });

    if (existingOrder) {
      console.log(
        `Webhook already processed for payment ${stripePaymentId}, skipping`
      );
      return;
    }

    // Extract metadata
    const {
      clerkUserId,
      userEmail,
      productIds: productIdsString,
      quantities: quantitiesString,
    } = session.metadata ?? {};

    if (!clerkUserId || !productIdsString || !quantitiesString) {
      console.error("Missing metadata in checkout session");
      return;
    }

    const productIds = productIdsString.split(",");
    const quantities = quantitiesString.split(",").map(Number);

    // Get line items from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

    // Build order items array for Prisma
    const orderItems = productIds.map((productId, index) => ({
      productId,
      quantity: quantities[index] ?? 0,
      priceAtPurchase: lineItems.data[index]?.amount_total
        ? (lineItems.data[index].amount_total as number) / 100
        : 0,
    }));

    // Generate order number
    const orderNumber = `ORD-${Date.now()
      .toString(36)
      .toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;

    // Resolve or create customer in Prisma using DAO
    const email = userEmail ?? session.customer_details?.email ?? "";
    const name =
      session.customer_details?.name ??
      (email ? email.split("@")[0] : "Customer");

    let customer: Awaited<ReturnType<typeof getCustomerByClerkUserId>> = null;
    if (clerkUserId) {
      customer = await getCustomerByClerkUserId(clerkUserId);
    }
    if (!customer && email) {
      customer = await getCustomerByEmail(email);
    }
    if (!customer) {
      customer = await createCustomer({
        clerkUserId: clerkUserId ?? `guest-${Date.now()}`,
        email: email || `guest-${Date.now()}@example.com`,
        name,
      });
    } else if (clerkUserId && customer.clerkUserId !== clerkUserId) {
      // Ensure clerkUserId is linked if missing
      await updateCustomerClerkUserId(customer.id, clerkUserId);
    }

    // Create order and update stock atomically via Prisma transaction
    const totalAmount = (session.amount_total ?? 0) / 100;
    await DB.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          total: totalAmount,
          status: "paid",
          stripePaymentId,
          customerId: customer!.id,
          items: {
            create: orderItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
        },
        select: { id: true },
      });

      // Decrement stock for each product
      for (let i = 0; i < productIds.length; i++) {
        const pid = productIds[i];
        const qty = quantities[i] ?? 0;
        if (qty > 0) {
          await tx.product.update({
            where: { id: pid },
            data: { stock: { decrement: qty } },
          });
        }
      }

      console.log(`Order created: ${order.id} (${orderNumber})`);
      console.log(`Stock updated for ${productIds.length} products`);
    });
  } catch (error) {
    console.error("Error handling checkout.session.completed:", error);
    throw error; // Re-throw to return 500 and trigger Stripe retry
  }
}
