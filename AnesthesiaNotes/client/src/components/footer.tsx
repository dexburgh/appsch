export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-400">
              © 2024 Anaesthetic Ease. Professional medical documentation and billing.
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Quote to Cash - Without the Crash
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-400">POWERED BY</span>
            <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent tracking-wide">NEXPATH</span>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-slate-700 text-center">
          <p className="text-xs text-slate-500 uppercase tracking-widest">
            PRECISION • COMPLIANCE • CLARITY
          </p>
        </div>
      </div>
    </footer>
  );
}