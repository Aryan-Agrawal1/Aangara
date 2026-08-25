'use client';

import React from 'react';

const TEAM_MEMBERS = [
  { 
    id: 1, 
    name: 'Aryan Agrawal', 
    initials: 'AA',
    linkedin: 'https://www.linkedin.com/in/aryan-agrawal-286685371',
    github: 'https://github.com/Aryan-Agrawal1',
    email: 'aryanagrawal458@gmail.com'
  },
  { 
    id: 2, 
    name: 'Arko Roy Chowdhury', 
    initials: 'AR',
    linkedin: 'https://www.linkedin.com/in/arkoroychowdhury/',
    github: 'https://github.com/Max-Rex-2006',
    email: 'arkoroychowdhury2oo6@gmail.com'
  },
  { 
    id: 3, 
    name: 'Biswajit Baral', 
    initials: 'BB',
    linkedin: 'https://www.linkedin.com/in/biswajit-baral-540991367',
    github: 'https://github.com/BISWAJIT-BARAL01',
    email: 'biswajitbaral2006@gmail.com'
  },
  { 
    id: 4, 
    name: 'Subhankar Das Mohanty', 
    initials: 'SD',
    linkedin: 'https://www.linkedin.com/in/subhankar-das-mohanty/',
    github: 'https://github.com/subhankardasmohanty',
    email: 'subhankardasmohanty@gmail.com'
  },
  { 
    id: 5, 
    name: 'Monami Jana', 
    initials: 'MJ',
    linkedin: 'https://www.linkedin.com/in/monami-jana-8069a223b',
    github: 'https://github.com/monamiJ',
    email: 'monamijana2006@gmail.com'
  },
  { 
    id: 6, 
    name: 'S.V.S. Praveenya', 
    initials: 'SP',
    linkedin: 'https://www.linkedin.com/in/praveenya-s-92016737a',
    github: 'https://github.com/praveenya5577-coder',
    email: 'praveenya5577@gmail.com'
  },
];

export function TeamSection() {
  return (
    <section className="mb-14 pt-8">
      <div className="flex items-center justify-between mb-12 border-b border-[#E8E2DC] pb-3">
        <div>
          <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight">Core Engineering Team</h2>
          <p className="text-xs text-[#6B7268] mt-1">Systems Architecture, Carbon Economics &amp; Decision Intelligence</p>
        </div>
      </div>
      
      {/* 3x2 Grid on desktop/tablet, 1-col on mobile - Compact Portrait Vertical Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 max-w-5xl mx-auto">
        {TEAM_MEMBERS.map((member) => (
          <div 
            key={member.id} 
            className="group team-blue-glass-card rounded-2xl pt-6 pb-5 px-5 flex flex-col items-center text-center max-w-[280px] w-full mx-auto shadow-sm"
          >
            {/* Avatar Circle (100% Fully Visible, No Overflow Clipping) */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1F4D2E] via-[#27643A] to-[#10231C] flex flex-shrink-0 items-center justify-center text-white font-bold text-xl mb-3.5 shadow-md ring-4 ring-white/90 border border-[#BAE0FD] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(31,77,46,0.30)] group-hover:ring-[#BAE0FD]">
              <span className="font-mono tracking-widest text-white text-xl font-black">{member.initials}</span>
            </div>
            
            {/* Member Name */}
            <div className="flex flex-col flex-1 justify-center w-full mb-4 px-1">
              <h3 className="text-base font-bold text-[#1A1C18] tracking-tight transition-colors duration-200 group-hover:text-[#1F4D2E]">
                {member.name}
              </h3>
            </div>
            
            {/* Direct Official Brand Social Icons (No circular container wrapping) */}
            <div className="flex items-center justify-center space-x-5 w-full border-t border-[#BAE0FD]/50 pt-3.5 relative z-10">
              {/* LinkedIn */}
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#0A66C2] opacity-85 hover:opacity-100 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
                title={`${member.name} LinkedIn`}
                aria-label={`${member.name} LinkedIn Profile`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.6a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28Z" />
                </svg>
              </a>

              {/* GitHub */}
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#24292e] opacity-85 hover:opacity-100 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
                title={`${member.name} GitHub`}
                aria-label={`${member.name} GitHub Profile`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>

              {/* Email */}
              <a 
                href={`mailto:${member.email}`} 
                className="text-[#EA4335] opacity-85 hover:opacity-100 transition-all duration-200 hover:scale-115 cursor-pointer p-1"
                title={`Email ${member.name}`}
                aria-label={`Email ${member.name}`}
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
