import React, { useEffect, useRef } from 'react';

const PremierCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) {return;}

    const moveCursor = e => {
      const { clientX, clientY } = e;
      // Adjust these offsets to center the custom cursor element on the pointer
      const offsetX = 10;
      const offsetY = 10;
      cursor.style.transform = `translate(${clientX - offsetX}px, ${clientY - offsetY}px)`;
    };

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        background: 'linear-gradient(45deg, #ff0080, #ff8c00, #40e0d0, #8a2be2)',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        transition: 'transform 0.1s ease-out',
        zIndex: 9999,
      }}
    />
  );
};

export default PremierCursor;
