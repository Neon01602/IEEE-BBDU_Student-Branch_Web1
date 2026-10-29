import { useState, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/ieeeData';

interface GalleryPageProps {
  onNavigate: (destination: string) => void;
}

export default function GalleryPage({ onNavigate }: GalleryPageProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ['All', 'Workshops', 'Hackathons', 'IEEE Day', 'Industrial Visit'];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-[#060919] text-slate-100 pt-24 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumb Navigation */}
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
            <span className="text-cyan-400 font-medium">Visual Chronicles</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3 shadow-sm">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Chronicles</span>
          </div>
          <h1 className="font-chillax text-3xl sm:text-4xl md:text-5xl font-normal text-white tracking-tight leading-tight">
            Capturing Moments of{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Inspiration & Discovery
            </span>
          </h1>
          <p className="font-cabinet mt-4 sm:mt-5 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            A visual retrospective of student hackathons, robotic build sprints, industrial expeditions, and high-energy IEEE Day campus galas.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 pb-6 border-b border-slate-800/80">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all border ${
                activeCategory === cat
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md shadow-blue-900/40'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="rounded-3xl bg-[#090e28]/85 border border-slate-800/90 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1.5 shadow-xl overflow-hidden group cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-950">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#090e28] via-transparent to-transparent opacity-80" />
                
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-blue-600/90 backdrop-blur-md text-white shadow-sm">
                  {item.category}
                </span>

                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-cyan-300 transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                    {item.caption}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 truncate max-w-[170px]">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-blue-950/60 via-indigo-950/50 to-purple-950/60 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-xl font-bold text-white">Have Event Photographs or Video Media?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Student photographers and branch documentarians are invited to submit their media archives to the branch publicity desk.
            </p>
          </div>
          <button
            onClick={() => onNavigate('contact')}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-blue-900/40 shrink-0"
          >
            Contact Publicity Desk
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-lg animate-in fade-in duration-200">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 z-20 w-10 h-10 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <div className="relative rounded-2xl overflow-hidden border border-blue-500/30 max-h-[70vh] shadow-2xl">
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            <div className="mt-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center max-w-2xl w-full">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-600 text-white mb-2">
                {activePhoto.category}
              </span>
              <h3 className="font-bold text-white text-lg sm:text-xl">
                {activePhoto.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                {activePhoto.caption}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {activePhoto.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {activePhoto.date}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
