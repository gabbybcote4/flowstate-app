import { useEffect } from 'react';

interface ScrollToTopProps {
  screenKey: string;
}

export function ScrollToTop({ screenKey }: ScrollToTopProps) {
  useEffect(() => {
    // Smooth scroll to top when screen changes
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [screenKey]);

  return null;
}
