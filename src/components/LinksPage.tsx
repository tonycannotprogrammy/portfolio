import React from 'react';

const SOCIAL_LINKS = [
  { name: 'linkedin', url: 'https://www.linkedin.com/in/thomas-dascaliuc-1284772b4' },
  { name: 'instagram', url: 'https://instagram.com/tonytoskalio' },
  { name: 'pinterest', url: 'https://at.pinterest.com/tonyalreadytaken/' },
  { name: 'github', url: 'https://github.com/tonycannotprogrammy' },
  { name: 'youtube', url: 'https://www.youtube.com/@totoskalio' },
  { name: 'spotify', url: 'https://open.spotify.com/user/krbnpobqjqta7b9n9ju0i5u94?si=af2c686941534e10' },
];

const LinksPage: React.FC = () => {
  return (
    <div className="links-page">
      <div className="links-list">
        {SOCIAL_LINKS.map(({ name, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-item"
          >
            {name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default LinksPage;
