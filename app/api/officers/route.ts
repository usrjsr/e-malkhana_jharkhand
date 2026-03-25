import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";

/* GET — list active officers (excluding the current user) */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await connectDB();

  const userId = (session.user as any).id;
  const officers = await User.find({
    _id: { $ne: userId },
    status: "ACTIVE",
    role: { $in: ["OFFICER", "CLERK"] },
  })
    .select("fullName officerId policeStation")
    .sort({ fullName: 1 })
    .lean();

  return NextResponse.json(officers);
}
