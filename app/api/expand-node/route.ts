import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();
    if (!title) {
      return NextResponse.json({ error: "No title" }, { status: 400 });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          max_tokens: 512,
          messages: [
            {
              role: "system",
              content: `You are a knowledge expansion AI. Given a topic 
title and optional existing notes, write a clear concise explanation 
in 3-5 sentences. Cover: what it is, why it matters, and one practical 
example. Write in plain text only. No markdown, no bullet points, 
no headers. Be direct and educational. Max 120 words.`,
            },
            {
              role: "user",
              content: `Title: ${title}\nExisting notes: ${content || "none"}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "No response from Groq" },
        { status: 500 }
      );
    }

    return NextResponse.json({ text });
  } catch (err) {
    console.error("Expand node error:", err);
    return NextResponse.json({ error: "Expansion failed" }, { status: 500 });
  }
}
