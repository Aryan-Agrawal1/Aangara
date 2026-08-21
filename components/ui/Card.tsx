import React from "react";
interface CardProps { children: React.ReactNode; className?: string; variant?: "base" | "subtle" | "glass" | "elevated"; hover?: boolean; as?: "div" | "article" | "section"; }
export function Card({ children, className = "", variant = "base", hover = false, as: Tag = "div" }: CardProps) {
  const base = "rounded-card transition-all duration-200";
  const variants = { base: "bg-white border border-[#E4E9E6] shadow-resting", subtle: "bg-[#F6F8F7] border border-[#E4E9E6]", glass: "card-glass", elevated: "bg-white border border-[#E4E9E6] shadow-elevated" };
  const hoverCls = hover ? "hover:shadow-hover hover:-translate-y-0.5 cursor-pointer" : "";
  return <Tag className={`${base} ${variants[variant]} ${hoverCls} ${className}`}>{children}</Tag>;
}