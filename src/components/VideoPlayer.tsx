import React, { useState, useEffect, useRef } from 'react';
import '../styles/VideoPlayer.css';

const FLICKER_SEQUENCE = [
  '#111', '#fff', '#222', '#fff', '#111', '#fff', '#eee', '#fff', '#fff'
];

const VideoPlayer: React.FC = () => {
  const [dimmed, setDimmed] = useState(false);
  const [flicker, setFlicker] = useState(false);
  const [bg, setBg] = useState('#fff');
  const switchRef = useRef<HTMLDivElement>(null);
  const flickerTimeouts = useRef<number[]>([]);

  // Flicker effect when turning lights ON
  useEffect(() => {
    if (!dimmed && flicker) {
      FLICKER_SEQUENCE.forEach((color, i) => {
        const t = window.setTimeout(() => setBg(color), i * 60);
        flickerTimeouts.current.push(t);
      });
      const end = window.setTimeout(() => {
        setBg('#fff');
        setFlicker(false);
      }, FLICKER_SEQUENCE.length * 60 + 40);
      flickerTimeouts.current.push(end);
      return () => {
        flickerTimeouts.current.forEach(clearTimeout);
        flickerTimeouts.current = [];
      };
    }
  }, [flicker, dimmed]);

  // Set body background color to match dimming or flicker
  useEffect(() => {
    document.body.style.transition = 'background 0.7s cubic-bezier(.77,0,.18,1)';
    document.body.style.backgroundColor = bg;
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.transition = '';
    };
  }, [bg]);

  // Switch image sources (replace with your own if needed)
  const switchOff = '/switch-off.png'; // Place in public/
  const switchOn = '/switch-on.png'; // Place in public/

  // Handlers for top/bottom click zones (reversed logic)
  const handleTopClick = (e: React.MouseEvent) => {
    if (dimmed) {
      setFlicker(true);
      setDimmed(false); // Turn lights ON (with flicker)
      e.stopPropagation();
    }
  };
  const handleBottomClick = (e: React.MouseEvent) => {
    if (!dimmed) {
      setDimmed(true); // Turn lights OFF
      setBg('#111');
      e.stopPropagation();
    }
  };

  // When dimmed, set bg to dark (seamless)
  useEffect(() => {
    if (dimmed) setBg('#111');
    // If not dimmed and not flickering, ensure bg is white
    if (!dimmed && !flicker) setBg('#fff');
  }, [dimmed, flicker]);

  return (
    <div className="video-player-root">
      <div
        className="video-player-message"
        style={{ fontSize: '1.05rem' }}
      >
        you can dim the lights.
      </div>
      <div className="video-player-video" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', width: '90vw', maxWidth: 1000, minWidth: 360, margin: '0 auto' }}>
        <iframe
          src="https://www.youtube.com/embed/GXa732Mshx4"
          title="The Mundane Movie"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        />
      </div>
      <div
        className={`switch-container${!dimmed ? ' on' : ''}`}
        ref={switchRef}
        style={{ margin: '32px 0 0 0' }}
      >
        <img
          src={dimmed ? switchOff : switchOn}
          alt="Switch"
          className="switch-image"
        />
        <div className="glow-effect" />
        <div className="click-zone top-zone" onClick={handleTopClick} />
        <div className="click-zone bottom-zone" onClick={handleBottomClick} />
      </div>
    </div>
  );
};

export default VideoPlayer; 