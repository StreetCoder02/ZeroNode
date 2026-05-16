"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { embedText } from "@/lib/embeddings";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
  ReactFlowProvider,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toPng } from "html-to-image";

import KnowledgeNode, { type KnowledgeNodeData } from "./knowledge-node";
import AnimatedEdge from "./animated-edge";
import CanvasToolbar from "./canvas-toolbar";
import AIPanel from "./ai-panel";
import NodeEditorPanel from "./node-editor-panel";
import AIGenerateModal from "./ai-generate-modal";
import EmptyState from "./empty-state";
import CommandPalette from "./command-palette";
import Navbar from "./navbar";
import GraphChat from "./graph-chat";
import NodeFilterBar from "./node-filter-bar";
import type { NodeType } from "./knowledge-node";
import { buildShareUrl, decodeGraph } from "@/lib/share";
import { useSearchParams } from "next/navigation";

const nodeTypes = {
  knowledge: KnowledgeNode,
};

const edgeTypes = {
  animated: AnimatedEdge,
};

const initialNodes: Node<KnowledgeNodeData>[] = [];

const initialEdges: Edge[] = [];

function KnowledgeGraphInner() {
  const searchParams = useSearchParams();
  const { getNodes, fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [activeFilter, setActiveFilter] = useState<NodeType | "all">("all");
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isAIGenerateModalOpen, setIsAIGenerateModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [aiGenerateInitialPrompt, setAiGenerateInitialPrompt] = useState("");
  const [selectedNode, setSelectedNode] = useState<Node<KnowledgeNodeData> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const encoded = searchParams.get("graph");
    if (!encoded) return;
    const decoded = decodeGraph(encoded);
    if (decoded && decoded.nodes.length > 0) {
      setNodes(decoded.nodes);
      setEdges(decoded.edges);
      toast.success("Shared graph loaded");
      window.history.replaceState({}, "", "/app");
    }
  }, [searchParams, setNodes, setEdges]);

  const handleShare = useCallback(() => {
    if (nodes.length === 0) {
      toast.info("Add some nodes before sharing.");
      return;
    }
    const url = buildShareUrl(nodes, edges);
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Share link copied to clipboard");
    }).catch(() => {
      toast.error("Could not copy to clipboard");
    });
  }, [nodes, edges]);

  const handleClearGraph = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const nodeCounts = nodes.reduce((acc, node) => {
    const type = node.data.nodeType as string;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredNodes = activeFilter === "all"
    ? nodes
    : nodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: n.data.nodeType === activeFilter ? 1 : 0.15,
          transition: "opacity 0.3s ease",
        },
      }));

  const onNodeDoubleClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const connectedIds = edges
        .filter((e) => e.source === node.id || e.target === node.id)
        .flatMap((e) => [e.source, e.target]);
      const relatedIds = [...new Set([node.id, ...connectedIds])];
      fitView({
        nodes: relatedIds.map((id) => ({ id })),
        duration: 600,
        padding: 0.3,
      });
    },
    [edges, fitView]
  );

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node as Node<KnowledgeNodeData>);
      setIsAIPanelOpen(false); // Close AI panel when opening node editor
    },
    []
  );

  const handleUpdateNode = useCallback(
    (id: string, data: Partial<KnowledgeNodeData>) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, ...data } }
            : node
        )
      );
      // Update selected node reference
      setSelectedNode((prev) =>
        prev && prev.id === id
          ? { ...prev, data: { ...prev.data, ...data } }
          : prev
      );
    },
    [setNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) => eds.filter((edge) => edge.source !== id && edge.target !== id));
    },
    [setNodes, setEdges]
  );

  const handleRemoveConnection = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges]
  );

  const handleOpenAIPanel = useCallback(() => {
    setIsAIPanelOpen(true);
    setSelectedNode(null); // Close node editor when opening AI panel
  }, []);

  const handleAddGeneratedNodes = useCallback(
    (newNodes: { id: string; title: string; description: string; nodeType: KnowledgeNodeData["nodeType"] }[]) => {
      const baseX = 100;
      const baseY = 100;
      const spacing = 180;
      const nodesPerRow = 3;

      const nodesToAdd: Node<KnowledgeNodeData>[] = newNodes.map((node, index) => ({
        id: `generated-${Date.now()}-${index}`,
        type: "knowledge",
        position: {
          x: baseX + (index % nodesPerRow) * spacing + Math.random() * 40,
          y: baseY + Math.floor(index / nodesPerRow) * 140 + Math.random() * 30,
        },
        data: {
          title: node.title,
          preview: node.description,
          nodeType: node.nodeType,
        },
      }));

      setNodes((nds) => [...nds, ...nodesToAdd]);

      nodesToAdd.forEach(async (node) => {
        const embedding = await embedText(
          node.data.title + " " + (node.data.preview || "")
        );
        if (embedding) {
          setNodes((nds) =>
            nds.map((n) =>
              n.id === node.id
                ? { ...n, data: { ...n.data, embedding } }
                : n
            )
          );
        }
      });
    },
    [setNodes]
  );

  const handleFindRelated = useCallback(
    async (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node) return;
      
      let embedding = node.data.embedding;
      
      if (!embedding) {
        const text = node.data.title + " " + (node.data.preview || "");
        const fetched = await embedText(text);
        if (!fetched) {
          toast.error("Could not generate embedding");
          return;
        }
        embedding = fetched;
        setNodes((nds) =>
          nds.map((n) =>
            n.id === nodeId ? { ...n, data: { ...n.data, embedding } } : n
          )
        );
      }
      
      const { findRelatedNodes } = await import("@/lib/embeddings");
      const related = findRelatedNodes(embedding as number[], nodes as any, nodeId, 3);
      
      if (related.length === 0) {
        toast.info("No related nodes found yet. Add more nodes first.");
        return;
      }
      
      const newEdges = related
        .filter((r) => r.score > 0.7)
        .map((r) => ({
          id: `semantic-${nodeId}-${r.id}`,
          source: nodeId,
          target: r.id,
          type: "animated",
          style: { 
            stroke: "rgba(139, 92, 246, 0.5)", 
            strokeWidth: 1,
            strokeDasharray: "4 4"
          },
          label: `${Math.round(r.score * 100)}% match`,
          labelStyle: { 
            fill: "rgba(139, 92, 246, 0.8)", 
            fontSize: 10 
          },
        }));
      
      if (newEdges.length > 0) {
        setEdges((eds) => {
          const filtered = eds.filter(
            (e) => !e.id.startsWith(`semantic-${nodeId}`)
          );
          return [...filtered, ...newEdges];
        });
        toast.success(
          `Found ${newEdges.length} related node${newEdges.length > 1 ? "s" : ""}`
        );
      } else {
        toast.info("No strongly related nodes found (similarity < 70%)");
      }
    },
    [nodes, setNodes, setEdges]
  );

  const handleCreateBlankNode = useCallback(() => {
    const newNode: Node<KnowledgeNodeData> = {
      id: `node-${Date.now()}`,
      type: "knowledge",
      position: { x: 250 + Math.random() * 100, y: 200 + Math.random() * 100 },
      data: {
        title: "New Node",
        preview: "Click to edit...",
        nodeType: "note",
      },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [setNodes]);

  const handleExport = useCallback(() => {
    const nodesBounds = getNodesBounds(getNodes());
    const imageWidth = 1920;
    const imageHeight = 1080;
    const viewport = getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2,
      0.1
    );

    const viewportEl = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;
    
    if (!viewportEl) return;

    toPng(viewportEl, {
      backgroundColor: "#000000",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: `${imageWidth}px`,
        height: `${imageHeight}px`,
        transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
      },
    }).then((dataUrl) => {
      const a = document.createElement("a");
      a.setAttribute("download", "zeronode-graph.png");
      a.setAttribute("href", dataUrl);
      a.click();
      toast.success("Graph exported as PNG");
    }).catch(() => {
      toast.error("Export failed");
    });
  }, [getNodes]);

  const handleQuickGenerate = useCallback((prompt: string) => {
    setAiGenerateInitialPrompt(prompt);
    setIsAIGenerateModalOpen(true);
  }, []);

  const handleOpenAIGenerateModal = useCallback(() => {
    setAiGenerateInitialPrompt("");
    setIsAIGenerateModalOpen(true);
  }, []);

  // Global Cmd+K / Ctrl+K listener for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Parallax effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x: x * 4, y: y * 4 });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col bg-black overflow-hidden">
      <Navbar 
        onAIClick={handleOpenAIPanel} 
        onAIGenerateClick={handleOpenAIGenerateModal} 
        onClearGraph={handleClearGraph}
        onExport={handleExport}
        onShare={handleShare}
      />

      <div ref={containerRef} className="flex-1 relative">
        {/* Parallax dot grid */}
        <div
          className="absolute inset-0 pointer-events-none transition-transform duration-100 ease-out"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />

        <ReactFlow
          nodes={filteredNodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          proOptions={{ hideAttribution: true }}
          className="!bg-transparent"
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1}
            color="rgba(255, 255, 255, 0.03)"
          />
          <MiniMap
            nodeColor={() => "rgba(59, 130, 246, 0.8)"}
            maskColor="rgba(59, 130, 246, 0.1)"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 8,
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
            pannable
            zoomable
          />
          <Controls showInteractive={false} />
        </ReactFlow>

        {/* Empty state overlay */}
        {nodes.length === 0 && (
          <EmptyState
            onOpenAIGenerate={handleOpenAIGenerateModal}
            onCreateBlankNode={handleCreateBlankNode}
            onQuickGenerate={handleQuickGenerate}
          />
        )}

        <CanvasToolbar />
        <AIPanel isOpen={isAIPanelOpen} onClose={() => setIsAIPanelOpen(false)} />
        <NodeEditorPanel
          isOpen={selectedNode !== null}
          onClose={() => setSelectedNode(null)}
          node={selectedNode}
          nodes={nodes as Node<KnowledgeNodeData>[]}
          edges={edges}
          onUpdateNode={handleUpdateNode}
          onDeleteNode={handleDeleteNode}
          onRemoveConnection={handleRemoveConnection}
          onFindRelated={handleFindRelated}
        />
        <AIGenerateModal
          isOpen={isAIGenerateModalOpen}
          onClose={() => setIsAIGenerateModalOpen(false)}
          onAddNodes={handleAddGeneratedNodes}
          initialPrompt={aiGenerateInitialPrompt}
        />
        <CommandPalette
          isOpen={isCommandPaletteOpen}
          onClose={() => setIsCommandPaletteOpen(false)}
          nodes={nodes as Node<KnowledgeNodeData>[]}
          onSelectNode={(node) => {
            setSelectedNode(node);
            setIsAIPanelOpen(false);
          }}
          onOpenAIGenerate={handleOpenAIGenerateModal}
          onCreateNode={handleCreateBlankNode}
        />
        <NodeFilterBar
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          nodeCounts={nodeCounts}
        />
        <GraphChat nodes={nodes as Node<KnowledgeNodeData>[]} />
      </div>
    </div>
  );
}

export default function KnowledgeGraph() {
  return (
    <ReactFlowProvider>
      <KnowledgeGraphInner />
    </ReactFlowProvider>
  );
}
