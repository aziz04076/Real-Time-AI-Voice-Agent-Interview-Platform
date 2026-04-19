import { connectToDatabase } from "@/lib/mongoose";
import Interview from "@/lib/models/interview.model";
import { getCurrentUser } from "@/lib/actions/auth.action";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return new Response("Unauthorized", { status: 401 });

    await connectToDatabase();

    const interview = await Interview.findOne({
      _id: id,
      userId: user.id
    });

    if (!interview) {
      return new Response("Interview not found", { status: 404 });
    }

    return Response.json({ interview });
  } catch (error: any) {
    console.error("[GET_INTERVIEW_DETAIL_ERROR]", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
