import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Menu.css';

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const toggle = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setOpen(v => !v);
  };

  const close = () => setOpen(false);

  return (
    <div className="mobile-menu" onClick={(e) => e.stopPropagation()}>
      <button
        aria-label={open ? 'Close menu' : 'Open menu'}
        className={`hamburger ${open ? 'open' : ''}`}
        onClick={toggle}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {open && (
        <div className="mobile-overlay" onClick={close}>
          <nav className={`mobile-nav ${open ? 'open' : ''}`} onClick={(e) => e.stopPropagation()}>
            <Link to="/" onClick={close} className={pathname==='/' ? 'active' : ''}>Card</Link>
            <Link to="/works" onClick={close} className={pathname==='/works' ? 'active' : ''}>Works</Link>
            <Link to="/about" onClick={close} className={pathname==='/about' ? 'active' : ''}>About</Link>
            <Link to="/links" onClick={close} className={pathname==='/links' ? 'active' : ''}>Links</Link>
          </nav>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
