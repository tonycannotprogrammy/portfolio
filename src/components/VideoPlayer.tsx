import React, { useState, useEffect } from 'react';
import '../styles/VideoPlayer.css';

const VideoPlayer: React.FC = () => {
  const [dimmed, setDimmed] = useState(false);

  useEffect(() => {
    document.body.style.backgroundColor = dimmed ? '#111' : '#fff';
    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [dimmed]);

  const switchOff = '/switch-off.png';
  const switchOn = '/switch-on.png';

  return (
    <div className="video-player-root">
      <div className="video-player-message" style={{ fontSize: '1.05rem' }}>
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
        style={{ margin: '32px 0 0 0', cursor: 'pointer' }}
        onClick={() => setDimmed(d => !d)}
      >
        <img
          src={dimmed ? switchOff : switchOn}
          alt="Switch"
          className="switch-image"
        />
      </div>
    </div>
  );
};

export default VideoPlayer; 