import { useState } from 'react';
import { Leaf, Sparkles, ArrowRight } from 'lucide-react';

/**
 * Cinematic introductory screen with delayed premium entry animations and fluid exits.
 */
export default function Welcome({ onEnter }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    // Smooth exit transition before unmounting
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  return (
    <div className={`fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-50 transition-all duration-700 ease-in-out ${
      isExiting ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100'
    }`}>
      
      {/* Background ambient radial glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-eco-500/10 rounded-full filter blur-[100px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[100px] animate-pulse-slow [animation-delay:2s]" />

      <div className="text-center space-y-8 max-w-xl px-6 relative z-10 flex flex-col items-center">
        
        {/* Glowing Leaf Logo Container */}
        <div className="p-4 bg-gradient-to-br from-eco-500/20 to-eco-700/5 border border-eco-500/30 rounded-3xl text-eco-400 shadow-2xl shadow-eco-500/10 mb-2 animate-scale-in flex items-center justify-center">
          <Leaf size={44} className="animate-pulse" />
        </div>

        {/* Minimalist Hook Line */}
        <p className="text-sm md:text-base font-medium text-slate-400 tracking-wider animate-slide-up [animation-delay:0.3s] opacity-0 select-none">
          “Our planet breathes. Every choice leaves a trace.”
        </p>

        {/* Spaced, Elegant Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-[0.25em] bg-gradient-to-r from-eco-400 via-slate-100 to-gold-400 bg-clip-text text-transparent uppercase select-none py-1.5 animate-slide-up [animation-delay:0.7s] opacity-0">
          Antiquity
        </h1>

        {/* Description/Intro */}
        <p className="text-xs text-slate-500 max-w-sm tracking-wide leading-relaxed animate-slide-up [animation-delay:1.1s] opacity-0 select-none">
          Understand, calculate, and optimize your carbon footprint using interactive gamification checkpoints and Google Gemini-powered sustainability intelligence.
        </p>

        {/* Enter Button */}
        <div className="pt-6 animate-slide-up [animation-delay:1.5s] opacity-0">
          <button
            onClick={handleStart}
            className="group btn-accent py-3.5 px-8 text-xs font-bold tracking-wider uppercase rounded-2xl flex items-center gap-3 border border-gold-400/20 bg-slate-900/40 backdrop-blur-md text-gold-300 hover:text-slate-950 hover:bg-gradient-to-r hover:from-gold-400 hover:to-eco-400 transition-all duration-300 shadow-xl shadow-gold-500/5 hover:shadow-eco-500/15"
          >
            Begin Your Journey
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-300 text-gold-500 group-hover:text-slate-950" />
          </button>
        </div>
      </div>

      {/* Creator & Powered By Footer */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 select-none animate-fade-in [animation-delay:1.8s] opacity-0">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
          <span className="text-slate-600 font-medium">Designed & Engineered by</span>
          <a 
            href="https://www.linkedin.com/in/shivam-kamal-/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-eco-400 font-extrabold hover:text-eco-300 transition-colors cursor-pointer"
          >
            Shivam Kamal
          </a>
        </div>
        <div className="flex items-center gap-2 text-[8px] text-slate-600 tracking-wider font-bold">
          <a href="https://github.com/shivamkamal3379" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 hover:underline transition-all cursor-pointer">GitHub</a>
          <span>•</span>
          <a href="https://www.linkedin.com/in/shivam-kamal-/" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 hover:underline transition-all cursor-pointer">LinkedIn</a>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-gold-500/80 font-bold"><Sparkles size={9} /> Gemini AI</span>
        </div>
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

Welcome.propTypes = {
  onEnter: PropTypes.func.isRequired,
};
