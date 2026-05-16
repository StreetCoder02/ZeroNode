"use client";

import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react";

export default function AnimatedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: "url(#edge-gradient)",
          strokeWidth: 1,
          strokeOpacity: 0.3,
        }}
      />
      <path
        d={edgePath}
        fill="none"
        stroke="url(#edge-gradient)"
        strokeWidth={1.5}
        strokeDasharray="8 8"
        strokeOpacity={0.6}
        className="animate-flow"
      />
      <defs>
        <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </>
  );
}
