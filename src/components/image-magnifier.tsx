import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function ImageMagnifier({src, alt = 'Product Image', sizes, preload = false, eager = false}:{
  src: string;
  alt?: string;
  sizes: string;
  // Preload in the document head; only for the image visible on first paint (the LCP image)
  preload?: boolean;
  // Load now instead of when scrolled near, e.g. for the slides next to the visible one
  eager?: boolean;
}) {
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
    <div className="relative" style={{ aspectRatio: '1000/1500' }}>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover rounded-sm"
        preload={preload}
        loading={preload ? undefined : eager ? 'eager' : 'lazy'}
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
