import { useState, useEffect } from "react";
import { FileText, Wifi, WifiOff } from "lucide-react";
import nexPathLogoUrl from "@assets/purple logo_1755525518108.png";

export default function Header() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img 
                src={nexPathLogoUrl} 
                alt="Nexpath Logo" 
                className="h-12 w-auto"
                data-testid="icon-app-logo" 
              />
            </div>
            <div>
              <h1 className="text-xl font-medium text-white" data-testid="text-app-title">
                Anaesthetic Ease
              </h1>
              <p className="text-sm text-teal-300 font-medium tracking-wide" data-testid="text-app-subtitle">
                PRECISION. COMPLIANCE. CLARITY.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2" data-testid="status-connection">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-red-400'}`}>
              </div>
              <span className="text-sm text-slate-300">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <div 
                className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-slate-800 rounded-full flex items-center justify-center text-sm font-medium shadow-lg"
                data-testid="avatar-user"
              >
                DR
              </div>
              <span className="text-sm font-medium text-white" data-testid="text-user-name">
                Dr. Smith
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
