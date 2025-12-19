import { successResponse, handleApiError } from "@/lib/response";
import DB from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await DB.category.findMany({
      orderBy: {
        title: "asc",
      },
    });
    return successResponse(categories);
  } catch (error) {
    return handleApiError(error, "Error fetching categories");
  }
}
