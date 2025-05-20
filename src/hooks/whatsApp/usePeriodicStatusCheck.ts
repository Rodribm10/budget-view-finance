
import { useEffect } from 'react';

export const usePeriodicStatusCheck = (
  instancesCount: number,
  checkAllInstancesStatus: () => Promise<void>
) => {
  // Set up periodic status checks
  useEffect(() => {
    console.log("Setting up periodic status checks, current instances:", instancesCount);
    
    // Check status initially after a short delay to prevent immediate execution
    let initialCheck: NodeJS.Timeout;
    if (instancesCount > 0) {
      initialCheck = setTimeout(() => {
        console.log("Running initial status check");
        checkAllInstancesStatus();
      }, 1000);
    }

    // Set up interval for periodic checks (every 30 seconds)
    const interval = setInterval(() => {
      if (instancesCount > 0) {
        console.log("Running periodic status check");
        checkAllInstancesStatus();
      }
    }, 30000); // 30 seconds

    // Clean up interval and timeout when component unmounts
    return () => {
      clearInterval(interval);
      if (initialCheck) {
        clearTimeout(initialCheck);
      }
    };
  }, [instancesCount, checkAllInstancesStatus]);
};
