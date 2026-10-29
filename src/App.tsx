import { useState, useEffect, lazy, Suspense } from 'react';
import CardNav from './CardNav';
import LatticeLoader from './LatticeLoader';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import Footer from './components/Footer';
import GridBackground8Col from './components/GridBackground8Col';
import { ArrowUp } from 'lucide-react';

// Lazy load dedicated pages to optimize bundle size, decrease memory, and reduce storage overhead
const EventsPage = lazy(() => import('./pages/EventsPage'));
const TeamPage = lazy(() => import('./pages/TeamPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const NewsletterPage = lazy(() => import('./pages/NewsletterPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminEventsPage = lazy(() => import('./pages/AdminEventsPage'));

const items = [
  {
    label: 'About',
    links: [
      { label: 'About BBDU', href: '#about' },
      { label: 'Chapters', href: '#about' }
    ]
  },
  {
    label: 'Events',
    links: [
      { label: 'Programs', href: '#events' },
      { label: 'Push Event', href: '#admin' }
    ]
  },
  {
    label: 'Leadership',
    links: [
      { label: 'Core Team', href: '#team' },
      { label: 'Officers', href: '#team' }
    ]
  },
  {
    label: 'Contact',
    links: [
      { label: 'Inquiry', href: '#contact' },
      { label: 'Join Branch', href: '#contact' }
    ]
  }
];

export type PageType = 'home' | 'events' | 'team' | 'gallery' | 'newsletter' | 'contact' | 'admin-events';

function PageLoadingFallback() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-8 bg-[#04060d]">
      <div className="px-6 py-4 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl backdrop-blur-xl">
        <LatticeLoader
          status="working"
          label="Loading View"
          doneLabel="Done in"
          errorLabel="Failed"
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
          showTimer={false}
          color="#38bdf8"
        />
      </div>
    </div>
  );
}

export default function App() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  
  // Loading splash screen state with LatticeLoader
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [splashStatus, setSplashStatus] = useState<'working' | 'done'>('working');
  const [splashFading, setSplashFading] = useState(false);
  const [isBufferEnded, setIsBufferEnded] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Listen for hash changes to support browser back/forward and direct URL links
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === 'admin-events' || hash === 'push-event') {
        setCurrentPage('admin-events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'events' || hash === 'hackathons' || hash === 'workshops') {
        setCurrentPage('events');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'team' || hash === 'leadership' || hash === 'members') {
        setCurrentPage('team');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'gallery' || hash === 'chronicles') {
        setCurrentPage('gallery');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'newsletter' || hash === 'dispatch') {
        setCurrentPage('newsletter');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'contact' || hash === 'join') {
        setCurrentPage('contact');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === 'about') {
        setCurrentPage('home');
        setTimeout(() => {
          const el = document.getElementById('about');
          if (el) {
            const navHeight = 90;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
          }
        }, 120);
      } else if (!hash || hash === 'home') {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    // Initial loading splash screen lifecycle
    const timer1 = setTimeout(() => {
      setSplashStatus('done');
    }, 850);

    const timer2 = setTimeout(() => {
      setSplashFading(true);
    }, 1250);

    const timer3 = setTimeout(() => {
      setIsAppLoading(false);
      // Webpage buffer ends: notify all components to begin their entrance animations
      document.body.classList.add('page-buffered');
      document.body.dataset.bufferEnded = 'true';
      window.dispatchEvent(new CustomEvent('page-buffer-end'));
      setIsBufferEnded(true);
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (destination: string) => {
    if (destination === 'admin-events' || destination === 'admin') {
      setCurrentPage('admin-events');
      window.location.hash = 'admin';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'events') {
      setCurrentPage('events');
      window.location.hash = 'events';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'team') {
      setCurrentPage('team');
      window.location.hash = 'team';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'gallery') {
      setCurrentPage('gallery');
      window.location.hash = 'gallery';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'newsletter') {
      setCurrentPage('newsletter');
      window.location.hash = 'newsletter';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'contact') {
      setCurrentPage('contact');
      window.location.hash = 'contact';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (destination === 'about') {
      setCurrentPage('home');
      window.location.hash = 'about';
      setTimeout(() => {
        const el = document.getElementById('about');
        if (el) {
          const navHeight = 90;
          const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementPosition - navHeight, behavior: 'smooth' });
        }
      }, 100);
      return;
    }
    if (destination === 'home') {
      setCurrentPage('home');
      window.location.hash = '';
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#04060d] text-slate-100 selection:bg-blue-600 selection:text-white flex flex-col font-sans relative">
      {/* Full Page Initial Loading Splash Screen */}
      {isAppLoading && (
        <div
          id="splash-loader-screen"
          className={`fixed inset-0 z-[100] bg-[#04060d] flex items-center justify-center transition-opacity duration-500 ease-out select-none p-4 ${
            splashFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Subtle luminous ambient glow */}
          <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 px-4 py-2.5 sm:px-6 sm:py-3.5 rounded-xl sm:rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl backdrop-blur-xl scale-90 sm:scale-100 transition-transform">
            <LatticeLoader
              status={splashStatus}
              label="Thinking"
              doneLabel="Done in"
              errorLabel="Failed after"
              pattern="orbit"
              grid={3}
              shape="round"
              doneColor="#22c55e"
              errorColor="#ef4444"
              cellSize={isMobile ? 5 : 6}
              gap={isMobile ? 1.5 : 2}
              fontSize={isMobile ? 12 : 14}
              step={90}
              idleOpacity={0.15}
              glow={false}
              glowColor=""
              showTimer
              color="#f5f5f5"
            />
          </div>
        </div>
      )}

      {/* Top Floating Glass CardNav */}
      <div
        className={`fixed top-2.5 sm:top-3 left-0 right-0 z-50 px-2 sm:px-4 flex justify-center pointer-events-none transition-all duration-700 ease-out ${
          isBufferEnded ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0'
        }`}
      >
        <div className="w-full max-w-[360px] sm:max-w-[880px] pointer-events-auto flex justify-center">
          <CardNav
            barHeight={isMobile ? 36 : 42}
            items={items}
            cardEffect="rise"
            openOn="click"
            surface="glass"
            stagger={0.12}
            bounce={0.2}
            menuLabel
            speed={1}
            cardHeight={100}
            maxWidth={880}
            intro={isBufferEnded}
            onLinkClick={(link, _item, e) => {
              e.preventDefault();
              if (link.href === '#admin' || link.label.toLowerCase().includes('push')) {
                handleNavigate('admin-events');
              } else if (link.href === '#events' || link.label.toLowerCase().includes('event') || link.label.toLowerCase().includes('program')) {
                handleNavigate('events');
              } else if (link.href === '#team' || link.label.toLowerCase().includes('team') || link.label.toLowerCase().includes('officer')) {
                handleNavigate('team');
              } else if (link.href === '#gallery' || link.label.toLowerCase().includes('gallery') || link.label.toLowerCase().includes('moment')) {
                handleNavigate('gallery');
              } else if (link.href === '#newsletter' || link.label.toLowerCase().includes('dispatch') || link.label.toLowerCase().includes('newsletter')) {
                handleNavigate('newsletter');
              } else if (link.href === '#contact' || link.label.toLowerCase().includes('contact') || link.label.toLowerCase().includes('join') || link.label.toLowerCase().includes('inquiry')) {
                handleNavigate('contact');
              } else if (link.href === '#about' || link.label.toLowerCase().includes('about') || link.label.toLowerCase().includes('chapter')) {
                handleNavigate('about');
              } else {
                handleNavigate('home');
              }
            }}
          />
        </div>
      </div>

      {/* Main Sections with Code-Splitting */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <>
            {/* Dynamic Hero Section */}
            <Hero onNavigate={handleNavigate} bufferEnded={isBufferEnded} />

            {/* Sections below Hero with 8-box-per-row grid background */}
            <div className="relative">
              <GridBackground8Col lineColor="rgba(228, 228, 231, 0.08)" />
              {/* About IEEE BBDU Student Branch Section */}
              <AboutSection onNavigate={handleNavigate} />
            </div>
          </>
        )}

        {currentPage !== 'home' && (
          <div className="relative min-h-[70vh]">
            <GridBackground8Col lineColor="rgba(228, 228, 231, 0.08)" />
            <Suspense fallback={<PageLoadingFallback />}>
              {currentPage === 'events' && (
                <EventsPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'admin-events' && (
                <AdminEventsPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'team' && (
                <TeamPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'gallery' && (
                <GalleryPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'newsletter' && (
                <NewsletterPage onNavigate={handleNavigate} />
              )}

              {currentPage === 'contact' && (
                <ContactPage onNavigate={handleNavigate} />
              )}
            </Suspense>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Back to Top Button */}
      {showBackToTop && (
        <button
          id="back-to-top-btn"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-indigo-900/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all border border-blue-400/30"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
