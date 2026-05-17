import type { Node, Edge } from "@xyflow/react";
import type { KnowledgeNodeData } from "@/components/zeronode/knowledge-node";

export interface HealthScore {
  total: number;
  breakdown: {
    nodeCount: number;      // max 25
    connectivity: number;   // max 35
    contentDepth: number;   // max 25
    typeDiversity: number;  // max 15
  };
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  insight: string;
}

export function computeHealthScore(
  nodes: Node<KnowledgeNodeData>[],
  edges: Edge[]
): HealthScore {
  if (nodes.length === 0) {
    return {
      total: 0,
      breakdown: { nodeCount: 0, connectivity: 0, contentDepth: 0, typeDiversity: 0 },
      grade: "F",
      insight: "Add nodes to start building your graph",
    };
  }

  // Node count score (max 25)
  const nodeCount = Math.min(25, Math.floor((nodes.length / 20) * 25));

  // Connectivity score (max 35)
  const avgConnections = edges.length > 0
    ? (edges.length * 2) / nodes.length
    : 0;
  const connectivity = Math.min(35, Math.floor((avgConnections / 3) * 35));

  // Content depth score (max 25)
  const nodesWithContent = nodes.filter(
    (n) => n.data.content && (n.data.content as string).length > 30
  ).length;
  const contentDepth = Math.min(
    25,
    Math.floor((nodesWithContent / nodes.length) * 25)
  );

  // Type diversity score (max 15)
  const uniqueTypes = new Set(nodes.map((n) => n.data.nodeType)).size;
  const typeDiversity = Math.min(15, Math.floor((uniqueTypes / 5) * 15));

  const total = nodeCount + connectivity + contentDepth + typeDiversity;

  const grade =
    total >= 90 ? "S"
    : total >= 75 ? "A"
    : total >= 60 ? "B"
    : total >= 40 ? "C"
    : total >= 20 ? "D"
    : "F";

  const insight =
    connectivity < 10
      ? "Connect more nodes to strengthen your graph"
      : contentDepth < 10
      ? "Expand node content with AI to improve depth"
      : typeDiversity < 8
      ? "Add varied node types for a richer graph"
      : nodeCount < 10
      ? "Keep adding nodes to grow your knowledge base"
      : "Your graph is well-structured — keep going!";

  return { total, breakdown: { nodeCount, connectivity, contentDepth, typeDiversity }, grade, insight };
}
