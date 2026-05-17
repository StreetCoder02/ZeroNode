"use client";

import {
  MousePointer, Hand, PlusCircle, GitBranch,
  Trash2, LayoutGrid, Circle, Layers, Crosshair
} from "lucide-react";

type Tool = "select" | "pan" | "add" | "connect" | "delete";

interface CanvasToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  nodeCount: number;
  edgeCount: number;
  isFocusMode: boolean;
}

const tools: {
  id: Tool;
  icon: React.ElementType;
  label: string;
  shortcut: string;
}[] = [
  { id: "select", icon: MousePointer, label: "Select", shortcut: "V" },
  { id: "pan", icon: Hand, label: "Pan", shortcut: "H" },
  { id: "add", icon: PlusCircle, label: "Add Node", shortcut: "A" },
  { id: "connect", icon: GitBranch, label: "Connect", shortcut: "C" },
  { id: "delete", icon: Trash2, label: "Delete", shortcut: "D" },
];

export default function CanvasToolbar({
  activeTool,
  onToolChange,
  nodeCount,
  edgeCount,
  isFocusMode,
}: CanvasToolbarProps) {
  return (
    <div className="absolute left-0 top-0 bottom-0 w-14 z-10
      flex flex-col items-center py-4 gap-1
      border-r border-white/8 bg-black/40 backdrop-blur-xl">

      {/* Tool buttons */}
      <div className="flex flex-col gap-1 w-full px-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => onToolChange(tool.id)}
              title={`${tool.label} (${tool.shortcut})`}
              className={`relative w-full flex flex-col items-center
                justify-center py-2.5 rounded-lg transition-all group ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.3)]"
                  : "text-white/30 hover:text-white/70 hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-[9px] mt-1 font-medium opacity-60">
                {tool.shortcut}
              </span>

              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1
                text-xs font-medium text-white bg-black/90 rounded-md
                opacity-0 pointer-events-none group-hover:opacity-100
                transition-opacity whitespace-nowrap border border-white/10
                z-50">
                {tool.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-2" />

      {/* Graph stats */}
      <div className="flex flex-col items-center gap-3 px-2 w-full">
        <div className="flex flex-col items-center gap-0.5
          w-full py-2 rounded-lg bg-white/3">
          <div className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
            <span className="text-[10px] font-bold text-white/70">
              {nodeCount}
            </span>
          </div>
          <span className="text-[8px] text-white/30 uppercase tracking-wide">
            nodes
          </span>
        </div>

        <div className="flex flex-col items-center gap-0.5
          w-full py-2 rounded-lg bg-white/3">
          <div className="flex items-center gap-1">
            <Layers className="w-2.5 h-2.5 text-violet-400" />
            <span className="text-[10px] font-bold text-white/70">
              {edgeCount}
            </span>
          </div>
          <span className="text-[8px] text-white/30 uppercase tracking-wide">
            edges
          </span>
        </div>
      </div>

      {/* Bottom: layout hint */}
      <div className="mt-auto">
        {isFocusMode && (
          <div className="w-8 h-px bg-blue-500/50 mb-1" />
        )}
        {isFocusMode && (
          <div className="flex flex-col items-center gap-0.5
            w-full px-2 py-1.5 rounded-lg bg-blue-500/10
            border border-blue-500/20">
            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[8px] text-blue-400/70 uppercase
              tracking-wide">Focus</span>
          </div>
        )}
        <button
          title="Auto layout (coming soon)"
          className="p-2 rounded-lg text-white/20
            hover:text-white/40 transition-colors"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
