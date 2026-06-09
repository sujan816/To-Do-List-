/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { UserStats } from '../types';
import { Award, Shield, Coins, Sparkles, Brain, Dumbbell, Zap, Flame, Palette } from 'lucide-react';
import { sfx } from '../lib/audioSynth';

interface StatsProfileProps {
  stats: UserStats;
  onUpdateStats: (updates: Partial<UserStats>) => void;
}

export default function StatsProfile({ stats, onUpdateStats }: StatsProfileProps) {
  const getXpNeeded = (level: number) => {
    return level * 100; // Level 1 needs 100, level 2 needs 200, etc.
  };

  const xpNeeded = getXpNeeded(stats.level);
  const xpPercent = Math.min(100, Math.round((stats.xp / xpNeeded) * 100));

  const equipTitle = (title: string) => {
    sfx.playClick();
    onUpdateStats({ title });
    
    // Play the respective premium theme song when equipping a prestige badge!
    if (title.includes('Straw Hat') || title.includes('Captain')) {
      sfx.playThemeSong('onepiece');
    } else if (title.includes('Hokage')) {
      sfx.playThemeSong('naruto');
    } else if (title.includes('New World') || title.includes('God')) {
      sfx.playThemeSong('deathnote');
    } else if (title.includes('Danger') || title.includes('Heisenberg')) {
      sfx.playThemeSong('breakingbad');
    } else if (title.includes('Throne') || title.includes('Iron')) {
      sfx.playThemeSong('got');
    } else if (title.includes('Dungeon') || title.includes('Raider')) {
      sfx.playThemeSong('dungeon');
    } else if (title.includes('Tokyo') || title.includes('Hacker')) {
      sfx.playThemeSong('tokyo');
    } else {
      sfx.playLevelUp();
    }
  };

  return (
    <div className="space-y-6" id="stats-profile">
      {/* Level Banner Card */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/60 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
        {/* Shine background decorative ring */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative">
          {/* Avatar box overlay */}
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center relative">
            <Shield className="w-8 h-8 text-indigo-400 stroke-[1.5]" />
            <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[10px] font-black w-5 h-5 rounded-md flex items-center justify-center text-white border border-slate-900 font-mono shadow-md">
              {stats.level}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-100 flex items-center gap-2 tracking-tight">
              {stats.title}
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
            </h3>
            <span className="text-xs text-slate-400 font-mono">Rank: Legendary Quest Master</span>
          </div>
        </div>

        {/* XP Status bar */}
        <div className="mt-5 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono tracking-wide">
            <span className="text-slate-400 font-bold uppercase">Experience Level Progress</span>
            <span className="text-indigo-400 font-bold">{stats.xp} / {xpNeeded} XP ({xpPercent}%)</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950 border border-white/5 rounded-full overflow-hidden p-[2px]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 0.6 }}
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]"
            />
          </div>
        </div>

        {/* Currency summary blocks */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/5">
          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl flex items-center gap-2.5">
            <Coins className="w-5 h-5 text-amber-400 fill-amber-400" />
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 block">Gold Earned</span>
              <span className="text-sm font-bold text-amber-400 font-mono">{stats.gold} gp</span>
            </div>
          </div>

          <div className="bg-slate-950/40 border border-white/5 p-3 rounded-xl flex items-center gap-2.5">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-[9px] font-mono uppercase text-slate-500 block">Active Companion</span>
              <span className="text-sm font-bold text-emerald-400 capitalize">{stats.selectedCompanion}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes progression radar block */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5" id="stats-attributes">
        <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-violet-400" /> Hero Core Attributes
        </h4>

        <div className="space-y-4">
          {/* Mind Stat */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>Mind (Study, Reading)</span>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-400">LVL {stats.stats.mind}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, stats.stats.mind * 4)}%` }} 
              />
            </div>
          </div>

          {/* Vitality Stat */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Dumbbell className="w-4 h-4 text-rose-400" />
                <span>Vitality (Fitness, Workouts)</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-400">LVL {stats.stats.vitality}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-rose-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, stats.stats.vitality * 4)}%` }} 
              />
            </div>
          </div>

          {/* Discipline Stat */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Discipline (Chores, Routine)</span>
              </div>
              <span className="text-xs font-mono font-bold text-emerald-400">LVL {stats.stats.discipline}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, stats.stats.discipline * 4)}%` }} 
              />
            </div>
          </div>

          {/* Creative Stat */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Palette className="w-4 h-4 text-pink-400" />
                <span>Creative (Art, Code, Writing)</span>
              </div>
              <span className="text-xs font-mono font-bold text-pink-400">LVL {stats.stats.creative}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-pink-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, stats.stats.creative * 4)}%` }} 
              />
            </div>
          </div>

          {/* Spirit Stat */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2 text-xs text-slate-300 font-medium">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Spirit (Focus timer sprints)</span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-400">LVL {stats.stats.spirit}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all" 
                style={{ width: `${Math.min(100, stats.stats.spirit * 4)}%` }} 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Equipped titles block selection */}
      <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-5" id="stats-titles">
        <h4 className="text-xs font-semibold text-slate-300 font-mono uppercase tracking-wider mb-3.5 flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-500" /> My Unlocked Titles
        </h4>
        <div className="space-y-2">
          {stats.ownedTitles.map((t) => (
            <button
              key={t}
              onClick={() => equipTitle(t)}
              className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all flex items-center justify-between ${
                stats.title === t
                  ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-amber-500/30'
              }`}
              id={`title-equipped-${t.replace(/\s+/g, '-')}`}
            >
              <span>{t}</span>
              {stats.title === t ? (
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">EQUIPPED</span>
              ) : (
                <span className="text-[9px] font-mono text-slate-600">CLICK TO EQUIP</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
