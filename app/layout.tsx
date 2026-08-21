import type { Metadata } from 'next';
import '../styles/globals.css';
import { JudgeModeFAB } from '@/components/navigation/JudgeModeFAB';
import { ThemeProvider } from '@/lib/theme';

export const metadata: Metadata = {
  title: 'CarbonAlpha India - CCTS Carbon Decision Intelligence & Capital Allocation',
  description: 'Convert Indian carbon-market complexity into deterministic capital-allocation decisions (BUY vs BUILD vs HYBRID) calibrated to BEE and CCTS rules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-[#06090E] text-slate-100 min-h-screen antialiased flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative">
        <ThemeProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium">Skip to main content</a>
          {children}
          <JudgeModeFAB />
          <div className="fixed bottom-0 right-0 z-50 px-3 py-1 bg-amber-500/10 text-amber-500 border-t border-l border-amber-500/20 text-[10px] font-mono font-bold backdrop-blur-md rounded-tl-lg pointer-events-none">
            SYNTHETIC DEMONSTRATION
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
