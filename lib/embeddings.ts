import { toast } from "sonner";

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function embedText(text: string): Promise<number[] | null> {
  try {
    const res = await fetch("/api/embed-node", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => null);
      if (errData?.error?.includes("configured")) {
        toast.error("Live AI features require API keys. See README to self-host, or contact the demo owner.", { duration: 6000 });
        return null;
      }
    }
    const data = await res.json();
    return data.embedding ?? null;
  } catch {
    return null;
  }
}

export function findRelatedNodes(
  targetEmbedding: number[],
  allNodes: { id: string; data: { title: string; embedding?: number[] } }[],
  excludeId: string,
  topK = 3
): { id: string; title: string; score: number }[] {
  return allNodes
    .filter((n) => n.id !== excludeId && n.data.embedding)
    .map((n) => ({
      id: n.id,
      title: n.data.title,
      score: cosineSimilarity(targetEmbedding, n.data.embedding!),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
