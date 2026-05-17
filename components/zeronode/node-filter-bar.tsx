"use client";

import { Brain, Code, BookOpen, Lightbulb, 
  FileText, Map, Sparkles } from "lucide-react";
import type { NodeType } from "./knowledge-node";

interface NodeFilterBarProps {
  activeFilter: NodeType | "all";
  onFilterChange: (filter: NodeType | "all") => void;
  nodeCounts: Record<string, number>;
}

const filters: { 
  type: NodeType | "all"; 
  label: string; 
  icon: React.ElementType;
  color: string;
}[] = [
  { type: "all", label: "All", icon: Brain, color: "#ffffff" },
  { type: "concept", label: "Concept", icon: Brain, color: "#3B82F6" },
  { type: "note", label: "Note", icon: FileText, color: "#10B981" },
  { type: "code", label: "Code", icon: Code, color: "#06B6D4" },
  { type: "idea", label: "Idea", icon: Lightbulb, color: "#F59E0B" },
  { type: "roadmap", label: "Roadmap", icon: Map, color: "#F43F5E" },
  { type: "topic", label: "Topic", icon: BookOpen, color: "#8B5CF6" },
  { type: "research", label: "Research", icon: Sparkles, color: "#EC4899" },
];

export default function NodeFilterBar({
  activeFilter,
  onFilterChange,
  nodeCounts,
}: NodeFilterBarProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 
      z-20 max-w-[calc(100%-200px)]">
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl
        bg-black/80 backdrop-blur-xl border border-white/10
        shadow-xl shadow-black/50 overflow-x-auto 
        scrollbar-none max-w-full">
        {filters.map(({ type, label, icon: Icon, color }) => {
          const count = type === "all"
            ? Object.values(nodeCounts).reduce((a, b) => a + b, 0)
            : nodeCounts[type] || 0;
          const isActive = activeFilter === type;

          return (
            <button
              key={type}
              onClick={() => onFilterChange(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 
                rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-white/40 hover:text-white/70 hover:bg-white/8"
              }`}
              style={isActive ? { color } : {}}
            >
              <Icon
                className="w-3.5 h-3.5 shrink-0"
                style={isActive ? { color } : {}}
              />
              {label}
              {count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full 
                    font-medium ${
                    isActive ? "bg-white/20" : "bg-white/10"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
