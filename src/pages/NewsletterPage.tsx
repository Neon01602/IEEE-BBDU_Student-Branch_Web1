import { useState, type FormEvent } from 'react';
import { 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  BellRing, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft, 
  Calendar, 
  FileText, 
  Cpu, 
  Users,
  Check,
  Clock,
  Send,
  HelpCircle
} from 'lucide-react';
import LatticeLoader from '../components/LatticeLoader';

interface NewsletterPageProps {
  onNavigate: (destination: string) => void;
}

export default function NewsletterPage({ onNavigate }: NewsletterPageProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    'Upcoming Hackathons',
    'AI & Tech Bootcamps',
  ]);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const topicOptions = [
    'Upcoming Hackathons',
    'AI & Tech Bootcamps',
    'IEEE Research & Publications',
    'WIE STEM Outreach & Mentorship',
  ];

  const recentEditions = [
    {
      issue: 'Edition #28',
      date: 'Latest Release',
      title: 'National Hackathon Season & GenAI Agents Bootcamp',
      summary: 'Shortlists for Smart India Hackathon, registration link for IEEE BBDU Agentic AI bootcamp, and IEEE Xplore research grant eligibility.',
      topics: ['Hackathons', 'GenAI', 'Grants'],
      readTime: '4 min read'
    },
    {
      issue: 'Edition #27',
      date: 'Previous Month',
      title: 'IEEE R10 Conference Call-for-Papers & Robotics Challenge',
      summary: 'Exclusive student track submission guidelines for upcoming IEEE UP Section & R10 conferences plus hardware prototyping kit grants.',
      topics: ['Research', 'Robotics', 'IEEE R10'],
      readTime: '3 min read'
    },
    {
      issue: 'Edition #26',
      date: 'Archive',
      title: 'WIE STEM Mentorship Fellowship & Open Source Sprints',
      summary: 'Mentorship pairing for female engineering students, Google Summer of Code prep sessions, and Git/GitHub branch repositories.',
      topics: ['WIE Mentorship', 'Open Source'],
      readTime: '5 min read'
    }
  ];

  const faqs = [
    {
      q: 'How often will I receive the dispatch?',
      a: 'We send exactly one curated edition per month, plus urgent flash alerts only when major national hackathon registration deadlines are within 48 hours.'
    },
    {
      q: 'Can non-BBDU students subscribe?',
      a: 'Yes! Engineering students, researchers, and tech enthusiasts across all colleges and universities are welcome to join our dispatch community.'
    },
    {
      q: 'Is the dispatch free?',
      a: 'Completely free forever. It is an initiative of the IEEE BBDU Student Branch to democratize access to technical opportunities.'
    },
    {
      q: 'How do I change my topic preferences later?',
      a: 'Every email includes a direct 1-click preference management link where you can update your topics or unsubscribe at any time.'
    }
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 650);
  };

  return (
    <div className="min-h-screen bg-[#060919] text-slate-100 pt-24 pb-20 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation Breadcrumb / Back button */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-blue-950/60">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="hover:text-blue-400 cursor-pointer" onClick={() => onNavigate('home')}>IEEE BBDU</span>
            <span>/</span>
            <span className="text-cyan-400 font-medium">Tech Dispatch Newsletter</span>
          </div>
        </div>

        {/* Hero Section of the Dedicated Newsletter Page */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <BellRing className="w-3.5 h-3.5 text-cyan-400" />
            <span>Stay Connected & Informed</span>
          </div>

          <h1 className="font-chillax text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
            Subscribe to IEEE BBDU{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Tech Dispatch
            </span>
          </h1>

          <p className="font-cabinet mt-4 sm:mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Receive curated monthly announcements on registration deadlines for national hackathons, exclusive research paper call-for-papers, and robotics bootcamps straight to your inbox.
          </p>

          <div className="flex items-center justify-center gap-4 text-xs sm:text-sm text-slate-400 mt-5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>No spam ever</span>
            </div>
            <span className="text-slate-600">•</span>
            <div className="text-slate-300">Over <strong className="text-cyan-300 font-semibold">1,200+</strong> engineering subscribers</div>
          </div>
        </div>

        {/* Main Grid: Form Card & Features */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-20">
          {/* Subscription Form Card */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-10 rounded-3xl bg-[#090e28]/95 border border-blue-500/35 shadow-2xl shadow-blue-950/50 relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500" />

              {subscribed ? (
                <div className="py-8 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto shadow-lg shadow-emerald-950/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Welcome to IEEE BBDU Dispatch!
                  </h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    {name ? `Thank you, ${name}! ` : 'Thank you! '}
                    We have registered <span className="font-semibold text-blue-300 underline">{email}</span> for the IEEE BBDU Tech Dispatch.
                  </p>
                  
                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-500/20 text-xs text-left text-slate-300 max-w-md mx-auto space-y-2 mt-4">
                    <div className="font-semibold text-white flex items-center gap-1.5 text-cyan-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Your Active Topic Subscriptions:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTopics.map((t) => (
                        <span key={t} className="px-2.5 py-0.5 rounded-full bg-blue-900/60 border border-blue-400/30 text-[11px] text-blue-200">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubscribed(false);
                        setEmail('');
                        setName('');
                      }}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Subscribe another student email
                    </button>
                    <button
                      onClick={() => onNavigate('home')}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-blue-950/80 hover:bg-blue-900/80 border border-cyan-500/30 transition-colors"
                    >
                      Return to Homepage
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-5">
                  <div className="border-b border-slate-800/80 pb-4">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      <span>Join Dispatch Free</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      No advertisements or spam. Curated by student chair and IEEE research leads.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                      Your Preferred Name (Optional)
                    </label>
                    <input
                      type="text"
                      id="newsletter-name-input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Aryan Sharma"
                      className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
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
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/90 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                      Topic Preferences:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {topicOptions.map((topic) => {
                        const isChecked = selectedTopics.includes(topic);
                        return (
                          <button
                            type="button"
                            key={topic}
                            onClick={() => toggleTopic(topic)}
                            className={`flex items-center gap-2.5 p-3 rounded-xl text-xs text-left transition-all border ${
                              isChecked
                                ? 'bg-blue-950/70 border-blue-500/50 text-blue-100 shadow-sm'
                                : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                                isChecked
                                  ? 'bg-blue-600 border-blue-400 text-white'
                                  : 'border-slate-700 bg-slate-800/80'
                              }`}
                            >
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <span className="truncate font-medium">{topic}</span>
                          </button>
                        );
                      })}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                      Select topics relevant to your engineering path. You can customize anytime.
                    </p>
                  </div>

                  <button
                    type="submit"
                    id="newsletter-submit-btn"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 text-sm mt-3"
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

          {/* Value Props & What Subscribers Receive */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                What’s Inside Every Edition
              </h3>

              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">National Hackathon Calendars</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Verified timelines for Smart India Hackathon, IEEE Region 10 student tracks, and university hackathons with mentorship.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Call-for-Papers & Research Grants</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Subsidized conference fees, IEEE Xplore indexing tips, and student travel grant applications reviewed by faculty counsellors.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Hands-on AI & Robotics Bootcamps</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Priority pre-registration links for IEEE BBDU workshops with industrial certificates, starter repositories, and cloud credits.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">WIE STEM Outreach & Fellowships</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Women in Engineering special scholarships, mentor coffee-chats, and national leadership symposium invites.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Community Stats Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-500/20 text-xs text-slate-300 flex items-center justify-between">
              <div>
                <div className="text-white font-semibold">Need to collaborate with us?</div>
                <div className="text-slate-400 text-[11px] mt-0.5">Have an event proposal or branch inquiry?</div>
              </div>
              <button
                onClick={() => onNavigate('contact')}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors shrink-0"
              >
                Contact Page
              </button>
            </div>
          </div>
        </div>

        {/* Recent Dispatch Editions Section */}
        <div className="mb-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Archive Preview</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Recent Dispatch Highlights
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
              Take a look at the caliber of engineering resources and exclusive opportunities shared with our members.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentEditions.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-blue-500/40 transition-all hover:-translate-y-1 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 border border-blue-500/20">
                      {item.issue}
                    </span>
                    <span className="flex items-center gap-1 text-[11px]">
                      <Clock className="w-3 h-3 text-slate-500" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors line-clamp-2 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {item.summary}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {item.topics.map((t) => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    <span>Digest</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Frequently Asked Questions */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Common Inquiries</span>
            </div>
            <h2 className="text-2xl font-bold text-white">
              Newsletter & Subscription FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-blue-400 font-mono text-base shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-4 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
