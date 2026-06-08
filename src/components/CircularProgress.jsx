import React from 'react';

/**
 * Circular progress gauge representing carbon footprint levels.
 */
export default function CircularProgress({ value = 0, max = 15, status }) {
  // Clamp value between 0 and max
  const cleanValue = Math.max(0, Math.min(value, max));
  
  // SVG Configuration
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  // Calculate stroke dashoffset
  // Offset 0 means fully colored, offset circumference means empty
  const progress = cleanValue / max;
  const strokeDashoffset = circumference - progress * circumference;

  // Outer dots ring parameters
  const dotRadius = radius + 14;
  const dotCircumference = dotRadius * 2 * Math.PI;

  return (
    <div className="flex flex-col items-center justify-center p-2 relative select-none">
      <div className="relative" style={{ width: size, height: size }}>
        
        {/* Glow behind the gauge */}
        <div 
          className="absolute inset-4 rounded-full filter blur-xl opacity-20 transition-all duration-500"
          style={{ 
            backgroundColor: status.strokeColor,
          }}
        />

        {/* SVG Gauge */}
        <svg className="w-full h-full transform -rotate-90 select-none">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-800/60 fill-none"
            strokeWidth={strokeWidth}
          />
          
          {/* Dynamic Progress Ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            stroke={status.strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />

          {/* Dotted Track for Visual Complexity */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={dotRadius}
            className="stroke-slate-800/40 fill-none"
            strokeWidth={1.5}
            strokeDasharray="4 8"
          />
        </svg>

        {/* Center Labels */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Annual Footprint
          </span>
          <div className="flex items-baseline gap-0.5 my-1">
            <span className="text-4xl font-extrabold tracking-tight bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
              {value.toFixed(2)}
            </span>
          </div>
          <span className="text-xs font-bold text-slate-300">
            t CO₂e / yr
          </span>
        </div>
      </div>

      {/* Dynamic Status Badge */}
      <div className="mt-6 flex flex-col items-center text-center">
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all duration-300 ${status.color}`}>
          <span className="w-2 h-2 rounded-full mr-2 animate-pulse" style={{ backgroundColor: status.strokeColor }}></span>
          {status.badge}
        </span>
        <p className="mt-2 text-xs text-slate-400 max-w-[220px] leading-relaxed">
          {status.description}
        </p>
      </div>
    </div>
  );
}

import PropTypes from 'prop-types';

CircularProgress.propTypes = {
  value: PropTypes.number.isRequired,
  max: PropTypes.number,
  status: PropTypes.shape({
    color: PropTypes.string.isRequired,
    strokeColor: PropTypes.string.isRequired,
    badge: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
};
