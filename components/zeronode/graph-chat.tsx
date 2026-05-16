"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import type { Node } from "@xyflow/react";
import type { KnowledgeNodeData } from "./knowledge-node";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

interface GraphChatProps {
  nodes: Node<KnowledgeNodeData>[];
}

export default function GraphChat({ nodes }: GraphChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    if (nodes.length === 0) {
      toast.info("Add some nodes to your graph first, then ask me about them.");
      return;
    }

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat-graph", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          question: userMsg.text,
          nodes: nodes.map((n) => ({
            title: n.data.title,
            content: n.data.content,
            preview: n.data.preview,
            nodeType: n.data.nodeType,
          })),
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (errData?.error?.includes("configured")) {
          toast.error("Live AI features require API keys. See README to self-host, or contact the demo owner.", { duration: 6000 });
          setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
          setIsLoading(false);
          return;
        }
        throw new Error("Chat failed");
      }
      const data = await res.json();
      if (data.answer) {
        setMessages((prev) => [
          ...prev,
          { id: `msg-${Date.now()}`, role: "assistant", text: data.answer },
        ]);
      } else {
        throw new Error("No answer");
      }
    } catch {
      toast.error("Chat failed. Try again.");
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Toggle button - bottom left of canvas */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="absolute bottom-36 left-6 z-20 flex items-center gap-2 
          px-4 py-2.5 rounded-xl text-sm font-medium text-white
          bg-violet-600/80 hover:bg-violet-600 backdrop-blur-sm
          border border-violet-500/30 shadow-lg shadow-violet-500/20
          transition-all hover:shadow-violet-500/40"
      >
        <MessageCircle className="w-4 h-4" />
        Ask your graph
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="absolute bottom-52 left-6 z-30 w-[340px] 
          flex flex-col rounded-2xl overflow-hidden
          bg-[#0a0a0a] border border-white/10 
          shadow-2xl shadow-violet-500/10
          animate-in fade-in slide-in-from-bottom-4 duration-200"
          style={{ maxHeight: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 
            border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <span className="text-sm font-semibold text-white">
                Ask your graph
              </span>
              <span className="text-xs text-white/30 ml-1">
                {nodes.length} nodes
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-white/40 hover:text-white 
                hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 
            flex flex-col gap-3 min-h-[200px]">
            {messages.length === 0 && (
              <div className="flex flex-col gap-2 mt-2">
                <p className="text-xs text-white/30 text-center">
                  Ask anything about your knowledge graph
                </p>
                {[
                  "What do I know about this topic?",
                  "Summarize my roadmap nodes",
                  "What concepts are in my graph?",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-2 text-xs text-white/50 
                      hover:text-white bg-white/5 hover:bg-white/10
                      border border-white/10 rounded-lg transition-all 
                      text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-sm 
                    leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600/80 text-white rounded-br-sm"
                      : "bg-white/8 text-white/80 rounded-bl-sm border border-white/10"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/8 border border-white/10 
                  px-3 py-2 rounded-xl rounded-bl-sm">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-violet-400 
                          animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-white/10 shrink-0">
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 px-3 py-2 text-sm text-white 
                  bg-white/5 border border-white/10 rounded-xl
                  placeholder:text-white/30 focus:outline-none 
                  focus:border-violet-500/50 resize-none transition-all"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 rounded-xl bg-violet-600 hover:bg-violet-500
                  disabled:opacity-40 disabled:cursor-not-allowed 
                  transition-all shrink-0"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
