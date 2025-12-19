import { successResponse, handleApiError } from "@/lib/response";
import DB from "@/lib/prisma";

export async function GET() {
  try {
    const products = await DB.product.findMany({
      where: {
        featured: true,
      },
      include: {
        images: true,
      },
    });
    return successResponse(products);
  } catch (error) {
    return handleApiError(error, "Error fetching products");
  }
}
