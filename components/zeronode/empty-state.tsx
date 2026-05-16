"use client";

import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import type { KnowledgeNodeData } from "./knowledge-node";

interface EmptyStateProps {
  onOpenAIGenerate: () => void;
  onCreateBlankNode: () => void;
  onQuickGenerate: (prompt: string) => void;
}

const exampleChips = [
  { label: "DSA Roadmap", prompt: "Create a comprehensive DSA learning roadmap" },
  { label: "React concepts", prompt: "Map out core React concepts and hooks" },
  { label: "Machine learning", prompt: "Explain machine learning fundamentals" },
];

const floatingParticles = [
  { color: "bg-primary", size: "w-2 h-2", left: "15%", top: "20%", delay: "0s", alt: false },
  { color: "bg-secondary", size: "w-1.5 h-1.5", left: "80%", top: "25%", delay: "1s", alt: true },
  { color: "bg-primary", size: "w-1 h-1", left: "25%", top: "70%", delay: "2s", alt: false },
  { color: "bg-accent", size: "w-2 h-2", left: "75%", top: "65%", delay: "0.5s", alt: true },
  { color: "bg-secondary", size: "w-1.5 h-1.5", left: "10%", top: "50%", delay: "1.5s", alt: false },
  { color: "bg-primary", size: "w-1 h-1", left: "85%", top: "45%", delay: "2.5s", alt: true },
];

export default function EmptyState({
  onOpenAIGenerate,
  onCreateBlankNode,
  onQuickGenerate,
}: EmptyStateProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
      {/* Hexagon grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Floating particles */}
      {floatingParticles.map((particle, index) => (
        <div
          key={index}
          className={`absolute ${particle.size} ${particle.color} rounded-full blur-[1px] ${
            particle.alt ? "animate-float-particle-alt" : "animate-float-particle"
          }`}
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
          }}
        />
      ))}

      {/* Main card */}
      <div className="pointer-events-auto animate-card-enter">
        <div className="w-[480px] bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          {/* Animated logo */}
          <div className="flex justify-center mb-6">
            <div className="animate-logo-pulse">
              <svg
                width="64"
                height="64"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 2L37 11.5V30.5L20 40L3 30.5V11.5L20 2Z"
                  fill="url(#emptyStateGradient)"
                  stroke="url(#emptyStateStroke)"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="21" r="4" fill="#3B82F6" />
                <defs>
                  <linearGradient
                    id="emptyStateGradient"
                    x1="3"
                    y1="2"
                    x2="37"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3B82F6" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient
                    id="emptyStateStroke"
                    x1="3"
                    y1="2"
                    x2="37"
                    y2="40"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#3B82F6" />
                    <stop offset="1" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-white text-center mb-2">
            Your graph is empty
          </h2>
          <p className="text-white/50 text-center mb-8 text-sm leading-relaxed">
            Start by telling AI what you want to learn,
            <br />
            or drop your first node manually.
          </p>

          {/* Action buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={onOpenAIGenerate}
              className="w-full h-12 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]"
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </button>
            <p className="text-white/30 text-xs text-center -mt-1">
              {"e.g. 'Teach me system design'"}
            </p>

            <button
              onClick={onCreateBlankNode}
              className="w-full h-12 bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 text-white/70 hover:text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create blank node
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or try an example</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Example chips */}
          <div className="flex gap-2 justify-center">
            {exampleChips.map((chip, index) => (
              <button
                key={chip.label}
                onClick={() => onQuickGenerate(chip.prompt)}
                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full text-white/60 hover:text-white text-xs transition-all duration-300 animate-fade-in-up opacity-0"
                style={{ animationDelay: `${300 + index * 100}ms`, animationFillMode: "forwards" }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tip text below card */}
        <p className="text-white/20 text-xs text-center mt-6">
          Tip: Press Space anywhere on the canvas to create a node
        </p>
      </div>
    </div>
  );
}
