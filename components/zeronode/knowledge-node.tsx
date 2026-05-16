"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import {
  Code,
  Lightbulb,
  BookOpen,
  Sparkles,
  FileText,
  Map,
  Brain,
} from "lucide-react";

export type NodeType =
  | "concept"
  | "code"
  | "topic"
  | "idea"
  | "note"
  | "roadmap"
  | "research";

export interface KnowledgeNodeData {
  [key: string]: unknown;
  title: string;
  preview: string;
  nodeType: NodeType;
  embedding?: number[];
  content?: string;
}

const nodeTypeConfig: Record<
  NodeType,
  { color: string; icon: React.ElementType; bgGlow: string }
> = {
  concept: {
    color: "#3B82F6",
    icon: Brain,
    bgGlow: "rgba(59, 130, 246, 0.3)",
  },
  code: { color: "#06B6D4", icon: Code, bgGlow: "rgba(6, 182, 212, 0.3)" },
  topic: { color: "#8B5CF6", icon: BookOpen, bgGlow: "rgba(139, 92, 246, 0.3)" },
  idea: { color: "#F59E0B", icon: Lightbulb, bgGlow: "rgba(245, 158, 11, 0.3)" },
  note: { color: "#10B981", icon: FileText, bgGlow: "rgba(16, 185, 129, 0.3)" },
  roadmap: { color: "#F43F5E", icon: Map, bgGlow: "rgba(244, 63, 94, 0.3)" },
  research: { color: "#EC4899", icon: Sparkles, bgGlow: "rgba(236, 72, 153, 0.3)" },
};

function KnowledgeNode({ data }: NodeProps) {
  const nodeData = data as KnowledgeNodeData;
  const config = nodeTypeConfig[nodeData.nodeType];
  const Icon = config.icon;

  return (
    <div
      className="group relative animate-fade-scale-in"
      style={{ animationDelay: `${Math.random() * 0.3}s` }}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-white/20 !border-none hover:!bg-primary transition-colors"
      />

      <div
        className="relative w-[140px] rounded-lg overflow-hidden backdrop-blur-xl border border-white/10 transition-all duration-300 group-hover:scale-[1.02] cursor-grab active:cursor-grabbing"
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          borderLeft: `3px solid ${config.color}`,
        }}
      >
        {/* Hover glow effect */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${config.bgGlow}, inset 0 0 20px ${config.bgGlow}`,
          }}
        />

        <div className="relative p-3">
          {/* Icon */}
          <div className="absolute top-2 right-2">
            <Icon
              className="w-3.5 h-3.5 text-white/30 group-hover:text-white/50 transition-colors"
              strokeWidth={1.5}
            />
          </div>

          {/* Title */}
          <h3 className="text-sm font-medium text-white pr-5 leading-tight line-clamp-2">
            {nodeData.title}
          </h3>

          {/* Preview */}
          <p className="text-xs text-white/40 mt-1.5 line-clamp-1 group-hover:text-white/60 transition-colors">
            {nodeData.preview}
          </p>

          {/* Type indicator */}
          <div className="flex items-center gap-1 mt-2">
            <span
              className="text-[10px] font-medium uppercase tracking-wider opacity-50"
              style={{ color: config.color }}
            >
              {nodeData.nodeType}
            </span>
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-white/20 !border-none hover:!bg-primary transition-colors"
      />
    </div>
  );
}

export default memo(KnowledgeNode);
