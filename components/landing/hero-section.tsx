"use client";

import Link from "next/link";
import HeroCanvas from "./hero-canvas";

export default function HeroSection() {
  return (
    <section className="min-h-screen pt-16 flex items-center">
      <div className="w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="space-y-6">
            {/* Eyebrow */}
            <div className="animate-fade-in-up">
              <span className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                AI-Powered Knowledge Graphs
              </span>
            </div>

            {/* H1 */}
            <h1
              className="text-5xl lg:text-6xl font-bold text-white leading-tight animate-fade-in-up animation-delay-100"
            >
              <span className="inline-block">Your second brain,</span>
              <br />
              <span className="inline-block bg-gradient-to-r from-white via-primary to-white bg-clip-text text-transparent animate-shimmer">
                rewired by AI.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/60 max-w-lg leading-relaxed animate-fade-in-up animation-delay-200">
              ZeroNode turns scattered notes into a living knowledge graph. AI
              connects your ideas, finds gaps, and helps you think deeper.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-300">
              <Link
                href="/app"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-primary to-primary/80 text-white font-medium hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all duration-300"
              >
                Start for free
              </Link>
              <button className="px-6 py-3 rounded-lg border border-white/20 text-white/80 font-medium hover:bg-white/5 hover:border-white/30 transition-all duration-300">
                See how it works
              </button>
            </div>

            {/* Muted text */}
            <p className="text-sm text-white/40 animate-fade-in-up animation-delay-400">
              No account needed to try
            </p>
          </div>

          {/* Right: Hero Canvas */}
          <div className="animate-fade-in-up animation-delay-300 lg:animate-fade-in-up lg:animation-delay-500">
            <HeroCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
