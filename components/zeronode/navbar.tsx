"use client";

import { Search, Sparkles, Plus, Settings, Download, Share2 } from "lucide-react";

interface NavbarProps {
  onCreateBlankNode: () => void;
  onAIGenerateClick: () => void;
  onExport: () => void;
  onShare: () => void;
  onClearGraph?: () => void;
  onSettingsClick: () => void;
}

export default function Navbar({ onCreateBlankNode, onAIGenerateClick, onExport, onShare, onClearGraph, onSettingsClick }: NavbarProps) {
  return (
    <nav className="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-black/50 backdrop-blur-xl relative z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2L25.5 8.5V19.5L14 26L2.5 19.5V8.5L14 2Z"
              stroke="#3B82F6"
              strokeWidth="1.5"
              fill="none"
            />
            <path
              d="M14 8L19.5 11V17L14 20L8.5 17V11L14 8Z"
              fill="#3B82F6"
              fillOpacity="0.3"
              stroke="#06B6D4"
              strokeWidth="1"
            />
            <circle cx="14" cy="14" r="2" fill="#3B82F6" />
          </svg>
        </div>
        <span className="text-white font-semibold tracking-tight">
          ZeroNode
        </span>
      </div>

      {/* Search */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors cursor-pointer group min-w-[280px]">
          <Search className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
          <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors flex-1">
            Search your knowledge...
          </span>
          <div className="flex items-center gap-0.5">
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-white/30 bg-white/5 rounded border border-white/10">
              ⌘
            </kbd>
            <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-white/30 bg-white/5 rounded border border-white/10">
              K
            </kbd>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={onAIGenerateClick}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
          title="AI Generate"
        >
          <Sparkles className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onCreateBlankNode}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
          title="New Node"
        >
          <Plus className="w-4.5 h-4.5" />
        </button>
        <button
          onClick={onExport}
          title="Export as PNG"
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" />
        </button>
        <button
          onClick={onShare}
          title="Share graph"
          className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <Share2 className="w-4 h-4" />
        </button>
        {onClearGraph && (
          <button
            onClick={onClearGraph}
            title="Clear Graph"
            className="p-2 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            Clear
          </button>
        )}
        <button
          onClick={onSettingsClick}
          className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-primary/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300"
          title="Settings"
        >
          <Settings className="w-4.5 h-4.5" />
        </button>
      </div>
    </nav>
  );
}
