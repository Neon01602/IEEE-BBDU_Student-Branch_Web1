import { useState, type FormEvent } from 'react';
import { 
  Mail, 
  MapPin, 
  Phone, 
  Clock, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  HelpCircle, 
  Building,
  UserCheck
} from 'lucide-react';
import LatticeLoader from './LatticeLoader';
import { BRANCH_INFO } from '../data/ieeeData';
import { ContactFormData } from '../types';

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    studentId: '',
    branch: 'Computer Science & Engineering',
    purpose: 'membership',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [ticketNumber, setTicketNumber] = useState('');

  const branches = [
    'Computer Science & Engineering',
    'Information Technology',
    'Electronics & Communication',
    'Electrical Engineering',
    'Mechanical / Civil / Other',
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setTicketNumber(`BBDU-IEEE-${Math.floor(1000 + Math.random() * 9000)}`);
      setSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      studentId: '',
      branch: 'Computer Science & Engineering',
      purpose: 'membership',
      subject: '',
      message: '',
    });
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-[#060919] border-t border-blue-950/80 relative">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Connect & Collaborate</span>
          </div>
          <h2 className="font-chillax text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Get in Touch with{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              IEEE BBDU Branch
            </span>
          </h2>
          <p className="font-cabinet mt-4 text-base sm:text-lg text-slate-300">
            Have questions about student membership, upcoming hackathon partnerships, or technical collaborations? Send our team a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-400" />
                <span>Branch Secretariat</span>
              </h3>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Campus Location</div>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {BRANCH_INFO.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Official Correspondence</div>
                    <a
                      href={`mailto:${BRANCH_INFO.email}`}
                      className="text-xs text-blue-400 hover:underline mt-0.5 block"
                    >
                      {BRANCH_INFO.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Help Desk & Tel</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {BRANCH_INFO.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">Office Hours</div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {BRANCH_INFO.hours}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-purple-950/60 border border-blue-500/30 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-blue-300 mb-1">
                  <UserCheck className="w-4 h-4 text-blue-400" />
                  <span>Looking to Join IEEE BBDU?</span>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Select <strong className="text-white">"Join Branch"</strong> in the inquiry form. Our membership chairs will assist you with onboarding, your IEEE global ID, and society chapter choices.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 space-y-3">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Frequently Asked Questions</span>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Can first-year students join the branch?</p>
                <p className="text-slate-400 mt-0.5">Yes! All students from BBDU (B.Tech, BCA, MCA, M.Tech) across any year or department are welcomed.</p>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Do I get discounts on IEEE conferences?</p>
                <p className="text-slate-400 mt-0.5">Yes, IEEE student members receive subsidized registration fees, access to IEEE Xplore digital library papers, and travel grant eligibilities.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl relative">
              <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                <div>
                  <h3 className="text-2xl font-bold text-white">Send Us a Direct Message</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                    Our student branch officers respond within 24 hours.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                  <Send className="w-4 h-4" />
                </div>
              </div>

              {submitted ? (
                <div className="py-10 text-center space-y-4 animate-in zoom-in-95 duration-300">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">
                    Message Dispatched Successfully!
                  </h4>
                  <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-mono text-purple-300">
                    Ticket Reference: {ticketNumber}
                  </div>
                  <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. An email notification has been dispatched to <span className="text-blue-400 font-medium">{formData.email}</span>. Our branch secretary or technical team will follow up promptly.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-6 px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Inquiry Category *
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: 'membership', label: 'Join Branch' },
                        { id: 'events', label: 'Event Inquiry' },
                        { id: 'sponsorship', label: 'Sponsorship' },
                        { id: 'query', label: 'General' },
                      ].map((item) => (
                        <button
                          type="button"
                          key={item.id}
                          onClick={() => setFormData({ ...formData, purpose: item.id as any })}
                          className={`py-2 px-3 rounded-lg text-xs font-medium text-center border transition-all ${
                            formData.purpose === item.id
                              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-transparent font-semibold shadow-md'
                              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        id="contact-name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Shruti Tiwari"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        id="contact-email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@bbdu.ac.in or gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Student ID / Roll No (Optional)
                      </label>
                      <input
                        type="text"
                        id="contact-roll"
                        value={formData.studentId}
                        onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        placeholder="e.g. 230056010042"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                        Department / Branch
                      </label>
                      <select
                        id="contact-branch"
                        value={formData.branch}
                        onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      >
                        {branches.map((b) => (
                          <option key={b} value={b} className="bg-slate-900 text-white">
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="contact-subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Query regarding Agentic AI bootcamp / Joining WIE affinity"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                      Your Message *
                    </label>
                    <textarea
                      required
                      id="contact-message"
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Share your question, proposal, or interest in detail..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    id="contact-submit-btn"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {loading ? (
                      <LatticeLoader
                        status="working"
                        label="Dispatching ticket"
                        doneLabel="Dispatched in"
                        errorLabel="Failed after"
                        pattern="orbit"
                        grid={3}
                        shape="round"
                        doneColor="#22c55e"
                        errorColor="#ef4444"
                        cellSize={6}
                        gap={2}
                        fontSize={14}
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
                        <span>Submit Inquiry to Branch</span>
                        <Send className="w-4 h-4 ml-1" />
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
