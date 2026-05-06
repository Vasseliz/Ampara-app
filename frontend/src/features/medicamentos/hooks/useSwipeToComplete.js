import { useState, useCallback } from 'react';

export function useSwipeToComplete(onComplete, threshold = 100) {
  const [isTaken, setIsTaken] = useState(false);

  const handleDragEnd = useCallback((event, info) => {
    if (!isTaken && info.offset.x > threshold) {
      setIsTaken(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [isTaken, threshold, onComplete]);

  return {
    isTaken,
    handleDragEnd
  };
}
