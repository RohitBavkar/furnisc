import DB from "@/lib/prisma";

/**
 * DAO Layer - Pure database access, no business logic
 */

/**
 * Get customer ID by Clerk user ID
 */
export async function getCustomerIdByClerkUserId(
  clerkUserId: string
): Promise<string | null> {
  const customer = await DB.customer.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  return customer?.id ?? null;
}

/**
 * Get all orders for a customer
 */
export async function getOrdersByCustomerId(customerId: string) {
  return await DB.order.findMany({
    where: { customerId },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Get a single order by ID with all relations
 */
export async function getOrderById(orderId: string) {
  return await DB.order.findUnique({
    where: { id: orderId },
    include: {
      customer: true,
      items: {
        include: {
          product: {
            include: {
              images: {
                orderBy: { order: "asc" },
                take: 1,
              },
            },
          },
        },
      },
    },
  });
}

/**
 * Create a new order with items
 */
export async function createOrder(data: {
  customerId: string;
  orderNumber: string;
  total: number;
  status: string;
  stripePaymentId: string;
  items: {
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }[];
}) {
  return await DB.order.create({
    data: {
      customerId: data.customerId,
      orderNumber: data.orderNumber,
      total: data.total,
      status: data.status,
      stripePaymentId: data.stripePaymentId,
      items: {
        create: data.items,
      },
    },
    include: {
      items: true,
    },
  });
}

/**
 * Update order status
 */
export async function updateOrderStatus(orderId: string, status: string) {
  return await DB.order.update({
    where: { id: orderId },
    data: { status },
  });
}

/**
 * Find order by Stripe payment ID
 */
export async function getOrderByStripePaymentId(stripePaymentId: string) {
  return await DB.order.findUnique({
    where: { stripePaymentId },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
}
