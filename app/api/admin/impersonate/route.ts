import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import * as jose from "jose";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { targetUserId } = body;

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";

    if (targetUser.role === "ADMIN") {
      await prisma.auditLog.create({
        data: {
          adminId: session.user.id,
          targetId: targetUser.id,
          action: "DENIED_TARGET_ADMIN",
          ipAddress,
        },
      });
      return NextResponse.json({ error: "Cannot impersonate an ADMIN" }, { status: 403 });
    }

    const sessionId = crypto.randomUUID();

    await prisma.auditLog.create({
      data: {
        adminId: session.user.id,
        targetId: targetUser.id,
        action: "START_IMPERSONATION",
        sessionId,
        ipAddress,
      },
    });

    const secretKey = process.env.IMPERSONATION_SECRET;
    if (!secretKey) {
       throw new Error("IMPERSONATION_SECRET environment variable is not set");
    }

    const secret = new TextEncoder().encode(secretKey);
    const jti = crypto.randomUUID();

    const impersonationPayload = {
      sub: targetUser.id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      picture: targetUser.image,
      impersonationSessionId: sessionId,
      jti,
    };

    const token = await new jose.SignJWT(impersonationPayload)
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30s")
      .sign(secret);

    return NextResponse.json({ token });
  } catch (error) {
    console.error("[IMPERSONATE_ERROR]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}
