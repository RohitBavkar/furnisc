"use server";

import Stripe from "stripe";
import {
  getCustomerByEmail,
  createCustomer,
  updateCustomerStripeId,
  updateCustomerClerkUserId,
} from "@/dao/customerDao";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not defined");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-12-15.clover",
});

/**
 * Service Layer - Business logic for customer operations
 * Gets or creates a Stripe customer by email
 * Also syncs the customer to Prisma database
 */
export async function getOrCreateStripeCustomer(
  email: string,
  name: string,
  clerkUserId: string
): Promise<{ stripeCustomerId: string; prismaCustomerId: string }> {
  // First, check if customer already exists in Prisma (using DAO)
  const existingCustomer = await getCustomerByEmail(email);

  if (existingCustomer?.stripeCustomerId) {
    // Customer exists, return existing IDs
    return {
      stripeCustomerId: existingCustomer.stripeCustomerId,
      prismaCustomerId: existingCustomer.id,
    };
  }

  // Check if customer exists in Stripe by email
  const existingStripeCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  let stripeCustomerId: string;

  if (existingStripeCustomers.data.length > 0) {
    // Customer exists in Stripe
    stripeCustomerId = existingStripeCustomers.data[0].id;
  } else {
    // Create new Stripe customer
    const newStripeCustomer = await stripe.customers.create({
      email,
      name,
      metadata: {
        clerkUserId,
      },
    });
    stripeCustomerId = newStripeCustomer.id;
  }

  // Create or update customer in Prisma (using DAO)
  if (existingCustomer) {
    // Update existing Prisma customer with Stripe ID
    const updated = await updateCustomerStripeId(
      existingCustomer.id,
      stripeCustomerId
    );
    await updateCustomerClerkUserId(existingCustomer.id, clerkUserId);
    return {
      stripeCustomerId,
      prismaCustomerId: updated.id,
    };
  }

  // Create new customer in Prisma
  const newPrismaCustomer = await createCustomer({
    email,
    name,
    clerkUserId,
    stripeCustomerId,
  });

  return {
    stripeCustomerId,
    prismaCustomerId: newPrismaCustomer.id,
  };
}
