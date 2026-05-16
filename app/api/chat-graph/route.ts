import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }
    const { question, nodes } = await req.json();
    if (!question || !nodes) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    const knowledgeContext = nodes
      .map(
        (n: {
          title: string;
          content?: string;
          preview?: string;
          nodeType: string;
        }) =>
          `- [${n.nodeType.toUpperCase()}] ${n.title}: ${
            n.content || n.preview || "no content"
          }`
      )
      .join("\n");

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
              content: `You are a knowledge assistant. You ONLY answer 
based on the user's knowledge graph nodes provided below.
If the answer is not in their nodes, say exactly:
"I don't see anything about that in your graph yet. 
Try generating some nodes on this topic first."
Be conversational, concise, max 4 sentences.
Never make up information not present in the nodes.

USER'S KNOWLEDGE GRAPH:
${knowledgeContext}`,
            },
            {
              role: "user",
              content: question,
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

    return NextResponse.json({ answer: text });
  } catch (err) {
    console.error("Chat graph error:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
