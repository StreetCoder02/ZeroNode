"use client";

import { useState, useEffect } from "react";
import { X, Sparkles, Check } from "lucide-react";
import { type KnowledgeNodeData } from "./knowledge-node";

interface GeneratedNode {
  id: string;
  title: string;
  description: string;
  nodeType: KnowledgeNodeData["nodeType"];
  selected: boolean;
}

interface AIGenerateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNodes: (nodes: Omit<GeneratedNode, "selected">[]) => void;
  initialPrompt?: string;
}

const quickPrompts = [
  "Backend roadmap",
  "DSA concepts",
  "Machine learning basics",
  "My project stack",
];

const sampleGeneratedNodes: Omit<GeneratedNode, "selected">[] = [
  {
    id: "gen-1",
    title: "Load Balancing",
    description: "Distribute traffic across multiple servers for reliability",
    nodeType: "concept",
  },
  {
    id: "gen-2",
    title: "Database Sharding",
    description: "Horizontal partitioning strategy for large datasets",
    nodeType: "concept",
  },
  {
    id: "gen-3",
    title: "Caching Strategies",
    description: "Redis, Memcached, and CDN caching patterns",
    nodeType: "note",
  },
  {
    id: "gen-4",
    title: "API Gateway",
    description: "Centralized entry point for microservices",
    nodeType: "topic",
  },
  {
    id: "gen-5",
    title: "Message Queues",
    description: "Async communication with Kafka, RabbitMQ",
    nodeType: "code",
  },
  {
    id: "gen-6",
    title: "Microservices Roadmap",
    description: "Learning path from monolith to distributed",
    nodeType: "roadmap",
  },
  {
    id: "gen-7",
    title: "Build a URL Shortener",
    description: "Practice project combining multiple concepts",
    nodeType: "idea",
  },
];

const nodeTypeColors: Record<KnowledgeNodeData["nodeType"], string> = {
  concept: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  note: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  code: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  idea: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  roadmap: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  topic: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  research: "bg-pink-500/20 text-pink-400 border-pink-500/30",
};

export default function AIGenerateModal({
  isOpen,
  onClose,
  onAddNodes,
  initialPrompt = "",
}: AIGenerateModalProps) {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedNodes, setGeneratedNodes] = useState<GeneratedNode[]>([]);
  const [visibleNodes, setVisibleNodes] = useState<number>(0);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Reset state when modal opens/closes and handle initial prompt
  useEffect(() => {
    if (!isOpen) {
      setPrompt("");
      setIsGenerating(false);
      setGeneratedNodes([]);
      setVisibleNodes(0);
      setHasGenerated(false);
    } else if (initialPrompt) {
      setPrompt(initialPrompt);
    }
  }, [isOpen, initialPrompt]);

  // Staggered animation for nodes appearing
  useEffect(() => {
    if (isGenerating && visibleNodes < sampleGeneratedNodes.length) {
      const timer = setTimeout(() => {
        setGeneratedNodes((prev) => [
          ...prev,
          { ...sampleGeneratedNodes[visibleNodes], selected: true },
        ]);
        setVisibleNodes((prev) => prev + 1);
      }, 200);
      return () => clearTimeout(timer);
    } else if (visibleNodes === sampleGeneratedNodes.length && isGenerating) {
      setIsGenerating(false);
    }
  }, [isGenerating, visibleNodes]);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedNodes([]);
    setVisibleNodes(0);
    setHasGenerated(true);
  };

  const toggleNodeSelection = (id: string) => {
    setGeneratedNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, selected: !node.selected } : node
      )
    );
  };

  const handleAddToCanvas = () => {
    const selectedNodes = generatedNodes
      .filter((n) => n.selected)
      .map(({ selected, ...rest }) => rest);
    onAddNodes(selectedNodes);
    onClose();
  };

  const selectedCount = generatedNodes.filter((n) => n.selected).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-[560px] max-h-[85vh] mx-4 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl shadow-blue-500/10 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Sparkles className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">
              Generate Knowledge Nodes
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {!hasGenerated ? (
            <>
              {/* Textarea */}
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to explore? e.g. 'Teach me system design' or 'Map out React concepts'"
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30 resize-none transition-all"
              />

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2 mt-4">
                {quickPrompts.map((qp) => (
                  <button
                    key={qp}
                    onClick={() => setPrompt(qp)}
                    className="px-3 py-1.5 text-sm text-white/60 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white hover:border-white/20 transition-all"
                  >
                    {qp}
                  </button>
                ))}
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={!prompt.trim()}
                className="w-full mt-6 h-12 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
              >
                Generate Nodes
              </button>
            </>
          ) : (
            <>
              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/60">
                  {isGenerating ? (
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      Generating nodes...
                    </span>
                  ) : (
                    `Generated ${generatedNodes.length} nodes — click to add to canvas`
                  )}
                </h3>
                {!isGenerating && (
                  <button
                    onClick={() => {
                      setHasGenerated(false);
                      setGeneratedNodes([]);
                      setVisibleNodes(0);
                    }}
                    className="text-xs text-white/40 hover:text-white transition-colors"
                  >
                    Start over
                  </button>
                )}
              </div>

              {/* Generated nodes grid */}
              <div className="grid grid-cols-2 gap-3">
                {generatedNodes.map((node, index) => (
                  <button
                    key={node.id}
                    onClick={() => toggleNodeSelection(node.id)}
                    className={`relative p-4 text-left rounded-xl border transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 ${node.selected
                        ? "bg-blue-500/10 border-blue-500/30"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Selection checkbox */}
                    <div
                      className={`absolute top-3 right-3 w-5 h-5 rounded-md border flex items-center justify-center transition-all ${node.selected
                          ? "bg-blue-500 border-blue-500"
                          : "border-white/20 bg-white/5"
                        }`}
                    >
                      {node.selected && <Check className="w-3 h-3 text-white" />}
                    </div>

                    {/* Node title */}
                    <h4 className="text-sm font-medium text-white pr-6 mb-1">
                      {node.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-white/40 mb-3 line-clamp-2">
                      {node.description}
                    </p>

                    {/* Type badge */}
                    <span
                      className={`inline-flex px-2 py-0.5 text-[10px] font-medium rounded-full border ${nodeTypeColors[node.nodeType]
                        }`}
                    >
                      {node.nodeType}
                    </span>
                  </button>
                ))}
              </div>

              {/* Add to canvas button */}
              {!isGenerating && generatedNodes.length > 0 && (
                <button
                  onClick={handleAddToCanvas}
                  disabled={selectedCount === 0}
                  className="w-full mt-6 h-12 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                >
                  Add {selectedCount} node{selectedCount !== 1 ? "s" : ""} to
                  canvas
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
