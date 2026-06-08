import { useState, useEffect } from 'react';
import { Award, Flame, CheckCircle2 } from 'lucide-react';

const INITIAL_CHALLENGES = [
  { id: 'plastic', title: 'Zero Single-Use Plastic', desc: 'Avoid plastic bags, bottles, or packaging today.', xp: 25 },
  { id: 'digital', title: 'Digital Clean-up', desc: 'Clear 50 old emails or files, reducing cloud storage carbon.', xp: 15 },
  { id: 'standby', title: 'Vampire Energy Hunt', desc: 'Unplug 5 standby chargers or media systems.', xp: 20 },
  { id: 'meatfree', title: 'Meat-Free Day', desc: 'Eat plant-based meals all day. Avoid red meat.', xp: 30 },
  { id: 'commute', title: 'Active Transit Commute', desc: 'Walk, bike, or take public transit instead of driving.', xp: 35 },
  { id: 'coldwash', title: 'Cold-Water Wash', desc: 'Wash a load of laundry at 30°C or lower.', xp: 15 },
];

const BADGES = [
  { id: 'sprout', name: 'Green Sprout', desc: 'Begin your footprint journey.', threshold: 0, icon: '🌱' },
  { id: 'watt', name: 'Volt Guard', desc: 'Cut home vampire energy loads.', threshold: 30, icon: '⚡' },
  { id: 'traveler', name: 'Eco Commuter', desc: 'Commit to clean transport.', threshold: 65, icon: '🚲' },
  { id: 'vegan', name: 'Plant Pioneer', desc: 'Cut agricultural meat impact.', threshold: 100, icon: '🥗' },
  { id: 'champion', name: 'Carbon Buster', desc: 'Collect 130 XP in green deeds.', threshold: 130, icon: '🏆' },
];

export default function EcoTracker() {
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('antiquity_xp');
    return saved ? parseInt(saved) : 0;
  });

  const [completed, setCompleted] = useState(() => {
    const saved = localStorage.getItem('antiquity_completed_challenges');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('antiquity_xp', xp.toString());
    localStorage.setItem('antiquity_completed_challenges', JSON.stringify(completed));
  }, [xp, completed]);

  // Level calculations
  const xpPerLevel = 100;
  const currentLevel = Math.floor(xp / xpPerLevel) + 1;
  const xpInLevel = xp % xpPerLevel;
  const progressPercent = (xpInLevel / xpPerLevel) * 100;

  const toggleChallenge = (id, challengeXp) => {
    setCompleted(prev => {
      const isCompleted = !prev[id];
      if (isCompleted) {
        setXp(x => x + challengeXp);
      } else {
        setXp(x => Math.max(0, x - challengeXp));
      }
      return {
        ...prev,
        [id]: isCompleted
      };
    });
  };

  const getBadgeStatus = (threshold) => {
    return xp >= threshold;
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between h-[520px]">
      
      {/* Background radial highlight */}
      <div className="absolute -bottom-10 -left-10 w-28 h-28 bg-gradient-to-br from-gold-500/5 to-transparent rounded-full blur-xl pointer-events-none" />

      <div>
        {/* Header - Level and XP Info */}
        <div className="flex justify-between items-center mb-5 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-700 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-gold-500/10">
              Lv.{currentLevel}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Eco Action Tracker</h3>
              <p className="text-[10px] text-slate-400 font-semibold">{xp} Total XP earned</p>
            </div>
          </div>
          <span className="text-xs font-bold text-gold-400 flex items-center gap-1">
            <Flame size={14} className="animate-pulse" /> {xpInLevel}/100 XP to next level
          </span>
        </div>

        {/* Level Progress Bar */}
        <div className="w-full bg-slate-900/80 border border-slate-800/60 rounded-full h-3 mb-6 p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-500 to-eco-400 rounded-full transition-all duration-700 ease-out shadow-inner"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Section Title */}
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Daily Challenges
        </h4>

        {/* Challenges Scrollable List */}
        <div className="h-[210px] overflow-y-auto space-y-2 pr-1">
          {INITIAL_CHALLENGES.map((challenge) => {
            const isDone = !!completed[challenge.id];
            return (
              <button
                key={challenge.id}
                onClick={() => toggleChallenge(challenge.id, challenge.xp)}
                aria-pressed={isDone}
                aria-label={`Toggle daily challenge: ${challenge.title}`}
                className={`w-full p-2.5 rounded-xl border text-left flex items-start justify-between gap-3 transition-all duration-200 ${
                  isDone
                    ? 'border-eco-500/40 bg-eco-950/20 hover:bg-eco-950/30'
                    : 'border-slate-800/80 bg-slate-900/10 hover:border-slate-700/60 hover:bg-slate-900/30'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="mt-0.5">
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-eco-400 fill-eco-950/30" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-700 hover:border-slate-500" />
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-bold block transition-all ${isDone ? 'line-through text-slate-500' : 'text-slate-200'}`}>
                      {challenge.title}
                    </span>
                    <span className="text-[10px] text-slate-500 leading-tight block mt-0.5">
                      {challenge.desc}
                    </span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${isDone ? 'bg-slate-800/50 text-slate-600' : 'bg-gold-500/10 text-gold-400 border border-gold-500/15'}`}>
                  +{challenge.xp} XP
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges Section */}
      <div className="mt-5 border-t border-slate-800/60 pt-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Award size={14} className="text-gold-400" /> Unlocked Badges
        </h4>
        <div className="flex justify-between items-center gap-2">
          {BADGES.map((badge) => {
            const isUnlocked = getBadgeStatus(badge.threshold);
            return (
              <div
                key={badge.id}
                className="group relative flex flex-col items-center flex-1"
              >
                {/* Badge Emoji Sphere */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-lg transition-all duration-500 border ${
                    isUnlocked
                      ? 'border-gold-500 bg-gold-950/30 text-white shadow-lg shadow-gold-500/10 scale-100'
                      : 'border-slate-800 bg-slate-900/20 opacity-30 scale-90 filter grayscale'
                  }`}
                >
                  <span role="img" aria-label={badge.name}>
                    {badge.icon}
                  </span>
                </div>
                <span className={`text-[8px] font-bold mt-1 text-center truncate w-full ${isUnlocked ? 'text-gold-300' : 'text-slate-600'}`}>
                  {badge.name}
                </span>

                {/* Hover Tooltip */}
                <div className="absolute bottom-12 scale-0 group-hover:scale-100 transition-all duration-200 origin-bottom bg-slate-900 border border-slate-800 p-2 rounded-lg text-center shadow-xl z-10 w-32">
                  <span className="text-[9px] font-bold text-slate-200 block">{badge.name}</span>
                  <span className="text-[8px] text-slate-500 block leading-tight mt-0.5">{badge.desc}</span>
                  <span className="text-[8px] text-gold-400 font-bold block mt-1">
                    {isUnlocked ? '🔓 Unlocked!' : `🔒 Needs ${badge.threshold} XP`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
