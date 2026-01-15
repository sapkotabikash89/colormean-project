'use client';

import { useEffect } from 'react';
import { isStaticColor } from '@/lib/color-linking-utils';

interface ColorPageGuardProps {
  hex: string;
  children: React.ReactNode;
}

export default function ColorPageGuard({ hex, children }: ColorPageGuardProps) {
  useEffect(() => {
    // Check if the hex color exists in our static color database
    if (!isStaticColor(hex)) {
      // If not, redirect to the universal picker
      const cleanHex = hex.replace('#', '').toLowerCase();
      window.location.replace(`/html-color-picker?hex=${cleanHex}`);
    }
  }, [hex]);

  // Only render children if the color is valid (will redirect otherwise)
  return <>{children}</>;
}