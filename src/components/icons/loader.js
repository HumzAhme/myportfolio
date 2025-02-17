import React from 'react';

const IconLoader = () => (
  <svg
    id="logo"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    viewBox="0 0 84 96"
    width="84"
    height="96">
    <title>Loader Logo</title>
    {/* Shift everything slightly down-right to avoid clipping */}
    <g transform="translate(3,3)">
      {/* The hexagon shape */}
      <polygon
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        points="39 0 0 22 0 67 39 90 78 68 78 23"
      />
      {/* Position & scale the 'H' path so it sits near the center */}
      <g transform="translate(14,17) scale(4)">
        <path
          d="M1.88494 12V1.81818H4.03764V6.01918H8.40767V1.81818H10.5554V12H8.40767V7.79403H4.03764V12H1.88494Z"
          fill="currentColor"
        />
      </g>
    </g>
  </svg>
);

export default IconLoader;
