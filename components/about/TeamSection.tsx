import React from 'react';
import { Linkedin, Github, Mail } from 'lucide-react';

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
    <section className="mb-12 pt-8">
      <div className="flex items-center justify-between mb-16 border-b border-[#E8E2DC] pb-3">
        <h2 className="text-xl font-bold text-[#1A1C18] tracking-tight">Team</h2>
      </div>
      
      {/* 3x2 Grid on desktop, 2x3 on tablet, 1x6 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-16">
        {TEAM_MEMBERS.map((member) => (
          <div 
            key={member.id} 
            className="group card-glass rounded-xl px-8 pb-8 pt-0 border-[#E8E2DC] flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_-4px_rgba(31,77,46,0.12)]"
          >
            {/* Avatar overlapping top edge */}
            <div className="-mt-12 w-24 h-24 relative z-10 rounded-full bg-gradient-to-br from-[#1F4D2E] to-[#27643A] flex flex-shrink-0 items-center justify-center text-[#F5F2F3] font-bold text-2xl mb-5 shadow-resting ring-4 ring-[#F5F2F3] transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_8px_20px_rgba(31,77,46,0.3)] group-hover:ring-[#FEF0E6]">
              {member.initials}
            </div>
            
            {/* Name Container */}
            <div className="flex flex-col flex-1 justify-start w-full mb-6">
              <h3 className="text-base font-bold text-[#1A1C18] line-clamp-2 transition-colors duration-200 group-hover:text-[#1F4D2E]">{member.name}</h3>
            </div>
            
            {/* Icon Links */}
            <div className="flex items-center justify-center space-x-3 w-full border-t border-[#E8E2DC] pt-4">
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative p-2.5 rounded-full text-[#6B7268] transition-all hover:text-[#0A66C2] group/icon"
                title={`${member.name} LinkedIn`}
              >
                <div className="absolute inset-0 bg-[#0A66C2]/10 rounded-full opacity-0 scale-75 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100"></div>
                <Linkedin className="w-4 h-4 relative z-10" />
              </a>
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative p-2.5 rounded-full text-[#6B7268] transition-all hover:text-[#1A1C18] group/icon"
                title={`${member.name} GitHub`}
              >
                <div className="absolute inset-0 bg-[#1A1C18]/10 rounded-full opacity-0 scale-75 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100"></div>
                <Github className="w-4 h-4 relative z-10" />
              </a>
              <a 
                href={`mailto:${member.email}`} 
                className="relative p-2.5 rounded-full text-[#6B7268] transition-all hover:text-[#D9531E] group/icon"
                title={`Email ${member.name}`}
              >
                <div className="absolute inset-0 bg-[#FEF0E6] rounded-full opacity-0 scale-75 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100 border border-[#D9531E]/30"></div>
                <Mail className="w-4 h-4 relative z-10" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
