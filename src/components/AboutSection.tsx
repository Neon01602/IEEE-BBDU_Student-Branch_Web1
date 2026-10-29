import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Terminal, 
  Sparkles, 
  Users, 
  CalendarCheck, 
  Mail, 
  MapPin, 
  GraduationCap,
  Building,
  ArrowRight
} from 'lucide-react';
import { BRANCH_INFO, BRANCH_STATS, SOCIETIES_CHAPTERS } from '../data/ieeeData';
import GridBackground8Col from './GridBackground8Col';

interface AboutSectionProps {
  onNavigate: (destination: string) => void;
}

export default function AboutSection({ onNavigate }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 md:py-28 bg-[#060812] border-t border-zinc-800/80 text-slate-100 relative overflow-hidden">
      {/* 8-box-per-row grid background with light greyish lines */}
      <GridBackground8Col lineColor="rgba(228, 228, 231, 0.08)" />

      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="mb-14 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>About IEEE BBDU Student Branch</span>
          </div>

          <h2 className="font-chillax text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight max-w-4xl">
            Advancing Technology for Humanity &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 font-medium">
              Cultivating Engineering Leaders
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            The IEEE Student Branch at Babu Banarasi Das University is a premier student-run technical ecosystem dedicated to nurturing technological innovation, academic excellence, leadership skills, and professional development.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs text-slate-400">
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300 font-mono">
              Branch Code: <strong className="text-cyan-300 font-semibold">{BRANCH_INFO.code}</strong>
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300">
              Region 10 (Asia-Pacific)
            </span>
            <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-slate-300">
              IEEE UP Section
            </span>
          </div>
        </div>

        {/* Bento Grid layout designed according to reference image */}
        <div className="border border-zinc-800 bg-[#07090e] rounded-3xl overflow-hidden divide-y divide-zinc-800/80 shadow-2xl mb-16">
          {/* Top Row: Two Equal Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-800/80">
            {/* Top-Left Card: Vibrant Colored Keywords & Stats */}
            <div className="p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-b from-[#090d16]/50 to-[#07090e]/50">
              <div>
                <p className="text-xl sm:text-2xl font-light text-slate-300 leading-relaxed">
                  A premier student-run technical ecosystem empowering{' '}
                  <span className="text-purple-400 font-normal">30+ active student members from UG</span>, organizing{' '}
                  <span className="text-emerald-400 font-normal">15+ tech & non-tech events</span>, hands-on{' '}
                  <span className="text-sky-400 font-normal">workshops</span>, national{' '}
                  <span className="text-pink-400 font-normal">hackathons</span>, and technical symposiums, bridging academic learning with{' '}
                  <span className="text-amber-300 font-normal">global IEEE research</span>,{' '}
                  <span className="text-indigo-400 font-normal">ethical engineering</span>, and{' '}
                  <span className="text-cyan-300 font-normal">peer mentorship</span>.
                </p>
              </div>

              {/* The Two Requested Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-8 border-t border-zinc-800/80">
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                    30<span className="text-purple-400 font-normal">+</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">
                    Active Student Members from UG
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Undergraduate student innovators & technical volunteers
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                  <div className="text-3xl sm:text-4xl font-light text-white tracking-tight">
                    15<span className="text-emerald-400 font-normal">+</span>
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-200 mt-1">
                    Tech & Non-Tech Events
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Workshops, hackathons, and tech talks conducted
                  </div>
                </div>
              </div>
            </div>

            {/* Top-Right Card: Core Mission & Strategic Vision + Real Image with Opacity Filter */}
            <div className="p-8 sm:p-12 flex flex-col justify-between bg-gradient-to-b from-[#090d16]/50 to-[#07090e]/50">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                  Our Core Mission
                </div>
                <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Inspiring Technical Ingenuity
                </h3>
                <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  To foster technological innovation and excellence for the benefit of humanity by inspiring students, organizing world-class workshops, hackathons, and technical symposiums, and cultivating future-ready engineers with ethical integrity.
                </p>
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span className="text-emerald-400 font-mono">✓</span>
                  <span>Aligned with IEEE Global Code of Ethics • Benchmark in Region 10</span>
                </div>
              </div>

              {/* User-Provided Image 1 with Opacity Filter */}
              <div className="mt-8 relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 group shadow-lg">
                <img
                  src="/assets/aistudio/ieee_7cb0638c.jpeg"
                  alt="IEEE BBDU Student Branch Core Team with Counsellor"
                  className="w-full h-56 sm:h-64 object-cover opacity-65 group-hover:opacity-90 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs">
                  <span className="font-medium text-white px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-white/10">
                    IEEE BBDU Student Branch
                  </span>
                  <span className="text-[11px] text-slate-300 font-mono bg-black/70 px-2 py-0.5 rounded">
                    School of Engineering
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Affiliated Chapters (CS & WIE) + User-Provided Image 2 with Opacity Filter */}
          <div className="p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-b from-[#07090e]/80 to-[#05070c]/80">
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-purple-400 mb-1.5">
                  Affiliated Chapters
                </div>
                <h3 className="text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  Societies & Affinity Groups
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Our active student body specializes through the IEEE Computer Society chapter and the IEEE Women in Engineering affinity group at BBDU.
                </p>
              </div>

              <div className="space-y-4">
                {/* Flagship Chapter: IEEE CS */}
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-300 px-2.5 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/20">
                      Flagship Chapter
                    </span>
                    <span className="text-xs font-semibold text-cyan-400 font-mono">30+ Members</span>
                  </div>
                  <h4 className="text-base font-semibold text-white mt-1">
                    IEEE Computer Society (CS)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    The leading society for computer science, machine learning, distributed computing, and software engineering enthusiasts.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 font-mono">
                    IEEE BBDU Student Branch
                  </div>
                </div>

                {/* Affinity Group: IEEE WIE */}
                <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 hover:border-pink-500/30 transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-pink-300 px-2.5 py-0.5 rounded-full bg-pink-950/60 border border-pink-500/20">
                      Affinity Group
                    </span>
                    <span className="text-xs font-semibold text-pink-400 font-mono">30+ Members</span>
                  </div>
                  <h4 className="text-base font-semibold text-white mt-1">
                    IEEE Women in Engineering (WIE)
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    A global network of IEEE members dedicated to promoting women engineers and scientists and inspiring girls to follow STEM.
                  </p>
                  <div className="mt-3 text-[11px] text-slate-500 font-mono">
                    IEEE BBDU Student Branch
                  </div>
                </div>
              </div>
            </div>

            {/* User-Provided Image 2 with Opacity Filter & Grid Overlay */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden border border-zinc-800 bg-black/60 shadow-xl group">
                <img
                  src="/assets/aistudio/wie_image_898bec26.jpeg"
                  alt="WIE Inspire 1.0 at Babu Banarasi Das University"
                  className="w-full h-64 sm:h-80 object-cover opacity-65 group-hover:opacity-90 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-white text-sm">WIE Inspire 1.0</div>
                    <div className="text-[11px] text-slate-300">Babu Banarasi Das University</div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-500/30 text-purple-200 font-mono text-[11px]">
                    Women Leading Innovation
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Join Us Section: Branch Counsellor Detail */}
        <div id="join-us-section" className="p-8 sm:p-12 rounded-3xl bg-zinc-950/90 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Join Us</span>
            </div>
            <h3 className="font-chillax text-2xl sm:text-3xl md:text-4xl font-normal text-white">
              Connect with Our Branch Counsellor
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed max-w-xl mx-auto">
              For student membership registration, chapter onboarding, or academic collaborations, reach out directly to our Faculty Counsellor.
            </p>
          </div>

          <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-6">
            {/* Counsellor Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left pb-6 border-b border-zinc-800">
              <div className="w-20 h-20 rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-cyan-300 text-2xl font-bold shadow-lg shrink-0 overflow-hidden">
                <img
                  src="https://unavatar.io/linkedin/dr-mrinalini-srivastava-392529285"
                  alt="Dr. Mrinalini Srivastava"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="space-y-1">
                <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">
                  Branch Counsellor
                </div>
                <h4 className="text-xl sm:text-2xl font-bold text-white">
                  Dr. Mrinalini Srivastava
                </h4>
                <p className="text-xs text-slate-300">
                  Faculty Counsellor, IEEE BBDU Student Branch • Senior Member, IEEE
                </p>
                <div className="text-xs text-slate-400 flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                  <Building className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>School of Engineering, Babu Banarasi Das University, Lucknow</span>
                </div>
              </div>
            </div>

            {/* Direct Contact Details */}
            <div className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Official Branch Counsellor Email:</div>
                  <a
                    href="mailto:mrinalini.prep@bbdu.ac.in"
                    className="text-cyan-300 hover:text-cyan-200 hover:underline font-mono text-xs sm:text-sm font-medium"
                  >
                    mrinalini.prep@bbdu.ac.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Branch Secretariat Correspondence:</div>
                  <a
                    href="mailto:ieeebbdu@gmail.com"
                    className="text-blue-300 hover:text-blue-200 hover:underline font-mono text-xs sm:text-sm"
                  >
                    ieeebbdu@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Office Location:</div>
                  <p className="text-xs text-slate-300">
                    Block E, School of Engineering, Babu Banarasi Das University, Faizabad Road, Lucknow, UP 226028
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row items-center gap-3">
              <a
                href="mailto:mrinalini.prep@bbdu.ac.in"
                className="w-full py-3 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-blue-900/40"
              >
                <Mail className="w-4 h-4" />
                <span>Email Branch Counsellor</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
