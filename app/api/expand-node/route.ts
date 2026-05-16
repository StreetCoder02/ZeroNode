import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    if (!title) return NextResponse.json({ error: "No title" }, { status: 400 });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: `You are a knowledge expansion AI. Given a topic title and 
optional existing notes, write a clear, concise explanation in 3-5 sentences.
Cover: what it is, why it matters, and one practical example.
Write in plain text only. No markdown, no bullet points, no headers.
Be direct and educational. Max 120 words.`,
        messages: [
          {
            role: "user",
            content: `Title: ${title}\nExisting notes: ${content || "none"}`,
          },
        ],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) return NextResponse.json({ error: "No response" }, { status: 500 });

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Expand node error:", err);
    return NextResponse.json({ error: "Expansion failed" }, { status: 500 });
  }
}
