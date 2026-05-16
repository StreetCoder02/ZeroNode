"use client";

import Link from "next/link";
import { Hexagon } from "lucide-react";

export default function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-6 bg-black/80 backdrop-blur-xl border-b border-white/5">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <Hexagon className="w-8 h-8 text-primary fill-primary/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-primary" />
          </div>
        </div>
        <span className="text-lg font-semibold text-white tracking-tight">
          ZeroNode
        </span>
      </div>

      {/* Open App Button */}
      <Link
        href="/app"
        className="px-5 py-2 rounded-full bg-gradient-to-r from-primary to-primary/80 text-white text-sm font-medium hover:shadow-[0_0_24px_rgba(59,130,246,0.4)] transition-all duration-300"
      >
        Open App
      </Link>
    </nav>
  );
}
