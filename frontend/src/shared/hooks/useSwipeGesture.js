import { useEffect, useRef } from "react";

export function useSwipeGesture({ onSwipeRight, onSwipeLeft, threshold = 80 } = {}) {
  const ref = useRef(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);

  useEffect(() => {
    const el = ref.current ?? document;

    function onStart(e) {
      const t = e.touches?.[0];
      if (!t) return;
      startX.current = t.clientX;
      startY.current = t.clientY;
      tracking.current = true;
    }

    function onEnd(e) {
      if (!tracking.current) return;
      tracking.current = false;
      const t = e.changedTouches?.[0];
      if (!t) return;
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      if (Math.abs(dy) > Math.abs(dx)) return;
      if (dx > threshold && onSwipeRight) onSwipeRight();
      else if (dx < -threshold && onSwipeLeft) onSwipeLeft();
    }

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [onSwipeRight, onSwipeLeft, threshold]);

  return ref;
}
