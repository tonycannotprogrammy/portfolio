import React from 'react';
import '../styles/VideoPlayer.css';

const SocialSlotPage: React.FC = () => {
  return (
    <div
      className="video-player-root"
      style={{ background: '#fff', minHeight: '100vh', justifyContent: 'flex-start', position: 'relative' }}
    >
      {/* SocialSlot removed */}
      <div
        style={{
          fontFamily: 'Fira Mono, monospace',
          textTransform: 'lowercase',
          fontSize: '1.05rem',
          letterSpacing: '0.01em',
          color: '#444',
          textAlign: 'center',
          opacity: 0.85,
          fontWeight: 500,
          position: 'absolute',
          left: 0,
          right: 0,
          top: '80vh',
          margin: '0 auto',
          pointerEvents: 'none',
        }}
      >
        scroll to pick a social.
      </div>
    </div>
  );
};

export default SocialSlotPage; 