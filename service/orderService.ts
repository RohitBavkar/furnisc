import { auth } from "@clerk/nextjs/server";
import {
  getCustomerIdByClerkUserId,
  getOrdersByCustomerId,
  getOrderById,
} from "@/dao/orderDao";

export interface TransformedOrder {
  _id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  itemCount: number;
  itemImages: string[];
  itemNames: string[];
}

export interface TransformedOrderDetail {
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  email: string;
  items: {
    _key: string;
    quantity: number;
    priceAtPurchase: number;
    product: {
      name: string;
      slug: string;
      image: {
        asset: {
          url: string | null;
        };
      };
    };
  }[];
}

/**
 * Transform raw order data to UI format (Business Logic)
 */
function transformOrders(orders: any[]): TransformedOrder[] {
  return orders.map((order) => ({
    _id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    itemCount: order.items.reduce(
      (sum: number, item: any) => sum + item.quantity,
      0
    ),
    itemImages: order.items
      .map((item: any) => item.product.images[0]?.url ?? null)
      .filter((url: string | null): url is string => url !== null),
    itemNames: order.items.map((item: any) => item.product.name),
  }));
}

/**
 * Transform raw order detail data to UI format (Business Logic)
 */
function transformOrderDetail(order: any): TransformedOrderDetail {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.total,
    createdAt: order.createdAt,
    email: order.customer.email,
    items: order.items.map((item: any) => ({
      _key: item.id,
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
      product: {
        name: item.product.name,
        slug: item.product.slug,
        image: {
          asset: {
            url: item.product.images[0]?.url ?? null,
          },
        },
      },
    })),
  };
}

/**
 * Service Layer - Authentication + Business Logic
 * Get all orders for the authenticated user
 */
export async function getOrdersByClerkUserId(): Promise<TransformedOrder[]> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return [];
    }

    const customerId = await getCustomerIdByClerkUserId(userId);

    if (!customerId) {
      return [];
    }

    const orders = await getOrdersByCustomerId(customerId);

    // Apply business logic: transform raw data to UI format
    return transformOrders(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
}

/**
 * Service Layer - Authentication + Business Logic
 * Get order detail for the authenticated user
 */
export async function getOrderDetailById(
  orderId: string
): Promise<TransformedOrderDetail | null> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const order = await getOrderById(orderId);

    // Verify order exists and belongs to current user
    if (!order || order.customer.clerkUserId !== userId) {
      return null;
    }

    // Apply business logic: transform raw data to UI format
    return transformOrderDetail(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return null;
  }
}
