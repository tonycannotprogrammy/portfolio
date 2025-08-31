import React from 'react';

type Props = {
  onLinkClick?: React.MouseEventHandler<SVGElement>;
  isMobile?: boolean;
};

const SvgCardContent: React.FC<Props> = ({ onLinkClick, isMobile = false }) => {
  // Tunables for desktop vs mobile portrait
  const LEFT = isMobile ? 120 : 140;                // closer to left edge, but safe
  const RIGHT_EDGE = isMobile ? 1500 : 1560;        // extend a bit further to right
  const SAFE_RIGHT = isMobile ? 1480 : 1540;        // values sit slightly inside
  const NAME_Y = isMobile ? 330 : 340;
  const NAME_SIZE = isMobile ? 160 : 170;           // a tad smaller to prevent overflow
  const ROLE_Y = isMobile ? 150 : 160;
  const LABEL_Y1 = isMobile ? 710 : 720;
  const LABEL_Y2 = isMobile ? 850 : 860;
  const LABEL_SIZE = isMobile ? 90 : 90;
  const VALUE_SIZE = isMobile ? 90 : 90;
  const NAME_MARGIN = isMobile ? 20 : 24;           // keep a thin breathing room
  const NAME_WIDTH = RIGHT_EDGE - LEFT - NAME_MARGIN; // available width for the name

  return (
    <svg className="svg-card" viewBox="0 0 1700 1100" preserveAspectRatio="xMidYMid meet">
      <rect width="100%" height="100%" fill="#fff" />
      <g fontFamily="'Satoshi', Arial, sans-serif" fill="#000">
        {/* Role */}
        <text x={LEFT} y={ROLE_Y} fontSize={80} fontWeight={400} className="svg-role">designer.</text>

        {/* Name (single line, bold). Using an anchor just for the OSK segment */}
        {/* Fit-to-width name: adjust spacing only (no glyph squish) and keep a small margin */}
        <text x={LEFT} y={NAME_Y} fontSize={NAME_SIZE} fontWeight={700} textRendering="geometricPrecision" className="svg-name" textLength={NAME_WIDTH} lengthAdjust="spacing">
          TONY T
          <a href="http://www.oszko.com" target="_blank" rel="noopener noreferrer" onClick={onLinkClick}>
            <tspan>OSK</tspan>
          </a>
          ALIO
        </text>

        {/* Left labels */}
        <text x={LEFT} y={LABEL_Y1} fontSize={LABEL_SIZE} fontWeight={400} className="svg-label">contact</text>
        <text x={LEFT} y={LABEL_Y2} fontSize={LABEL_SIZE} fontWeight={400} className="svg-label">tel</text>

        {/* Right values (right-aligned). Wrap in <a> so hover works and links are clickable */}
        <a href="mailto:tony@tonytoskal.io" target="_blank" rel="noopener noreferrer" onClick={onLinkClick} className="svg-email">
          <text x={SAFE_RIGHT} y={LABEL_Y1} fontSize={VALUE_SIZE} fontWeight={400} textAnchor="end" className="svg-value svg-hover-underline">
            tony@tonytoskal.io
          </text>
        </a>
        <a href="tel:+436787903718" onClick={onLinkClick} className="svg-tel">
          <text x={SAFE_RIGHT} y={LABEL_Y2} fontSize={VALUE_SIZE} fontWeight={400} textAnchor="end" className="svg-value svg-hover-underline">
            0.678.790 37 18
          </text>
        </a>
      </g>
    </svg>
  );
};

export default SvgCardContent;
