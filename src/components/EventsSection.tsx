import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  X, 
  Sparkles,
  ArrowRight,
  Filter,
  History,
  Radio,
  Trophy
} from 'lucide-react';
import { EventItem } from '../types';
import { eventStore, getEventPushTimestamp } from '../services/eventStore';
import LatticeLoader from './LatticeLoader';

export default function EventsSection() {
  const [events, setEvents] = useState<EventItem[]>(() => eventStore.getEvents());
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'past'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Subscribe to real-time events store updates (Firebase Firestore)
  useEffect(() => {
    setEvents(eventStore.getEvents());
    return eventStore.subscribe((liveEvents) => {
      setEvents(liveEvents);
    });
  }, []);

  // Registration form state for modal
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpEmail, setRsvpEmail] = useState('');
  const [rsvpRoll, setRsvpRoll] = useState('');
  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const categories = ['All', 'Technical', 'Workshop', 'Hackathon', 'WIE', 'Social'];

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (activeTab === 'upcoming' && event.status !== 'upcoming') return false;
        if (activeTab === 'past' && event.status !== 'past') return false;
        if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(q);
          const matchDesc = event.description.toLowerCase().includes(q);
          const matchTags = event.tags?.some(t => t.toLowerCase().includes(q));
          const matchSpeaker = event.speaker?.name?.toLowerCase().includes(q);
          const matchWinner = typeof event.winner === 'string'
            ? event.winner.toLowerCase().includes(q)
            : event.winner?.name?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchSpeaker && !matchWinner) return false;
        }
        return true;
      })
      .sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  }, [events, activeTab, selectedCategory, searchQuery]);

  const handleOpenEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setRsvpSuccess(false);
    setRsvpName('');
    setRsvpEmail('');
    setRsvpRoll('');
  };

  const handleRsvpSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!rsvpName || !rsvpEmail) return;
    setRsvpLoading(true);
    setTimeout(() => {
      setRsvpLoading(false);
      setRsvpSuccess(true);
    }, 800);
  };

  return (
    <section id="events" className="py-20 md:py-28 bg-[#060919] border-t border-blue-950/80 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-3/4 h-72 bg-gradient-to-r from-blue-600/10 via-sky-600/10 to-indigo-600/10 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Events & Programs</span>
            </div>
            <h2 className="font-chillax text-3xl sm:text-4xl font-normal text-white tracking-tight">
              Workshops, Hackathons &{' '}
              <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                Recent Highlights
              </span>
            </h2>
            <p className="font-cabinet mt-2 text-slate-300 text-base max-w-2xl">
              Stay ahead with our hands-on engineering conferences, competitive hackathons, and retrospective event milestones.
            </p>
          </div>

          <div className="inline-flex p-1 bg-[#090e28] rounded-xl border border-blue-900/50 shrink-0">
            <button
              id="events-tab-all"
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Events
            </button>
            <button
              id="events-tab-upcoming"
              onClick={() => setActiveTab('upcoming')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>Upcoming</span>
            </button>
            <button
              id="events-tab-past"
              onClick={() => setActiveTab('past')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-indigo-600 to-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-sky-400" />
              <span>Past Highlights</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-10 pb-6 border-b border-blue-900/40">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30 font-semibold'
                    : 'bg-[#090e28]/80 text-slate-400 hover:text-white hover:bg-[#0f173d] border border-blue-900/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="events-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, tag, or speaker..."
              className="w-full pl-9 pr-4 py-2 bg-[#090e28]/90 border border-blue-900/40 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-2xl border border-slate-800/80">
            <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No events matching your filter</h3>
            <p className="text-slate-400 text-sm mt-1">Try resetting the category or searching for another keyword.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); setActiveTab('all'); }}
              className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/40 hover:bg-blue-600/50"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {filteredEvents.map((evt) => {
              const isUpcoming = evt.status === 'upcoming';
              return (
                <div
                  key={evt.id}
                  className="rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:shadow-blue-950/30"
                >
                  <div className="relative h-28 xs:h-36 sm:h-48 w-full overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3">
                      {isUpcoming ? (
                        <span className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold bg-blue-600/90 text-white backdrop-blur-md shadow-md">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                          Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-bold bg-purple-900/80 text-purple-200 border border-purple-500/30 backdrop-blur-md">
                          <History className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-300" />
                          <span className="hidden xs:inline">Past Highlight</span>
                          <span className="xs:hidden">Past</span>
                        </span>
                      )}
                    </div>
                    <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3">
                      <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[9px] sm:text-xs font-medium bg-slate-950/80 text-slate-300 border border-slate-700/60 backdrop-blur-md">
                        {evt.category}
                      </span>
                    </div>
                    <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex items-center justify-between text-[9px] sm:text-xs text-slate-200">
                      <div className="flex items-center gap-1 sm:gap-1.5 font-medium truncate max-w-[70%]">
                        <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{evt.date}</span>
                      </div>
                      {evt.attendeesCount && (
                        <div className="hidden xs:flex items-center gap-1 text-slate-300">
                          <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-indigo-400 shrink-0" />
                          <span>{evt.attendeesCount}+</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xs sm:text-base lg:text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                        {evt.title}
                      </h3>
                      <p className="text-slate-300 text-[10px] sm:text-xs lg:text-sm mt-1 sm:mt-2 line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>
                      <div className="mt-2 sm:mt-4 space-y-1 text-[10px] sm:text-xs text-slate-400">
                        {evt.time && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{evt.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                      </div>
                      {/* Winners preview if available */}
                      {((evt.winners && evt.winners.length > 0) || evt.winner) && (
                        <div className="mt-2.5 p-1.5 sm:p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 space-y-0.5 w-full min-w-0 overflow-hidden">
                          <div className="flex items-center gap-1 text-amber-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider min-w-0">
                            <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 shrink-0" />
                            <span className="truncate">
                              {evt.winners && evt.winners.length > 1 ? `WINNERS (${evt.winners.length})` : 'WINNER'}
                            </span>
                          </div>
                          <div className="text-[8px] sm:text-[11px] text-amber-300 font-medium truncate block w-full min-w-0">
                            {evt.winners && evt.winners.length > 0 
                              ? `${evt.winners[0].position ? evt.winners[0].position + ': ' : ''}${evt.winners[0].name}`
                              : typeof evt.winner === 'string' ? evt.winner : evt.winner?.name}
                          </div>
                        </div>
                      )}
                      <div className="hidden sm:flex flex-wrap gap-1.5 mt-3">
                        {evt.tags.slice(0, 2).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-800/80 text-slate-400 border border-slate-700/50"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-6 pt-2 sm:pt-4 border-t border-slate-800/80">
                      <button
                        onClick={() => handleOpenEvent(evt)}
                        className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                          isUpcoming
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-500 hover:to-indigo-500 shadow-md shadow-blue-900/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {isUpcoming ? (
                          <>
                            <span className="hidden sm:inline">Register / Details</span>
                            <span className="sm:hidden">Register</span>
                            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </>
                        ) : (
                          <>
                            <span className="hidden sm:inline">View Recap & Notes</span>
                            <span className="sm:hidden">Recap</span>
                            <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedEvent && (
        <div
          id="event-detail-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-white">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-950/80 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-56 w-full">
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-600 text-white">
                  {selectedEvent.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-tight">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{selectedEvent.date}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span>{selectedEvent.time}</span>
                </div>
                <div className="flex items-center gap-2.5 sm:col-span-2">
                  <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                  <span>{selectedEvent.venue}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Event Overview
                </h4>
                <p className="text-slate-300 leading-relaxed text-sm">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.speaker && (
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-4">
                  {selectedEvent.speaker.avatar ? (
                    <img
                      src={selectedEvent.speaker.avatar}
                      alt={selectedEvent.speaker.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full object-cover border border-blue-500/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center font-bold text-white">
                      {selectedEvent.speaker.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-blue-400 font-semibold">Featured Speaker / Mentor</div>
                    <div className="text-white font-bold text-base">{selectedEvent.speaker.name}</div>
                    <div className="text-xs text-slate-400">{selectedEvent.speaker.designation}</div>
                  </div>
                </div>
              )}

              {/* Multiple Winners Spotlight - stay strictly in block, truncate with dots if lengthy */}
              {((selectedEvent.winners && selectedEvent.winners.length > 0) || selectedEvent.winner) && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/30 space-y-3 w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider min-w-0">
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span className="truncate">Winners of the Event</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full min-w-0">
                    {selectedEvent.winners && selectedEvent.winners.length > 0 ? (
                      selectedEvent.winners.map((winner, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/20 space-y-1 w-full min-w-0 overflow-hidden"
                        >
                          {winner.position && (
                            <div className="w-full min-w-0 overflow-hidden">
                              <span
                                className="inline-block max-w-full text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold truncate"
                                title={winner.position}
                              >
                                {winner.position}
                              </span>
                            </div>
                          )}
                          <div
                            className="text-xs sm:text-sm font-bold text-white pt-0.5 truncate block w-full min-w-0"
                            title={winner.name}
                          >
                            {winner.name}
                          </div>
                          {winner.department && (
                            <div
                              className="text-[11px] sm:text-xs text-slate-300 truncate block w-full min-w-0"
                              title={winner.department}
                            >
                              {winner.department}
                            </div>
                          )}
                          {winner.prize && (
                            <div
                              className="text-[11px] sm:text-xs text-amber-400 font-medium pt-0.5 truncate block w-full min-w-0"
                              title={winner.prize}
                            >
                              {winner.prize}
                            </div>
                          )}
                        </div>
                      ))
                    ) : selectedEvent.winner ? (
                      <div className="p-3 rounded-lg bg-slate-950/80 border border-amber-500/20 space-y-1 sm:col-span-2 w-full min-w-0 overflow-hidden">
                        <div
                          className="text-xs sm:text-sm font-bold text-white truncate block w-full min-w-0"
                          title={typeof selectedEvent.winner === 'string' ? selectedEvent.winner : selectedEvent.winner.name}
                        >
                          {typeof selectedEvent.winner === 'string' ? selectedEvent.winner : selectedEvent.winner.name}
                        </div>
                        {typeof selectedEvent.winner !== 'string' && selectedEvent.winner.department && (
                          <div
                            className="text-[11px] sm:text-xs text-slate-300 truncate block w-full min-w-0"
                            title={selectedEvent.winner.department}
                          >
                            {selectedEvent.winner.department}
                          </div>
                        )}
                        {typeof selectedEvent.winner !== 'string' && selectedEvent.winner.prize && (
                          <div
                            className="text-[11px] sm:text-xs text-amber-400 font-medium truncate block w-full min-w-0"
                            title={selectedEvent.winner.prize}
                          >
                            {selectedEvent.winner.prize}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              )}

              {selectedEvent.recapNotes && (
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-purple-400 mb-2">
                    {selectedEvent.status === 'upcoming' ? 'Key Session Highlights' : 'Event Milestones & Takeaways'}
                  </h4>
                  <ul className="space-y-2">
                    {selectedEvent.recapNotes.map((note, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.status === 'upcoming' && (
                <div className="pt-4 border-t border-slate-800">
                  <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-400" />
                    <span>Instant RSVP & Seat Reservation</span>
                  </h4>
                  {rsvpSuccess ? (
                    <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-sm">
                      <div className="font-bold flex items-center gap-2 mb-1 text-emerald-300">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>RSVP Confirmed for {selectedEvent.title}!</span>
                      </div>
                      <p className="text-xs text-emerald-300/80">
                        We sent a calendar invite and pass instructions to <span className="font-semibold text-white">{rsvpEmail}</span>. See you at {selectedEvent.venue}!
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleRsvpSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={rsvpName}
                          onChange={(e) => setRsvpName(e.target.value)}
                          className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Email Address (@bbdu.ac.in or personal)"
                          value={rsvpEmail}
                          onChange={(e) => setRsvpEmail(e.target.value)}
                          className="px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Student ID / Roll No (Optional)"
                        value={rsvpRoll}
                        onChange={(e) => setRsvpRoll(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={rsvpLoading}
                        className="w-full py-2.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 font-semibold text-white text-sm hover:opacity-95 shadow-md shadow-indigo-600/30 transition-opacity flex items-center justify-center disabled:opacity-60"
                      >
                        {rsvpLoading ? (
                          <LatticeLoader
                            status="working"
                            label="Reserving Seat"
                            doneLabel="Reserved in"
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
                          <span>Confirm Registration (Free for BBDU Students)</span>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
