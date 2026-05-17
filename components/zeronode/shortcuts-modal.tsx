"use client";

import { X, Command } from "lucide-react";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  {
    category: "Canvas Tools",
    items: [
      { keys: ["V"], description: "Select tool" },
      { keys: ["H"], description: "Pan tool" },
      { keys: ["A"], description: "Add node tool" },
      { keys: ["C"], description: "Connect tool" },
      { keys: ["D"], description: "Delete tool" },
    ],
  },
  {
    category: "Navigation",
    items: [
      { keys: ["0"], description: "Fit all nodes in view" },
      { keys: ["F"], description: "Focus mode (node selected)" },
      { keys: ["Esc"], description: "Exit focus mode / close panels" },
      { keys: ["Space"], description: "Create new node" },
      { keys: ["Double click"], description: "Zoom to node cluster" },
    ],
  },
  {
    category: "Actions",
    items: [
      { keys: ["⌘", "K"], description: "Open command palette" },
      { keys: ["⌘", "Z"], description: "Undo" },
      { keys: ["⌘", "Y"], description: "Redo" },
      { keys: ["?"], description: "Show shortcuts" },
    ],
  },
  {
    category: "Node Editor",
    items: [
      { keys: ["Click"], description: "Select & open editor" },
      { keys: ["Double click"], description: "Zoom to cluster" },
      { keys: ["Delete tool + click"], description: "Delete node" },
    ],
  },
];

function Key({ label }: { label: string }) {
  return (
    <kbd className="inline-flex items-center justify-center px-2 py-0.5
      min-w-[28px] h-6 rounded-md text-[11px] font-semibold
      bg-white/8 border border-white/15 text-white/70
      font-mono shadow-sm">
      {label}
    </kbd>
  );
}

export default function ShortcutsModal({
  isOpen,
  onClose,
}: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
        bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-[580px] max-h-[80vh] overflow-y-auto
        rounded-2xl bg-[#080808] border border-white/10
        shadow-2xl shadow-black/50
        animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4
          border-b border-white/8 sticky top-0 bg-[#080808] z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-white/5
              border border-white/10">
              <Command className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">
                Keyboard Shortcuts
              </h2>
              <p className="text-xs text-white/30">
                Press ? anytime to show this
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/30 hover:text-white
              hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts grid */}
        <div className="p-6 grid grid-cols-2 gap-6">
          {shortcuts.map((section) => (
            <div key={section.category}>
              <h3 className="text-[10px] font-semibold text-white/30
                uppercase tracking-widest mb-3">
                {section.category}
              </h3>
              <div className="flex flex-col gap-2">
                {section.items.map((item) => (
                  <div
                    key={item.description}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-xs text-white/50">
                      {item.description}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((key) => (
                        <Key key={key} label={key} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/8
          flex items-center justify-between">
          <span className="text-xs text-white/20">
            ZeroNode — AI Knowledge Graph
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-white/50
              hover:text-white bg-white/5 hover:bg-white/10
              border border-white/10 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
