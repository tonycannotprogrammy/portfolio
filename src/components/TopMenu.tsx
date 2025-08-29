import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Menu.css';

const TopMenu: React.FC = () => {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `nav-link${isActive ? ' active' : ''}`;

  return (
    <div className="top-left-nav">
      <NavLink to="/" className={linkClass} end>
        Card
      </NavLink>
      {" / "}
      <NavLink to="/works" className={linkClass}>
        Works
      </NavLink>
      {" / "}
      <NavLink to="/about" className={linkClass}>
        About
      </NavLink>
      {" / "}
      <NavLink to="/links" className={linkClass}>
        Links
      </NavLink>
    </div>
  );
};

export default TopMenu;
