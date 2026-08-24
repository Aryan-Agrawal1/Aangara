import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import "../styles/globals.css";
import { JudgeModeFAB } from "@/components/navigation/JudgeModeFAB";
import { ThemeProvider } from "@/lib/theme";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: "AANGARA — CCTS Decision Intelligence by Terranex",
  description: "Institutional carbon-market decision intelligence for India CCTS compliance. BUY vs BUILD vs HYBRID strategies calibrated to BEE / MoEFCC / CERC regulations. Produced by Terranex.",
  keywords: ["AANGARA", "Terranex", "CCTS", "carbon compliance", "BEE", "India carbon market", "GEI", "CCC"],
  authors: [{ name: "Terranex" }],
  creator: "Terranex",
  publisher: "Terranex",
  openGraph: {
    title: "AANGARA — CCTS Decision Intelligence",
    description: "Institutional carbon-market decision intelligence for India CCTS compliance. Produced by Terranex.",
    siteName: "AANGARA by Terranex",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "AANGARA — CCTS Decision Intelligence by Terranex",
    description: "Institutional carbon-market decision intelligence for India CCTS compliance.",
  },
  icons: {
    icon: [
      { url: "/aangara-logo.jpg", type: "image/jpeg" },
    ],
    apple: "/aangara-logo.jpg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${newsreader.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-surface-base text-text-primary min-h-screen antialiased flex flex-col font-sans selection:bg-leaf-primary selection:text-white relative">
        <ThemeProvider>
          {children}
          <JudgeModeFAB />
          {/* Sitewide footer */}
          <footer className="w-full border-t border-[#E8E2DC] bg-white/70 backdrop-blur-sm py-4 px-6">
            <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-[10px] text-[#6B7268] font-mono">
                AANGARA — CCTS Decision Intelligence · Synthetic Demonstration Data Only
              </p>
              <p className="text-[10px] text-[#6B7268] font-mono">
                Produced by <span className="font-bold text-[#1F4D2E]">Terranex</span>
              </p>
            </div>
          </footer>
          <div className="fixed bottom-0 right-0 z-50 px-3 py-1 bg-[#FEF0E6] text-[#D9531E] border-t border-l border-[#D9531E]/30 text-[10px] font-mono font-bold rounded-tl-lg pointer-events-none">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}