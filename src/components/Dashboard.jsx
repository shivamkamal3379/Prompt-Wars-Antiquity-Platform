import React, { useState } from 'react';
import CarbonCalculator from './CarbonCalculator';
import CircularProgress from './CircularProgress';
import AIAdvisor from './AIAdvisor';
import EcoTracker from './EcoTracker';
import { calculateEmissions, getEmissionStatus, BENCHMARKS } from '../utils/emissionUtils';
import { Leaf, Zap, Car, Plane, BarChart3, Globe, Sparkles } from 'lucide-react';

export default function Dashboard() {
  // Shared inputs state
  const [inputs, setInputs] = useState({
    electricity: 350,
    gas: 200,
    carDist: 600,
    carType: 'petrol',
    publicTransit: 15,
    flightsShort: 6,
    flightsLong: 10,
    diet: 'averageMeat'
  });

  // Calculate live values
  const emissions = calculateEmissions(inputs);
  const status = getEmissionStatus(emissions.total);

  // Percentages for bar breakdown
  const totalCategoryEmissions = Math.max(0.1, emissions.categories.energy + emissions.categories.transport + emissions.categories.flights + emissions.categories.diet);
  
  const categoriesData = [
    { 
      key: 'energy', 
      label: 'Home Energy', 
      value: emissions.categories.energy, 
      color: 'bg-sky-500', 
      icon: Zap,
      desc: 'Electricity & Gas heating'
    },
    { 
      key: 'transport', 
      label: 'Transportation', 
      value: emissions.categories.transport, 
      color: 'bg-gold-500', 
      icon: Car,
      desc: 'Commuting & public transit'
    },
    { 
      key: 'flights', 
      label: 'Aviation & Flights', 
      value: emissions.categories.flights, 
      color: 'bg-rose-500', 
      icon: Plane,
      desc: 'Air travel miles'
    },
    { 
      key: 'diet', 
      label: 'Dietary Impact', 
      value: emissions.categories.diet, 
      color: 'bg-eco-500', 
      icon: Leaf,
      desc: 'Food carbon intensity'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-fade-in">
      
      {/* Platform Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6 relative">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-gradient-to-br from-eco-500 to-eco-700 rounded-xl text-white shadow-lg shadow-eco-500/20">
              <Leaf size={24} />
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-eco-400 bg-clip-text text-transparent">
              Antiquity
            </h1>
          </div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            Carbon Footprint Awareness & Optimization Platform
          </p>
        </div>

        {/* Global Stats bar */}
        <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 p-3 rounded-2xl md:self-end">
          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">IPCC Target</span>
            <span className="text-xs font-bold text-eco-400">{BENCHMARKS.target} t CO₂e</span>
          </div>
          <div className="px-3 border-r border-slate-800">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Global Avg</span>
            <span className="text-xs font-bold text-slate-300">{BENCHMARKS.globalAverage} t CO₂e</span>
          </div>
          <div className="px-3">
            <span className="text-[9px] uppercase font-bold text-slate-500 tracking-wider block">Status Rating</span>
            <span className="text-xs font-bold text-gold-400 flex items-center gap-1">
              <Sparkles size={12} /> {status.badge}
            </span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (Calculator & Visual Meter) - 7 Grid Cols */}
        <div className="lg:col-span-7 space-y-8 flex flex-col justify-start">
          
          {/* Carbon Calculator */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <BarChart3 size={16} className="text-eco-400" /> 1. Input habits calculator
            </h2>
            <CarbonCalculator inputs={inputs} setInputs={setInputs} />
          </div>

          {/* Live Meter Gauge & Breakdown */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Globe size={16} className="text-eco-400" /> 2. Environmental Impact Meter
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 glass-panel p-6">
              
              {/* Circular Gauge - 5 Cols */}
              <div className="md:col-span-5 flex items-center justify-center">
                <CircularProgress value={emissions.total} max={15} status={status} />
              </div>
              
              {/* Category breakdown bars - 7 Cols */}
              <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-200">Category Breakdown</h3>
                  <p className="text-[10px] text-slate-400">Values are shown in annual metric tons of CO₂.</p>
                </div>

                <div className="space-y-3">
                  {categoriesData.map((category) => {
                    const percentage = Math.max(2, (category.value / totalCategoryEmissions) * 100);
                    return (
                      <div key={category.key} className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1.5 font-bold text-slate-300">
                            {React.createElement(category.icon, { className: 'text-slate-500', size: 13 })}
                            {category.label}
                          </span>
                          <span className="font-bold text-slate-200">
                            {category.value.toFixed(2)} t <span className="text-[9px] text-slate-500 font-normal">({Math.round(percentage)}%)</span>
                          </span>
                        </div>
                        <div className="w-full bg-slate-950/80 border border-slate-900 h-2.5 rounded-full overflow-hidden p-0.5">
                          <div
                            className={`h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-slate-800/80 pt-3 flex justify-between items-center text-[10px] text-slate-400">
                  <span>Standard EPA math factors</span>
                  <span className="font-bold text-eco-400 flex items-center gap-1">
                    <Sparkles size={11} /> Real-time Calculation
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Right Column (AI Advisor & Eco Action Tracker) - 5 Grid Cols */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-start">
          
          {/* AI Advisor Chat Box */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Sparkles size={16} className="text-eco-400" /> 3. Antiquity AI Advisor
            </h2>
            <AIAdvisor inputs={inputs} emissions={emissions} />
          </div>

          {/* Gamified Eco Action Tracker */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Leaf size={16} className="text-eco-400" /> 4. Daily Eco Challenges
            </h2>
            <EcoTracker />
          </div>

        </div>

      </main>

      {/* Footer copyright */}
      <footer className="text-center text-[10px] text-slate-600 border-t border-slate-900 pt-6 space-y-2">
        <p>© 2026 Antiquity Carbon Awareness Platform - Created for Google Developers PromptWars Virtual Main Challenge 3</p>
        <p className="flex flex-wrap items-center justify-center gap-2 font-semibold text-slate-500">
          <span>Designed & Engineered by <strong className="text-eco-400">Shivam Kamal</strong></span>
          <span className="text-slate-850">|</span>
          <a href="https://github.com/shivamkamal3379" target="_blank" rel="noopener noreferrer" className="hover:text-eco-400 hover:underline transition-all">GitHub</a>
          <span className="text-slate-850">|</span>
          <a href="https://www.linkedin.com/in/shivam-kamal-/" target="_blank" rel="noopener noreferrer" className="hover:text-eco-400 hover:underline transition-all">LinkedIn</a>
        </p>
      </footer>
    </div>
  );
}
