import brandedSocialMediaPath from "@assets/branded social media_1755523660937.png";

export default function BrandingBanner() {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-8 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-4">
              BUILD PROFESSIONAL MEDICAL QUOTES
            </h2>
            <p className="text-lg text-slate-300 mb-4">
              Generate comprehensive quotes with procedure codes and specialized billing.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <span className="text-sm text-teal-300 font-semibold uppercase tracking-wide">
                Precision • Compliance • Clarity
              </span>
              <div className="h-px bg-slate-600 flex-1 hidden sm:block"></div>
              <span className="text-sm text-slate-400">POWERED BY</span>
              <span className="text-sm font-bold bg-gradient-to-r from-purple-400 to-teal-400 bg-clip-text text-transparent tracking-wider">NEXPATH</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-teal-400/20 rounded-xl blur-lg"></div>
              <img 
                src={brandedSocialMediaPath} 
                alt="Professional Medical Quotes" 
                className="relative rounded-xl shadow-2xl border border-slate-700 max-w-md w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}