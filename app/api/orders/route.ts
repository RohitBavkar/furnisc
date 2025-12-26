import { NextResponse } from "next/server";
import { getOrdersByClerkUserId } from "@/service/orderService";

/**
 * API Route - For client-side calls only
 * Server Components should call the service layer directly
 */
export async function GET() {
  try {
    const orders = await getOrdersByClerkUserId();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
