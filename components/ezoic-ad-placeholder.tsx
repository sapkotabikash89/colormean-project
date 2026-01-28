"use client";

import { useEffect } from 'react';

// Extend Window interface for Ezoic
declare global {
  interface Window {
    ezstandalone?: {
      cmd: Array<() => void>;
      refresh?: () => void;
    };
  }
}

interface EzoicAdPlaceholderProps {
  id: string;
  minHeight?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Ezoic Ad Placeholder Component
 * 
 * Provides semantic ad containers that reserve space to prevent layout shift
 * and ensure smooth ad loading. Place strategically throughout content.
 * 
 * Usage examples:
 * - After content intro
 * - Mid-content sections  
 * - End of content
 * - Sidebar placements
 */
export function EzoicAdPlaceholder({ 
  id, 
  minHeight = '250px', 
  className = '',
  children 
}: EzoicAdPlaceholderProps) {
  useEffect(() => {
    // Ensure Ezoic can properly target this container
    if (typeof window !== 'undefined' && window.ezstandalone) {
      window.ezstandalone.cmd.push(function() {
        // Trigger Ezoic to check for new ad slots
        if (window.ezstandalone.refresh) {
          window.ezstandalone.refresh();
        }
      });
    }
  }, [id]);

  return (
    <div 
      id={id}
      className={`ezoic-ad-placeholder ${className}`}
      style={{ 
        minHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        borderRadius: '4px',
        margin: '1rem 0'
      }}
    >
      {/* Optional fallback content while ads load */}
      {children || (
        <div 
          style={{ 
            color: 'transparent',
            fontSize: '12px',
            textAlign: 'center',
            width: '100%'
          }}
        >
          Advertisement
        </div>
      )}
    </div>
  );
}

// Predefined ad placement components for common positions
export function IntroAd() {
  return (
    <EzoicAdPlaceholder 
      id="ezoic-pub-ad-placeholder-101" 
      minHeight="280px"
      className="intro-ad"
    />
  );
}

export function MidContentAd() {
  return (
    <EzoicAdPlaceholder 
      id="ezoic-pub-ad-placeholder-102" 
      minHeight="250px"
      className="mid-content-ad"
    />
  );
}

export function EndContentAd() {
  return (
    <EzoicAdPlaceholder 
      id="ezoic-pub-ad-placeholder-103" 
      minHeight="250px"
      className="end-content-ad"
    />
  );
}

export function SidebarAd() {
  return (
    <EzoicAdPlaceholder 
      id="ezoic-pub-ad-placeholder-201" 
      minHeight="600px"
      className="sidebar-ad"
    />
  );
}