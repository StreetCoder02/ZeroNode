"use client";

import { X, Palette, Zap, Info } from "lucide-react";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center 
        bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[480px] rounded-2xl bg-[#0a0a0a] border border-white/10 
        shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 
          border-b border-white/10">
          <h2 className="text-base font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/40 hover:text-white 
              hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          
          {/* Canvas section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold 
              text-white/40 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              Canvas
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-white/70">Show grid background</span>
                <input type="checkbox" defaultChecked 
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-white/70">Snap nodes to grid</span>
                <input type="checkbox" 
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-white/70">Animate edges</span>
                <input type="checkbox" defaultChecked 
                  className="w-4 h-4 accent-blue-500" />
              </label>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* AI section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold 
              text-white/40 uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              AI
            </div>
            <div className="space-y-2">
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-white/70">
                  Auto-embed nodes on creation
                </span>
                <input type="checkbox" defaultChecked 
                  className="w-4 h-4 accent-blue-500" />
              </label>
              <label className="flex items-center justify-between py-2">
                <span className="text-sm text-white/70">
                  Show similarity scores on edges
                </span>
                <input type="checkbox" defaultChecked 
                  className="w-4 h-4 accent-blue-500" />
              </label>
            </div>
          </div>

          <div className="border-t border-white/10" />

          {/* About section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold 
              text-white/40 uppercase tracking-wider">
              <Info className="w-3.5 h-3.5" />
              About
            </div>
            <div className="space-y-1 text-sm text-white/50">
              <p>ZeroNode v1.0.0</p>
              <p>Built with Next.js · Groq LLaMA · Gemini Embeddings</p>
              <a
                href="https://github.com/StreetCoder02/zeronode"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                View on GitHub →
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white 
              bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
