import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return Response.json({ error: "GROQ_API_KEY is not configured." }, { status: 500 });
    }
    const { prompt } = await req.json();
    if (!prompt) {
      return new Response(JSON.stringify({ error: "No prompt" }), {
        status: 400,
      });
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
          max_tokens: 1024,
          stream: true,
          messages: [
            {
              role: "system",
              content: `You are a knowledge graph AI. Given a topic or 
learning goal, generate exactly 7 knowledge nodes that form a connected 
learning structure.
Respond ONLY with a valid JSON array. No markdown, no backticks, 
no explanation, no text before or after the array.
Each object must have these exact fields:
- title: string (max 4 words)
- description: string (max 12 words)
- nodeType: one of exactly: concept, note, code, idea, roadmap, topic, research
- connections: array of 0-2 other node titles from the same response

Example format:
[{"title":"Load Balancing","description":"Distribute traffic across servers for reliability","nodeType":"concept","connections":["API Gateway"]}]`,
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Groq error:", err);
      return new Response(JSON.stringify({ error: "Groq API error" }), {
        status: 500,
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
          const lines = chunk
            .split("\n")
            .filter((l) => l.trim().startsWith("data: "));

          for (const line of lines) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") {
              controller.enqueue(
                new TextEncoder().encode(
                  `data: ${JSON.stringify({ done: true, fullText })}\n\n`
                )
              );
              continue;
            }
            try {
              const parsed = JSON.parse(data);
              const delta =
                parsed.choices?.[0]?.delta?.content || "";
              if (delta) {
                fullText += delta;
                controller.enqueue(
                  new TextEncoder().encode(
                    `data: ${JSON.stringify({ delta, fullText })}\n\n`
                  )
                );
              }
            } catch {
              // skip malformed chunks
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
      status: 500,
    });
  }
}
