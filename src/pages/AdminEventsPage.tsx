import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Trophy, 
  Calendar, 
  MapPin, 
  Clock, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowLeft, 
  Image as ImageIcon,
  Sparkles,
  ExternalLink,
  LogOut,
  AlertCircle,
  X,
  Database,
  ZoomIn,
  Pencil
} from 'lucide-react';
import { EventItem, EventCategory, EventWinner } from '../types';
import { eventStore, getEventPushTimestamp } from '../services/eventStore';
import { compressImageFile, compressDataUrlIfNeeded } from '../utils/imageCompressor';

interface AdminEventsPageProps {
  onNavigate: (destination: string) => void;
}

export default function AdminEventsPage({ onNavigate }: AdminEventsPageProps) {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ieee_admin_authed') === 'true';
  });
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // Event form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<EventCategory>('Technical');
  const [status, setStatus] = useState<'past' | 'upcoming'>('past');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('Auditorium Hall, Babu Banarasi Das University, Lucknow');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tags, setTags] = useState<string[]>(['Technical', 'BBDU', 'IEEE']);

  // Multiple Winners Feature ("make the feature to add more winners details if needed")
  const [hasWinners, setHasWinners] = useState(true);
  const [winners, setWinners] = useState<EventWinner[]>([
    {
      id: 'w-1',
      position: '1st Place Winner',
      name: '',
      department: '',
      prize: ''
    }
  ]);

  // Related pictures ("Pictures related to it")
  const [relatedPictures, setRelatedPictures] = useState<string[]>([]);
  const [newPictureUrl, setNewPictureUrl] = useState('');

  // Recap notes / key highlights
  const [recapNotes, setRecapNotes] = useState<string[]>([]);
  const [newRecapNote, setNewRecapNote] = useState('');

  // Submission feedback
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [existingEvents, setExistingEvents] = useState<EventItem[]>([]);

  // Image Modal Lightbox ("the image uploaded can be viewed in a modal")
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    setExistingEvents([...eventStore.getEvents()].sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a)));
    return eventStore.subscribe((events) => {
      setExistingEvents([...events].sort((a, b) => getEventPushTimestamp(b) - getEventPushTimestamp(a)));
    });
  }, []);

  // Handle Login Authentication
  const handleAuthSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // Specific password requested by user: admin@7752
    if (adminPassword.trim() === 'admin@7752') {
      setIsAuthenticated(true);
      sessionStorage.setItem('ieee_admin_authed', 'true');
    } else {
      setAuthError('Incorrect admin password. Access denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ieee_admin_authed');
    setAdminPassword('');
  };

  // Add another winner
  const handleAddWinner = () => {
    const nextIndex = winners.length + 1;
    const defaultPosition = nextIndex === 2 ? '2nd Place / Runner Up' : nextIndex === 3 ? '3rd Place' : `Winner ${nextIndex}`;
    setWinners([
      ...winners,
      {
        id: `w-${Date.now()}`,
        position: defaultPosition,
        name: '',
        department: '',
        prize: ''
      }
    ]);
  };

  // Update a winner field
  const handleUpdateWinner = (index: number, field: keyof EventWinner, value: string) => {
    const updated = [...winners];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setWinners(updated);
  };

  // Remove a winner
  const handleRemoveWinner = (index: number) => {
    setWinners(winners.filter((_, i) => i !== index));
  };

  // Add related picture
  const handleAddPicture = () => {
    if (newPictureUrl.trim() && !relatedPictures.includes(newPictureUrl.trim())) {
      setRelatedPictures([...relatedPictures, newPictureUrl.trim()]);
      setNewPictureUrl('');
    }
  };

  // Image file upload handler (compresses large camera photos to keep well within Firestore 1MB document limit)
  const handleImageFileUpload = async (e: ChangeEvent<HTMLInputElement>, target: 'cover' | 'related') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    try {
      const compressedDataUrl = await compressImageFile(file, 1024, 1024, 0.72);
      if (target === 'cover') {
        setImageUrl(compressedDataUrl);
      } else {
        setRelatedPictures(prev => [...prev, compressedDataUrl]);
      }
    } catch (err) {
      console.error('Error compressing image:', err);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'cover') {
          setImageUrl(result);
        } else {
          setRelatedPictures(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setIsCompressing(false);
      e.target.value = '';
    }
  };

  // Handle Event Publish / Update Submit (Stores to Firebase Firestore)
  const handlePublishEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!title || !description || !date || !venue) {
      alert('Please fill out all required fields (Title, Date, Venue, Description).');
      return;
    }

    setIsSubmitting(true);

    try {
      // Ensure cover image and related pictures are compressed if they are large data URIs
      const rawCover = imageUrl.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
      const finalCover = await compressDataUrlIfNeeded(rawCover, 1024);
      
      const finalRelated = await Promise.all(
        relatedPictures.map(pic => compressDataUrlIfNeeded(pic, 900))
      );

      // Filter out empty winners
      const validWinners = hasWinners
        ? winners.filter(w => w.name.trim() !== '')
        : [];

      if (editingEventId) {
        // UPDATE EXISTING EVENT - ranks as latest pushed
        const existing = existingEvents.find(ev => ev.id === editingEventId);
        const updatedEvent: EventItem = {
          id: editingEventId,
          title: title.trim(),
          category,
          status,
          date: date.trim(),
          time: time.trim() || 'Event Hours',
          venue: venue.trim(),
          description: description.trim(),
          image: finalCover,
          tags: tags.length > 0 ? tags : ['IEEE', 'BBDU'],
          attendeesCount: existing?.attendeesCount || 50,
          createdAt: existing?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        if (validWinners.length > 0) {
          updatedEvent.winners = validWinners;
          updatedEvent.winner = validWinners[0];
        }

        if (finalRelated.length > 0) {
          updatedEvent.relatedPictures = finalRelated;
        }

        if (recapNotes.length > 0) {
          updatedEvent.recapNotes = recapNotes;
        }

        await eventStore.updateEvent(updatedEvent);
        setEditSuccess(true);
        setPublishSuccess(false);
        setEditingEventId(null);
      } else {
        // CREATE NEW EVENT - ranks as latest pushed
        const nowIso = new Date().toISOString();
        const newId = `evt-${Date.now()}`;
        const newEvent: EventItem = {
          id: newId,
          title: title.trim(),
          category,
          status,
          date: date.trim(),
          time: time.trim() || 'Event Hours',
          venue: venue.trim(),
          description: description.trim(),
          image: finalCover,
          tags: tags.length > 0 ? tags : ['IEEE', 'BBDU'],
          attendeesCount: 50,
          createdAt: nowIso,
          updatedAt: nowIso
        };

        if (validWinners.length > 0) {
          newEvent.winners = validWinners;
          newEvent.winner = validWinners[0];
        }
        if (finalRelated.length > 0) {
          newEvent.relatedPictures = finalRelated;
        }
        if (recapNotes.length > 0) {
          newEvent.recapNotes = recapNotes;
        }

        // Store in Firebase Firestore
        await eventStore.addEvent(newEvent);
        setPublishSuccess(true);
        setEditSuccess(false);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setDate('');
      setTime('');
      setImageUrl('');
      setWinners([
        {
          id: 'w-1',
          position: '1st Place Winner',
          name: '',
          department: '',
          prize: ''
        }
      ]);
      setRelatedPictures([]);
      setRecapNotes([]);

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to save event to Firebase:', err);
      alert('Failed to save to Firebase. Please check connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form with existing event details to edit (including cover image, pictures, winners)
  const handleStartEdit = (evt: EventItem) => {
    setEditingEventId(evt.id);
    setTitle(evt.title || '');
    setCategory(evt.category || 'Technical');
    setStatus(evt.status || 'past');
    setDate(evt.date || '');
    setTime(evt.time || '');
    setVenue(evt.venue || '');
    setDescription(evt.description || '');
    setImageUrl(evt.image || '');
    setTags(evt.tags && evt.tags.length > 0 ? evt.tags : ['Technical', 'BBDU', 'IEEE']);

    if (evt.winners && evt.winners.length > 0) {
      setHasWinners(true);
      setWinners(evt.winners);
    } else if (evt.winner) {
      setHasWinners(true);
      if (typeof evt.winner === 'string') {
        setWinners([{ id: 'w-1', name: evt.winner, position: '1st Place Winner' }]);
      } else {
        setWinners([evt.winner]);
      }
    } else {
      setHasWinners(false);
      setWinners([
        {
          id: 'w-1',
          position: '1st Place Winner',
          name: '',
          department: '',
          prize: ''
        }
      ]);
    }

    setRelatedPictures(evt.relatedPictures || []);
    setRecapNotes(evt.recapNotes || []);
    setPublishSuccess(false);
    setEditSuccess(false);

    // Smooth scroll up to form
    const formElement = document.getElementById('event-publish-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Cancel edit mode and reset form fields
  const handleCancelEdit = () => {
    setEditingEventId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setImageUrl('');
    setWinners([
      {
        id: 'w-1',
        position: '1st Place Winner',
        name: '',
        department: '',
        prize: ''
      }
    ]);
    setRelatedPictures([]);
    setRecapNotes([]);
  };

  const handleDeleteEvent = async (id: string) => {
    if (confirm('Are you sure you want to delete this event from Firebase Firestore?')) {
      if (editingEventId === id) {
        handleCancelEdit();
      }
      await eventStore.deleteEvent(id);
    }
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 pt-24 pb-20 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/10 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 pb-3 sm:pb-4 border-b border-zinc-800">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl text-[11px] sm:text-sm font-medium text-slate-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onNavigate('events')}
              className="text-[11px] sm:text-sm font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 sm:gap-1.5"
            >
              <span>View Public Events</span>
              <ExternalLink className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-medium text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 transition-all"
              >
                <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* AUTHENTICATION SCREEN: If not logged in */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-8 sm:py-12">
            <div className="p-5 sm:p-10 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-2xl relative text-center">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-cyan-400 mx-auto mb-3 sm:mb-5 shadow-lg">
                <Lock className="w-5 h-5 sm:w-7 sm:h-7" />
              </div>

              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>Admin Verification</span>
              </div>

              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">
                Are you the Branch Admin?
              </h2>
              <p className="text-[11px] sm:text-sm text-slate-400 mb-4 sm:mb-6 leading-relaxed">
                Please enter the authorized admin credentials to push events and store them in Firebase Firestore.
              </p>

              {authError && (
                <div className="mb-4 sm:mb-5 p-2.5 sm:p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-[11px] sm:text-xs flex items-center gap-2 text-left">
                  <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3 sm:space-y-4 text-left">
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-400 mb-1">
                    Admin Identifier
                  </label>
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="Admin Email or Username"
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-400 mb-1">
                    Admin Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter admin password..."
                      className="w-full pl-3 pr-10 sm:pl-4 sm:pr-11 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] sm:text-sm transition-all shadow-lg shadow-blue-900/40 flex items-center justify-center gap-1.5 sm:gap-2 mt-2"
                >
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Verify & Access Event Studio</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* EVENT PUBLISHING FORM: When Authenticated */
          <div className="space-y-6 sm:space-y-10">
            {/* Simple Push Event Details Title */}
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-white">
                Push Event Details
              </h1>
            </div>

            {/* Success notification */}
            {publishSuccess && (
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-in fade-in">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Event Stored in Firebase Firestore!</h4>
                    <p className="text-[10px] sm:text-xs text-slate-300">
                      Your event details and winners have been securely saved and are now live publicly.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('events')}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-xs font-semibold shadow-md"
                  >
                    Open Events Page
                  </button>
                  <button
                    onClick={() => setPublishSuccess(false)}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 text-slate-400 hover:text-white text-[10px] sm:text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Edit Success notification */}
            {editSuccess && (
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-cyan-950/60 border border-cyan-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-in fade-in">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 shrink-0" />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">Event Updated in Firebase Firestore!</h4>
                    <p className="text-[10px] sm:text-xs text-slate-300">
                      All modified details, images, and winners have been synchronized to Firebase in real-time.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('events')}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] sm:text-xs font-semibold shadow-md"
                  >
                    Open Events Page
                  </button>
                  <button
                    onClick={() => setEditSuccess(false)}
                    className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 text-slate-400 hover:text-white text-[10px] sm:text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {/* Active Editing Mode Banner */}
            {editingEventId && (
              <div className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-amber-950/60 border border-amber-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 animate-in fade-in shadow-xl shadow-amber-950/30">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                    <Pencil className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] sm:text-[11px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                        Editing Mode Active
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-sm text-slate-200 mt-0.5 sm:mt-1 leading-relaxed">
                      Modifying: <strong className="text-white font-semibold">{title || 'Event'}</strong>. You can change any detail, upload or replace the cover image and gallery pictures, update winners, and save changes.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-[10px] sm:text-xs font-semibold text-slate-200 hover:text-white flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
                >
                  <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>Cancel Editing</span>
                </button>
              </div>
            )}

            {/* Event Form */}
            <form id="event-publish-form" onSubmit={handlePublishEvent} className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-6 sm:space-y-8">
              {/* Section 1: Core Details */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-base font-semibold text-white border-b border-zinc-800 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 sm:gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                    <span>1. Details About the Event</span>
                  </span>
                  {editingEventId && (
                    <span className="text-[10px] sm:text-xs text-amber-400 font-mono flex items-center gap-1">
                      <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span>Updating Existing Event</span>
                    </span>
                  )}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Event Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. HackBBDU 2026: National Innovation Hackathon"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="WIE">Women in Engineering (WIE)</option>
                      <option value="Webinar">Webinar</option>
                      <option value="Social">Social / Expo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Event Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'past' | 'upcoming')}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="past">Happened (Past Event & Recap)</option>
                      <option value="upcoming">Upcoming Event</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. October 24, 2026"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Time
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM - 4:30 PM IST"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                    Event Overview / Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide a comprehensive summary of what happened, topics covered, challenges faced, or key milestones..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500 leading-relaxed"
                  />
                </div>
              </div>

              {/* Section 2: Where it Happened */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-base font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 sm:gap-2">
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  <span>2. Where it Happened (Venue / Location)</span>
                </h3>

                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                    Venue / Campus Location <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Main Auditorium Hall & High-Performance CS Lab, BBDU Campus, Lucknow"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Section 3: Event Cover Image with Modal Lightbox */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-base font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 sm:gap-2">
                  <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                  <span>3. Event Cover Image (Click to view full size)</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                      Cover Image URL or File Upload
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="url"
                        placeholder="https://... or upload below"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                      />
                      <label className="px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] sm:text-xs text-slate-200 border border-zinc-700 font-medium cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 transition-colors shrink-0">
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Upload File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'cover')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Image Preview with click to open in modal lightbox */}
                  {imageUrl && (
                    <div className="relative inline-block group">
                      <div 
                        onClick={() => setModalImage(imageUrl)}
                        className="relative w-48 sm:w-64 h-28 sm:h-36 rounded-xl overflow-hidden border border-zinc-700 bg-black cursor-pointer shadow-lg group-hover:border-blue-400 transition-all"
                      >
                        <img src={imageUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white gap-1 sm:gap-1.5 text-[10px] sm:text-xs font-medium">
                          <ZoomIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" />
                          <span>View Full Size</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImageUrl('')}
                        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-600 text-white shadow hover:bg-red-500 transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Multiple Winners Feature */}
              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-wrap items-center justify-between border-b border-zinc-800 pb-2 gap-2">
                  <h3 className="text-xs sm:text-base font-semibold text-white flex items-center gap-1.5 sm:gap-2">
                    <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                    <span>4. Winners of the Event ({winners.length})</span>
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <label className="flex items-center gap-1.5 text-[10px] sm:text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasWinners}
                        onChange={(e) => setHasWinners(e.target.checked)}
                        className="rounded border-zinc-700 text-blue-600 focus:ring-0"
                      />
                      <span>Include Winners</span>
                    </label>
                    {hasWinners && (
                      <button
                        type="button"
                        onClick={handleAddWinner}
                        className="px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-md sm:rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[10px] sm:text-xs font-semibold flex items-center justify-center transition-colors text-center shadow-sm"
                      >
                        <span>+ Add More</span>
                      </button>
                    )}
                  </div>
                </div>

                {hasWinners && (
                  <div className="space-y-2.5 sm:space-y-3">
                    {winners.map((winner, idx) => (
                      <div 
                        key={winner.id || idx}
                        className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2.5 sm:space-y-3 relative group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-xs font-mono font-semibold text-amber-300 flex items-center gap-1 sm:gap-1.5">
                            <Trophy className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" />
                            <span>Winner Entry #{idx + 1}</span>
                          </span>
                          {winners.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveWinner(idx)}
                              className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md bg-red-950/40 border border-red-500/20"
                            >
                              <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              <span>Remove</span>
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                              Award / Position Title
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. 1st Place / Gold Trophy"
                              value={winner.position || ''}
                              onChange={(e) => handleUpdateWinner(idx, 'position', e.target.value)}
                              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                              Winner / Team Name <span className="text-red-400">*</span>
                            </label>
                            <input
                              type="text"
                              required={idx === 0}
                              placeholder="e.g. Team ByteCraft"
                              value={winner.name}
                              onChange={(e) => handleUpdateWinner(idx, 'name', e.target.value)}
                              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                              Department / College
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Dept of CSE, BBDU"
                              value={winner.department || ''}
                              onChange={(e) => handleUpdateWinner(idx, 'department', e.target.value)}
                              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                          <div className="sm:col-span-3">
                            <label className="block text-[10px] sm:text-xs font-medium text-slate-300 mb-1">
                              Prize Won / Recognition
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Cash Prize INR 25,000 + Certificate of Excellence"
                              value={winner.prize || ''}
                              onChange={(e) => handleUpdateWinner(idx, 'prize', e.target.value)}
                              className="w-full px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 5: Pictures Related to It with Modal Lightbox */}
              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xs sm:text-base font-semibold text-white border-b border-zinc-800 pb-2 flex items-center gap-1.5 sm:gap-2">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                  <span>5. Pictures Related to It (Click any image to view in modal)</span>
                </h3>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <input
                      type="url"
                      placeholder="Paste picture URL..."
                      value={newPictureUrl}
                      onChange={(e) => setNewPictureUrl(e.target.value)}
                      className="w-full px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] sm:text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleAddPicture}
                        className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-[10px] sm:text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Add Picture URL</span>
                      </button>
                      <label className="flex-1 px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg sm:rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] sm:text-xs text-slate-200 border border-zinc-700 font-medium cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                        <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Upload Picture</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'related')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Pictures Preview Grid with Modal Lightbox */}
                  {relatedPictures.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-2">
                      {relatedPictures.map((pic, idx) => (
                        <div key={idx} className="relative h-24 sm:h-28 rounded-xl overflow-hidden border border-zinc-800 bg-black group">
                          <img 
                            src={pic} 
                            alt={`Related ${idx}`} 
                            onClick={() => setModalImage(pic)}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform" 
                          />
                          <div 
                            onClick={() => setModalImage(pic)}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-[10px] sm:text-[11px] text-white gap-1 pointer-events-auto"
                          >
                            <ZoomIn className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>View</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setRelatedPictures(relatedPictures.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/80 text-red-400 hover:text-red-300 opacity-90 group-hover:opacity-100 z-10"
                          >
                            <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3 sm:pt-4 border-t border-zinc-800 flex items-center justify-end gap-2 sm:gap-3">
                {editingEventId ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-slate-300 hover:text-white text-[11px] sm:text-sm font-medium transition-colors"
                  >
                    Cancel Editing
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="px-3.5 py-2 sm:px-5 sm:py-3 rounded-lg sm:rounded-xl bg-zinc-900 text-slate-400 hover:text-white text-[11px] sm:text-sm font-medium"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 sm:px-7 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-[11px] sm:text-sm shadow-xl flex items-center gap-1.5 sm:gap-2 transition-all active:scale-95 disabled:opacity-50 text-white ${
                    editingEventId
                      ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-amber-900/40'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/40'
                  }`}
                >
                  {editingEventId ? <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Database className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  <span>
                    {isSubmitting 
                      ? (editingEventId ? 'Updating...' : 'Publishing...') 
                      : (editingEventId ? 'Update' : 'Publish')}
                  </span>
                </button>
              </div>
            </form>

            {/* Currently Published Events in Firebase with Dedicated Edit Column */}
            {existingEvents.length > 0 && (
              <div className="p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-zinc-950 border border-zinc-800 shadow-xl">
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-sm sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>Previously Saved Events</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 text-[10px] sm:text-xs font-mono font-semibold">
                      {existingEvents.length}
                    </span>
                  </h3>
                </div>

                {/* Table Header: Dedicated Edit Column */}
                <div className="hidden lg:grid grid-cols-12 gap-3 px-4 py-2.5 bg-zinc-900/90 rounded-xl text-[11px] font-mono uppercase tracking-wider text-zinc-400 border border-zinc-800 mb-3">
                  <div className="col-span-1">Image</div>
                  <div className="col-span-4">Event Title & Category</div>
                  <div className="col-span-3">Date & Venue</div>
                  <div className="col-span-2">Highlights & Winners</div>
                  <div className="col-span-1 text-center font-bold text-cyan-400">Edit</div>
                  <div className="col-span-1 text-right">Delete</div>
                </div>

                {/* Table Rows with Edit & Delete actions */}
                <div className="space-y-2.5 sm:space-y-3">
                  {existingEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-zinc-900/70 border transition-all ${
                        editingEventId === evt.id
                          ? 'border-amber-500/60 bg-amber-950/20 shadow-lg shadow-amber-900/20'
                          : 'border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {/* Desktop Grid Layout */}
                      <div className="hidden lg:grid grid-cols-12 gap-3 items-center">
                        {/* 1. Cover Image / Lightbox */}
                        <div className="col-span-1">
                          <div
                            onClick={() => setModalImage(evt.image)}
                            className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-800 cursor-pointer group bg-black"
                            title="Click to view full image in modal"
                          >
                            <img
                              src={evt.image}
                              alt={evt.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                              <ZoomIn className="w-3.5 h-3.5" />
                            </div>
                          </div>
                        </div>

                        {/* 2. Title & Category */}
                        <div className="col-span-4 min-w-0 pr-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-cyan-300">
                            {evt.category} • {evt.status}
                          </span>
                          <h4 className="font-semibold text-white text-sm mt-1 truncate" title={evt.title}>
                            {evt.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5" title={evt.description}>
                            {evt.description}
                          </p>
                        </div>

                        {/* 3. Date & Venue */}
                        <div className="col-span-3 text-xs text-slate-300 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 font-medium text-white">
                            <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                            <span>{evt.date}</span>
                            {evt.time && <span className="text-slate-400 text-[11px]">({evt.time})</span>}
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5 truncate" title={evt.venue}>
                            <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        </div>

                        {/* 4. Winners & Pictures count */}
                        <div className="col-span-2 text-xs min-w-0 overflow-hidden">
                          {evt.winners && evt.winners.length > 0 ? (
                            <span 
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30 truncate max-w-full"
                              title={evt.winners.map(w => `${w.position ? w.position + ': ' : ''}${w.name}`).join(' | ')}
                            >
                              <Trophy className="w-3 h-3 text-amber-400 shrink-0" />
                              <span className="truncate">{evt.winners.length} {evt.winners.length === 1 ? 'Winner' : 'Winners'}</span>
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500 truncate block">No winners listed</span>
                          )}
                          {evt.relatedPictures && evt.relatedPictures.length > 0 && (
                            <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 min-w-0 overflow-hidden">
                              <ImageIcon className="w-3 h-3 text-purple-400 shrink-0" />
                              <span className="truncate">{evt.relatedPictures.length} related pictures</span>
                            </div>
                          )}
                        </div>

                        {/* 5. DEDICATED EDIT COLUMN */}
                        <div className="col-span-1 flex items-center justify-center">
                          <button
                            onClick={() => handleStartEdit(evt)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                              editingEventId === evt.id
                                ? 'bg-amber-500 text-black border-amber-400 font-bold shadow-amber-500/20'
                                : 'bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border-blue-500/40'
                            }`}
                            title="Edit this event detail (including image)"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{editingEventId === evt.id ? 'Editing' : 'Edit'}</span>
                          </button>
                        </div>

                        {/* 6. DELETE COLUMN */}
                        <div className="col-span-1 flex items-center justify-end">
                          <button
                            onClick={() => handleDeleteEvent(evt.id)}
                            className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400 transition-colors"
                            title="Delete from Firebase"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Mobile Card Layout */}
                      <div className="lg:hidden flex flex-col gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div
                            onClick={() => setModalImage(evt.image)}
                            className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-zinc-800 cursor-pointer bg-black"
                          >
                            <img
                              src={evt.image}
                              alt={evt.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                              <ZoomIn className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1 overflow-hidden">
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-blue-950/70 border border-blue-500/30 text-cyan-300 inline-block">
                              {evt.category} • {evt.status}
                            </span>
                            <h4 className="font-semibold text-white text-xs sm:text-sm mt-0.5 truncate block w-full min-w-0" title={evt.title}>
                              {evt.title}
                            </h4>
                            <div className="text-[10px] sm:text-xs text-slate-400 mt-0.5 min-w-0 overflow-hidden" title={`${evt.date} • ${evt.venue}`}>
                              <p className="truncate block w-full min-w-0 text-slate-400">
                                <span className="text-slate-300 font-medium">{evt.date}</span>
                                {evt.venue && (
                                  <>
                                    <span className="text-slate-500 mx-1">•</span>
                                    <span>{evt.venue}</span>
                                  </>
                                )}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 min-w-0">
                          <div className="text-[10px] sm:text-xs text-slate-400 min-w-0 truncate">
                            {evt.winners && evt.winners.length > 0 && (
                              <span className="text-amber-400 text-[10px] sm:text-xs font-medium truncate inline-flex items-center gap-1">
                                <Trophy className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 shrink-0" />
                                <span className="truncate">{evt.winners.length} {evt.winners.length === 1 ? 'Winner' : 'Winners'}</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <button
                              onClick={() => handleStartEdit(evt)}
                              className={`px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg sm:rounded-xl border text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 ${
                                editingEventId === evt.id
                                  ? 'bg-amber-500 text-black border-amber-400 font-bold'
                                  : 'bg-blue-600/20 hover:bg-blue-600/40 text-cyan-300 border-blue-500/40'
                              }`}
                            >
                              <Pencil className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span>{editingEventId === evt.id ? 'Editing' : 'Edit'}</span>
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(evt.id)}
                              className="p-1 sm:p-1.5 rounded-lg sm:rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-400"
                            >
                              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Modal Lightbox ("the image uploaded can be viewed in a modal") */}
      {modalImage && (
        <div 
          onClick={() => setModalImage(null)}
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 cursor-zoom-out"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col cursor-default"
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/80 border border-zinc-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full max-h-[85vh] overflow-auto flex items-center justify-center bg-black p-2">
              <img
                src={modalImage}
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
