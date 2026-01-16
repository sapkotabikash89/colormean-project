'use client';

import { useEffect } from 'react';
import { isStaticColor } from '@/lib/color-linking-utils';

interface ColorPageGuardProps {
  hex: string;
  children: React.ReactNode;
}

export default function ColorPageGuard({ hex, children }: ColorPageGuardProps) {
  useEffect(() => {
    // Only redirect if we're certain this is not a static color
    // and we're not already on the universal picker page
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      
      // Don't redirect if we're already on the universal picker
      if (currentPath.includes('/html-color-picker')) {
        return;
      }
      
      // Check if the hex color exists in our static color database
      if (!isStaticColor(hex)) {
        // If not, redirect to the universal picker
        const cleanHex = hex.replace('#', '').toLowerCase();
        window.location.replace(`/html-color-picker?hex=${cleanHex}`);
      }
    }
  }, [hex]);

  // Render children immediately - redirect happens in background
  return <>{children}</>;
}