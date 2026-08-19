'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/decision');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-mono text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
        <span>Initializing CarbonAlpha Decision Twin...</span>
      </div>
    </div>
  );
}
