import React, { useState, useRef, useEffect } from 'react';
import '../styles/Card.css';
import qrcode from '../assets/qrcode.svg';

const Card: React.FC = () => {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [enter, setEnter] = useState(true); // For slide-in
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' && window.innerWidth > 812
  );
  const cardRef = useRef<HTMLDivElement>(null);

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
    const tiltStr = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
    return `${flip} ${tiltStr}`;
  };

  useEffect(() => {
    document.title = "tony's card";
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

  return (
    <>
      <div className="rotate-message">
        please rotate your device horizontally.
      </div>
      <div
        className="card-container"
        style={{
          position: 'relative',
          minHeight: '100vh',
          minWidth: '100vw',
          backgroundImage: isDesktop ? "url('/portrait.jpeg')" : 'none',
          backgroundSize: isDesktop ? 'cover' : undefined,
          backgroundPosition: isDesktop ? 'center' : undefined,
          backgroundRepeat: isDesktop ? 'no-repeat' : undefined
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
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
            <div className="business-card">
              <div className="bc-row bc-tight">
                <span className="aboutme-link">designer.</span>
              </div>
              <div className="bc-row bc-tight">
                <span className="bc-name">
                  TONY&nbsp;T
                  <a
                    href="http://www.oszko.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
                    aria-label="Secret Link"
                    tabIndex={-1}
                    onClick={stopFlip}
                  >
                    OSK
                  </a>
                  ALIO
                </span>
              </div>
              <div className="bc-row bc-space"></div>
              <div className="bc-row">
                <span className="bc-small">contact</span>
                <span className="bc-email">
                  <a href="mailto:tony@tonytoskal.io" onClick={stopFlip}>
                    tony@tonytoskal.io
                  </a>
                </span>
              </div>
              <div className="bc-row">
                <span className="bc-small">tel</span>
                <span className="bc-tel">
                  <a href="tel:+436787903718" onClick={stopFlip}>
                    0.678.790 37 18
                  </a>
                </span>
              </div>
            </div>
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
