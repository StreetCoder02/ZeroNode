import { Suspense } from "react";
import KnowledgeGraph from "@/components/zeronode/knowledge-graph";

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
      </div>
    }>
      <KnowledgeGraph />
    </Suspense>
  );
}
