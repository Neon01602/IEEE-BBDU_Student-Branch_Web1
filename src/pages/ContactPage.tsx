import { 
  Mail, 
  MapPin, 
  Building, 
  ArrowLeft, 
  GraduationCap
} from 'lucide-react';

interface ContactPageProps {
  onNavigate: (destination: string) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 pt-28 pb-20 relative overflow-hidden flex flex-col justify-center">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('home')}>IEEE BBDU</span>
            <span>/</span>
            <span className="text-cyan-400 font-medium">Join Us</span>
          </div>
        </div>

        {/* Join Us Section: Branch Counsellor Detail */}
        <div className="p-8 sm:p-12 rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Join Us</span>
            </div>
            <h1 className="font-chillax text-2xl sm:text-3xl md:text-4xl font-normal text-white">
              Connect with Our Branch Counsellor
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2.5 leading-relaxed max-w-xl mx-auto">
              For student membership registration, chapter onboarding, or academic collaborations, reach out directly to our Faculty Counsellor.
            </p>
          </div>

          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-zinc-900/80 border border-zinc-800 shadow-xl space-y-6">
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
    </div>
  );
}
