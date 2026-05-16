"use client";

import { FileText, Lightbulb, Code, BookOpen, GitBranch } from "lucide-react";

const heroNodes = [
  {
    id: 1,
    title: "System Design",
    type: "concept",
    icon: BookOpen,
    color: "#3B82F6",
    position: { x: 20, y: 15 },
    drift: "animate-node-drift",
  },
  {
    id: 2,
    title: "Microservices",
    type: "note",
    icon: FileText,
    color: "#10B981",
    position: { x: 65, y: 8 },
    drift: "animate-node-drift-alt",
  },
  {
    id: 3,
    title: "Load Balancing",
    type: "idea",
    icon: Lightbulb,
    color: "#F59E0B",
    position: { x: 50, y: 55 },
    drift: "animate-node-drift-slow",
  },
  {
    id: 4,
    title: "API Gateway",
    type: "code",
    icon: Code,
    color: "#EC4899",
    position: { x: 10, y: 60 },
    drift: "animate-node-drift",
  },
  {
    id: 5,
    title: "Caching Layer",
    type: "concept",
    icon: GitBranch,
    color: "#8B5CF6",
    position: { x: 75, y: 50 },
    drift: "animate-node-drift-alt",
  },
];

const connections = [
  { from: 1, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 5 },
  { from: 3, to: 4 },
  { from: 4, to: 5 },
];

export default function HeroCanvas() {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px]">
      {/* SVG Connections */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {connections.map((conn, i) => {
          const fromNode = heroNodes.find((n) => n.id === conn.from)!;
          const toNode = heroNodes.find((n) => n.id === conn.to)!;
          const x1 = `${fromNode.position.x + 8}%`;
          const y1 = `${fromNode.position.y + 5}%`;
          const x2 = `${toNode.position.x + 8}%`;
          const y2 = `${toNode.position.y + 5}%`;

          return (
            <path
              key={i}
              d={`M ${x1.replace("%", "")}% ${y1.replace("%", "")}% Q ${
                (parseFloat(x1) + parseFloat(x2)) / 2
              }% ${(parseFloat(y1) + parseFloat(y2)) / 2 - 10}% ${x2.replace(
                "%",
                ""
              )}% ${y2.replace("%", "")}%`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeDasharray="8 4"
              className="animate-flow"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          );
        })}
      </svg>

      {/* Nodes */}
      {heroNodes.map((node) => {
        const Icon = node.icon;
        return (
          <div
            key={node.id}
            className={`absolute ${node.drift}`}
            style={{
              left: `${node.position.x}%`,
              top: `${node.position.y}%`,
            }}
          >
            <div
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-3 w-[140px] hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: `0 0 20px ${node.color}20`,
              }}
            >
              <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                style={{ backgroundColor: node.color }}
              />
              <div className="flex items-center gap-2 pl-2">
                <Icon className="w-4 h-4" style={{ color: node.color }} />
                <span className="text-sm text-white font-medium truncate">
                  {node.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
