import { 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown 
} from 'lucide-react';
import logo from '../ieee.png';
import { BRANCH_INFO } from '../data/ieeeData';
import GradientASCII from './GradientASCII';
import SplitText from './SplitText';

interface HeroProps {
  onNavigate: (sectionId: string) => void;
  bufferEnded?: boolean;
}

const handleAnimationComplete = () => {
  console.log('All letters have animated!');
};

export default function Hero({ onNavigate, bufferEnded = true }: HeroProps) {
  return (
    <section
      id="hero-section"
      className="relative min-h-screen w-full flex flex-col justify-between pt-28 pb-8 sm:pb-12 overflow-hidden bg-[#060919] text-white"
    >
      {/* Top Section Background with GradientASCII */}
      <div className="absolute inset-0 overflow-hidden pointer-events-auto">
        <div className="w-full h-full relative">
          <GradientASCII
            colors={["#1e3fd8", "#f6f8ff", "#a5d8ff", "#38bdf8"]}
            shape="horizon"
            characters=" =+xX0S8#@"
            cellSize={18}
            density={0.8}
            glyphOpacity={0.85}
            glow={0.2}
            depthOfField={0}
            flicker={0.2}
            softness={0.5}
            scale={1}
            flow={0.5}
            speed={1}
            gradientOpacity={0.9}
            grain={0.08}
            variation={0}
            mouseInteraction
            scrambleRadius={0.1}
            clickEffect="wave"
            intro
            lightMode={false}
          />
        </div>
        {/* Soft bottom fade to blend into #060919 while keeping ASCII pixels clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#060919]/30 to-[#060919] pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col items-center justify-center my-auto">
        {/* Main Hero Header Block */}
        <div className="text-center max-w-4xl mx-auto mb-6 sm:mb-8 pt-2 sm:pt-4">
          {/* Institutional Crests (BBDU • IEEE • WIE) with upward light source gradient underlay */}
          <div
            className={`mb-6 sm:mb-8 flex justify-center transition-all duration-700 ease-out ${
              bufferEnded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-4 scale-95'
            }`}
          >
            <div className="relative inline-flex items-center justify-center px-4 sm:px-6 py-2 select-none group">
              {/* Very light-colored white gradient from bottom to up like a light source underlay */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                {/* Radiant upward light cone / pedestal */}
                <div
                  className="w-[125%] h-[140%] -bottom-1 absolute rounded-full blur-2xl opacity-70 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse 85% 60% at 50% 100%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.22) 42%, rgba(255, 255, 255, 0.04) 75%, transparent 100%)'
                  }}
                />
                {/* Soft directional upward gradient */}
                <div
                  className="w-full h-full absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      'linear-gradient(to top, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.16) 45%, rgba(255, 255, 255, 0.02) 80%, transparent 100%)',
                    filter: 'blur(10px)'
                  }}
                />
                {/* Ambient baseline light source highlight */}
                <div className="w-4/5 h-[1.5px] absolute -bottom-0.5 bg-gradient-to-r from-transparent via-white/70 to-transparent blur-[0.5px]" />
              </div>

              {/* Transparent PNG - refined size with constant position, PC slightly larger than mobile */}
              <img
                src={logo}
                alt="BBD University • IEEE Student Branch • IEEE WIE"
                className="relative z-10 h-11 sm:h-13 md:h-16 lg:h-18 xl:h-20 w-auto max-w-[270px] sm:max-w-[340px] md:max-w-[420px] lg:max-w-[480px] object-contain drop-shadow-[0_4px_16px_rgba(255,255,255,0.25)] select-none transition-transform duration-300 group-hover:scale-[1.02]"
                draggable={false}
              />
            </div>
          </div>

          {/* Main Headline with Chillax font & SplitText animation */}
          <h1 className="font-chillax tracking-wide leading-tight sm:leading-snug text-center">
            <SplitText
              text="Welcomes You towards Innovation & Excellence"
              highlightText="Innovation & Excellence"
              highlightClassName="font-bold text-[#00b4d8]"
              className="text-white font-normal text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
              effect="rise"
              splitType="chars"
              delay={40}
              duration={1.1}
              staggerFrom="start"
              trigger="view"
              hoverEffect="lift"
              loop={false}
              mask={false}
              threshold={0.05}
              rootMargin="0px"
              textAlign="center"
              waitForBuffer={true}
              onLetterAnimationComplete={handleAnimationComplete}
            />
          </h1>

          {/* Tagline in White with reduced font size */}
          <p
            className={`font-cabinet mt-4 sm:mt-5 text-xs sm:text-sm md:text-base text-white max-w-xl mx-auto font-normal leading-relaxed transition-all duration-700 delay-200 ease-out ${
              bufferEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            {BRANCH_INFO.tagline}
          </p>

          {/* Interactive CTA Action Buttons */}
          <div
            className={`mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-4 transition-all duration-700 delay-300 ease-out ${
              bufferEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <button
              id="hero-explore-events-btn"
              onClick={() => onNavigate('events')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-white text-[11px] sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:brightness-110 shadow-lg shadow-blue-900/40 border border-blue-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Explore Events & Workshops</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <button
              id="hero-join-now-btn"
              onClick={() => onNavigate('contact')}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 py-2 sm:px-6 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-cyan-300 text-[11px] sm:text-sm bg-[#0c163b]/70 hover:bg-[#122055] border border-cyan-500/35 transition-all backdrop-blur-md hover:scale-[1.02] active:scale-[0.98]"
            >
              <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span>Join Branch</span>
            </button>
          </div>
        </div>

        {/* Scroll down indicator to Events */}
        <div
          className={`flex justify-center mt-12 sm:mt-16 transition-all duration-700 delay-500 ease-out ${
            bufferEnded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
        >
          <button
            onClick={() => onNavigate('about')}
            className="flex flex-col items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <span>Discover About IEEE BBDU</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}
