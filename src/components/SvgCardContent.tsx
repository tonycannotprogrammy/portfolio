import React from 'react';

type Props = {
  onLinkClick?: React.MouseEventHandler<SVGElement>;
};

const SvgCardContent: React.FC<Props> = ({ onLinkClick }) => {
  return (
    <svg className="svg-card" viewBox="0 0 1700 1100" preserveAspectRatio="xMidYMid meet">
      <rect width="100%" height="100%" fill="#fff" />
      <g fontFamily="'Satoshi', Arial, sans-serif" fill="#000">
        {/* Role */}
        <text x="160" y="160" fontSize="80" fontWeight={400} className="svg-role">designer.</text>

        {/* Name (single line, bold). Using an anchor just for the OSK segment */}
        <text x="160" y="340" fontSize="185" fontWeight={700} textRendering="geometricPrecision" className="svg-name">
          TONY T
          <a href="http://www.oszko.com" target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>
            <tspan>OSK</tspan>
          </a>
          ALIO
        </text>

        {/* Left labels */}
        <text x="160" y="720" fontSize="90" fontWeight={400} className="svg-label">contact</text>
        <text x="160" y="860" fontSize="90" fontWeight={400} className="svg-label">tel</text>

        {/* Right values (right-aligned). Wrap in <a> so hover works and links are clickable */}
        <a href="mailto:tony@tonytoskal.io" target="_blank" rel="noopener noreferrer" onClick={onLinkClick} className="svg-email">
          <text x="1540" y="720" fontSize="90" fontWeight={400} textAnchor="end" className="svg-value svg-hover-underline">
            tony@tonytoskal.io
          </text>
        </a>
        <a href="tel:+436787903718" onClick={onLinkClick} className="svg-tel">
          <text x="1540" y="860" fontSize="90" fontWeight={400} textAnchor="end" className="svg-value svg-hover-underline">
            0.678.790 37 18
          </text>
        </a>
      </g>
    </svg>
  );
};

export default SvgCardContent;
