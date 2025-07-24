import React, { useContext } from 'react';
import '../styles/VideoPlayer.css';
import { CursorContext } from '../App'; // Wir werden diesen Kontext erstellen

const VideoPlayer: React.FC = () => {
  const { setShowCursor } = useContext(CursorContext);

  return (
    <div className="video-player-root">
      <div 
        className="video-player-video"
        onMouseEnter={() => setShowCursor(false)}
        onMouseLeave={() => setShowCursor(true)}
      >
        <iframe
          src="https://www.youtube.com/embed/GXa732Mshx4"
          title="The Mundane Movie"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default VideoPlayer;