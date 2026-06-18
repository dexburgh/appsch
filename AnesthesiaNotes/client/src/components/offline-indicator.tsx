import { useState, useEffect } from "react";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!showOfflineMessage) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50" data-testid="offline-indicator">
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-3 rounded-lg shadow-lg">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-5 h-5" />
          <span className="text-sm font-medium">Working Offline</span>
        </div>
        <p className="text-xs mt-1 opacity-90">
          Data will sync when connection is restored
        </p>
      </div>
    </div>
  );
}
