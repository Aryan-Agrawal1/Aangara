import React from "react";
export function SkeletonCard({ rows = 3, className = "" }: { rows?: number; className?: string }) {
  return (
    <div className={`bg-white border border-[#E4E9E6] rounded-xl p-5 ${className}`}>
      <div className="skeleton h-4 w-1/3 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`skeleton h-3 mb-2 ${i % 2 === 0 ? "w-full" : "w-3/4"}`} />
      ))}
    </div>
  );
}