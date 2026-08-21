import React from 'react';

export function SkeletonCard({ rows = 3, className = '' }: { rows?: number; className?: string }) {
  return (
    <div className={`card-base rounded-xl p-5 animate-pulse ${className}`}>
      <div className="h-4 bg-slate-800 rounded w-1/3 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={`h-3 bg-slate-800/70 rounded mb-2 ${i % 2 === 0 ? 'w-full' : 'w-3/4'}`} />
      ))}
    </div>
  );
}
