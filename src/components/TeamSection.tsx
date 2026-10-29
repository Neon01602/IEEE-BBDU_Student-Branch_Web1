import { useState, useMemo } from 'react';
import { 
  Users, 
  Linkedin, 
  Mail, 
  Award, 
  Search, 
  Sparkles, 
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { TEAM_MEMBERS } from '../data/ieeeData';
import { TeamWing, TeamMember } from '../types';
import ProfileCard from './ProfileCard';

export default function TeamSection() {
  const [selectedWing, setSelectedWing] = useState<TeamWing>('All');
  const [searchMember, setSearchMember] = useState('');
  const [activeModalMember, setActiveModalMember] = useState<TeamMember | null>(null);

  const wings: TeamWing[] = [
    'All',
    'Faculty Counsellor',
    'Office Bearers',
    'Event Coordinators',
    'Publicity & Membership',
    'Webmaster',
  ];

  const filteredTeam = useMemo(() => {
    return TEAM_MEMBERS.filter((member) => {
      if (selectedWing !== 'All' && member.wing !== selectedWing) return false;
      if (searchMember.trim()) {
        const q = searchMember.toLowerCase();
        const matchName = member.name.toLowerCase().includes(q);
        const matchRole = member.role.toLowerCase().includes(q);
        const matchBio = member.bio.toLowerCase().includes(q);
        const matchWing = member.wing.toLowerCase().includes(q);
        if (!matchName && !matchRole && !matchBio && !matchWing) return false;
      }
      return true;
    });
  }, [selectedWing, searchMember]);

  const activeIndex = useMemo(() => {
    if (!activeModalMember) return -1;
    return filteredTeam.findIndex(m => m.id === activeModalMember.id);
  }, [activeModalMember, filteredTeam]);

  const nextMember = () => {
    if (activeIndex === -1 || filteredTeam.length === 0) return;
    const nextIdx = (activeIndex + 1) % filteredTeam.length;
    setActiveModalMember(filteredTeam[nextIdx]);
  };

  const prevMember = () => {
    if (activeIndex === -1 || filteredTeam.length === 0) return;
    const prevIdx = (activeIndex - 1 + filteredTeam.length) % filteredTeam.length;
    setActiveModalMember(filteredTeam[prevIdx]);
  };

  // Helper component for avatar with graceful fallback
  const MemberAvatar = ({ member, size = 'sm' }: { member: TeamMember; size?: 'sm' | 'lg' }) => {
    const [imgStep, setImgStep] = useState(0);
    const fallbacks = [
      member.avatar,
      member.linkedinSlug ? `https://unavatar.io/linkedin/${encodeURIComponent(member.linkedinSlug)}` : null,
      `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=0b1536&color=38bdf8&size=256&bold=true&format=svg`
    ].filter(Boolean) as string[];

    const currentSrc = fallbacks[Math.min(imgStep, fallbacks.length - 1)];

    const sizeClasses = size === 'lg' 
      ? 'w-20 h-20 sm:w-28 sm:h-28 rounded-2xl' 
      : 'w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl';

    return (
      <div className={`relative shrink-0 overflow-hidden bg-[#060919] border-2 border-blue-900/60 group-hover:border-cyan-400 transition-colors shadow-md ${sizeClasses}`}>
        <img
          src={currentSrc}
          alt={member.name}
          onError={() => setImgStep((prev) => prev + 1)}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-[8px] sm:text-[10px] text-white shadow">
          <Sparkles className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
        </div>
      </div>
    );
  };

  return (
    <section id="team" className="py-16 md:py-28 bg-[#060919] border-t border-blue-950/80 relative">
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
            <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Executive Leadership & Office Bearers</span>
          </div>
          <h2 className="font-chillax text-2xl sm:text-4xl font-normal text-white tracking-tight">
            Meet the Minds Driving{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              IEEE BBDU Student Branch
            </span>
          </h2>
        </div>

        {/* Wing Filter Tabs & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {wings.map((wing) => {
              const count = wing === 'All' 
                ? TEAM_MEMBERS.length 
                : TEAM_MEMBERS.filter(m => m.wing === wing).length;

              return (
                <button
                  key={wing}
                  onClick={() => setSelectedWing(wing)}
                  className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1 sm:gap-1.5 ${
                    selectedWing === wing
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-900/40 font-semibold'
                      : 'bg-[#090e28]/80 text-slate-400 hover:text-white hover:bg-[#0f173d] border border-blue-900/40'
                  }`}
                >
                  <span>{wing}</span>
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedWing === wing ? 'bg-white/20 text-white' : 'bg-[#060919] text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="team-search-input"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              placeholder="Search member or post..."
              className="w-full pl-8 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 bg-[#090e28]/90 border border-blue-900/40 rounded-xl text-[11px] sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
          </div>
        </div>

        {/* Team Grid with Default Hoverable 3D Profile Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8 justify-items-center">
          {filteredTeam.map((member) => (
            <div
              key={member.id}
              className="w-full flex justify-center group"
            >
              <ProfileCard
                name={member.name}
                title={member.role}
                handle={member.linkedinSlug || member.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                status={member.wing === 'Faculty Counsellor' ? 'Branch Counsellor' : member.wing}
                statusColor={member.wing === 'Faculty Counsellor' ? '#a855f7' : '#38bdf8'}
                avatarUrl={member.avatar}
                miniAvatarUrl={member.avatar}
                holo={0.8}
                glare={0.5}
                tiltStrength={12}
                parallax={8}
                radius={16}
                enableTilt
                intro
                
                enableMobileTilt={false}
                theme="dark"
                onClick={() => setActiveModalMember(member)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Member 3D ProfileCard Modal */}
      {activeModalMember && (
        <div
          id="member-model-card-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalMember(null)}
        >
          <div
            className="bg-[#090e28] border border-blue-500/40 rounded-2xl sm:rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative text-white p-4 sm:p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider bg-blue-500/10 border border-blue-500/30 text-cyan-400 flex items-center gap-1 sm:gap-1.5">
                  <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>{activeModalMember.wing}</span>
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-500">STB99214 • UP Section</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <button
                  onClick={prevMember}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  title="Previous Member"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <span className="text-[10px] sm:text-xs text-slate-500 font-mono px-1">
                  {activeIndex + 1}/{filteredTeam.length}
                </span>
                <button
                  onClick={nextMember}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-slate-800"
                  title="Next Member"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => setActiveModalMember(null)}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 flex items-center justify-center ml-1 sm:ml-2 transition-colors border border-slate-800"
                  aria-label="Close Profile Card"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Modal Content: 2-Column Responsive Layout */}
            <div className="pt-4 sm:pt-6 grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-8 items-start">
              {/* Left Column: 3D Holographic ProfileCard */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className="w-full flex justify-center py-1 max-w-[280px] sm:max-w-none mx-auto">
                  <ProfileCard
                    name={activeModalMember.name}
                    title={activeModalMember.role}
                    handle={activeModalMember.linkedinSlug || activeModalMember.name.toLowerCase().replace(/[^a-z0-9]/g, '')}
                    status={activeModalMember.wing === 'Faculty Counsellor' ? 'Branch Counsellor' : 'IEEE Officer'}
                    statusColor="#38bdf8"
                    contactText="Email Member"
                    avatarUrl={activeModalMember.avatar}
                    miniAvatarUrl={activeModalMember.avatar}
                    holo={0.8}
                    glare={0.5}
                    tiltStrength={12}
                    parallax={8}
                    radius={16}
                    enableTilt
                    intro
                    
                    enableMobileTilt={false}
                    theme="dark"
                    onContactClick={() => {
                      if (activeModalMember.email) {
                        window.location.href = `mailto:${activeModalMember.email}`;
                      } else if (activeModalMember.linkedin) {
                        window.open(activeModalMember.linkedin, '_blank');
                      }
                    }}
                  />
                </div>
                <p className="text-[9.5px] sm:text-[11px] text-slate-500 text-center mt-1.5 sm:mt-2 flex items-center gap-1 sm:gap-1.5">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                  <span>Interactive 3D Card • Move mouse to tilt & sheen</span>
                </p>
              </div>

              {/* Right Column: Member Dossier & Leadership Details */}
              <div className="md:col-span-7 space-y-3.5 sm:space-y-5">
                <div>
                  <h3 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
                    {activeModalMember.name}
                  </h3>
                  <div className="text-xs sm:text-base font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300 mt-0.5 sm:mt-1">
                    {activeModalMember.role}
                  </div>
                  {activeModalMember.department && (
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mt-1">
                      <GraduationCap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                      <span>{activeModalMember.department}</span>
                    </div>
                  )}
                  {activeModalMember.ieeeNumber && (
                    <div className="inline-block mt-1.5 sm:mt-2 px-2 sm:px-2.5 py-0.5 rounded-md text-[9.5px] sm:text-[11px] font-mono bg-blue-950/80 text-cyan-300 border border-blue-800/40">
                      {activeModalMember.ieeeNumber}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1 sm:mb-1.5">
                    About & Technical Focus
                  </h4>
                  <p className="text-[11px] sm:text-sm text-slate-200 leading-relaxed bg-[#060919]/70 p-2.5 sm:p-3.5 rounded-xl border border-blue-950">
                    {activeModalMember.bio}
                  </p>
                </div>

                {activeModalMember.responsibilities && (
                  <div>
                    <h4 className="text-[10.5px] sm:text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1.5 sm:mb-2">
                      Key Branch Responsibilities
                    </h4>
                    <ul className="space-y-1 sm:space-y-1.5 text-[10.5px] sm:text-sm text-slate-300">
                      {activeModalMember.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 leading-snug sm:leading-relaxed">
                          <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Direct Action Buttons */}
                <div className="pt-3 sm:pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 sm:gap-3">
                  {activeModalMember.email && (
                    <a
                      href={`mailto:${activeModalMember.email}`}
                      className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 sm:gap-2 transition-all shadow-md active:scale-95"
                    >
                      <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>{activeModalMember.email}</span>
                    </a>
                  )}
                  {activeModalMember.linkedin && (
                    <a
                      href={activeModalMember.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-[11px] sm:text-xs font-semibold bg-[#0077b5] hover:bg-[#006097] text-white flex items-center gap-1.5 sm:gap-2 transition-all shadow-md active:scale-95"
                    >
                      <Linkedin className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      <span>LinkedIn Profile</span>
                      <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-80" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
