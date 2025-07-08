import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AboutSquare.css';

const TYPING_SPEED = 7; // ms per character for faster reading speed

// Helper to get a random rotation between -8 and 8 degrees
function getRandomRotation() {
  return Math.random() * 16 - 8;
}

const About: React.FC = () => {
  const [about, setAbout] = useState('');
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

  // Fetch the about text
  useEffect(() => {
    fetch('/aboutMe.txt')
      .then((res) => res.text())
      .then((text) => setAbout(text));
    document.title = "tony's about";
  }, []);

  // Animation logic
  useEffect(() => {
    if (!about) return;
    setDisplayed('');
    setIsSkipping(false);
    setStartTime(performance.now());
    setPausedAt(null);
    setAnimationDone(false);
    setFrozenDisplay(null);
    overlayRotations.current = {}; // Reset rotations on new text
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
    img: string;
    onClick?: (e: React.MouseEvent) => void;
    href?: string;
  };
  const overlays: OverlayConfig[] = [
    {
      word: 'tony toskalio',
      img: '/card.png',
      onClick: handleNameClick,
      href: undefined,
    },
    {
      word: 'syπthesizer.',
      img: '/synth.png',
      onClick: undefined,
      href: 'https://synthesizer.cargo.site',
    },
    {
      word: 'htl donaustadt',
      img: '/htl.png',
      onClick: undefined,
      href: 'https://htl-donaustadt.at',
    },
  ];

  // Helper to process overlays in a single pass
  const renderTextWithOverlays = (text: string) => {
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
        if (overlayRotations.current[nextMatch] === undefined) {
          overlayRotations.current[nextMatch] = getRandomRotation();
        }
        const handleOverlayClick = (e: React.MouseEvent) => {
          if (!isLink) return;
          if (matchOverlay && matchOverlay.onClick) return matchOverlay.onClick(e);
          if (matchOverlay && matchOverlay.href) {
            e.preventDefault();
            window.open(matchOverlay.href, '_blank', 'noopener');
          }
        };
        // Add 'htl' class for htl donaustadt overlay
        const isHtl = nextMatch === 'htl donaustadt';
        result.push(
          <span
            key={nextIdx + '-' + nextMatch}
            style={isLink ? {
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
              position: 'relative',
              display: 'inline-block',
            } : {
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'default',
              position: 'relative',
              display: 'inline-block',
            }}
            onClick={isLink ? handleOverlayClick : undefined}
          >
            {isLink && (
              <img
                src={matchOverlay.img}
                alt={nextMatch}
                className={`overlay-img${isHtl ? ' htl' : ''}`}
                style={{
                  transform: `translate(-50%, -50%) rotate(${overlayRotations.current[nextMatch!]}deg)`
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = `translate(-50%, -50%) scale(1.25) rotate(${overlayRotations.current[nextMatch!]}deg)`;
                  (e.currentTarget as HTMLImageElement).style.filter = 'drop-shadow(0 4px 8px rgba(180,180,180,0.35))';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLImageElement).style.transform = `translate(-50%, -50%) rotate(${overlayRotations.current[nextMatch!]}deg)`;
                  (e.currentTarget as HTMLImageElement).style.filter = 'drop-shadow(0 2px 4px rgba(180,180,180,0.25))';
                }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{text.slice(nextIdx, nextIdx + nextMatch.length)}</span>
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
  const withOverlays = renderTextWithOverlays(textToDisplay);

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
      >
        {withOverlays}
      </div>
    </div>
  );
};

export default About; 