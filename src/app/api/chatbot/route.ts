import { NextRequest, NextResponse } from "next/server";
import { getRuleAnswer } from "@/lib/chatbot/knowledge";
import type { BotAction } from "@/lib/chatbot/types";

export const runtime = "nodejs";

interface ChatResponse {
  answer: string;
  actions?: BotAction[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const raw = body?.message;

    if (!raw || typeof raw !== "string") {
      return NextResponse.json({ error: "Ungültige Nachricht" }, { status: 400 });
    }

    const message = raw.trim().slice(0, 500);

    if (!message) {
      return NextResponse.json({ error: "Leere Nachricht" }, { status: 400 });
    }

    const { answer, actions } = getRuleAnswer(message);

    const response: ChatResponse = { answer };
    if (actions && actions.length > 0) {
      response.actions = actions;
    }

    return NextResponse.json(response);
  } catch {
    return NextResponse.json(
      { answer: "Entschuldigung, bitte versuchen Sie es erneut." },
      { status: 200 }
    );
  }
}