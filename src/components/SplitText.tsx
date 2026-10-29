import { useEffect, useRef, useState, useMemo, type CSSProperties, type FC } from 'react';

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number; // ms per letter/word
  duration?: number; // seconds
  ease?: string;
  splitType?: 'chars' | 'words' | 'lines';
  from?: { opacity?: number; y?: number | string; x?: number | string; scale?: number; filter?: string };
  to?: { opacity?: number; y?: number | string; x?: number | string; scale?: number; filter?: string };
  threshold?: number;
  rootMargin?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  tag?: 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  staggerFrom?: 'start' | 'center' | 'end' | 'random';
  mask?: boolean;
  effect?: 'rise' | 'fade' | 'blur' | 'flip' | 'pop' | 'skew' | 'wave';
  trigger?: 'view' | 'load';
  loop?: boolean;
  loopDelay?: number;
  hoverEffect?: 'none' | 'lift' | 'scale';
  color?: string;
  accentColor?: string;
  highlightText?: string;
  highlightClassName?: string;
  highlightStyle?: CSSProperties;
  waitForBuffer?: boolean;
  onLetterAnimationComplete?: () => void;
  style?: CSSProperties;
}

export const SplitText: FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 40,
  duration = 1.1,
  ease = 'cubic-bezier(0.16, 1, 0.3, 1)',
  splitType = 'chars',
  from,
  to,
  threshold = 0.05,
  rootMargin = '0px',
  textAlign = 'center',
  tag: Tag = 'span',
  staggerFrom = 'start',
  mask = false,
  effect = 'rise',
  trigger = 'view',
  loop = false,
  hoverEffect = 'lift',
  color,
  accentColor,
  highlightText,
  highlightClassName = '',
  highlightStyle,
  waitForBuffer = true,
  onLetterAnimationComplete,
  style = {}
}) => {
  const containerRef = useRef<HTMLElement | null>(null);
  
  // Track if webpage buffer has dissolved
  const [bufferReady, setBufferReady] = useState(() => {
    if (!waitForBuffer) return true;
    if (typeof document === 'undefined') return true;
    return document.body.classList.contains('page-buffered') || document.body.dataset.bufferEnded === 'true';
  });

  const [isInView, setIsInView] = useState(false);
  const [hasSettled, setHasSettled] = useState(false);
  const [hoveredCharIndex, setHoveredCharIndex] = useState<number | null>(null);

  // Buffer lifecycle subscription
  useEffect(() => {
    if (!waitForBuffer) {
      setBufferReady(true);
      return;
    }

    if (document.body.classList.contains('page-buffered') || document.body.dataset.bufferEnded === 'true') {
      setBufferReady(true);
      return;
    }

    const handleBufferEnd = () => {
      setBufferReady(true);
    };

    window.addEventListener('page-buffer-end', handleBufferEnd);
    return () => {
      window.removeEventListener('page-buffer-end', handleBufferEnd);
    };
  }, [waitForBuffer]);

  // Compute character range for exact highlight matching
  const highlightRange = useMemo(() => {
    if (!highlightText || !text) return null;
    const startIndex = text.toLowerCase().indexOf(highlightText.toLowerCase());
    if (startIndex === -1) return null;
    return {
      start: startIndex,
      end: startIndex + highlightText.length
    };
  }, [text, highlightText]);

  // Parse text into words and individual characters with index tracking
  const parsedWords = useMemo(() => {
    if (!text) return [];
    const rawWords = text.split(' ');
    let globalCharIndex = 0;

    return rawWords.map((word, wordIndex) => {
      const isWordInHighlight =
        highlightRange !== null &&
        globalCharIndex >= highlightRange.start &&
        globalCharIndex + word.length <= highlightRange.end;

      const chars = splitType === 'words' ? [word] : word.split('');
      const wordChars = chars.map((char) => {
        const charIdx = globalCharIndex++;
        const isCharHighlighted =
          highlightRange !== null &&
          charIdx >= highlightRange.start &&
          charIdx < highlightRange.end;

        return {
          char,
          index: charIdx,
          isHighlighted: isCharHighlighted
        };
      });

      // Account for space between words
      if (wordIndex < rawWords.length - 1) {
        globalCharIndex++;
      }

      return {
        word,
        wordIndex,
        isHighlighted: isWordInHighlight,
        chars: wordChars
      };
    });
  }, [text, splitType, highlightRange]);

  const totalChars = useMemo(() => {
    return parsedWords.reduce((sum, w) => sum + w.chars.length, 0);
  }, [parsedWords]);

  // Trigger entrance ONLY after buffer ends and element enters viewport
  useEffect(() => {
    if (!bufferReady) {
      setIsInView(false);
      return;
    }

    if (trigger === 'load') {
      setIsInView(true);
      return;
    }

    const el = containerRef.current;
    if (!el) {
      setIsInView(true);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setIsInView(true);
      setHasSettled(true);
      onLetterAnimationComplete?.();
      return;
    }

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setIsInView(true);
              if (!loop) {
                observer?.disconnect();
              }
              break;
            } else if (loop) {
              setIsInView(false);
              setHasSettled(false);
            }
          }
        },
        {
          threshold: Math.max(0, Math.min(1, threshold)),
          rootMargin: rootMargin || '0px'
        }
      );
      observer.observe(el);
    } catch {
      setIsInView(true);
    }

    return () => {
      observer?.disconnect();
    };
  }, [bufferReady, trigger, threshold, rootMargin, loop, onLetterAnimationComplete]);

  // Complete settle callback
  useEffect(() => {
    if (!isInView || hasSettled) return;
    const maxDelaySeconds = (totalChars * delay) / 1000 + duration + 0.1;
    const timer = setTimeout(() => {
      setHasSettled(true);
      onLetterAnimationComplete?.();
    }, maxDelaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [isInView, hasSettled, totalChars, delay, duration, onLetterAnimationComplete]);

  // Calculate stagger delay based on staggerFrom
  const getDelayForIndex = (index: number) => {
    let orderIndex = index;
    if (staggerFrom === 'end') {
      orderIndex = totalChars - 1 - index;
    } else if (staggerFrom === 'center') {
      const mid = (totalChars - 1) / 2;
      orderIndex = Math.abs(index - mid);
    } else if (staggerFrom === 'random') {
      orderIndex = (index * 47) % Math.max(1, totalChars);
    }
    return (orderIndex * delay) / 1000;
  };

  // Harmonized initial transform values matching active transforms
  const getInitialTransform = () => {
    if (from?.y !== undefined) {
      return `translateY(${typeof from.y === 'number' ? `${from.y}px` : from.y})`;
    }
    switch (effect) {
      case 'fade':
        return 'translateY(0px)';
      case 'blur':
        return 'translateY(0px)';
      case 'pop':
        return 'scale(0.5)';
      case 'skew':
        return 'translateX(-16px)';
      case 'wave':
        return 'translateY(24px)';
      case 'rise':
      default:
        return 'translateY(32px)';
    }
  };

  const getInitialOpacity = () => {
    if (from?.opacity !== undefined) return from.opacity;
    return 0;
  };

  return (
    <Tag
      ref={containerRef as any}
      className={`inline-block ${className}`}
      style={{
        textAlign,
        color: color || undefined,
        ...style
      }}
      aria-label={text}
    >
      {parsedWords.map((wordData, wIdx) => {
        return (
          <span
            key={`word-${wIdx}`}
            className="inline-block whitespace-nowrap"
            style={{
              overflow: mask ? 'hidden' : 'visible',
              verticalAlign: 'baseline'
            }}
          >
            {wordData.chars.map((item) => {
              const charDelay = getDelayForIndex(item.index);
              const isHovered = hoveredCharIndex === item.index;

              // Compute clean 2D transforms (no matrix glitches)
              let currentTransform: string;
              if (isHovered && hoverEffect === 'lift') {
                currentTransform = 'translateY(-7px)';
              } else if (isHovered && hoverEffect === 'scale') {
                currentTransform = 'scale(1.15)';
              } else if (isInView) {
                currentTransform = 'translateY(0px)';
              } else {
                currentTransform = getInitialTransform();
              }

              const currentOpacity = isInView ? (to?.opacity ?? 1) : getInitialOpacity();

              // When animation completes and settles, hover interaction is instant & snappy
              const transitionDuration = hasSettled ? '0.18s' : `${duration}s`;
              const transitionDelay = hasSettled ? '0s' : `${charDelay}s`;
              const transitionEase = hasSettled ? 'cubic-bezier(0.2, 0.9, 0.4, 1.1)' : ease;

              return (
                <span
                  key={`char-${item.index}`}
                  className={`inline-block select-none transition-transform ${
                    item.isHighlighted && highlightClassName ? highlightClassName : ''
                  }`}
                  onMouseEnter={() => {
                    if (hoverEffect !== 'none' && hasSettled) {
                      setHoveredCharIndex(item.index);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hoverEffect !== 'none') {
                      setHoveredCharIndex(null);
                    }
                  }}
                  style={{
                    display: 'inline-block',
                    transform: currentTransform,
                    opacity: currentOpacity,
                    transitionProperty: 'transform, opacity, color',
                    transitionDuration,
                    transitionTimingFunction: transitionEase,
                    transitionDelay: isInView ? transitionDelay : '0s',
                    willChange: 'transform, opacity',
                    color: item.isHighlighted
                      ? undefined
                      : accentColor && isInView
                      ? accentColor
                      : 'inherit',
                    ...(item.isHighlighted && highlightStyle ? highlightStyle : {})
                  }}
                  aria-hidden="true"
                >
                  {item.char}
                </span>
              );
            })}

            {/* Natural word spacing */}
            {wIdx < parsedWords.length - 1 && (
              <span className="inline-block whitespace-pre" aria-hidden="true">
                {' '}
              </span>
            )}
          </span>
        );
      })}
    </Tag>
  );
};

export default SplitText;
