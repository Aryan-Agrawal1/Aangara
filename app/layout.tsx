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
  title: "CarbonAlpha India - CCTS Carbon Decision Intelligence",
  description: "Institutional carbon-market decision intelligence for India CCTS compliance. BUY vs BUILD vs HYBRID strategies calibrated to BEE/MoEFCC/CERC regulations.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`light ${newsreader.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="bg-white text-[#10231C] min-h-screen antialiased flex flex-col font-sans selection:bg-[#0B4A3D] selection:text-white relative">
        <ThemeProvider>
          {children}
          <JudgeModeFAB />
          <div className="fixed bottom-0 right-0 z-50 px-3 py-1 bg-[#FEF7E8] text-[#C98A1E] border-t border-l border-[#C98A1E]/30 text-[10px] font-mono font-bold rounded-tl-lg pointer-events-none">
            SYNTHETIC DEMONSTRATION DATA
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}