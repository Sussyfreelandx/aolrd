import { useState, useEffect } from 'react';

export const BREAKPOINTS = {
  MOBILE: 768,
  DESKTOP: 1024,
} as const;

interface ScreenSize {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const useScreenSize = (): ScreenSize => {
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.DESKTOP,
    height: typeof window !== 'undefined' ? window.innerHeight : BREAKPOINTS.MOBILE,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < BREAKPOINTS.MOBILE : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.MOBILE && window.innerWidth < BREAKPOINTS.DESKTOP : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= BREAKPOINTS.DESKTOP : true,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < BREAKPOINTS.MOBILE,
        isTablet: width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.DESKTOP,
        isDesktop: width >= BREAKPOINTS.DESKTOP,
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Call handler right away so state gets updated with initial window size
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};