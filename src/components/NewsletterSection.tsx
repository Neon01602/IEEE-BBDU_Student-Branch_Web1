import { useState, type FormEvent } from 'react';
import { Mail, Sparkles, CheckCircle2, BellRing, ArrowRight, ShieldCheck } from 'lucide-react';
import LatticeLoader from './LatticeLoader';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Upcoming Hackathons',
    'AI & Tech Bootcamps',
  ]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const topicOptions = [
    'Upcoming Hackathons',
    'AI & Tech Bootcamps',
    'IEEE Research & Publications',
    'WIE STEM Outreach & Mentorship',
  ];

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
    }, 600);
  };

  return (
    <section id="newsletter" className="py-16 md:py-20 bg-[#060919] border-t border-b border-blue-950/80 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/15 via-indigo-900/15 to-sky-900/15 pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="p-8 sm:p-12 rounded-3xl bg-[#090e28]/95 border border-blue-500/35 shadow-2xl shadow-blue-950/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-sky-500 to-indigo-500" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider">
                <BellRing className="w-3.5 h-3.5 text-cyan-400" />
                <span>Stay Connected & Informed</span>
              </div>
              <h2 className="font-chillax text-2xl sm:text-3xl md:text-4xl font-normal text-white tracking-tight leading-tight">
                Subscribe to IEEE BBDU{' '}
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  Tech Dispatch
                </span>
              </h2>
              <p className="font-cabinet text-slate-300 text-sm sm:text-base leading-relaxed">
                Receive curated monthly announcements on registration deadlines for national hackathons, exclusive research paper call-for-papers, and robotics bootcamps straight to your inbox.
              </p>
              <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>No spam ever</span>
                </div>
                <span>•</span>
                <div>Over 1,200+ engineering subscribers</div>
              </div>
            </div>

            <div className="lg:col-span-6">
              {subscribed ? (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/80 to-purple-950/80 border border-emerald-500/40 text-white animate-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">
                    Welcome to the Community!
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    We have registered <span className="font-semibold text-blue-300">{email}</span> for the IEEE BBDU Tech Dispatch. Check your inbox for our latest welcome digest.
                  </p>
                  <button
                    onClick={() => {
                      setSubscribed(false);
                      setEmail('');
                      setName('');
                    }}
                    className="mt-5 text-xs text-blue-400 hover:text-blue-300 underline underline-offset-4"
                  >
                    Subscribe another student email
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Your Preferred Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="newsletter-name-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        id="newsletter-email-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@bbdu.ac.in or gmail.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Topic Preferences:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {topicOptions.map((topic) => {
                        const isChecked = selectedTopics.includes(topic);
                        return (
                          <button
                            type="button"
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-all border ${
                              isChecked
                                ? 'bg-blue-950/60 border-blue-500/40 text-blue-200'
                                : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-300'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 border ${
                                isChecked
                                  ? 'bg-blue-600 border-blue-500 text-white'
                                  : 'border-slate-700 bg-slate-800'
                              }`}
                            >
                              {isChecked && <CheckCircle2 className="w-3 h-3" />}
                            </div>
                            <span className="truncate">{topic}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="newsletter-submit-btn"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <LatticeLoader
                        status="working"
                        label="Subscribing"
                        doneLabel="Subscribed in"
                        errorLabel="Failed after"
                        pattern="orbit"
                        grid={3}
                        shape="round"
                        doneColor="#22c55e"
                        errorColor="#ef4444"
                        cellSize={5}
                        gap={2}
                        fontSize={13}
                        step={90}
                        idleOpacity={0.15}
                        glow={false}
                        glowColor=""
                        showTimer
                        color="#ffffff"
                      />
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-blue-200" />
                        <span>Join Free Newsletter</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
