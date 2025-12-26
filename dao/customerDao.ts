import DB from "@/lib/prisma";

/**
 * DAO Layer - Pure database access for customers
 */

/**
 * Get customer by Clerk user ID
 */
export async function getCustomerByClerkUserId(clerkUserId: string) {
  return await DB.customer.findUnique({
    where: { clerkUserId },
  });
}

/**
 * Get customer by email
 */
export async function getCustomerByEmail(email: string) {
  return await DB.customer.findUnique({
    where: { email },
  });
}

/**
 * Create a new customer
 */
export async function createCustomer(data: {
  clerkUserId: string;
  email: string;
  name: string;
  stripeCustomerId?: string;
}) {
  return await DB.customer.create({
    data,
  });
}

/**
 * Update customer Clerk user ID
 */
export async function updateCustomerClerkUserId(
  customerId: string,
  clerkUserId: string
) {
  return await DB.customer.update({
    where: { id: customerId },
    data: { clerkUserId },
  });
}

/**
 * Update customer Stripe customer ID
 */
export async function updateCustomerStripeId(
  customerId: string,
  stripeCustomerId: string
) {
  return await DB.customer.update({
    where: { id: customerId },
    data: { stripeCustomerId },
  });
}
