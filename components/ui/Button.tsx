import React from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> { variant?: "primary" | "accent" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg"; children: React.ReactNode; }
export function Button({ variant = "primary", size = "md", className = "", children, ...props }: ButtonProps) {
  const sizes = { sm: "text-xs px-3 py-1.5", md: "text-sm px-5 py-2.5", lg: "text-base px-7 py-3" };
  const variants = { primary: "bg-[#0B4A3D] hover:bg-[#0E5C4C] text-white shadow-resting hover:shadow-hover", accent: "bg-[#C9622A] hover:bg-[#B5541F] text-white shadow-resting hover:shadow-hover", secondary: "bg-[#F6F8F7] hover:bg-[#E4E9E6] text-[#10231C] border border-[#E4E9E6]", ghost: "text-[#4B5A54] hover:text-[#10231C] hover:bg-[#F6F8F7]", outline: "border border-[#0B4A3D] text-[#0B4A3D] hover:bg-[#E8F5F2]" };
  return <button {...props} className={`inline-flex items-center justify-center gap-2 font-semibold rounded-button transition-all focus-visible:ring-2 focus-visible:ring-[#C9622A] focus-visible:ring-offset-2 ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>;
}