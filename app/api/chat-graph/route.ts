import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, nodes } = await req.json();
    if (!question || !nodes) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const knowledgeContext = nodes
      .map((n: { title: string; content?: string; preview?: string; nodeType: string }) => 
        `- [${n.nodeType.toUpperCase()}] ${n.title}: ${n.content || n.preview || "no content"}`
      )
      .join("\n");

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
        system: `You are a knowledge assistant. You ONLY answer based on 
the user's knowledge graph nodes provided below. 
If the answer isn't in their nodes, say: 
"I don't see anything about that in your graph yet. 
Try generating some nodes on this topic first."
Be conversational, concise, max 4 sentences.
Never make up information not present in the nodes.

USER'S KNOWLEDGE GRAPH:
${knowledgeContext}`,
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();
    const text = data.content?.[0]?.text;
    if (!text) {
      return NextResponse.json({ error: "No response" }, { status: 500 });
    }

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("Chat graph error:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
