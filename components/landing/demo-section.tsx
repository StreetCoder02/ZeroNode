"use client";

import { useEffect, useRef, useState } from "react";
import {
  FileText,
  Lightbulb,
  Code,
  BookOpen,
  GitBranch,
  Hexagon,
} from "lucide-react";

const demoNodes = [
  { title: "CAP Theorem", icon: BookOpen, color: "#3B82F6" },
  { title: "Consistency", icon: FileText, color: "#10B981" },
  { title: "Availability", icon: Lightbulb, color: "#F59E0B" },
  { title: "Partition Tol.", icon: Code, color: "#EC4899" },
  { title: "Trade-offs", icon: GitBranch, color: "#8B5CF6" },
];

export default function DemoSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div
          className={`
            relative bg-white/[0.03] border border-white/10 rounded-2xl p-8 lg:p-12 overflow-hidden
            ${isVisible ? "animate-fade-in-up" : "opacity-0"}
          `}
        >
          {/* Background grid pattern */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Steps */}
            <div className="space-y-8">
              <div
                className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "100ms" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                    1
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    Type a topic
                  </h3>
                </div>
                <div className="ml-11 bg-white/5 border border-white/10 rounded-lg px-4 py-3">
                  <span className="text-white/40 text-sm">
                    Teach me system design...
                  </span>
                </div>
              </div>

              <div
                className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "300ms" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center text-sm font-semibold">
                    2
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    AI generates nodes
                  </h3>
                </div>
                <div className="ml-11 flex gap-2 flex-wrap">
                  {demoNodes.slice(0, 3).map((node, i) => {
                    const Icon = node.icon;
                    return (
                      <div
                        key={node.title}
                        className={`
                          bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center gap-2
                          ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                        `}
                        style={{ animationDelay: `${400 + i * 100}ms` }}
                      >
                        <Icon
                          className="w-3.5 h-3.5"
                          style={{ color: node.color }}
                        />
                        <span className="text-xs text-white/80">
                          {node.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div
                className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
                style={{ animationDelay: "700ms" }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold">
                    3
                  </span>
                  <h3 className="text-lg font-semibold text-white">
                    Explore your graph
                  </h3>
                </div>
                <div className="ml-11">
                  <svg
                    width="200"
                    height="60"
                    viewBox="0 0 200 60"
                    className="text-white/30"
                  >
                    <defs>
                      <linearGradient
                        id="demoGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <circle cx="20" cy="30" r="6" fill="#3B82F6" />
                    <circle cx="80" cy="15" r="6" fill="#10B981" />
                    <circle cx="80" cy="45" r="6" fill="#F59E0B" />
                    <circle cx="140" cy="30" r="6" fill="#8B5CF6" />
                    <path
                      d="M26 30 Q 50 20 74 15"
                      stroke="url(#demoGrad)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                    />
                    <path
                      d="M26 30 Q 50 40 74 45"
                      stroke="url(#demoGrad)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                      style={{ animationDelay: "0.2s" }}
                    />
                    <path
                      d="M86 15 Q 110 20 134 30"
                      stroke="url(#demoGrad)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                      style={{ animationDelay: "0.4s" }}
                    />
                    <path
                      d="M86 45 Q 110 40 134 30"
                      stroke="url(#demoGrad)"
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                      style={{ animationDelay: "0.6s" }}
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Right: Canvas Mockup */}
            <div
              className={`${isVisible ? "animate-fade-in-up" : "opacity-0"}`}
              style={{ animationDelay: "400ms" }}
            >
              <div className="bg-black/60 border border-white/10 rounded-xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/10">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                    <div className="w-3 h-3 rounded-full bg-white/20" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="bg-white/5 rounded-md px-4 py-1 text-xs text-white/40 flex items-center gap-2">
                      <Hexagon className="w-3 h-3" />
                      zeronode.app/canvas
                    </div>
                  </div>
                </div>

                {/* Canvas Content */}
                <div
                  className="relative h-[280px]"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                >
                  {/* Demo nodes in canvas */}
                  {demoNodes.map((node, i) => {
                    const Icon = node.icon;
                    const positions = [
                      { x: 15, y: 20 },
                      { x: 55, y: 10 },
                      { x: 55, y: 50 },
                      { x: 10, y: 65 },
                      { x: 70, y: 70 },
                    ];
                    return (
                      <div
                        key={node.title}
                        className={`
                          absolute bg-white/5 backdrop-blur border border-white/10 rounded-lg p-2 w-[100px]
                          ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                        `}
                        style={{
                          left: `${positions[i].x}%`,
                          top: `${positions[i].y}%`,
                          animationDelay: `${600 + i * 100}ms`,
                        }}
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-l-lg"
                          style={{ backgroundColor: node.color }}
                        />
                        <div className="flex items-center gap-1.5 pl-1">
                          <Icon
                            className="w-3 h-3"
                            style={{ color: node.color }}
                          />
                          <span className="text-[10px] text-white/80 truncate">
                            {node.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Connection lines in canvas */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                      <linearGradient
                        id="canvasGrad"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 65 60 Q 100 40 145 35"
                      stroke="url(#canvasGrad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                    />
                    <path
                      d="M 65 60 Q 100 80 145 110"
                      stroke="url(#canvasGrad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                    />
                    <path
                      d="M 155 35 Q 180 60 210 165"
                      stroke="url(#canvasGrad)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 2"
                      className="animate-flow"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
