"use client";

import { MousePointer, Hand, PlusCircle, GitBranch, Trash2 } from "lucide-react";

type Tool = "select" | "pan" | "add" | "connect" | "delete";

interface CanvasToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
}

const tools: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: "select", icon: MousePointer, label: "Select" },
  { id: "pan", icon: Hand, label: "Pan" },
  { id: "add", icon: PlusCircle, label: "Add Node" },
  { id: "connect", icon: GitBranch, label: "Connect" },
  { id: "delete", icon: Trash2, label: "Delete" },
];

export default function CanvasToolbar({ activeTool, onToolChange }: CanvasToolbarProps) {
  return (
    <div className="absolute top-4 left-4 z-10">
      <div className="flex flex-col gap-1 p-1.5 rounded-xl bg-white/5 
        backdrop-blur-xl border border-white/10">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;

          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              className={`p-2 rounded-lg transition-all duration-200 group relative ${
                isActive
                  ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                  : "text-white/50 hover:text-white hover:bg-white/10"
              }`}
              title={tool.label}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
              <span className="absolute left-full ml-2 px-2 py-1 text-xs 
                font-medium text-white bg-black/90 rounded-md opacity-0 
                pointer-events-none group-hover:opacity-100 transition-opacity 
                whitespace-nowrap border border-white/10">
                {tool.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
