"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, GitBranch, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Sparkles,
    color: "#3B82F6",
    title: "AI Node Generation",
    description:
      "Describe any topic and watch ZeroNode build a connected knowledge structure instantly.",
  },
  {
    icon: GitBranch,
    color: "#8B5CF6",
    title: "Semantic Linking",
    description:
      "AI automatically finds hidden connections between your ideas across your entire graph.",
  },
  {
    icon: MessageCircle,
    color: "#06B6D4",
    title: "Chat with your graph",
    description:
      "Ask questions in natural language. Get answers from your own knowledge base.",
  },
];

export default function FeaturesSection() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`
                  relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6
                  hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1
                  transition-all duration-300
                  ${isVisible ? "animate-fade-in-up" : "opacity-0"}
                `}
                style={{
                  animationDelay: `${index * 150}ms`,
                  boxShadow: isVisible
                    ? `0 0 40px ${feature.color}10`
                    : "none",
                }}
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
