import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminId = session.user.impersonatedBy;
    const targetId = session.user.id;
    const sessionId = session.user.impersonationSessionId;

    if (!adminId) {
      return NextResponse.json({ error: "Not currently impersonating" }, { status: 400 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    await prisma.auditLog.create({
      data: {
        adminId,
        targetId,
        action: "STOP_IMPERSONATION",
        sessionId: sessionId || null,
        ipAddress,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[IMPERSONATE_STOP_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
