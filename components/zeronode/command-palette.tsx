"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  FileText,
  Sparkles,
  Plus,
  Search,
  Download,
  MessageCircle,
  X,
} from "lucide-react";
import type { Node } from "@xyflow/react";
import type { KnowledgeNodeData } from "./knowledge-node";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node<KnowledgeNodeData>[];
  onSelectNode: (node: Node<KnowledgeNodeData>) => void;
  onOpenAIGenerate: () => void;
  onCreateNode: () => void;
}

type ResultType = "node" | "action" | "ai";

interface Result {
  id: string;
  type: ResultType;
  title: string;
  subtitle?: string;
  meta?: string;
  icon: React.ReactNode;
  action: () => void;
}

const nodeTypeLabels: Record<KnowledgeNodeData["nodeType"], string> = {
  concept: "Concept",
  note: "Note",
  code: "Code",
  idea: "Idea",
  roadmap: "Roadmap",
  topic: "Research",
  research: "Research",
};

export default function CommandPalette({
  isOpen,
  onClose,
  nodes,
  onSelectNode,
  onOpenAIGenerate,
  onCreateNode,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleResults, setVisibleResults] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Check if query looks like a question
  const isQuestion = /^(what|how|why|when|where|who|can|is|are|do|does|should|would|could)/i.test(
    query.trim()
  );

  // Build results list
  const getResults = useCallback((): Result[] => {
    const results: Result[] = [];

    // AI Ask result (if question detected)
    if (query.trim() && isQuestion) {
      results.push({
        id: "ai-ask",
        type: "ai",
        title: `Ask AI: "${query}"`,
        subtitle: "Search your knowledge base",
        icon: <MessageCircle className="w-4 h-4" />,
        action: () => {
          onClose();
          // Would trigger AI search
        },
      });
    }

    // Filter nodes by query
    const filteredNodes = nodes
      .filter(
        (node) =>
          !query.trim() ||
          node.data.title.toLowerCase().includes(query.toLowerCase()) ||
          node.data.preview?.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 3);

    // Add node results
    filteredNodes.forEach((node) => {
      results.push({
        id: node.id,
        type: "node",
        title: node.data.title,
        subtitle: nodeTypeLabels[node.data.nodeType],
        meta: "last edited 2h ago",
        icon: <FileText className="w-4 h-4" />,
        action: () => {
          onSelectNode(node);
          onClose();
        },
      });
    });

    // Action results (always show)
    results.push(
      {
        id: "action-generate",
        type: "action",
        title: "Generate nodes with AI",
        subtitle: "Action",
        icon: <Sparkles className="w-4 h-4 text-primary" />,
        action: () => {
          onOpenAIGenerate();
          onClose();
        },
      },
      {
        id: "action-create",
        type: "action",
        title: "Create new node",
        subtitle: "Action",
        icon: <Plus className="w-4 h-4" />,
        action: () => {
          onCreateNode();
          onClose();
        },
      },
      {
        id: "action-search",
        type: "action",
        title: "Semantic search...",
        subtitle: "Action",
        icon: <Search className="w-4 h-4" />,
        action: () => {
          onClose();
        },
      },
      {
        id: "action-export",
        type: "action",
        title: "Export graph as PNG",
        subtitle: "Action",
        icon: <Download className="w-4 h-4" />,
        action: () => {
          onClose();
        },
      }
    );

    return results;
  }, [query, isQuestion, nodes, onSelectNode, onOpenAIGenerate, onCreateNode, onClose]);

  const results = getResults();

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setVisibleResults(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Stagger in results
  useEffect(() => {
    if (isOpen && visibleResults < results.length) {
      const timeout = setTimeout(() => {
        setVisibleResults((prev) => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [isOpen, visibleResults, results.length]);

  // Reset visible results when query changes
  useEffect(() => {
    setVisibleResults(0);
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) => (prev + 1) % results.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
          break;
        case "Enter":
          e.preventDefault();
          if (results[activeIndex]) {
            results[activeIndex].action();
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, results, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeItem = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
      activeItem?.scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  // Global Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const getBorderColor = (type: ResultType) => {
    switch (type) {
      case "node":
        return "border-l-primary";
      case "ai":
        return "border-l-secondary";
      case "action":
        return "border-l-white/20";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-[560px] mx-4 h-fit animate-command-palette-in"
        style={{
          animation: "command-palette-in 150ms ease-out forwards",
        }}
      >
        <div
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden"
          style={{
            boxShadow: "0 0 40px rgba(59, 130, 246, 0.15), 0 0 80px rgba(59, 130, 246, 0.05)",
          }}
        >
          {/* Search input */}
          <div className="flex items-center px-4 py-3 border-b border-white/10">
            <Search className="w-5 h-5 text-white/40 mr-3 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search nodes, actions, or ask AI..."
              className="flex-1 bg-transparent text-white text-lg placeholder:text-white/30 outline-none"
            />
            <div className="flex items-center gap-2 text-white/30 text-xs ml-3">
              <span>ESC to close</span>
            </div>
          </div>

          {/* Results list */}
          <div
            ref={listRef}
            className="max-h-[360px] overflow-y-auto py-2"
          >
            {results.map((result, index) => (
              <button
                key={result.id}
                data-index={index}
                onClick={result.action}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left border-l-2 transition-all duration-150 ${getBorderColor(result.type)} ${
                  index === activeIndex
                    ? "bg-primary/10"
                    : "bg-transparent hover:bg-white/5"
                } ${
                  index < visibleResults ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                }`}
                style={{
                  transitionDelay: `${index * 30}ms`,
                }}
              >
                <div
                  className={`flex-shrink-0 ${
                    result.type === "ai"
                      ? "text-secondary"
                      : result.type === "action" && result.id === "action-generate"
                      ? "text-primary"
                      : "text-white/60"
                  }`}
                >
                  {result.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">
                      {result.title}
                    </span>
                    {result.subtitle && (
                      <>
                        <span className="text-white/20">—</span>
                        <span className="text-white/40 text-sm">{result.subtitle}</span>
                      </>
                    )}
                    {result.meta && (
                      <>
                        <span className="text-white/20">—</span>
                        <span className="text-white/30 text-xs">{result.meta}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}

            {results.length === 0 && (
              <div className="px-4 py-8 text-center text-white/40">
                No results found
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes command-palette-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
