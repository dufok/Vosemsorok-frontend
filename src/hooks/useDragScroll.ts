import { useRef, useCallback } from 'react';

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    dragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = ref.current.scrollLeft;
    ref.current.style.cursor = 'grabbing';
    ref.current.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current || !ref.current) return;
    e.preventDefault();
    const dx = e.clientX - startX.current;
    ref.current.scrollLeft = scrollLeft.current - dx * 1.5;
  }, []);

  const stop = useCallback(() => {
    dragging.current = false;
    if (ref.current) {
      ref.current.style.cursor = 'grab';
      ref.current.style.userSelect = '';
    }
  }, []);

  return { ref, onMouseDown, onMouseMove, onMouseUp: stop, onMouseLeave: stop };
}
