'use client';
import React from 'react';
import Link from 'next/link';

interface ProvenanceFooterProps {
  verifiedDate?: string;
  className?: string;
}

export function ProvenanceFooter({ verifiedDate = '2026-01-09', className = '' }: ProvenanceFooterProps) {
  return (
    <div className={`mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 ${className}`}>
      <div className="flex items-center gap-4">
        <span>Sources:</span>
        <a href="https://beeindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">BEE</a>
        <span>&middot;</span>
        <a href="https://moef.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">MoEFCC</a>
        <span>&middot;</span>
        <a href="https://cercind.gov.in" target="_blank" rel="noopener noreferrer" className="text-blue-400/70 hover:text-blue-400 transition-colors">CERC</a>
        <span>&middot;</span>
        <Link href="/sources" className="text-blue-400/70 hover:text-blue-400 transition-colors">Evidence Center &rarr;</Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
        <span>Regulatory data last verified: <time dateTime={verifiedDate}>{new Date(verifiedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></span>
      </div>
    </div>
  );
}
