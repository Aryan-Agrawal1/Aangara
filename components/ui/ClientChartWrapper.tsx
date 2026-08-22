'use client';

import React, { useEffect, useState } from 'react';

export function ClientChartWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-full h-full min-h-[200px] flex items-center justify-center text-xs text-[#6B7A72] font-mono">Loading chart...</div>;
  }

  return <>{children}</>;
}
