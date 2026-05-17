"use client";

import { useState } from "react";
import { Sparkles, MessageCircle, X, Send, Zap } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { KnowledgeNodeData } from "./knowledge-node";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface AIDockProps {
  nodes: Node<KnowledgeNodeData>[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenGenerate: () => void;
  selectedNode: Node<KnowledgeNodeData> | null;
}

export default function AIDock({
  nodes,
  isOpen,
  onOpenChange,
  onOpenGenerate,
  selectedNode,
}: AIDockProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "suggest">("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const suggestions = selectedNode
    ? [
        `What connects to "${selectedNode.data.title}"?`,
        `Explain "${selectedNode.data.title}" simply`,
        `What am I missing about "${selectedNode.data.title}"?`,
      ]
    : [
        "What topics am I studying most?",
        "Summarize my entire graph",
        "What concepts should I explore next?",
      ];

  const handleSend = async (text?: string) => {
    const question = text || input.trim();
    if (!question || isLoading) return;
    if (nodes.length === 0) {
      toast.info("Add some nodes first.");
      return;
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: question,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat-graph", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question,
          nodes: nodes.map((n) => ({
            title: n.data.title,
            content: n.data.content,
            preview: n.data.preview,
            nodeType: n.data.nodeType,
          })),
        }),
      });
      const data = await res.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, role: "assistant", text: data.answer },
        ]);
      } else throw new Error();
    } catch {
      toast.error("Chat failed. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => onOpenChange(!isOpen)}
        className={`absolute bottom-36 left-6 z-20 flex items-center
          gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
          border shadow-lg ${
          isOpen
            ? "bg-violet-600 border-violet-500/50 text-white shadow-violet-500/30"
            : "bg-black/60 backdrop-blur-sm border-white/10 text-white/60 hover:text-white hover:border-white/20"
        }`}
      >
        <Sparkles className="w-4 h-4" />
        AI
      </button>

      {/* Dock panel */}
      {isOpen && (
        <div className="absolute bottom-36 left-16 z-30 w-[320px]
          flex flex-col rounded-2xl overflow-hidden
          bg-[#080808] border border-white/10
          shadow-2xl shadow-black/50"
          style={{ maxHeight: "460px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3
            border-b border-white/8 shrink-0">
            <div className="flex items-center gap-1 bg-white/5
              rounded-lg p-0.5">
              {(["chat", "suggest"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-medium
                    transition-all capitalize ${
                    activeTab === tab
                      ? "bg-white/10 text-white"
                      : "text-white/40 hover:text-white/70"
                  }`}
                >
                  {tab === "chat" ? (
                    <span className="flex items-center gap-1.5">
                      <MessageCircle className="w-3 h-3" />
                      Chat
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3" />
                      Suggest
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1 rounded-md text-white/30 hover:text-white
                hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {activeTab === "chat" ? (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-3 py-3
                flex flex-col gap-2 min-h-[200px]">
                {messages.length === 0 && (
                  <p className="text-xs text-white/25 text-center mt-4">
                    Ask anything about your {nodes.length} nodes
                  </p>
                )}
                {messages.map((msg) => (
                  <div key={msg.id}
                    className={`flex ${msg.role === "user"
                      ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] px-3 py-2 rounded-xl
                      text-xs leading-relaxed ${
                      msg.role === "user"
                        ? "bg-violet-600/80 text-white rounded-br-sm"
                        : "bg-white/8 text-white/75 rounded-bl-sm border border-white/8"
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/8 border border-white/8
                      px-3 py-2 rounded-xl rounded-bl-sm">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => (
                          <div key={i}
                            className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                            style={{ animationDelay: `${i*150}ms` }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="px-3 py-3 border-t border-white/8 shrink-0">
                <div className="flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask your graph..."
                    className="flex-1 px-3 py-2 text-xs text-white
                      bg-white/5 border border-white/10 rounded-lg
                      placeholder:text-white/25 focus:outline-none
                      focus:border-violet-500/50 transition-all"
                  />
                  <button
                    onClick={() => handleSend()}
                    disabled={!input.trim() || isLoading}
                    className="p-2 rounded-lg bg-violet-600 hover:bg-violet-500
                      disabled:opacity-40 transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Suggest tab */
            <div className="flex-1 overflow-y-auto px-3 py-3 flex flex-col gap-2">
              <p className="text-xs text-white/30 mb-1">
                {selectedNode
                  ? `Context: ${selectedNode.data.title}`
                  : "Based on your graph"}
              </p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setActiveTab("chat");
                    handleSend(s);
                  }}
                  className="text-left px-3 py-2.5 text-xs text-white/60
                    hover:text-white bg-white/4 hover:bg-white/8
                    border border-white/8 rounded-lg transition-all"
                >
                  {s}
                </button>
              ))}
              <div className="border-t border-white/8 mt-2 pt-3">
                <button
                  onClick={() => {
                    onOpenChange(false);
                    onOpenGenerate();
                  }}
                  className="w-full flex items-center justify-center gap-2
                    px-3 py-2.5 text-xs font-medium text-white
                    bg-gradient-to-r from-blue-600/80 to-violet-600/80
                    hover:from-blue-600 hover:to-violet-600
                    rounded-lg transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Generate new nodes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
