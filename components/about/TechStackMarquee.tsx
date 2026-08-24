'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const LogoLoop = dynamic(() => import('@/components/ui/LogoLoop'), { ssr: false });

export function TechStackMarquee() {
  const TECH_STACK_ITEMS = [
    {
      name: 'Next.js',
      color: '#000000',
      icon: (
        <svg className="w-5 h-5 fill-current text-black" viewBox="0 0 180 180">
          <mask height="180" id="mask0" maskUnits="userSpaceOnUse" width="180" x="0" y="0" style={{ maskType: 'alpha' }}>
            <circle cx="90" cy="90" fill="black" r="90" />
          </mask>
          <g mask="url(#mask0)">
            <circle cx="90" cy="90" fill="black" r="90" />
            <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
            <rect fill="white" height="72" width="12" x="115" y="54" />
          </g>
        </svg>
      ),
    },
    {
      name: 'React 19',
      color: '#61DAFB',
      icon: (
        <svg className="w-5 h-5 text-[#087ea4]" viewBox="-11.5 -10.23174 23 20.46348">
          <circle cx="0" cy="0" r="2.05" fill="#087ea4" />
          <g stroke="#087ea4" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      color: '#3178C6',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 128 128">
          <rect fill="#3178C6" height="128" rx="16" width="128" />
          <path d="M72.7 78.4c2.2 3.6 5.8 6.4 10.7 6.4 4.5 0 7.3-2.3 7.3-5.5 0-4-3.7-5.5-10.1-8.3-9.5-4-15.8-9.4-15.8-20.2 0-10.7 8.5-19 22.4-19 9.8 0 16.8 3.5 21.2 11.2l-9.8 6.3c-2.3-4.1-5.6-5.8-9.8-5.8-4.2 0-6.6 2.3-6.6 5.1 0 3.5 3.3 4.9 9.5 7.6 11.3 4.8 16.6 9.9 16.6 21 0 12.3-9.5 19.8-23.7 19.8-12.7 0-21.5-5.3-25.9-13.8l9.4-4.8zM41.7 43.6H17.8V33.2h60.2v10.4H54.2v62H41.7v-62z" fill="#FFF" />
        </svg>
      ),
    },
    {
      name: 'Tailwind CSS',
      color: '#06B6D4',
      icon: (
        <svg className="w-5 h-5 fill-[#06B6D4]" viewBox="0 0 24 24">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      ),
    },
    {
      name: 'Recharts',
      color: '#22b5bf',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 32 32">
          <rect x="4" y="16" width="6" height="12" rx="2" fill="#22b5bf" />
          <rect x="13" y="8" width="6" height="20" rx="2" fill="#2E6BA8" />
          <rect x="22" y="4" width="6" height="24" rx="2" fill="#1F4D2E" />
        </svg>
      ),
    },
    {
      name: 'Zustand',
      color: '#443e38',
      icon: (
        <svg className="w-5 h-5 fill-[#443e38]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="9" fill="#F4E8DB" stroke="#443e38" strokeWidth="1.5" />
          <circle cx="9" cy="10" r="1.5" fill="#443e38" />
          <circle cx="15" cy="10" r="1.5" fill="#443e38" />
          <path d="M10 14.5c.8.8 2.2.8 3 0" stroke="#443e38" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      name: 'FastAPI',
      color: '#059669',
      icon: (
        <svg className="w-5 h-5 fill-[#059669]" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#009688" />
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 14.5v-4H9l4.5-6.5v4H15l-4 6.5z" fill="#FFF" />
        </svg>
      ),
    },
    {
      name: 'Pydantic',
      color: '#E92063',
      icon: (
        <svg className="w-5 h-5 fill-[#E92063]" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#E92063" />
          <path d="M7 6h6a4 4 0 010 8H7V6zm3 2.5v3h3a1.5 1.5 0 000-3h-3zm-3 8h3v3H7v-3z" fill="#FFF" />
        </svg>
      ),
    },
    {
      name: 'scikit-learn',
      color: '#F97316',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <circle cx="8" cy="14" r="5" fill="#3499cd" />
          <circle cx="16" cy="10" r="5" fill="#f89939" />
          <circle cx="12" cy="12" r="2.5" fill="#1F4D2E" opacity="0.8" />
        </svg>
      ),
    },
    {
      name: 'Pandas',
      color: '#150458',
      icon: (
        <svg className="w-5 h-5 fill-[#150458]" viewBox="0 0 24 24">
          <rect x="4" y="4" width="4" height="16" rx="1" fill="#150458" />
          <rect x="10" y="8" width="4" height="12" rx="1" fill="#E70488" />
          <rect x="16" y="12" width="4" height="8" rx="1" fill="#FFD13B" />
        </svg>
      ),
    },
    {
      name: 'NumPy',
      color: '#4D77CF',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <rect width="20" height="20" x="2" y="2" rx="4" fill="#4D77CF" />
          <path d="M6 18V6l4 8V6h2v12l-4-8v8H6zm9 0V6h3v12h-3z" fill="#FFF" />
        </svg>
      ),
    },
    {
      name: 'OGL / WebGL',
      color: '#D9531E',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <polygon points="12,2 22,8.5 22,17.5 12,22 2,17.5 2,8.5" fill="#D9531E" opacity="0.15" stroke="#D9531E" strokeWidth="1.5" />
          <polygon points="12,6 18,10 18,15 12,18 6,15 6,10" fill="#D9531E" />
        </svg>
      ),
    },
    {
      name: 'Vitest',
      color: '#729B1B',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#FCC72B" />
          <path d="M7 6l5 12 5-12h-3l-2 5-2-5H7z" fill="#729B1B" />
        </svg>
      ),
    },
    {
      name: 'Playwright',
      color: '#45BA4B',
      icon: (
        <svg className="w-5 h-5 fill-[#45BA4B]" viewBox="0 0 24 24">
          <circle cx="9" cy="12" r="6" fill="#45BA4B" opacity="0.85" />
          <circle cx="15" cy="12" r="6" fill="#D9531E" opacity="0.75" />
        </svg>
      ),
    },
  ];

  return (
    <LogoLoop
      items={TECH_STACK_ITEMS}
      speed={55}
      direction="left"
      pauseOnHover={true}
      fadeOut={true}
      fadeColor="#ffffff"
      gap={20}
    />
  );
}
