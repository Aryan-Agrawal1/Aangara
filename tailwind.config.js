/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        /* AANGARA v3 — logo-derived palette */
        "flame-primary":      "#D9531E",
        "flame-glow":         "#F2984A",
        "flame-subtle":       "#FEF0E6",
        "leaf-primary":       "#1F4D2E",
        "leaf-primary-hover": "#27643A",
        "leaf-accent":        "#5B8A4A",
        "leaf-subtle":        "#E8F2EB",
        "surface-base":       "#F5F2F3",
        "surface-subtle":     "#EBE6E3",
        "surface-border":     "#E8E2DC",
        "surface-border-strong": "#CFC8C2",
        "text-primary":       "#1A1C18",
        "text-secondary":     "#4A5446",
        "text-muted":         "#6B7268",

        /* Legacy aliases — so any remaining Tailwind class references still resolve */
        "brand-primary":        "#1F4D2E",
        "brand-primary-hover":  "#27643A",
        "brand-primary-subtle": "#E8F2EB",
        "accent-fresh":         "#F2984A",
        "accent-fresh-hover":   "#E8893A",
        "accent-fresh-deep":    "#D9531E",
        "accent-fresh-subtle":  "#FEF0E6",

        /* Semantic status */
        "status-good":        "#1F8A5F",
        "status-good-bg":     "#E8F5EE",
        "status-warning":     "#C98A1E",
        "status-warning-bg":  "#FEF7E8",
        "status-critical":    "#C33B2E",
        "status-critical-bg": "#FDECEA",
        "status-info":        "#2E6BA8",
        "status-info-bg":     "#EBF3FB",
        "ca-fact":            "#2E6BA8",
        "ca-calculation":     "#1F8A5F",
        "ca-model":           "#7C3AED",
        "ca-scenario":        "#C98A1E",
        "ca-synthetic":       "#6B7268",

        charcoal: { 950:"#10231C", 900:"#1C332A", 800:"#2D4A3D", 700:"#3D6152", 600:"#4E7967" },
        carbon:   { 50:"#E8F2EB", 100:"#C5E8D0", 400:"#3BAF8C", 500:"#1F4D2E", 600:"#19402A", accent:"#D9531E" },
        slate:    { 400:"#94a3b8", 500:"#64748b", 600:"#475569", 700:"#334155", 800:"#1e293b", 900:"#0f172a", 950:"#020617" },
        emerald:  { 300:"#6ee7b7", 400:"#34d399", 500:"#10b981", 600:"#059669" },
      },
      fontFamily: {
        sans:    ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono:    ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        "resting":  "0 1px 3px rgba(26,28,24,0.06), 0 1px 2px rgba(26,28,24,0.04)",
        "hover":    "0 4px 16px rgba(26,28,24,0.10), 0 2px 6px rgba(26,28,24,0.06)",
        "elevated": "0 8px 32px rgba(26,28,24,0.12), 0 4px 12px rgba(26,28,24,0.08)",
        "flame":    "0 0 24px rgba(217,83,30,0.35), 0 0 8px rgba(242,152,74,0.25)",
      },
      borderRadius: {
        "card":   "12px",
        "button": "8px",
        "pill":   "999px",
      },
      animation: {
        "shimmer":     "shimmer 1.5s infinite linear",
        "glow-pulse":  "glow-pulse 3s infinite ease-in-out",
        "fade-up":     "fadeUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards",
        "ember-rise":  "emberRise 3.5s ease-in infinite",
        "float-slow":  "float-slow 4s ease-in-out infinite",
      },
      keyframes: {
        shimmer:      { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
        fadeUp:       { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "glow-pulse": { "0%, 100%": { boxShadow: "0 0 0 2px rgba(31,77,46,0.15)" }, "50%": { boxShadow: "0 0 0 4px rgba(31,77,46,0.25)" } },
        "float-slow": { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-6px)" } },
      },
    },
  },
  plugins: [],
};