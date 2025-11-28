import React, { useState, useRef } from 'react';

export default function ImageMagnifier({src}:{src:string}) {
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const imageRef = useRef<HTMLImageElement| null>(null);

  // Magnifier size
  const magnifierHeight = 300;
  const magnifierWidth = 300;
  const zoomLevel = 2.5;

  const handleMouseMove = (e:React.MouseEvent<HTMLImageElement, MouseEvent>) => {
    if (!imageRef.current) return;
    const elem = imageRef.current;
    const { top, left } = elem.getBoundingClientRect();

    // Calculate cursor position
    const relX = e.pageX - left - window.scrollX;
    const relY = e.pageY - top - window.scrollY;

    setXY([relX, relY]);
  };

  const handleMouseEnter = () => {
    if (!imageRef.current) return;
    const elem = imageRef.current;
    const { width, height } = elem.getBoundingClientRect();
    setSize([width, height]);
    setShowMagnifier(true);
  };

  return (
    <div className="relative">
      <img
        ref={imageRef}
        src={src}
        alt="Product Image"
        className="w-full h-full object-cover rounded-sm"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
      />

      {showMagnifier && (
      <>
        <div
            className="fixed z-50 top-28 right-40 hidden md:block"
          style={{
            // position: 'absolute',
            // left: `${ +200}px`,
            // top: `${+200}px`,
            width: "550px",
            height: "550px",
            opacity: 1,
            backgroundColor: 'white',
            backgroundImage: `url(${src})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2+150}px`,
            backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2+150}px`,
            pointerEvents: 'none',
          }}
        />
        <div
            className="fixed z-50 hidden md:block"
            style={{
            position: 'absolute',
            left: `${x - magnifierWidth / 2}px`,
            top: `${y - magnifierHeight / 2}px`,
            width: `${magnifierWidth}px`,
            height: `${magnifierHeight}px`,
            opacity: 0.3,
            border: '1px solid lightgray',
            backgroundColor: 'white',
            pointerEvents: 'none',
          }}
        />
        </>
      )}

    </div>
  );
};
