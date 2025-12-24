import { NextRequest } from "next/server";
import DB from "@/lib/prisma";
import { errorResponse, handleApiError, successResponse } from "@/lib/response";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return errorResponse("Product slug is required", 400);
    }

    const product = await DB.product.findUnique({
      where: { slug },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    if (!product) {
      return errorResponse("Product not found", 404);
    }

    return successResponse(product);
  } catch (error) {
    return handleApiError(error, "Error fetching product");
  }
}
