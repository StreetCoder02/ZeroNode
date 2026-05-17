import { useCallback, useRef, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { KnowledgeNodeData } from "@/components/zeronode/knowledge-node";

interface GraphSnapshot {
  nodes: Node<KnowledgeNodeData>[];
  edges: Edge[];
}

export function useHistory(
  setNodes: (nodes: Node<KnowledgeNodeData>[]) => void,
  setEdges: (edges: Edge[]) => void
) {
  const past = useRef<GraphSnapshot[]>([]);
  const future = useRef<GraphSnapshot[]>([]);
  const isUndoRedoing = useRef(false);

  const pushSnapshot = useCallback(
    (nodes: Node<KnowledgeNodeData>[], edges: Edge[]) => {
      if (isUndoRedoing.current) return;
      past.current.push({ nodes: structuredClone(nodes), edges: structuredClone(edges) });
      if (past.current.length > 30) past.current.shift();
      future.current = [];
    },
    []
  );

  const undo = useCallback(
    (currentNodes: Node<KnowledgeNodeData>[], currentEdges: Edge[]) => {
      if (past.current.length === 0) return;
      const prev = past.current.pop()!;
      future.current.push({
        nodes: structuredClone(currentNodes),
        edges: structuredClone(currentEdges),
      });
      isUndoRedoing.current = true;
      setNodes(prev.nodes);
      setEdges(prev.edges);
      setTimeout(() => { isUndoRedoing.current = false; }, 100);
    },
    [setNodes, setEdges]
  );

  const redo = useCallback(
    (currentNodes: Node<KnowledgeNodeData>[], currentEdges: Edge[]) => {
      if (future.current.length === 0) return;
      const next = future.current.pop()!;
      past.current.push({
        nodes: structuredClone(currentNodes),
        edges: structuredClone(currentEdges),
      });
      isUndoRedoing.current = true;
      setNodes(next.nodes);
      setEdges(next.edges);
      setTimeout(() => { isUndoRedoing.current = false; }, 100);
    },
    [setNodes, setEdges]
  );

  return { pushSnapshot, undo, redo };
}
