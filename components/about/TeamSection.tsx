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
    <section className="mb-12">
      <div className="flex items-center justify-between mb-8 border-b border-[#E4E9E6] pb-3">
        <h2 className="text-xl font-bold text-[#10231C] tracking-tight">Team</h2>
      </div>
      
      {/* 3x2 Grid on desktop, 2x3 on tablet, 1x6 on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div 
            key={member.id} 
            className="group glass-panel rounded-xl p-8 border-[#E4E9E6] flex flex-col items-center text-center transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0B4A3D]/5"
          >
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-[#0B4A3D] flex flex-shrink-0 items-center justify-center text-white font-bold text-2xl mb-6 shadow-lg shadow-emerald-950/20 ring-4 ring-white/50">
              {member.initials}
            </div>
            
            {/* Name Container fixed height to ensure alignment */}
            <div className="flex flex-col flex-1 justify-start w-full min-h-[40px] mb-6">
              <h3 className="text-base font-bold text-[#10231C] line-clamp-2">{member.name}</h3>
            </div>
            
            {/* Icon Links */}
            <div className="flex items-center space-x-4 mt-auto">
              <a 
                href={member.linkedin} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative p-2 rounded-lg text-[#6B7A72] transition-colors hover:text-[#0B4A3D] group/icon"
                title={`${member.name} LinkedIn`}
              >
                <div className="absolute inset-0 bg-[#E8F5EE] rounded-lg opacity-0 scale-90 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100 border border-[#0B4A3D]/20"></div>
                <Linkedin className="w-5 h-5 relative z-10" />
              </a>
              <a 
                href={member.github} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative p-2 rounded-lg text-[#6B7A72] transition-colors hover:text-[#10231C] group/icon"
                title={`${member.name} GitHub`}
              >
                <div className="absolute inset-0 bg-white rounded-lg opacity-0 scale-90 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100 border border-[#E4E9E6] shadow-sm"></div>
                <Github className="w-5 h-5 relative z-10" />
              </a>
              <a 
                href={`mailto:${member.email}`} 
                className="relative p-2 rounded-lg text-[#6B7A72] transition-colors hover:text-[#2E6BA8] group/icon"
                title={`Email ${member.name}`}
              >
                <div className="absolute inset-0 bg-[#EBF3FB] rounded-lg opacity-0 scale-90 transition-all duration-200 group-hover/icon:opacity-100 group-hover/icon:scale-100 border border-sky-800/20"></div>
                <Mail className="w-5 h-5 relative z-10" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
