
import { useEffect, useRef } from 'react';

export const usePeriodicStatusCheck = (
  instancesCount: number,
  checkAllInstancesStatus: () => Promise<void>,
  initialDelay: number = 1000,
  checkInterval: number = 30000
) => {
  const isFirstRun = useRef(true);

  // Set up periodic status checks
  useEffect(() => {
    console.log("Setting up periodic status checks, current instances:", instancesCount);
    
    // Check status initially after a short delay to prevent immediate execution
    let initialCheck: NodeJS.Timeout;
    if (instancesCount > 0) {
      initialCheck = setTimeout(() => {
        console.log("Running initial status check");
        checkAllInstancesStatus();
        isFirstRun.current = false;
      }, initialDelay);
    }

    // Set up interval for periodic checks
    const interval = setInterval(() => {
      if (instancesCount > 0) {
        console.log("Running periodic status check");
        checkAllInstancesStatus();
      }
    }, checkInterval);

    // Clean up interval and timeout when component unmounts
    return () => {
      clearInterval(interval);
      if (initialCheck) {
        clearTimeout(initialCheck);
      }
    };
  }, [instancesCount, checkAllInstancesStatus, initialDelay, checkInterval]);

  return {
    isFirstRun: isFirstRun.current
  };
};
