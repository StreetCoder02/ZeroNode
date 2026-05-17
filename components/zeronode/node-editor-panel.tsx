"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import {
  X,
  Brain,
  Code,
  BookOpen,
  Lightbulb,
  FileText,
  Map,
  Sparkles,
  GitBranch,
  Network,
  Trash2,
  Plus,
} from "lucide-react";
import type { Node, Edge } from "@xyflow/react";
import type { KnowledgeNodeData, NodeType } from "./knowledge-node";

interface NodeEditorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  node: Node<KnowledgeNodeData> | null;
  nodes: Node<KnowledgeNodeData>[];
  edges: Edge[];
  onUpdateNode: (id: string, data: Partial<KnowledgeNodeData>) => void;
  onDeleteNode: (id: string) => void;
  onRemoveConnection: (edgeId: string) => void;
  onFindRelated: (nodeId: string) => Promise<void>;
}

const nodeTypes: { type: NodeType; label: string; icon: React.ElementType; color: string }[] = [
  { type: "concept", label: "Concept", icon: Brain, color: "#3B82F6" },
  { type: "note", label: "Note", icon: FileText, color: "#10B981" },
  { type: "code", label: "Code", icon: Code, color: "#06B6D4" },
  { type: "idea", label: "Idea", icon: Lightbulb, color: "#F59E0B" },
  { type: "roadmap", label: "Roadmap", icon: Map, color: "#F43F5E" },
  { type: "topic", label: "Research", icon: BookOpen, color: "#8B5CF6" },
];

export default function NodeEditorPanel({
  isOpen,
  onClose,
  node,
  nodes,
  edges,
  onUpdateNode,
  onDeleteNode,
  onRemoveConnection,
  onFindRelated,
}: NodeEditorPanelProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isFindingRelated, setIsFindingRelated] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [lastEdited, setLastEdited] = useState<Date | null>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Get connected nodes
  const connectedEdges = edges.filter(
    (e) => e.source === node?.id || e.target === node?.id
  );
  const connectedNodeIds = connectedEdges.map((e) =>
    e.source === node?.id ? e.target : e.source
  );
  const connectedNodes = nodes.filter((n) => connectedNodeIds.includes(n.id));

  useEffect(() => {
    if (node) {
      setTitle(node.data.title);
      setContent((node.data.content as string) || node.data.preview || "");
      setTags((node.data.tags as string[]) || []);
      setLastEdited(new Date());
    }
  }, [node]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  if (!isOpen || !node) return null;

  const currentTypeConfig = nodeTypes.find((t) => t.type === node.data.nodeType);

  const updateNode = (data: Partial<KnowledgeNodeData>) => {
    onUpdateNode(node.id, data);
    setLastEdited(new Date());
  };

  const formatLastEdited = (date: Date | null) => {
    if (!date) return "Not edited yet";
    const diff = Date.now() - date.getTime();
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (title.trim() && title !== node.data.title) {
      updateNode({ title: title.trim() });
    }
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTitleBlur();
    } else if (e.key === "Escape") {
      setTitle(node.data.title);
      setIsEditingTitle(false);
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="absolute top-0 right-0 h-full w-[320px] z-20 animate-slide-in-right">
      <div className="h-full bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                onKeyDown={handleTitleKeyDown}
                className="w-full text-lg font-semibold text-white bg-transparent border-b border-primary/50 outline-none"
              />
            ) : (
              <h2
                onClick={() => setIsEditingTitle(true)}
                className="text-lg font-semibold text-white truncate cursor-text hover:text-white/80 transition-colors"
              >
                {title}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="ml-2 p-1.5 rounded-md text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 flex flex-col gap-5">
            {/* Node Type Selector */}
            <div className="flex flex-wrap gap-2">
              {nodeTypes.map((typeOption) => {
                const Icon = typeOption.icon;
                const isSelected = node.data.nodeType === typeOption.type;
                return (
                  <button
                    key={typeOption.type}
                    onClick={() => updateNode({ nodeType: typeOption.type })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                    style={{
                      backgroundColor: isSelected ? typeOption.color : "rgba(255, 255, 255, 0.05)",
                      color: isSelected ? "white" : "rgba(255, 255, 255, 0.6)",
                      border: `1px solid ${isSelected ? typeOption.color : "rgba(255, 255, 255, 0.1)"}`,
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    {typeOption.label}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Content Editor */}
            <div className="flex flex-col gap-2">
              <textarea
                value={content}
                onChange={(e) => {
                  const value = e.target.value;
                  setContent(value);
                  updateNode({ content: value, preview: value.slice(0, 60) });
                }}
                onBlur={() => {
                  if (content !== node.data.preview && content !== node.data.content) {
                    updateNode({ content, preview: content.slice(0, 60) });
                  }
                }}
                placeholder="Write your thoughts, links, code..."
                className="w-full h-32 px-3 py-2.5 text-sm text-white bg-white/5 border border-white/10 rounded-lg resize-none placeholder:text-white/30 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all font-mono"
              />
              <p className="text-[10px] text-white/30">Supports markdown formatting</p>
            </div>

            {/* AI Actions */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">
                AI Actions
              </h3>
              <div className="flex flex-col gap-1.5">
                <button
                  onClick={async () => {
                    if (!node || isExpanding) return;
                    setIsExpanding(true);
                    try {
                      const res = await fetch("/api/expand-node", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({
                          title: node.data.title,
                          content: content,
                        }),
                      });
                      if (!res.ok) {
                        const errData = await res.json().catch(() => null);
                        if (errData?.error?.includes("configured")) {
                          toast.error("Live AI features require API keys. See README to self-host, or contact the demo owner.", { duration: 6000 });
                          setIsExpanding(false);
                          return;
                        }
                        toast.error("Expansion failed");
                        setIsExpanding(false);
                        return;
                      }
                      const data = await res.json();
                      if (data.text) {
                        setContent(data.text);
                        updateNode({ 
                          content: data.text,
                          preview: data.text.slice(0, 60) + "..."
                        });
                        toast.success("Node expanded");
                      } else {
                        toast.error("Expansion failed");
                      }
                    } catch {
                      toast.error("Expansion failed");
                    } finally {
                      setIsExpanding(false);
                    }
                  }}
                  disabled={isExpanding}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                  {isExpanding ? "Expanding..." : "Expand with AI"}
                </button>
                <button
                  onClick={async () => {
                    if (!node) return;
                    setIsFindingRelated(true);
                    await onFindRelated(node.id);
                    setIsFindingRelated(false);
                  }}
                  disabled={isFindingRelated}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Network className="w-4 h-4 text-violet-400 shrink-0" />
                  {isFindingRelated ? "Finding related..." : "Find related nodes"}
                </button>

              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-white/10" />

            {/* Connections */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Connections
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {connectedNodes.map((connectedNode) => {
                  const connectedData = connectedNode.data as KnowledgeNodeData;
                  const edgeToRemove = connectedEdges.find(
                    (e) =>
                      (e.source === node.id && e.target === connectedNode.id) ||
                      (e.target === node.id && e.source === connectedNode.id)
                  );
                  return (
                    <div
                      key={connectedNode.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-white/70"
                    >
                      <span className="truncate max-w-[120px]">{connectedData.title}</span>
                      {edgeToRemove && (
                        <button
                          onClick={() => onRemoveConnection(edgeToRemove.id)}
                          className="p-0.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                {connectedNodes.length === 0 && (
                  <p className="text-xs text-white/30">No connections yet</p>
                )}
              </div>

            </div>

            {/* Tags */}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-medium text-white/50 uppercase tracking-wider">
                Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 px-2 py-0.5 bg-primary/20 border border-primary/30 rounded-full text-xs text-primary"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                    >
                      <X className="w-2.5 h-2.5" />
                    </button>
                  </div>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Add tag..."
                  className="w-20 px-2 py-0.5 text-xs text-white bg-transparent border-none outline-none placeholder:text-white/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10">
          <span className="text-xs text-white/30">Last edited {formatLastEdited(lastEdited)}</span>
          <button
            onClick={() => {
              onDeleteNode(node.id);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 bg-transparent border border-red-500/30 rounded-lg hover:bg-red-500/10 hover:border-red-500/50 transition-all"
          >
            <Trash2 className="w-3 h-3" />
            Delete node
          </button>
        </div>
      </div>
    </div>
  );
}
