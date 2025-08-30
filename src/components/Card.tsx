import React, { useState, useRef, useEffect } from 'react';
import '../styles/Card.css';
import qrcode from '../assets/qrcode.svg';
import SvgCardContent from './SvgCardContent';

const Card: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enter, setEnter] = useState(true); // For slide-in
  const [scale, setScale] = useState(1);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth > 812
  );
  const cardRef = useRef<HTMLDivElement>(null);
  const businessRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLSpanElement>(null);
  const [nameWidth, setNameWidth] = useState<number | null>(null);
  const [baseWidth, setBaseWidth] = useState<number | null>(null);
  const [centerWidth, setCenterWidth] = useState<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();

    // Use a much larger margin for even more generous corners
    const margin = 500;

    const expandedRect = {
      left: rect.left - margin,
      top: rect.top - margin,
      right: rect.right + margin,
      bottom: rect.bottom + margin,
      width: rect.width + margin * 2,
      height: rect.height + margin * 2,
    };

    // Only apply tilt if mouse is within the expanded area
    if (
      e.clientX >= expandedRect.left &&
      e.clientX <= expandedRect.right &&
      e.clientY >= expandedRect.top &&
      e.clientY <= expandedRect.bottom
    ) {
      const x = e.clientX - expandedRect.left;
      const y = e.clientY - expandedRect.top;
      const centerX = expandedRect.width / 2;
      const centerY = expandedRect.height / 2;
      const maxTilt = 12;
      let rotateY = ((x - centerX) / centerX) * maxTilt;
      let rotateX = -((y - centerY) / centerY) * maxTilt;

      // Invert tilt when card is flipped
      if (flipped) {
        rotateX = -rotateX; // Invert only X axis
        // Do NOT invert rotateY
      }
      setTilt({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleCardClick = () => setFlipped(f => !f);

  const stopFlip: React.MouseEventHandler = (e) => {
    e.stopPropagation();
  };

  const getTransform = () => {
    const flip = flipped ? 'rotateY(180deg)' : '';
    if (!isDesktop) {
      // Disable tilt on mobile; only apply flip
      return `${flip}`.trim();
    }
    const tiltStr = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
    return `${flip} ${tiltStr}`;
  };

  useEffect(() => {
    document.title = "tony's card.";
    setEnter(true);
    const timer = setTimeout(() => setEnter(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth > 812);
    window.addEventListener('resize', checkDesktop);
    window.addEventListener('orientationchange', checkDesktop);
    checkDesktop();
    return () => {
      window.removeEventListener('resize', checkDesktop);
      window.removeEventListener('orientationchange', checkDesktop);
    };
  }, []);

  // Preload background images for smooth crossfade on flip
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = '/portrait.jpeg';
    img2.src = '/portrait_back.jpeg';
    return () => { /* noop cleanup */ };
  }, []);

  // Scale inner content to fit available width and height (base 500px width, measured base height)
  useEffect(() => {
    const el = businessRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    // Measure real unscaled inner width/height; no fixed BASE
    const update = () => {
      const cs = getComputedStyle(el);
      const padX = parseFloat(cs.paddingLeft || '0') + parseFloat(cs.paddingRight || '0');
      const padY = parseFloat(cs.paddingTop || '0') + parseFloat(cs.paddingBottom || '0');
      const availW = Math.max(0, el.clientWidth - padX);
      const availH = Math.max(0, el.clientHeight - padY);
      const baseW = inner.scrollWidth; // unscaled layout width
      const baseH = inner.scrollHeight; // unscaled layout height
      setBaseWidth(baseW);
      const sW = baseW > 0 ? (availW / baseW) : 1;
      const sH = baseH > 0 ? (availH / baseH) : 1;
      const s = Math.max(0.01, Math.min(1, sW, sH));
      setScale(s || 1);
      setCenterWidth(baseW * s);
    };
    update();
    // Ensure measurements run again after web fonts load (avoids FOUT-induced shifts)
    // @ts-ignore
    if (document.fonts && document.fonts.ready) {
      // @ts-ignore
      document.fonts.ready.then(update).catch(() => {});
    }
    const ro = new ResizeObserver(update);
    ro.observe(el);
    ro.observe(inner);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Measure name width to align left/right bounds for other rows
  useEffect(() => {
    const n = nameRef.current;
    if (!n) return;
    const update = () => setNameWidth(n.offsetWidth || null);
    update();
    // Re-measure after fonts load so width reflects final metrics
    // @ts-ignore
    if (document.fonts && document.fonts.ready) {
      // @ts-ignore
      document.fonts.ready.then(update).catch(() => {});
    }
    const ro = new ResizeObserver(update);
    ro.observe(n);
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, []);

  // Keep center column equal to the visual name width (scaled)
  useEffect(() => {
    if (nameWidth != null && !Number.isNaN(scale)) {
      setCenterWidth(nameWidth * scale);
    }
  }, [nameWidth, scale]);

  return (
    <>
      <div
        className="card-container"
        style={{
          position: 'relative',
          minHeight: '100vh',
          minWidth: '100vw',
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {isDesktop && (
          <>
            <div
              className="bg-layer"
              style={{
                backgroundImage: "url('/portrait.jpeg')",
                opacity: flipped ? 0 : 1,
              }}
              aria-hidden
            />
            <div
              className="bg-layer"
              style={{
                backgroundImage: "url('/portrait_back.jpeg')",
                opacity: flipped ? 1 : 0,
              }}
              aria-hidden
            />
          </>
        )}
        <div
        className={`card${flipped ? " flipped" : ""}${enter ? " card-enter-left" : ""}`}
          ref={cardRef}
          style={{
            transform: getTransform(),
            transition:
              enter
                ? 'transform 0.6s cubic-bezier(.77,0,.18,1)'
                : 'transform 0.25s cubic-bezier(.03,.98,.52,.99)',
          }}
          onClick={handleCardClick}
        >
          <div className="card-side front">
            <SvgCardContent onLinkClick={stopFlip} isMobile={!isDesktop} />
          </div>
          <div className="card-side back">
            <img
              src={qrcode}
              alt="QR Code localhost"
              style={{
                maxWidth: "50%",
                maxHeight: "50%",
                display: "block",
                margin: "0 auto"
              }}
            />
          </div>
        </div>
        <div className="tilt-hitbox tilt-hitbox-top" />
        <div className="tilt-hitbox tilt-hitbox-bottom" />
        <div className="tilt-hitbox tilt-hitbox-left" />
        <div className="tilt-hitbox tilt-hitbox-right" />
      </div>
    </>
  );
};

export default Card;
