import React, { useEffect } from 'react';
import '../styles/VideoPlayer.css';

const SOCIAL_LINKS = [
  { name: 'linkedin', url: 'https://www.linkedin.com/in/thomas-dascaliuc-1284772b4', color: '#0077b5' },
  { name: 'instagram', url: 'https://instagram.com/tonytoskalio', color: '#e4405f', gradient: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)' },
  { name: 'pinterest', url: 'https://at.pinterest.com/tonyalreadytaken/', color: '#e60023' },
  { name: 'github', url: 'https://github.com/tonycannotprogrammy', color: '#333' },
  { name: 'youtube', url: 'https://www.youtube.com/@totoskalio', color: '#ff0000' },
  { name: 'spotify', url: 'https://open.spotify.com/user/krbnpobqjqta7b9n9ju0i5u94?si=af2c686941534e10', color: '#1db954' },
];

const SocialSlotPage: React.FC = () => {
  const isMobile = typeof window !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div
      className="video-player-root"
      style={{ 
        background: '#fff', 
        height: '100vh',
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4vh 4vw',
        fontFamily: 'Satoshi, sans-serif',
        overflow: 'hidden'
      }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '400px',
        alignItems: 'center'
      }}>
        {SOCIAL_LINKS.map((social, index) => (
          <a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.8rem 0',
              width: '100%',
              textDecoration: 'none',
              color: isMobile ? (social.gradient ? 'transparent' : social.color) : '#333',
              fontWeight: 600,
              fontSize: '2rem',
              fontFamily: 'Satoshi, sans-serif',
              transition: 'all 0.3s ease',
              borderBottom: '1px solid transparent',
              cursor: 'pointer',
              gap: '2rem',
              transform: 'scale(1)',
              ...(isMobile && social.gradient && {
                background: social.gradient,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              })
            }}
            onMouseEnter={(e) => {
              if (!isMobile) {
                e.currentTarget.style.color = social.color;
                e.currentTarget.style.transform = 'scale(1.1)';
                const arrow = e.currentTarget.querySelector('.arrow') as HTMLElement;
                if (arrow) arrow.style.transform = 'translateX(8px)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMobile) {
                e.currentTarget.style.color = '#333';
                e.currentTarget.style.transform = 'scale(1)';
                const arrow = e.currentTarget.querySelector('.arrow') as HTMLElement;
                if (arrow) arrow.style.transform = 'translateX(0)';
              }
            }}
          >
            <span>{social.name}</span>
            <span 
              className="arrow"
              style={{ 
                fontSize: '1rem', 
                opacity: 0.6,
                transition: 'all 0.3s ease',
                color: isMobile ? (social.gradient ? 'transparent' : social.color) : 'inherit',
                ...(isMobile && social.gradient && {
                  background: social.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                })
              }}
            >
              →
            </span>
          </a>
        ))}
      </div>
    </div>
  );
};

export default SocialSlotPage; 