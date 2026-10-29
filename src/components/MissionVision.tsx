import { 
  Target, 
  Eye, 
  Cpu, 
  Sparkles, 
  Award, 
  HeartHandshake, 
  ShieldCheck 
} from 'lucide-react';
import { BRANCH_INFO, CORE_VALUES } from '../data/ieeeData';

interface MissionVisionProps {
  onNavigate?: (sectionId: string) => void;
}

export default function MissionVision({ onNavigate: _onNavigate }: MissionVisionProps) {
  return (
    <section
      id="mission"
      className="py-16 md:py-28 bg-[#060919] border-t border-blue-950/80 relative overflow-hidden"
    >
      {/* Ambient background gradients */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Identity & Purpose</span>
          </div>
          <h2 className="font-chillax text-2xl sm:text-4xl font-normal text-white tracking-tight">
            Our Foundation, Mission &{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Future Vision
            </span>
          </h2>
          <p className="font-cabinet mt-3 text-xs sm:text-base text-slate-300">
            Founded with the commitment to elevate undergraduate engineering education through global industry standards, research rigor, and collaborative community building.
          </p>
        </div>

        {/* Mission & Vision Side-by-Side In-Depth Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Mission Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#090e28]/95 to-[#060919]/95 border border-blue-500/30 hover:border-blue-400/60 shadow-xl shadow-blue-950/40 relative group transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-cyan-400 mb-5 group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-2">
              Our Core Mission
            </div>
            <h3 className="font-chillax text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Inspiring Technical Ingenuity
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-base">
              {BRANCH_INFO.mission}
            </p>
            <ul className="mt-5 space-y-2.5 pt-4 border-t border-blue-900/40 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Peer-to-peer coding sessions and technical build clubs</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Direct mentorship from alumni working at top tech enterprises</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                <span>Hands-on prototyping with industry-standard hardware tools</span>
              </li>
            </ul>
          </div>

          {/* Vision Card */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#090e28]/95 to-[#060919]/95 border border-indigo-500/30 hover:border-indigo-400/60 shadow-xl shadow-blue-950/40 relative group transition-all">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-5 group-hover:scale-110 transition-transform">
              <Eye className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              Our 2030 Vision
            </div>
            <h3 className="font-chillax text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">
              Leading the Engineering Frontier
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs sm:text-base">
              {BRANCH_INFO.vision}
            </p>
            <ul className="mt-5 space-y-2.5 pt-4 border-t border-blue-900/40 text-xs sm:text-sm text-slate-300">
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Publication of high-impact student research papers in IEEE Xplore</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Fostering student-founded hardware and software tech startups</span>
              </li>
              <li className="flex items-center gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span>Global exchange programs with IEEE Region 10 student branches</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div>
          <div className="text-center mb-8 sm:mb-10">
            <h3 className="font-chillax text-xl sm:text-2xl font-bold text-white">Our 4 Strategic Pillars</h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">The values that define every initiative at IEEE BBDU</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {CORE_VALUES.map((val, idx) => (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-xl bg-[#090e28]/70 border border-blue-900/40 hover:border-cyan-500/40 transition-all group"
              >
                <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg bg-gradient-to-r ${val.gradient} flex items-center justify-center text-white mb-3 sm:mb-4 shadow-md`}>
                  {val.icon === 'Cpu' && <Cpu className="w-5 h-5" />}
                  {val.icon === 'Sparkles' && <Sparkles className="w-5 h-5" />}
                  {val.icon === 'Award' && <Award className="w-5 h-5" />}
                  {val.icon === 'HeartHandshake' && <HeartHandshake className="w-5 h-5" />}
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {val.title}
                </h4>
                <p className="text-slate-300 text-xs sm:text-sm mt-1.5 sm:mt-2 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
