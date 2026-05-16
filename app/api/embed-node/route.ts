import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }
    const { text } = await req.json();
    if (!text) return NextResponse.json({ error: "No text" }, { status: 400 });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text }] },
        }),
      }
    );

    const data = await response.json();
    const embedding = data.embedding?.values;
    if (!embedding) {
      return NextResponse.json({ error: "No embedding returned" }, { status: 500 });
    }

    return NextResponse.json({ embedding });
  } catch (err) {
    console.error("Embed error:", err);
    return NextResponse.json({ error: "Embedding failed" }, { status: 500 });
  }
}
