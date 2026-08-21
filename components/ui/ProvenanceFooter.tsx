import React from "react";
import Link from "next/link";
export function ProvenanceFooter({ verifiedDate = "2026-01-09", className = "" }: { verifiedDate?: string; className?: string }) {
  const formatted = new Date(verifiedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  return (
    <div className={`mt-8 pt-4 border-t border-[#E4E9E6] flex flex-wrap items-center justify-between gap-3 text-xs text-[#6B7A72] ${className}`}>
      <div className="flex items-center gap-3 flex-wrap">
        <span>Sources:</span>
        <a href="https://beeindia.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#2E6BA8] hover:text-[#0B4A3D] transition-colors">BEE</a>
        <span>·</span>
        <a href="https://moef.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#2E6BA8] hover:text-[#0B4A3D] transition-colors">MoEFCC</a>
        <span>·</span>
        <a href="https://cercind.gov.in" target="_blank" rel="noopener noreferrer" className="text-[#2E6BA8] hover:text-[#0B4A3D] transition-colors">CERC</a>
        <span>·</span>
        <Link href="/sources" className="text-[#2E6BA8] hover:text-[#0B4A3D] transition-colors">Evidence Center →</Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1F8A5F] inline-block" />
        <span>Regulatory data last verified: <time dateTime={verifiedDate}>{formatted}</time></span>
      </div>
    </div>
  );
}