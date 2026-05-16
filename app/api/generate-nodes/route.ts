import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt" }), { 
        status: 400 
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        stream: true,
        system: `You are a knowledge graph AI. Given a topic or learning goal,
generate exactly 7 knowledge nodes that form a connected learning structure.
Respond ONLY with a valid JSON array. No markdown, no backticks, no explanation.
Each object must have these exact fields:
- title: string (max 4 words)
- description: string (max 12 words)
- nodeType: one of exactly: concept, note, code, idea, roadmap, topic, research
- connections: array of 0-2 other node titles from the same response

Example format:
[{"title":"Load Balancing","description":"Distribute traffic across servers for reliability","nodeType":"concept","connections":["API Gateway"]}]`,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: "Claude API error" }), { 
        status: 500 
      });
    }

    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.trim());

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;
              try {
                const parsed = JSON.parse(data);
                if (parsed.type === "content_block_delta") {
                  const delta = parsed.delta?.text || "";
                  fullText += delta;
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ delta, fullText })}\n\n`
                    )
                  );
                }
                if (parsed.type === "message_stop") {
                  controller.enqueue(
                    new TextEncoder().encode(
                      `data: ${JSON.stringify({ done: true, fullText })}\n\n`
                    )
                  );
                }
              } catch {
                // skip malformed chunks
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error("Stream error:", err);
    return new Response(JSON.stringify({ error: "Stream failed" }), { 
      status: 500 
    });
  }
}
