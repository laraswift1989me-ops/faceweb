import { Zap, TrendingUp, Crown, Star } from 'lucide-react';

export function BoosterLevels() {
  const boosterLevels = [
    { level: 1, stake: 100, profit: 1, badge: 'Starter', color: 'from-slate-400 to-slate-500' },
    { level: 2, stake: 500, profit: 3, badge: 'Bronze', color: 'from-amber-700 to-amber-800' },
    { level: 3, stake: 1000, profit: 5, badge: 'Silver', color: 'from-slate-300 to-slate-400' },
    { level: 4, stake: 2500, profit: 8, badge: 'Gold', color: 'from-yellow-400 to-yellow-500' },
    { level: 5, stake: 5000, profit: 12, badge: 'Platinum', color: 'from-cyan-400 to-blue-500' },
    { level: 6, stake: 10000, profit: 16, badge: 'Diamond', color: 'from-blue-400 to-indigo-500' },
    { level: 7, stake: 15000, profit: 20, badge: 'Master', color: 'from-purple-400 to-pink-500' },
    { level: 8, stake: 25000, profit: 24, badge: 'Elite', color: 'from-pink-400 to-rose-500' },
    { level: 9, stake: 35000, profit: 27, badge: 'Legend', color: 'from-orange-400 to-red-500' },
    { level: 10, stake: 50000, profit: 30, badge: 'Titan', color: 'from-emerald-400 to-cyan-500' }
  ];

  const currentLevel = 4; // User's current level

  return (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6 text-yellow-400" />
        <h2 className="text-xl text-white">Profit Booster Levels</h2>
      </div>
      
      <p className="text-slate-400 text-sm mb-6">
        Unlock higher profit rates by staking more. Current Level: <span className="text-yellow-400 font-bold">{boosterLevels[currentLevel - 1].badge}</span>
      </p>

      {/* Current Level Card */}
      <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/50 rounded-2xl p-4 mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${boosterLevels[currentLevel - 1].color} flex items-center justify-center`}>
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <p className="text-yellow-400 text-xs font-medium">YOUR CURRENT LEVEL</p>
            <p className="text-white text-xl font-bold">Level {currentLevel} - {boosterLevels[currentLevel - 1].badge}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Your Stake</p>
            <p className="text-white font-bold">${boosterLevels[currentLevel - 1].stake.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-3">
            <p className="text-slate-400 text-xs mb-1">Daily Profit</p>
            <p className="text-emerald-400 font-bold">{boosterLevels[currentLevel - 1].profit}%</p>
          </div>
        </div>
      </div>

      {/* All Levels */}
      <div className="space-y-2">
        <h3 className="text-white font-medium mb-3">All Booster Levels</h3>
        {boosterLevels.map((level) => {
          const isCurrentLevel = level.level === currentLevel;
          const isUnlocked = level.level <= currentLevel;
          const Icon = level.level === 10 ? Crown : level.level >= 7 ? Star : TrendingUp;

          return (
            <div
              key={level.level}
              className={`rounded-xl p-4 border transition-all ${
                isCurrentLevel
                  ? 'bg-yellow-500/10 border-yellow-500/50 scale-105'
                  : isUnlocked
                  ? 'bg-slate-800/50 border-slate-700/50'
                  : 'bg-slate-900/30 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${level.color} flex items-center justify-center flex-shrink-0 ${!isUnlocked && 'opacity-50'}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`font-bold ${isCurrentLevel ? 'text-yellow-400' : 'text-white'}`}>
                      Level {level.level}
                    </p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      isCurrentLevel
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                        : isUnlocked
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-slate-700/50 text-slate-400'
                    }`}>
                      {isCurrentLevel ? 'CURRENT' : isUnlocked ? 'UNLOCKED' : level.badge}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-slate-400 text-sm">
                      Stake: <span className="text-white font-medium">${level.stake.toLocaleString()}</span>
                    </p>
                    <p className="text-slate-400 text-sm">
                      Profit: <span className="text-emerald-400 font-bold">{level.profit}%/day</span>
                    </p>
                  </div>
                </div>

                {!isUnlocked && (
                  <button className="px-4 py-2 bg-cyan-500/20 border border-cyan-500 text-cyan-400 rounded-lg text-sm font-medium hover:bg-cyan-500/30 transition-colors">
                    Upgrade
                  </button>
                )}
                {isCurrentLevel && (
                  <div className="px-4 py-2 bg-yellow-500/20 border border-yellow-500 text-yellow-400 rounded-lg text-sm font-bold">
                    Active
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upgrade Info */}
      <div className="mt-6 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
        <p className="text-cyan-400 text-sm text-center">
          💡 Upgrade to Level {currentLevel + 1} by staking ${boosterLevels[currentLevel].stake.toLocaleString()} USDT to unlock {boosterLevels[currentLevel].profit}% daily profit!
        </p>
      </div>
    </div>
  );
}
