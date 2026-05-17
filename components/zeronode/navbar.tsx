"use client";

import { useState } from "react";
import {
  Sparkles, Share2, Download, Trash2, Settings,
  ChevronDown, Circle, GitBranch, Save
} from "lucide-react";
import Link from "next/link";

interface NavbarProps {
  onAIGenerateClick: () => void;
  onClearGraph: () => void;
  onExport: () => void;
  onShare: () => void;
  onSettingsClick: () => void;
  nodeCount: number;
  edgeCount: number;
  isSaved: boolean;
}

export default function Navbar({
  onAIGenerateClick,
  onClearGraph,
  onExport,
  onShare,
  onSettingsClick,
  nodeCount,
  edgeCount,
  isSaved,
}: NavbarProps) {
  const [showSecondary, setShowSecondary] = useState(false);

  return (
    <header className="h-12 shrink-0 flex items-center justify-between
      px-4 border-b border-white/8 bg-black/60 backdrop-blur-xl
      relative z-40">

      {/* LEFT: Logo + graph meta */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br
            from-blue-500 to-violet-600 flex items-center
            justify-center shrink-0">
            <GitBranch className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-white
            group-hover:text-blue-400 transition-colors">
            ZeroNode
          </span>
        </Link>

        <div className="w-px h-4 bg-white/10" />

        {/* Graph stats */}
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
            {nodeCount} nodes
          </span>
          <span className="flex items-center gap-1">
            <Circle className="w-2 h-2 fill-violet-500 text-violet-500" />
            {edgeCount} edges
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        {/* Save status */}
        <div className="flex items-center gap-1.5 text-xs">
          <Save className={`w-3 h-3 transition-colors ${
            isSaved ? "text-emerald-400" : "text-white/30"
          }`} />
          <span className={`transition-colors ${
            isSaved ? "text-emerald-400" : "text-white/30"
          }`}>
            {isSaved ? "Saved" : "Saving..."}
          </span>
        </div>
      </div>

      {/* CENTER: Graph title */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <input
          type="text"
          defaultValue="My Knowledge Graph"
          className="text-sm font-medium text-white/70 bg-transparent
            border-none outline-none text-center hover:text-white
            focus:text-white transition-colors w-48
            placeholder:text-white/30"
          placeholder="Untitled Graph"
        />
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2">

        {/* Primary CTA */}
        <button
          onClick={onAIGenerateClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-semibold text-white
            bg-gradient-to-r from-blue-600 to-violet-600
            hover:from-blue-500 hover:to-violet-500
            shadow-lg shadow-blue-500/20 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Generate
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg
            text-xs font-medium text-white/70 hover:text-white
            bg-white/5 hover:bg-white/10 border border-white/10
            transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>

        {/* Secondary actions dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSecondary((p) => !p)}
            className="p-1.5 rounded-lg text-white/40 hover:text-white
              hover:bg-white/10 transition-all"
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          {showSecondary && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowSecondary(false)}
              />
              <div className="absolute right-0 top-full mt-1 w-44 z-50
                bg-[#0a0a0a] border border-white/10 rounded-xl
                shadow-2xl overflow-hidden">
                {[
                  { icon: Download, label: "Export PNG", action: onExport },
                  { icon: Settings, label: "Settings", action: onSettingsClick },
                  { icon: Trash2, label: "Clear graph", action: onClearGraph, danger: true },
                ].map(({ icon: Icon, label, action, danger }) => (
                  <button
                    key={label}
                    onClick={() => { action(); setShowSecondary(false); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2.5
                      text-xs transition-colors text-left ${
                      danger
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
