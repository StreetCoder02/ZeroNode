import type { Node, Edge } from "@xyflow/react";

export function encodeGraph(nodes: Node[], edges: Edge[]): string {
  try {
    const data = JSON.stringify({ nodes, edges });
    const encoded = btoa(encodeURIComponent(data));
    return encoded;
  } catch {
    return "";
  }
}

export function decodeGraph(
  encoded: string
): { nodes: Node[]; edges: Edge[] } | null {
  try {
    const data = decodeURIComponent(atob(encoded));
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function buildShareUrl(nodes: Node[], edges: Edge[]): string {
  const encoded = encodeGraph(nodes, edges);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  return `${baseUrl}/app?graph=${encoded}`;
}
