import { useState, useMemo } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  X
} from 'lucide-react';
import { GALLERY_ITEMS } from '../data/ieeeData';
import LatticeLoader from './LatticeLoader';

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photoBuffering, setPhotoBuffering] = useState(true);

  const categories = ['All', 'Workshops', 'Hackathons', 'IEEE Day', 'Industrial Visit', 'Competitions'];

  const filteredItems = useMemo(() => {
    if (activeCategory === 'All') return GALLERY_ITEMS;
    return GALLERY_ITEMS.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const openLightbox = (index: number) => {
    setPhotoBuffering(true);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null) return;
    setPhotoBuffering(true);
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null) return;
    setPhotoBuffering(true);
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  const activePhoto = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#060919] border-t border-blue-950/80 relative">
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Visual Chronicles</span>
          </div>
          <h2 className="font-chillax text-3xl sm:text-4xl font-normal text-white tracking-tight">
            Capturing Moments of{' '}
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              Inspiration & Discovery
            </span>
          </h2>
          <p className="font-cabinet mt-4 text-base sm:text-lg text-slate-300">
            A visual retrospective of student hackathons, robotic build sprints, industrial expeditions, and high-energy IEEE Day campus galas.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer bg-slate-900 border border-slate-800/80 hover:border-purple-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-950/30"
            >
              <img
                src={item.image}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-950/80 text-blue-300 border border-blue-500/30 backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/70 border border-slate-700 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                <Maximize2 className="w-4 h-4" />
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="text-white font-bold text-base group-hover:text-blue-300 transition-colors line-clamp-1">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 line-clamp-2 mt-1">
                  {item.caption}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2.5 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                    <span className="truncate">{item.location}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3 text-blue-400" />
                    <span>{item.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activePhoto && (
        <div
          id="gallery-lightbox"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={prevLightbox}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextLightbox}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
              {photoBuffering && (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 z-10 backdrop-blur-sm">
                  <LatticeLoader
                    status="working"
                    label="Loading high-res preview"
                    doneLabel="Loaded in"
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
                    color="#f5f5f5"
                  />
                </div>
              )}
              <img
                src={activePhoto.image}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                onLoad={() => setPhotoBuffering(false)}
                className={`max-h-[60vh] w-auto max-w-full object-contain transition-opacity duration-300 ${
                  photoBuffering ? 'opacity-0' : 'opacity-100'
                }`}
              />
            </div>
            <div className="p-6 bg-slate-900 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  {activePhoto.category}
                </span>
                <span className="text-xs text-slate-400">
                  {activePhoto.date} • {activePhoto.location}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1">
                {activePhoto.title}
              </h3>
              <p className="text-sm text-slate-300">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
