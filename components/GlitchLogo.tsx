'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface GlitchLogoProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  glitchInterval?: number; // in milliseconds
  glitchDuration?: number; // in milliseconds
}

const GlitchLogo: React.FC<GlitchLogoProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  glitchInterval = 3000, // glitch every 3 seconds
  glitchDuration = 400,   // glitch lasts 400ms
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      
      // Stop glitching after the duration
      setTimeout(() => {
        setIsGlitching(false);
      }, glitchDuration);
    }, glitchInterval);

    return () => clearInterval(interval);
  }, [glitchInterval, glitchDuration]);

  return (
    <div className={`relative ${className}`}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`rounded-full animate-float transition-all duration-75 ${
          isGlitching
            ? 'glitch-logo animate-pulse filter brightness-110 contrast-125 saturate-150'
            : ''
        }`}
        style={{
          transform: isGlitching
            ? `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px) scale(${0.98 + Math.random() * 0.04})`
            : 'translate(0, 0) scale(1)',
          filter: isGlitching
            ? `hue-rotate(${Math.random() * 360}deg) saturate(${1.2 + Math.random() * 0.8})`
            : 'none',
        }}
      />
      
      {/* Glitch overlay effects */}
      {isGlitching && (
        <>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="absolute top-0 left-0 rounded-full opacity-30 animate-pulse"
            style={{
              transform: `translate(${Math.random() * 6 - 3}px, ${Math.random() * 6 - 3}px)`,
              filter: 'hue-rotate(180deg) brightness(1.5) contrast(1.5)',
              mixBlendMode: 'screen',
            }}
          />
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="absolute top-0 left-0 rounded-full opacity-20 animate-pulse"
            style={{
              transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
              filter: 'hue-rotate(90deg) brightness(1.3) contrast(1.3)',
              mixBlendMode: 'multiply',
            }}
          />
        </>
      )}
    </div>
  );
};

export default GlitchLogo; 