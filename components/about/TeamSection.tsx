import React from 'react';
import { Linkedin, Github, Globe } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Team Member Name', role: 'Role / Title', initials: 'A.K.' },
  { id: 2, name: 'Team Member Name', role: 'Role / Title', initials: 'S.R.' },
  { id: 3, name: 'Team Member Name', role: 'Role / Title', initials: 'M.P.' },
  { id: 4, name: 'Team Member Name', role: 'Role / Title', initials: 'J.D.' },
];

export function TeamSection() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6 border-b border-[#E4E9E6] pb-3">
        <div>
          <h2 className="text-xl font-bold text-[#10231C] tracking-tight">Team</h2>
          <p className="text-xs text-[#6B7A72] mt-1 italic">
            * Team profiles to be finalized (Placeholder Content)
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {TEAM_MEMBERS.map((member) => (
          <div key={member.id} className="glass-panel rounded-xl p-6 border-[#E4E9E6] flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#0B4A3D] flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-emerald-950/20">
              {member.initials}
            </div>
            <h3 className="text-sm font-bold text-[#10231C]">{member.name}</h3>
            <p className="text-xs text-[#4B5A54] font-mono mt-1 mb-4">{member.role}</p>
            
            <div className="flex items-center space-x-3">
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-[#F6F8F7] text-[#4B5A54] hover:text-[#0B4A3D] hover:bg-[#E8F5EE] transition-colors border border-[#E4E9E6]">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-[#F6F8F7] text-[#4B5A54] hover:text-[#10231C] hover:bg-white transition-colors border border-[#E4E9E6]">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-md bg-[#F6F8F7] text-[#4B5A54] hover:text-[#2E6BA8] hover:bg-[#EBF3FB] transition-colors border border-[#E4E9E6]">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
