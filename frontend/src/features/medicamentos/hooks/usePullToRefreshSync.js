import { useState, useCallback } from 'react';

export function usePullToRefreshSync(onSync) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      if (onSync) {
        await onSync();
      } else {
        
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    } finally {
      setIsRefreshing(false);
    }
  }, [onSync]);

  return {
    isRefreshing,
    handleRefresh
  };
}
