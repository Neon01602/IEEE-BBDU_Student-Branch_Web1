import { useState, useMemo, useEffect, type FormEvent } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Search, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  History, 
  Radio, 
  CalendarCheck, 
  Trophy, 
  PlusCircle, 
  Image as ImageIcon,
  ZoomIn,
  Award
} from 'lucide-react';
import { EventItem, EventWinner } from '../types';
import { eventStore, getEventPushTimestamp } from '../services/eventStore';

interface EventsPageProps {
  onNavigate: (destination: string) => void;
}

export default function EventsPage({ onNavigate }: EventsPageProps) {
  const [events, setEvents] = useState<EventItem[]>(() => eventStore.getEvents());
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Image Modal Lightbox ("the image uploaded can be viewed in a modal")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Subscribe to real-time events store updates (Firebase Firestore)
  useEffect(() => {
    setEvents(eventStore.getEvents());
    return eventStore.subscribe((liveEvents) => {
      setEvents(liveEvents);
    });
  }, []);

  const categories = ['All', 'Technical', 'Workshop', 'Hackathon', 'WIE', 'Social'];

  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        if (selectedCategory !== 'All' && event.category !== selectedCategory) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = event.title.toLowerCase().includes(q);
          const matchDesc = event.description.toLowerCase().includes(q);
          const matchTags = event.tags?.some(t => t.toLowerCase().includes(q));
          const matchVenue = event.venue?.toLowerCase().includes(q);
          const matchWinners = event.winners?.some(w => 
            w.name.toLowerCase().includes(q) || 
            w.department?.toLowerCase().includes(q) || 
            w.prize?.toLowerCase().includes(q)
          );
          const matchSingleWinner = typeof event.winner === 'string' 
            ? event.winner.toLowerCase().includes(q) 
            : event.winner?.name.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchTags && !matchVenue && !matchWinners && !matchSingleWinner) return false;
        }
        return true;
      })
      .sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a));
  }, [events, selectedCategory, searchQuery]);

  const handleOpenEvent = (event: EventItem) => {
    setSelectedEvent(event);
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 pt-24 pb-20 relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-zinc-800">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium text-slate-400 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-events')}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/30 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-cyan-300" />
              <span>Admin: Push Event</span>
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-mono uppercase tracking-wider mb-3 shadow-sm">
            <Calendar className="w-3.5 h-3.5" />
            <span>Events & Programs</span>
          </div>
          <h1 className="font-chillax text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
            Workshops, Hackathons &{' '}
            <span className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-purple-400">
              Recent Highlights
            </span>
          </h1>
          <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Explore live event recaps, winning teams, photo galleries, and technical symposiums at IEEE BBDU Student Branch.
          </p>
        </div>

        {/* Filter Controls & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-zinc-800">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat
                    ? 'bg-blue-950/80 border-blue-400 text-blue-200'
                    : 'bg-zinc-900/80 border-zinc-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topic, winner, venue..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Events Grid or Empty State */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-zinc-950/80 border border-zinc-800 max-w-2xl mx-auto shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-4">
              <CalendarCheck className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              No Events Published Yet
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-md mx-auto mb-6">
              All default sample events have been cleared. As the branch administrator, you can push new events with recaps, winners, gallery photos, and venue details into Firebase.
            </p>
            <button
              onClick={() => onNavigate('admin-events')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-blue-900/40 transition-all active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-cyan-300" />
              <span>Open Admin Event Studio to Push Event</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 lg:gap-8">
            {filteredEvents.map((event) => {
              const isUpcoming = event.status === 'upcoming';
              const displayWinners = event.winners && event.winners.length > 0 
                ? event.winners 
                : event.winner 
                  ? [typeof event.winner === 'string' ? { name: event.winner } : event.winner] 
                  : [];

              return (
                <div
                  key={event.id}
                  className="rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden shadow-xl flex flex-col group"
                >
                  {/* Event Image Banner with click to view modal lightbox */}
                  <div className="relative h-28 xs:h-36 sm:h-48 md:h-52 w-full overflow-hidden bg-black cursor-pointer">
                    <img
                      src={event.image}
                      alt={event.title}
                      loading="lazy"
                      onClick={() => setLightboxImage(event.image)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div 
                      onClick={() => setLightboxImage(event.image)}
                      className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-90" 
                    />
                    
                    {/* Status badges */}
                    <div className="absolute top-1.5 sm:top-3 left-1.5 sm:left-3 flex flex-wrap items-center gap-1 sm:gap-2 z-10 pointer-events-none">
                      <span className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-bold tracking-wide uppercase shadow-sm ${
                        isUpcoming 
                          ? 'bg-emerald-500 text-black' 
                          : 'bg-purple-600 text-white'
                      }`}>
                        {isUpcoming ? 'Upcoming' : 'Happened'}
                      </span>
                      <span className="hidden xs:inline-block px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[11px] font-medium bg-black/70 backdrop-blur-md text-cyan-300 border border-white/10">
                        {event.category}
                      </span>
                    </div>

                    <div className="absolute top-1.5 sm:top-3 right-1.5 sm:right-3 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setLightboxImage(event.image);
                        }}
                        className="p-1 sm:p-1.5 rounded-md sm:rounded-lg bg-black/70 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors"
                        title="View Full Size"
                      >
                        <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      </button>
                    </div>

                    <div className="absolute bottom-1.5 sm:bottom-3 left-1.5 sm:left-3 right-1.5 sm:right-3 flex items-center justify-between text-[9px] sm:text-xs text-slate-300 pointer-events-none">
                      <span className="font-medium bg-black/70 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg truncate max-w-[70%]">
                        {event.date}
                      </span>
                      {event.relatedPictures && event.relatedPictures.length > 0 && (
                        <span className="flex items-center gap-1 font-medium bg-black/70 backdrop-blur-md px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-purple-300">
                          <ImageIcon className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                          <span className="hidden xs:inline">{event.relatedPictures.length} Photos</span>
                          <span className="xs:hidden">{event.relatedPictures.length}</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-2.5 sm:p-5 lg:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-xs sm:text-base lg:text-lg group-hover:text-cyan-300 transition-colors line-clamp-2 mb-1 sm:mb-2">
                        {event.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-slate-400 leading-relaxed line-clamp-2 mb-2 sm:mb-3">
                        {event.description}
                      </p>

                      {/* Multiple Winners Display - stay strictly in block, truncate with dots if lengthy */}
                      {displayWinners.length > 0 && (
                        <div className="mb-1.5 sm:mb-3 p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1 w-full min-w-0 overflow-hidden">
                          <div className="flex items-center gap-1 sm:gap-1.5 text-amber-400 text-[8px] sm:text-[11px] font-bold uppercase tracking-wider leading-none min-w-0">
                            <Trophy className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 shrink-0" />
                            <span className="truncate">
                              {displayWinners.length > 1 ? `WINNERS (${displayWinners.length})` : 'WINNER'}
                            </span>
                          </div>
                          <div className="space-y-1 w-full min-w-0 overflow-hidden">
                            {displayWinners.slice(0, 2).map((w, i) => (
                              <div
                                key={i}
                                className="text-[8px] sm:text-xs flex items-center justify-between gap-1.5 leading-tight w-full min-w-0 overflow-hidden"
                              >
                                <div
                                  className="min-w-0 flex-1 truncate font-medium text-amber-300"
                                  title={`${w.position ? w.position + ': ' : ''}${w.name}`}
                                >
                                  {w.position && (
                                    <span className="text-amber-200/90 font-semibold mr-1">
                                      {w.position}:
                                    </span>
                                  )}
                                  <span className="truncate">{w.name}</span>
                                </div>
                                {w.prize && (
                                  <span
                                    className="text-[7.5px] sm:text-[10px] text-amber-400 font-mono shrink-0 max-w-[45%] truncate text-right ml-auto"
                                    title={w.prize}
                                  >
                                    {w.prize}
                                  </span>
                                )}
                              </div>
                            ))}
                            {displayWinners.length > 2 && (
                              <div className="text-[7.5px] sm:text-[10px] text-amber-300/80 italic leading-none truncate pt-0.5">
                                + {displayWinners.length - 2} more winner{displayWinners.length > 3 ? 's' : ''}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-3 border-t border-zinc-800">
                      <div className="space-y-1 text-[10px] sm:text-xs text-slate-400">
                        {event.time && (
                          <div className="flex items-center gap-1.5 truncate">
                            <Clock className="w-3 h-3 text-blue-400 shrink-0" />
                            <span className="truncate">{event.time}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 truncate">
                          <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                          <span className="truncate">{event.venue}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleOpenEvent(event)}
                        className={`w-full py-1.5 sm:py-2.5 px-2 sm:px-4 rounded-lg sm:rounded-xl text-[10px] sm:text-xs sm:text-sm font-semibold flex items-center justify-center gap-1 sm:gap-2 transition-all ${
                          isUpcoming
                            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
                            : 'bg-zinc-900 hover:bg-zinc-800 text-slate-200 border border-zinc-700'
                        }`}
                      >
                        <span className="hidden sm:inline">View Details & Photos</span>
                        <span className="sm:hidden">Details</span>
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}


      </div>

      {/* Modal for Details, Multiple Winners & Gallery Photos */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 border border-zinc-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header Image with click to view lightbox */}
            <div 
              onClick={() => setLightboxImage(selectedEvent.image)}
              className="relative h-56 sm:h-64 w-full overflow-hidden bg-black rounded-t-3xl cursor-pointer group"
            >
              <img
                src={selectedEvent.image}
                alt={selectedEvent.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute top-4 left-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs flex items-center gap-1.5 border border-white/10">
                  <ZoomIn className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Click to view full image</span>
                </span>
              </div>
              <div className="absolute bottom-4 left-6 right-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-600 text-white">
                  {selectedEvent.category} • {selectedEvent.status === 'past' ? 'Event Happened' : 'Upcoming'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {selectedEvent.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* Where It Happened & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 bg-zinc-900/70 p-4 rounded-2xl border border-zinc-800">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
                  <span>{selectedEvent.date}</span>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{selectedEvent.time}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 sm:col-span-2 pt-1 border-t border-zinc-800/80">
                  <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Where it Happened:</strong> {selectedEvent.venue}</span>
                </div>
              </div>

              {/* About the Event */}
              <div>
                <h4 className="font-semibold text-white text-sm mb-1.5">About the Event</h4>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {selectedEvent.description}
                </p>
              </div>

              {/* Multiple Winners Spotlight - stay strictly in block, truncate with dots if lengthy */}
              {((selectedEvent.winners && selectedEvent.winners.length > 0) || selectedEvent.winner) && (
                <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-zinc-900 border border-amber-500/30 space-y-3 sm:space-y-4 w-full min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-amber-400 text-xs sm:text-sm font-bold uppercase tracking-wider min-w-0">
                    <Trophy className="w-4 h-4 shrink-0" />
                    <span className="truncate">Winners of the Event</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full min-w-0">
                    {/* Render winners array */}
                    {selectedEvent.winners && selectedEvent.winners.length > 0 ? (
                      selectedEvent.winners.map((winner, idx) => (
                        <div
                          key={idx}
                          className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 space-y-1 w-full min-w-0 overflow-hidden"
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
                      <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 space-y-1 sm:col-span-2 w-full min-w-0 overflow-hidden">
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

              {/* Pictures Related to It with Modal Lightbox */}
              {selectedEvent.relatedPictures && selectedEvent.relatedPictures.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-white text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-purple-400" />
                      <span>Pictures Related to the Event ({selectedEvent.relatedPictures.length})</span>
                    </h4>
                    <span className="text-xs text-slate-400">Click to enlarge</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedEvent.relatedPictures.map((pic, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setLightboxImage(pic)}
                        className="h-32 rounded-xl overflow-hidden border border-zinc-800 bg-black cursor-pointer group relative"
                      >
                        <img 
                          src={pic} 
                          alt={`Event Moment ${idx + 1}`} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-1 text-xs font-medium">
                          <ZoomIn className="w-4 h-4 text-cyan-300" />
                          <span>View</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Highlights / Notes */}
              {selectedEvent.recapNotes && selectedEvent.recapNotes.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white text-sm mb-2">Event Highlights & Notes</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {selectedEvent.recapNotes.map((note, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Image Modal Lightbox ("the image uploaded can be viewed in a modal") */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 border border-zinc-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-h-[85vh] overflow-auto flex items-center justify-center bg-black p-2">
              <img
                src={lightboxImage}
                alt="Enlarged View"
                className="max-w-full max-h-[80vh] object-contain rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
