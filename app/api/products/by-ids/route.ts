import { NextRequest } from "next/server";
import DB from "@/lib/prisma";
import { errorResponse, handleApiError, successResponse } from "@/lib/response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawIds = searchParams.getAll("ids");
    const ids = rawIds
      .flatMap((s) => s.split(","))
      .map((s) => s.trim())
      .filter(Boolean);

    if (ids.length === 0) {
      return successResponse([]);
    }

    const products = await DB.product.findMany({
      where: { id: { in: ids } },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    return successResponse(products);
  } catch (error) {
    return handleApiError(error, "Error fetching products");
  }
}
