import { useEffect, useRef } from 'react';

export function useVisibleObserver(
  root: HTMLElement | null,
  onVisible: (el: Element) => void,
) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!root) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            onVisible(entry.target);
          }
        }
      },
      {
        root,
        rootMargin: '500px',
        threshold: 0.01,
      },
    );

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [root, onVisible]);

  const observe = (el: Element | null) => {
    if (el && observerRef.current) {
      observerRef.current.observe(el);
    }
  };

  return observe;
}
