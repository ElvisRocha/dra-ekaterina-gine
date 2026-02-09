import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string })?.scrollTo;
    if (!scrollTo) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.state]);

  return null;
}
