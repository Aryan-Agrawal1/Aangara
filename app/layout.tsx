import type { Metadata } from 'next';
import '../styles/globals.css';
import { JudgeModeFAB } from '@/components/navigation/JudgeModeFAB';

export const metadata: Metadata = {
  title: 'CarbonAlpha India · CCTS Carbon Decision Intelligence & Capital Allocation',
  description: 'Convert Indian carbon-market complexity into deterministic capital-allocation decisions (BUY vs BUILD vs HYBRID) calibrated to BEE and CCTS rules.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06090E] text-slate-100 min-h-screen antialiased flex flex-col font-sans selection:bg-emerald-500 selection:text-black relative">
        {children}
        <JudgeModeFAB />
        <div className="fixed bottom-0 right-0 z-50 px-3 py-1 bg-amber-500/10 text-amber-500 border-t border-l border-amber-500/20 text-[10px] font-mono font-bold backdrop-blur-md rounded-tl-lg pointer-events-none">
          SYNTHETIC DEMONSTRATION
        </div>
      </body>
    </html>
  );
}

