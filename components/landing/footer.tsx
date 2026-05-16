import { Hexagon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-16 px-6 border-t border-white/5">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Hexagon className="w-6 h-6 text-primary fill-primary/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
          </div>
          <span className="text-sm font-medium text-white/60">ZeroNode</span>
        </div>

        {/* Tech stack */}
        <p className="text-sm text-white/40">
          Built with Claude API + Gemini Embeddings
        </p>

        {/* Open source */}
        <p className="text-xs text-white/30">Open source. Free forever.</p>
      </div>
    </footer>
  );
}
