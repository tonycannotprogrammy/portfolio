import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutSquare.css';

// Helper to detect mobile
function isMobile() {
  return typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

const TYPING_SPEED = isMobile() ? 18 : 7; // ms per character, slower on mobile

// Helper to get a random rotation between -8 and 8 degrees
function getRandomRotation() {
  return Math.random() * 16 - 8;
}

const ABOUT_TEXT = `i'm tony toskalio. together with my five brothers and one sister, i was born and raised in austria, with roots tracing back to romania. since childhood, i've found joy in watching tv, drawing, and flipping through old books at thrift stores, early habits that likely sparked my fascination with visual media. growing up in a big family also shaped me into a fairly social creature.
this passion led me to work on a variety of creative projects where i’ve collaborated with talented minds to bring ideas to life. one of the most meaningful of these was my syπthesizer. project, my diploma thesis, where i designed not only the physical enclosure of a modern synthesizer but also its control interface and user interaction model. working on this project sparked a deeper curiosity for sound and ultimately ignited my interest in making music. that also led me to experiment with music visualizers and explore how sound can shape visuals in real time. naturally, this opened the door to vibe coding and the intersection of code, design, and motion.
another highlight is the mundane, a short film i directed that was exhibited during the open house event at htl donaustadt. i tend to keep my creative scope broad, experimenting across disciplines — a mindset shaped deeply by my father, whose work ethic and hands-on skill have always inspired me.
currently, i'm focused on graphic and logo design, typography, photography, and vibe coding visual art installations. i also dabble in blender from time to time. in the near future, i plan to dive deeper into video production and hardware design, from pcb layouts to cad modeling and 3d printing.`;

const COLOR_ANIMATION = {
  animation: 'rainbow 2s linear infinite',
  background: 'linear-gradient(90deg, #ff0055, #fffa00, #00ffae, #0055ff, #ff00e1, #ff0055)',
  backgroundSize: '400% 100%',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  display: 'inline-block',
  transform: 'rotate(180deg) scaleX(-1)',
  transition: 'filter 0.2s',
  cursor: 'pointer',
};

// Define unique styles for each link
const LINK_STYLES: { [key: string]: React.CSSProperties } = {
  'tony toskalio': {
    color: '#ff0055', // edgy pink-red
    filter: 'drop-shadow(0 0 6px #ff0055cc)',
    transform: 'rotate(180deg) scaleX(-1)',
    display: 'inline-block',
    animation: 'shake 0.7s infinite cubic-bezier(.36,.07,.19,.97) both',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
  'syπthesizer.': {
    color: '#00ffe7', // neon cyan
    filter: 'drop-shadow(0 0 8px #00ffe7cc)',
    transform: 'rotate(180deg) scaleX(-1)',
    display: 'inline-block',
    animation: 'pulse 1.2s infinite alternate',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
  'htl donaustadt': {
    color: '#fffa00', // bright yellow
    filter: 'drop-shadow(0 0 8px #fffa00cc)',
    transform: 'rotate(180deg) scaleX(-1)',
    display: 'inline-block',
    animation: 'hue-rotate 2s infinite linear',
    cursor: 'pointer',
    fontWeight: 700,
    letterSpacing: '0.03em',
  },
};

// Define unique classes for each link
const LINK_CLASSES: { [key: string]: string } = {
  'tony toskalio': 'about-link-tony',
  'syπthesizer.': 'about-link-synth',
  'htl donaustadt': 'about-link-htl',
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
  const animationFrame = useRef<number | null>(null);
  const navigate = useNavigate();

  // Store random rotations for overlays
  const overlayRotations = useRef<{ [key: string]: number }>({});

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
    if (!isSkipping && displayed.length < about.length) {
      // Skip to end
      setIsSkipping(true);
      setPausedAt(performance.now());
    } else if (isSkipping) {
      // Resume animation from where it would have been
      if (pausedAt !== null && startTime !== null) {
        const elapsed = pausedAt - startTime;
        const charsToShow = Math.floor(elapsed / TYPING_SPEED);
        // Calculate new start time so animation resumes as if uninterrupted
        setStartTime(performance.now() - charsToShow * TYPING_SPEED);
        setIsSkipping(false);
        setPausedAt(null);
        setAnimationDone(false);
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
  const overlays: OverlayConfig[] = [
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
  ];

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
        const isLink = animationDone && !fadeOut && (!!matchOverlay.onClick || !!matchOverlay.href);
        const handleOverlayClick = (e: React.MouseEvent) => {
          if (!isLink) return;
          if (matchOverlay && matchOverlay.onClick) return matchOverlay.onClick(e);
          if (matchOverlay && matchOverlay.href) {
            e.preventDefault();
            window.open(matchOverlay.href, '_blank', 'noopener');
          }
        };
        // On mobile, always add a modifier class for transform
        let className = isLink ? LINK_CLASSES[nextMatch] : '';
        if (forceTransform && className) className += ' about-link-flip';
        result.push(
          <span
            key={nextIdx + '-' + nextMatch}
            className={className}
            onClick={isLink ? handleOverlayClick : undefined}
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

  return (
    <div
      className="about-square-container"
      style={{
        opacity: fadeOut ? 0 : 1,
      }}
    >
      <div
        className="about-square-text"
        onClick={handleClick}
        title="Click to skip/resume animation"
        style={isMobile() ? { maxHeight: '80vh', overflowY: 'auto', WebkitOverflowScrolling: 'touch' } : {}}
      >
        {withOverlays}
      </div>
    </div>
  );
};

export default About; 