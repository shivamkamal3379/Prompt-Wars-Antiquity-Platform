import React, { useState } from 'react';
import { Zap, Flame, Car, Plane, Leaf, ArrowLeft, ArrowRight, Sparkles, Train } from 'lucide-react';

const STEPS = [
  { id: 'energy', title: 'Energy & Heating', icon: Zap },
  { id: 'commute', title: 'Commute & Travel', icon: Car },
  { id: 'flights', title: 'Aviation', icon: Plane },
  { id: 'diet', title: 'Dietary Habits', icon: Leaf },
];

export default function CarbonCalculator({ inputs, setInputs }) {
  const [activeStep, setActiveStep] = useState(0);

  const handleInputChange = (key, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const currentStepId = STEPS[activeStep].id;

  const handleNext = () => {
    if (activeStep < STEPS.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const renderEnergyStep = () => (
    <div className="space-y-6 animate-scale-in">
      <p className="text-sm text-slate-400">
        Enter your household's monthly energy consumption. Clean energy sources significantly reduce your electricity baseline.
      </p>

      {/* Electricity Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
            <Zap size={16} />
            Electricity Usage (kWh/month)
          </label>
          <input
            type="number"
            value={inputs.electricity}
            onChange={(e) => handleInputChange('electricity', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1500"
          step="10"
          value={inputs.electricity}
          onChange={(e) => handleInputChange('electricity', parseInt(e.target.value))}
          className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>0 kWh (Solar/Off-grid)</span>
          <span>750 kWh</span>
          <span>1500 kWh (High)</span>
        </div>
      </div>

      {/* Gas / Heating Input */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
            <Flame size={16} />
            Heating & Gas (kWh/month)
          </label>
          <input
            type="number"
            value={inputs.gas}
            onChange={(e) => handleInputChange('gas', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1500"
          step="10"
          value={inputs.gas}
          onChange={(e) => handleInputChange('gas', parseInt(e.target.value))}
          className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>0 kWh (Electric/Heat-pump)</span>
          <span>750 kWh</span>
          <span>1500 kWh</span>
        </div>
      </div>
    </div>
  );

  const renderCommuteStep = () => {
    const carTypes = [
      { id: 'none', label: 'No Car', desc: 'Walk, cycle, or none' },
      { id: 'electric', label: 'Electric', desc: 'EV clean drive' },
      { id: 'hybrid', label: 'Hybrid', desc: 'Gas + Electric' },
      { id: 'petrol', label: 'Petrol', desc: 'Standard gasoline' },
      { id: 'diesel', label: 'Diesel', desc: 'High torque & fuel' }
    ];

    return (
      <div className="space-y-6 animate-scale-in">
        <p className="text-sm text-slate-400">
          How do you move around? Swapping vehicle drives or increasing public transit yields the largest emission cuts.
        </p>

        {/* Car Fuel Type Cards */}
        <div className="space-y-2">
          <label className="text-sm font-semibold block text-eco-300">Primary Car Engine</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {carTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleInputChange('carType', type.id)}
                className={`p-2.5 rounded-xl border text-center transition-all duration-200 flex flex-col items-center justify-center gap-1 ${
                  inputs.carType === type.id
                    ? 'border-eco-500 bg-eco-950/40 text-eco-300 shadow-md shadow-eco-500/10'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-400 hover:border-slate-700/60'
                }`}
              >
                <Car size={16} className={inputs.carType === type.id ? 'text-eco-400' : 'text-slate-500'} />
                <span className="text-xs font-bold block">{type.label}</span>
                <span className="text-[9px] text-slate-500 hidden sm:inline">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Car Mileage Slider (only if not 'none') */}
        {inputs.carType !== 'none' && (
          <div className="space-y-2 animate-scale-in">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
                <Car size={16} />
                Car Commute Distance (km/month)
              </label>
              <input
                type="number"
                value={inputs.carDist}
                onChange={(e) => handleInputChange('carDist', Math.max(0, parseInt(e.target.value) || 0))}
                className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
              />
            </div>
            <input
              type="range"
              min="0"
              max="3000"
              step="50"
              value={inputs.carDist}
              onChange={(e) => handleInputChange('carDist', parseInt(e.target.value))}
              className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
              <span>0 km</span>
              <span>1500 km</span>
              <span>3000 km (High)</span>
            </div>
          </div>
        )}

        {/* Public transit hours */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
              <Train size={16} />
              Public Transit Travel (hours/month)
            </label>
            <input
              type="number"
              value={inputs.publicTransit}
              onChange={(e) => handleInputChange('publicTransit', Math.max(0, parseInt(e.target.value) || 0))}
              className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
            />
          </div>
          <input
            type="range"
            min="0"
            max="150"
            step="2"
            value={inputs.publicTransit}
            onChange={(e) => handleInputChange('publicTransit', parseInt(e.target.value))}
            className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
            <span>0 hrs (No transit)</span>
            <span>75 hrs</span>
            <span>150 hrs (Commuter)</span>
          </div>
        </div>
      </div>
    );
  };

  const renderFlightsStep = () => (
    <div className="space-y-6 animate-scale-in">
      <p className="text-sm text-slate-400">
        Aircraft emissions remain in the upper atmosphere, doubling their warming effect. Record your average annual flight hours.
      </p>

      {/* Short Haul Flights */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
            <Plane size={16} className="rotate-45" />
            Short-Haul Flights (hours/year)
          </label>
          <input
            type="number"
            value={inputs.flightsShort}
            onChange={(e) => handleInputChange('flightsShort', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
          />
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={inputs.flightsShort}
          onChange={(e) => handleInputChange('flightsShort', parseInt(e.target.value))}
          className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>0 hrs (Flightless)</span>
          <span>50 hrs</span>
          <span>100 hrs (Frequent flyer)</span>
        </div>
      </div>

      {/* Long Haul Flights */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-semibold flex items-center gap-2 text-eco-300">
            <Plane size={16} />
            Long-Haul Flights (hours/year)
          </label>
          <input
            type="number"
            value={inputs.flightsLong}
            onChange={(e) => handleInputChange('flightsLong', Math.max(0, parseInt(e.target.value) || 0))}
            className="w-20 text-right glass-input py-1 px-2 text-sm font-bold border-slate-700/80"
          />
        </div>
        <input
          type="range"
          min="0"
          max="200"
          step="5"
          value={inputs.flightsLong}
          onChange={(e) => handleInputChange('flightsLong', parseInt(e.target.value))}
          className="w-full accent-eco-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span>0 hrs</span>
          <span>100 hrs</span>
          <span>200 hrs (Intercontinental)</span>
        </div>
      </div>
    </div>
  );

  const renderDietStep = () => {
    const diets = [
      { id: 'vegan', label: 'Vegan', desc: 'No animal products', emissions: '1.5 t CO₂e/yr' },
      { id: 'vegetarian', label: 'Vegetarian', desc: 'Dairy & eggs, no meat', emissions: '1.7 t CO₂e/yr' },
      { id: 'pescatarian', label: 'Pescatarian', desc: 'Seafood, no red meat', emissions: '1.9 t CO₂e/yr' },
      { id: 'averageMeat', label: 'Average Meat', desc: 'Balanced diet', emissions: '2.5 t CO₂e/yr' },
      { id: 'heavyMeat', label: 'Heavy Meat', desc: 'Regular red meat eating', emissions: '3.3 t CO₂e/yr' }
    ];

    return (
      <div className="space-y-4 animate-scale-in">
        <p className="text-sm text-slate-400">
          The agricultural sector is responsible for 25% of global emissions. Switching diets reduces carbon and water usage.
        </p>

        <div className="flex flex-col gap-2.5">
          {diets.map((diet) => (
            <button
              key={diet.id}
              type="button"
              onClick={() => handleInputChange('diet', diet.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 flex items-center justify-between gap-3 ${
                inputs.diet === diet.id
                  ? 'border-eco-500 bg-eco-950/30 text-eco-300 shadow-md shadow-eco-500/10'
                  : 'border-slate-800/80 bg-slate-900/20 text-slate-400 hover:border-slate-700/60 hover:bg-slate-900/30'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${inputs.diet === diet.id ? 'bg-eco-500/20 text-eco-400' : 'bg-slate-850 text-slate-500'}`}>
                  <Leaf size={16} />
                </div>
                <div>
                  <span className="text-sm font-bold block">{diet.label}</span>
                  <span className="text-[10px] text-slate-500">{diet.desc}</span>
                </div>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${inputs.diet === diet.id ? 'bg-eco-500/10 text-eco-300' : 'bg-slate-850 text-slate-400'}`}>
                {diet.emissions}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderActiveStep = () => {
    switch (currentStepId) {
      case 'energy':
        return renderEnergyStep();
      case 'commute':
        return renderCommuteStep();
      case 'flights':
        return renderFlightsStep();
      case 'diet':
        return renderDietStep();
      default:
        return null;
    }
  };

  return (
    <div className="glass-panel p-6 flex flex-col justify-between min-h-[440px] relative overflow-hidden">
      
      {/* Dynamic background accent */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-eco-500/5 to-transparent rounded-full blur-xl pointer-events-none" />

      <div>
        {/* Step Indicator Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            {React.createElement(STEPS[activeStep].icon, { className: 'text-eco-400 animate-pulse', size: 20 })}
            <h3 className="text-lg font-bold tracking-wide text-slate-100">
              {STEPS[activeStep].title}
            </h3>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Step {activeStep + 1} of {STEPS.length}
          </span>
        </div>

        {/* Horizontal Progress bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-1 mb-6 flex overflow-hidden">
          {STEPS.map((_, index) => (
            <div
              key={index}
              className={`h-full transition-all duration-300 ${
                index <= activeStep ? 'bg-eco-500' : 'bg-transparent'
              }`}
              style={{ width: `${100 / STEPS.length}%` }}
            />
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[260px] flex flex-col justify-center">
          {renderActiveStep()}
        </div>
      </div>

      {/* Footer Nav Controls */}
      <div className="flex items-center justify-between border-t border-slate-800/60 pt-4 mt-6">
        <button
          type="button"
          onClick={handlePrev}
          disabled={activeStep === 0}
          className="btn-secondary py-2 px-4 text-xs font-bold"
        >
          <ArrowLeft size={14} /> Back
        </button>

        {/* Wizard Progress Dots */}
        <div className="flex items-center gap-1.5">
          {STEPS.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveStep(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeStep 
                  ? 'bg-eco-400 ring-4 ring-eco-500/20 scale-125' 
                  : 'bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {activeStep === STEPS.length - 1 ? (
          <div className="flex items-center gap-1.5 text-xs font-bold text-eco-400 animate-pulse bg-eco-500/10 border border-eco-500/20 px-3 py-2 rounded-xl">
            <Sparkles size={14} /> Calculations Live
          </div>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="btn-primary py-2 px-4 text-xs font-bold"
          >
            Next <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
