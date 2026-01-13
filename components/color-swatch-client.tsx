'use client';

import { useEffect, useState } from 'react';

interface ColorSwatchClientProps {
  hex: string;
  width?: number;
  height?: number;
  showText?: boolean;
}

export default function ColorSwatchClient({ hex, width = 1200, height = 630, showText = true }: ColorSwatchClientProps) {
  const [rgb, setRgb] = useState<{ r: number; g: number; b: number } | null>(null);
  const [textColor, setTextColor] = useState<string>('#000000');

  // Helper functions
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const getContrastColor = (hex: string): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

  useEffect(() => {
    const rgbValue = hexToRgb(hex);
    if (rgbValue) {
      setRgb(rgbValue);
      setTextColor(getContrastColor(hex));
    }
  }, [hex]);

  if (!rgb) {
    return (
      <div 
        style={{
          width: `${width}px`,
          height: `${height}px`,
          backgroundColor: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000000',
          fontSize: '48px',
        }}
      >
        Invalid Color
      </div>
    );
  }

  const rgbText = `RGB(${rgb.r},${rgb.g},${rgb.b})`;

  return (
    <div 
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: hex,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      {showText && (
        <>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            marginTop: '-20px'
          }}>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: textColor,
                letterSpacing: '0.05em',
                marginBottom: 20,
              }}
            >
              {hex.toUpperCase()}
            </div>
            <div
              style={{
                fontSize: 40,
                fontWeight: 400,
                color: textColor,
                letterSpacing: '0em',
              }}
            >
              {rgbText}
            </div>
          </div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 40,
              fontWeight: 700,
              color: textColor === '#FFFFFF' ? '#000000' : '#FFFFFF',
              opacity: 0.35,
            }}
          >
            ColorMean
          </div>
        </>
      )}
    </div>
  );
}