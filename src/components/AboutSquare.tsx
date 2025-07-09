import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutSquare.css';

// Helper to detect mobile
function isMobile() {
  return typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Helper to detect orientation
function isLandscape() {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(orientation: landscape)').matches;
  }
  return false;
}

const TYPING_SPEED = isMobile() ? 18 : 7; // ms per character, slower on mobile

const ABOUT_TEXT = `i'm tony toskalio. together with my five brothers and one sister, i was born and raised in austria, with roots tracing back to romania. since childhood, i've found joy in watching tv, drawing, and flipping through old books at thrift stores, early habits that likely sparked my fascination with visual media. growing up in a big family also shaped me into a fairly social creature.
this passion led me to work on a variety of creative projects where i’ve collaborated with talented minds to bring ideas to life. one of the most meaningful of these was my syπthesizer. project, my diploma thesis, where i designed not only the physical enclosure of a modern synthesizer but also its control interface and user interaction model. working on this project sparked a deeper curiosity for sound and ultimately ignited my interest in making music. that also led me to experiment with music visualizers and explore how sound can shape visuals in real time. naturally, this opened the door to vibe coding and the intersection of code, design, and motion.
another highlight is the mundane, a short film i directed that was exhibited during the open house event at htl donaustadt. i tend to keep my creative scope broad, experimenting across disciplines — a mindset shaped deeply by my father, whose work ethic and hands-on skill have always inspired me.
currently, i'm focused on graphic and logo design, typography, photography, and vibe coding visual art installations. i also dabble in blender from time to time. in the near future, i plan to dive deeper into video production and hardware design, from pcb layouts to cad modeling and 3d printing.`;

// Define unique classes for each link
const LINK_CLASSES: { [key: string]: string } = {
  'tony toskalio': 'about-link-tony',
  'syπthesizer.': 'about-link-synth',
  'htl donaustadt': 'about-link-htl',
  'social': 'about-link-social',
  'drawing': 'about-link-drawing',
  'the mundane': 'about-link-mundane',
  'graphic and logo design': 'about-link-graphic',
  'photography': 'about-link-photo',
};

const About: React.FC = () => {
  const [about] = useState(ABOUT_TEXT);
  const [displayed, setDisplayed] = useState('');
  const [isSkipping, setIsSkipping] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [pausedAt, setPausedAt] = useState<number | null>(null);
  const [fadeOut, setFadeOut] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [frozenDisplay, setFrozenDisplay] = useState<string | null>(null);
  const [showLinksOnly, setShowLinksOnly] = useState(false); // NEW
  const animationFrame = useRef<number | null>(null);
  const navigate = useNavigate();

  // Store random rotations for overlays
  const overlayRotations = useRef<{ [key: string]: number }>({});

  // Ref for animated text container
  const animatedTextRef = useRef<HTMLDivElement>(null);
  // Ref for the last character (for autoscroll)
  const lastCharRef = useRef<HTMLSpanElement>(null);

  // Auto-scroll to last character as text animates
  useEffect(() => {
    if (animatedTextRef.current && lastCharRef.current && !showLinksOnly && !fadeOut) {
      lastCharRef.current.scrollIntoView({ behavior: 'auto', block: 'nearest', inline: 'nearest' });
    }
  }, [displayed, showLinksOnly, fadeOut]);

  // Animation logic
  useEffect(() => {
    setDisplayed('');
    setIsSkipping(false);
    setStartTime(performance.now());
    setPausedAt(null);
    setAnimationDone(false);
    setFrozenDisplay(null);
    overlayRotations.current = {}; // Reset rotations on new text
    document.title = "tony's about";
  }, [about]);

  useEffect(() => {
    if (!about) return;
    if (isSkipping) {
      setDisplayed(about);
      setAnimationDone(true);
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      return;
    }
    let raf: number;
    const animate = (now: number) => {
      let elapsed = (pausedAt !== null ? pausedAt : now) - (startTime ?? now);
      let charsToShow = Math.min(about.length, Math.floor(elapsed / TYPING_SPEED));
      setDisplayed(about.slice(0, charsToShow));
      if (charsToShow < about.length) {
        raf = requestAnimationFrame(animate);
        animationFrame.current = raf;
      } else {
        setAnimationDone(true);
      }
    };
    raf = requestAnimationFrame(animate);
    animationFrame.current = raf;
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
    // eslint-disable-next-line
  }, [about, isSkipping, startTime, pausedAt]);

  // Click handler for typewriter
  const handleClick = () => {
    if (!about) return;
    if (isMobile()) {
      setShowLinksOnly(v => !v); // Toggle links-only mode on mobile
      return;
    }
    if (!isSkipping && displayed.length < about.length) {
      // Skip to end
      setIsSkipping(true);
      setPausedAt(performance.now());
    } else if (isSkipping) {
      // Resume animation from where it would have been
      if (pausedAt !== null && startTime !== null) {
        // Instead of resuming from where it left off, calculate how much time has passed since startTime, including time spent paused
        const now = performance.now();
        const elapsed = now - startTime;
        const charsToShow = Math.floor(elapsed / TYPING_SPEED);
        if (charsToShow >= about.length) {
          // Animation is already done, just show the full text and do nothing else
          setDisplayed(about);
          setAnimationDone(true);
          setIsSkipping(false);
          setPausedAt(null);
          setStartTime(null);
        } else {
          setDisplayed(about.slice(0, charsToShow));
          setStartTime(startTime); // keep the original startTime
          setIsSkipping(false);
          setPausedAt(null);
          setAnimationDone(false);
        }
      }
    }
  };

  // Handler for 'tony toskalio' link
  const handleNameClick = (e: React.MouseEvent) => {
    if (!animationDone) return;
    e.preventDefault();
    setFrozenDisplay(displayed); // Freeze the current text
    setFadeOut(true);
    setTimeout(() => {
      navigate('/');
    }, 600); // Match fade duration
  };

  // Overlay configuration (moved below handleNameClick)
  type OverlayConfig = {
    word: string;
    onClick?: (e: React.MouseEvent) => void;
    href?: string;
  };
  const overlays: OverlayConfig[] = useMemo(() => [
    {
      word: 'tony toskalio',
      onClick: handleNameClick,
      href: undefined,
    },
    {
      word: 'syπthesizer.',
      onClick: undefined,
      href: 'https://synthesizer.cargo.site',
    },
    {
      word: 'htl donaustadt',
      onClick: undefined,
      href: 'https://htl-donaustadt.at',
    },
    // New links
    {
      word: 'social',
      onClick: undefined,
      href: '/socials', // open the new social slot page
    },
    {
      word: 'drawing',
      onClick: undefined,
      href: '#',
    },
    {
      word: 'the mundane',
      onClick: undefined,
      href: '/mundane', // open the new video page
    },
    {
      word: 'graphic and logo design',
      onClick: undefined,
      href: '#',
    },
    {
      word: 'photography',
      onClick: undefined,
      href: '#',
    },
  ], [handleNameClick]);

  // Helper to process overlays in a single pass
  const renderTextWithOverlays = (text: string, forceTransform = false) => {
    let result: React.ReactNode[] = [];
    let i = 0;
    while (i < text.length) {
      // Find the next overlay match
      let nextMatch: string | null = null;
      let nextIdx = text.length;
      let matchOverlay: OverlayConfig | null = null;
      for (const overlay of overlays) {
        const idx = text.toLowerCase().indexOf(overlay.word.toLowerCase(), i);
        if (idx !== -1 && idx < nextIdx) {
          nextIdx = idx;
          nextMatch = overlay.word;
          matchOverlay = overlay;
        }
      }
      if (nextMatch && matchOverlay) {
        // Push text before the match
        if (nextIdx > i) result.push(text.slice(i, nextIdx));
        // Overlay logic
        const handleOverlayClick = (e: React.MouseEvent) => {
          if (!(animationDone && !fadeOut && (!!matchOverlay.onClick || !!matchOverlay.href))) return;
          if (matchOverlay && matchOverlay.onClick) return matchOverlay.onClick(e);
          if (matchOverlay && matchOverlay.href) {
            e.preventDefault();
            window.open(matchOverlay.href, '_blank', 'noopener');
          }
        };
        // On mobile, always add a modifier class for transform
        let className = (animationDone && !fadeOut && (!!matchOverlay.onClick || !!matchOverlay.href)) ? LINK_CLASSES[nextMatch] : '';
        if (forceTransform && className) className += ' about-link-flip';
        result.push(
          <span
            key={nextIdx + '-' + nextMatch}
            className={className}
            onClick={(animationDone && !fadeOut && (!!matchOverlay.onClick || !!matchOverlay.href)) ? handleOverlayClick : undefined}
          >
            {text.slice(nextIdx, nextIdx + nextMatch.length)}
          </span>
        );
        i = nextIdx + nextMatch.length;
      } else {
        // No more overlays, push the rest
        result.push(text.slice(i));
        break;
      }
    }
    return result;
  };

  // Compose overlays for all words in a single pass
  const textToDisplay = frozenDisplay !== null ? frozenDisplay : displayed;
  // On mobile, always apply the transform class to links
  const withOverlays = renderTextWithOverlays(textToDisplay, isMobile());

  // Generate unique, substantially different random colors for links
  const linkColors = useMemo(() => {
    // Use a set of visually distinct colors
    const palette = [
      '#e53935', // red
      '#8e24aa', // purple
      '#3949ab', // blue
      '#00897b', // teal
      '#fbc02d', // yellow
      '#43a047', // green
      '#fb8c00', // orange
      '#00bcd4', // cyan
      '#d81b60', // pink
      '#6d4c41', // brown
    ];
    // Shuffle palette and assign to overlays
    const shuffled = [...palette].sort(() => Math.random() - 0.5);
    return overlays.map((_, i) => shuffled[i % shuffled.length]);
  }, [overlays]);

  // Collect all overlay links for links-only mode
  const allLinks = overlays.map((overlay, idx) => {
    if (!LINK_CLASSES[overlay.word]) return null;
    // Responsive font size: larger in portrait, smaller in landscape
    let fontSize = 'clamp(1.3rem, 6vw, 2.8rem)';
    if (isMobile() && isLandscape()) fontSize = 'clamp(1.1rem, 4vw, 2.2rem)';
    return (
      <span
        key={overlay.word}
        className={LINK_CLASSES[overlay.word] + ' about-link-list'}
        onClick={(animationDone && !fadeOut && (!!overlay.onClick || !!overlay.href)) ? (e => {
          if (overlay.onClick) return overlay.onClick(e);
          if (overlay.href) {
            e.preventDefault();
            window.open(overlay.href, '_blank', 'noopener');
          }
        }) : undefined}
        style={{
          display: 'block',
          fontSize,
          fontWeight: 700,
          margin: 'min(2vw, 18px) 0',
          textAlign: 'center',
          transform: 'none',
          color: linkColors[idx],
          transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1), transform 0.5s cubic-bezier(.77,0,.18,1), color 0.5s cubic-bezier(.77,0,.18,1)',
          opacity: showLinksOnly ? 1 : 0,
          pointerEvents: showLinksOnly ? 'auto' : 'none',
          wordBreak: 'break-word',
          whiteSpace: isMobile() && isLandscape() ? 'nowrap' : undefined,
        }}
      >
        {overlay.word}
      </span>
    );
  });

  // Helper to render animated text with a span on the last character for autoscroll
  const renderAnimatedText = (nodes: React.ReactNode) => {
    if (typeof nodes === 'string') {
      if (!nodes) return null;
      return (
        <>
          {nodes.slice(0, -1)}
          <span ref={lastCharRef}>{nodes.slice(-1)}</span>
        </>
      );
    }
    if (Array.isArray(nodes)) {
      if (!nodes.length) return null;
      const lastIdx = nodes.length - 1;
      return nodes.map((n, i) =>
        i === lastIdx ? <span ref={lastCharRef} key={i}>{n}</span> : n
      );
    }
    return nodes;
  };

  return (
    <div
      className="about-square-container"
      style={{
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.6s cubic-bezier(.77,0,.18,1)',
        overflow: 'hidden',
        minHeight: '100vh',
        minWidth: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        className={
          'about-square-text about-scroll-hide' +
          (isMobile() && isLandscape() && showLinksOnly ? ' about-links-horizontal-scroll' : '')
        }
        onClick={handleClick}
        title="Click to skip/resume animation"
        ref={animatedTextRef}
        style={isMobile() ? {
          maxHeight: '90vh',
          maxWidth: '92vw',
          overflowY: 'auto',
          overflowX: isMobile() && isLandscape() && showLinksOnly ? 'auto' : 'hidden',
          // In horizontal links-only mode, allow both scroll directions
          ...(isMobile() && isLandscape() && showLinksOnly ? { overflowY: 'auto', overflowX: 'auto' } : {}),
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: isMobile() && isLandscape() && showLinksOnly ? 'row' : 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4vw 3vw',
          boxSizing: 'border-box',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.98)',
          gap: isMobile() && isLandscape() && showLinksOnly ? '2vw' : undefined,
        } : {
          maxHeight: '90vh',
          maxWidth: '60vw',
          overflowY: showLinksOnly ? 'hidden' : 'auto',
          overflowX: 'hidden',
          cursor: 'pointer',
          position: 'relative',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3vw 2vw',
          boxSizing: 'border-box',
          borderRadius: 18,
          background: 'rgba(255,255,255,0.98)',
        }}
      >
        <div
          className="about-scroll-hide"
          style={{
            transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1), transform 0.5s cubic-bezier(.77,0,.18,1)',
            opacity: showLinksOnly ? 0 : 1,
            pointerEvents: showLinksOnly ? 'none' : 'auto',
            transform: showLinksOnly ? 'translateY(-30px) scale(0.98)' : 'none',
            position: showLinksOnly ? 'absolute' : 'static',
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
        >
          {renderAnimatedText(withOverlays)}
        </div>
        <div
          style={{
            transition: 'opacity 0.5s cubic-bezier(.77,0,.18,1), transform 0.5s cubic-bezier(.77,0,.18,1)',
            opacity: showLinksOnly ? 1 : 0,
            pointerEvents: showLinksOnly ? 'auto' : 'none',
            transform: showLinksOnly ? 'none' : 'translateY(30px) scale(0.98)',
            position: showLinksOnly ? 'static' : 'absolute',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {allLinks}
        </div>
      </div>
    </div>
  );
};

export default About; 