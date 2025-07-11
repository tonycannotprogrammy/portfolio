import React from 'react';
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

const LINK_CLASSES = {
  'tony toskalio': 'about-link-tony',
  'syπthesizer.': 'about-link-synth',
  'htl donaustadt': 'about-link-htl',
  'social': 'about-link-social',
  'drawing': 'about-link-drawing',
  'the mundane': 'about-link-mundane',
  'graphic and logo design': 'about-link-graphic',
  'photography': 'about-link-photo',
};

const OVERLAYS = [
  { word: 'tony toskalio', onClick: (navigate: (path: string) => void, displayed: string, setFrozenDisplay: React.Dispatch<React.SetStateAction<string | null>>) => (e: React.MouseEvent) => { e.preventDefault(); setFrozenDisplay(displayed); setTimeout(() => navigate('/'), 600); } },
  { word: 'syπthesizer.', href: 'https://synthesizer.cargo.site' },
  { word: 'htl donaustadt', href: 'https://htl-donaustadt.at' },
  { word: 'social', href: '/socials' },
  { word: 'drawing', href: '#' },
  { word: 'the mundane', href: '/mundane' },
  { word: 'graphic and logo design', href: '#' },
  { word: 'photography', href: '#' },
];

const About: React.FC = () => {
  const [displayed, setDisplayed] = React.useState<string>('');
  const [isSkipping, setIsSkipping] = React.useState<boolean>(false);
  const [startTime, setStartTime] = React.useState<number | null>(null);
  const [frozenDisplay, setFrozenDisplay] = React.useState<string | null>(null);
  const [showLinksList, setShowLinksList] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const lastCharRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    setDisplayed('');
    setIsSkipping(false);
    setStartTime(performance.now());
    setFrozenDisplay(null);
    document.title = 'about tony.';
  }, []);

  React.useEffect(() => {
    if (isSkipping) {
      setDisplayed(ABOUT_TEXT);
      return;
    }
    let raf: number;
    const animate = (now: number) => {
      let charsToShow = Math.min(ABOUT_TEXT.length, Math.floor((now - (startTime ?? now)) / TYPING_SPEED));
      setDisplayed(ABOUT_TEXT.slice(0, charsToShow));
      if (charsToShow < ABOUT_TEXT.length) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => { if (raf) cancelAnimationFrame(raf); };
  }, [isSkipping, startTime]);

  // On click: if animating, skip; if done, toggle links/text (mobile only)
  const handleTextClick = () => {
    if (!isSkipping && displayed.length < ABOUT_TEXT.length) {
      setIsSkipping(true);
    } else if (isMobile()) {
      // Only toggle links list on mobile
      setShowLinksList(l => !l);
    }
  };

  const renderTextWithOverlays = (text: string) => {
    let result: React.ReactNode[] = [], i = 0;
    while (i < text.length) {
      let nextMatch: string | null = null, nextIdx = text.length, matchOverlay: any = null;
      for (const overlay of OVERLAYS) {
        const idx = text.toLowerCase().indexOf(overlay.word.toLowerCase(), i);
        if (idx !== -1 && idx < nextIdx) { nextIdx = idx; nextMatch = overlay.word; matchOverlay = overlay; }
      }
      if (nextMatch && matchOverlay) {
        if (nextIdx > i) result.push(text.slice(i, nextIdx));
        let className = nextMatch in LINK_CLASSES ? LINK_CLASSES[nextMatch as keyof typeof LINK_CLASSES] : '';
        const content = text.slice(nextIdx, nextIdx + nextMatch.length);
        if (matchOverlay.href) {
          result.push(
            <a
              key={nextIdx + '-' + nextMatch}
              className={className}
              href={matchOverlay.href}
              target={matchOverlay.href.startsWith('http') ? '_blank' : undefined}
              rel={matchOverlay.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
              onClick={matchOverlay.href.startsWith('/') ? (e) => { e.preventDefault(); navigate(matchOverlay.href); } : undefined}
            >
              {content}
            </a>
          );
        } else if (matchOverlay.onClick) {
          result.push(
            <span
              key={nextIdx + '-' + nextMatch}
              className={className}
              onClick={matchOverlay.onClick(navigate, displayed, setFrozenDisplay)}
              style={{ textDecoration: 'none', cursor: 'pointer' }}
            >
              {content}
            </span>
          );
        } else {
          result.push(content);
        }
        i = nextIdx + nextMatch.length;
      } else {
        result.push(text.slice(i));
        break;
      }
    }
    return result;
  };

  const textToDisplay = frozenDisplay !== null ? frozenDisplay : displayed;

  // Render all overlays as a vertical list of links
  const renderLinksList = () => {
    const isHorizontalMobile = isMobile() && isLandscape();
    
    if (isHorizontalMobile) {
      // Horizontal mobile layout: wrapped rows of links
      return (
        <div style={{ 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'row', 
          flexWrap: 'wrap',
          alignItems: 'center', 
          justifyContent: 'space-between',
          gap: '1vw',
          padding: '1vw 0',
        }}>
          {OVERLAYS.filter(o => o.href || o.onClick).map((overlay, idx) => {
            const className = overlay.word in LINK_CLASSES ? LINK_CLASSES[overlay.word as keyof typeof LINK_CLASSES] : '';
            const linkStyle = {
              textDecoration: 'none',
              cursor: 'pointer',
              display: 'inline-block',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem, 4vw, 2.2rem)', // responsive font size for horizontal
              lineHeight: 1.2,
              margin: 0,
              padding: '0.5vw 1vw',
              whiteSpace: 'nowrap',
              flex: '0 1 auto',
            };
            if (overlay.href) {
              return (
                <a
                  key={overlay.word}
                  className={className}
                  href={overlay.href}
                  target={overlay.href.startsWith('http') ? '_blank' : undefined}
                  rel={overlay.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  style={linkStyle}
                  onClick={overlay.href.startsWith('/') ? (e) => { e.preventDefault(); navigate(overlay.href); } : undefined}
                >
                  {overlay.word}
                </a>
              );
            } else if (overlay.onClick) {
              return (
                <span
                  key={overlay.word}
                  className={className}
                  onClick={overlay.onClick(navigate, displayed, setFrozenDisplay)}
                  style={linkStyle}
                >
                  {overlay.word}
                </span>
              );
            }
            return null;
          })}
        </div>
      );
    }
    
    // Default vertical layout
    return (
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
        {OVERLAYS.filter(o => o.href || o.onClick).map((overlay, idx) => {
          const className = overlay.word in LINK_CLASSES ? LINK_CLASSES[overlay.word as keyof typeof LINK_CLASSES] : '';
          const linkStyle = {
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'block',
            fontWeight: 700,
            fontSize: '1.7rem', // match about text size
            lineHeight: 1.3,
            margin: '0 0 0.7em 0',
            textAlign: 'justify' as const,
            width: '100%',
            wordBreak: 'break-word' as const,
          };
          if (overlay.href) {
            return (
              <a
                key={overlay.word}
                className={className}
                href={overlay.href}
                target={overlay.href.startsWith('http') ? '_blank' : undefined}
                rel={overlay.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                style={linkStyle}
                onClick={overlay.href.startsWith('/') ? (e) => { e.preventDefault(); navigate(overlay.href); } : undefined}
              >
                {overlay.word}
              </a>
            );
          } else if (overlay.onClick) {
            return (
              <span
                key={overlay.word}
                className={className}
                onClick={overlay.onClick(navigate, displayed, setFrozenDisplay)}
                style={linkStyle}
              >
                {overlay.word}
              </span>
            );
          }
          return null;
        })}
      </div>
    );
  };

  return (
    <div className="about-square-container" style={{ minHeight: '100vh', minWidth: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="about-square-text" style={{ width: '100%', background: 'rgba(255,255,255,0.98)', borderRadius: 18, padding: '4vw 3vw', cursor: 'pointer' }} onClick={handleTextClick}>
        {showLinksList ? renderLinksList() : (
          <>
            {renderTextWithOverlays(textToDisplay)}
            <span ref={lastCharRef} />
          </>
        )}
      </div>
    </div>
  );
};

export default About; 