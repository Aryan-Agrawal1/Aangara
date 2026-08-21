import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
export interface BreadcrumbItem { label: string; href?: string; }
export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[13px] text-[#4B5A54] py-2">
      <Link href="/" className="hover:text-[#0B4A3D] transition-colors">Home</Link>
      {items.map((item, i) => (
        <React.Fragment key={i}>
          <ChevronRight className="w-3 h-3 text-[#6B7A72] flex-shrink-0" />
          {item.href ? <Link href={item.href} className="hover:text-[#0B4A3D] transition-colors">{item.label}</Link> : <span className="text-[#10231C] font-medium" aria-current="page">{item.label}</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}