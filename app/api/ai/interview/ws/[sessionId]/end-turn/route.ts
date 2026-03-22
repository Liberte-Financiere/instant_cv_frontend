import { NextResponse } from "next/server";
import { sendTurnComplete } from "@/lib/interview-audio";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params;
    
    // Validate session
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    sendTurnComplete(sessionId);

    return NextResponse.json({ success: true, message: "Turn complete sent" });
  } catch (error) {
    console.error("[EndTurn API Error]", error);
    return NextResponse.json({ error: "Failed to end turn" }, { status: 500 });
  }
}
