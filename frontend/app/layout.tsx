import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'CarbonAlpha India ? Carbon-Market Decision Intelligence',
  description: 'Convert Indian carbon-market complexity into transparent capital-allocation decisions (BUY vs BUILD vs HYBRID).',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#070B11] text-slate-100 min-h-screen antialiased flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
        {children}
      </body>
    </html>
  );
}
