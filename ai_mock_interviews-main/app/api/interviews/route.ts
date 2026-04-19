import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const interviews = await Interview.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Interview.countDocuments({ userId: user.id });

    return Response.json({
      interviews,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("[GET_INTERVIEWS_ERROR]", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
