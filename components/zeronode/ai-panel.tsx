"use client";

import { Sparkles, X } from "lucide-react";

interface AIPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIPanel({ isOpen, onClose }: AIPanelProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute top-0 right-0 h-full w-[280px] z-20 animate-slide-in-right">
      <div className="h-full bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-white">AI Generate</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 flex flex-col gap-4">
          {/* Input */}
          <div className="flex flex-col gap-2">
            <textarea
              placeholder="Describe what you want to learn or explore..."
              className="w-full h-24 px-3 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-lg resize-none placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
            />
            <button className="w-full py-2.5 px-4 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(59,130,246,0.3)]">
              Generate
            </button>
          </div>

          {/* Recent Generations */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Recent generations
            </h3>
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-white/5 border border-white/5"
                >
                  <div className="h-2.5 w-3/4 bg-white/10 rounded animate-pulse" />
                  <div className="h-2 w-1/2 bg-white/5 rounded mt-2 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
