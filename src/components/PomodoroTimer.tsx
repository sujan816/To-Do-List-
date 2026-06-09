/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, CloudRain, Flame, Zap, Award, Sparkles } from 'lucide-react';
import { sfx } from '../lib/audioSynth';
import { UserStats } from '../types';

interface PomodoroTimerProps {
  stats: UserStats;
  onReward: (xpGained: number, goldGained: number, statToBoost?: 'mind' | 'vitality' | 'discipline' | 'creative' | 'spirit') => void;
}

export default function PomodoroTimer({ stats, onReward }: PomodoroTimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(1500); // 25 minutes default
  const [isRunning, setIsRunning] = useState(false);
  const [activePreset, setActivePreset] = useState(1500);
  const [rainVolume, setRainVolume] = useState(0.4);
  const [isRainActive, setIsRainActive] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const companion = stats.selectedCompanion;

  const presets = [
    { label: 'Short Test', value: 60 }, // 1m for testing
    { label: 'Speed Dial', value: 600 }, // 10m
    { label: 'Standard Dojo', value: 1500 }, // 25m
    { label: 'Iron Mind', value: 2700 }, // 45m
    { label: 'S-Rank Study', value: 3600 }, // 60m
  ];

  // Stop rain noise on dismount
  useEffect(() => {
    return () => {
      sfx.stopRain();
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    sfx.playLevelUp(); // Play level up sound fan fare for complete sessions!
    
    // Reward calculation based on preset duration
    const minutesFocused = Math.round(activePreset / 60);
    const xpReward = Math.max(10, Math.round(minutesFocused * 1.5));
    const goldReward = Math.max(10, Math.round(minutesFocused * 1.2));
    
    // Reward the user
    onReward(xpReward, goldReward, 'spirit');
    
    // Reset timer
    setSecondsLeft(activePreset);

    // Stop synthesizer rain briefly
    if (isRainActive) {
      toggleRainSound(false);
    }
    
    alert(`🎉 Great Focus Session, Senpai! You completed a ${minutesFocused} minute deep focus sprint! You have been rewarded +${xpReward} XP, +${goldReward} Gold, and your Spirit stat increased!`);
  };

  const handleStartPause = () => {
    sfx.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    sfx.playClick();
    setIsRunning(false);
    setSecondsLeft(activePreset);
  };

  const setPreset = (value: number) => {
    sfx.playClick();
    setIsRunning(false);
    setActivePreset(value);
    setSecondsLeft(value);
  };

  const toggleRainSound = (forceState?: boolean) => {
    sfx.playClick();
    const nextState = forceState !== undefined ? forceState : !isRainActive;
    setIsRainActive(nextState);
    if (nextState) {
      sfx.startRain(rainVolume);
    } else {
      sfx.stopRain();
    }
  };

  const changeRainVolume = (value: number) => {
    setRainVolume(value);
    if (isRainActive) {
      sfx.setRainVolume(value);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Custom companion focus descriptions
  const getCompanionStudyAction = () => {
    switch (companion) {
      case 'hikari':
        return isRunning 
          ? "Hikari is typing lightspeed-fast beside you, waving pom-poms whenever you look up!" 
          : "Hikari is stretching and sorting colored study highlighters, waiting for you.";
      case 'ren':
        return isRunning 
          ? "Master Ren sits in motionless lotus posture, breathing softly in sync with your work." 
          : "Master Ren is clearing the tea tray, checking if your alignment is ready.";
      case 'kuro':
        return isRunning 
          ? "Kuro has settled on top of your warm notebook, purring to keep you calm and focused." 
          : "Kuro is batting a toy pencil around, occasionally yawning at you to get moving.";
    }
  };

  return (
    <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden" id="focus-timer">
      {/* Decorative gradient overlay */}
      {isRunning && (
        <div className="absolute inset-0 bg-indigo-500/[0.02] animate-pulse pointer-events-none" />
      )}
      
      <div className="flex flex-col items-center justify-center space-y-6">
        {/* Presets Row */}
        <div className="flex flex-wrap gap-1.5 justify-center">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => setPreset(p.value)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all uppercase border ${
                activePreset === p.value
                  ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold shadow-[0_0_10px_rgba(99,102,241,0.15)]'
                  : 'border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
              }`}
              id={`preset-${p.value}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Big Timer Indicator */}
        <div className="relative flex items-center justify-center py-2">
          {/* S-Rank Neon-Glow Ring */}
          <div className="w-52 h-52 rounded-full border border-white/5 flex flex-col items-center justify-center relative p-2 shadow-2xl bg-slate-950/40">
            {/* Spinning active ring element if running */}
            {isRunning && (
              <div className="absolute inset-0 rounded-full border-t border-r border-indigo-500 animate-spin" style={{ animationDuration: '3s' }} />
            )}
            
            <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-1">Dojo Clock</span>
            <h2 className="text-4xl font-bold font-mono tracking-tight text-white mb-1" id="timer-display">
              {formatTime(secondsLeft)}
            </h2>
            <span className="text-[9px] font-mono rounded-full bg-slate-800 px-2 py-0.5 mt-1 border border-white/5 text-slate-400">
              {isRunning ? 'FOCUS ACTIVATED' : 'SITTING IDLE'}
            </span>
          </div>
        </div>

        {/* Buttons Controls */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleReset}
            className="p-3 text-slate-400 hover:text-rose-400 border border-white/5 hover:border-rose-500/20 bg-slate-950/40 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer"
            title="Reset focus clock"
            id="timer-reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleStartPause}
            className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/20 text-sm flex items-center gap-2 transition-all cursor-pointer"
            id="timer-toggle"
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 text-white fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 text-white fill-white" />
                <span>Start Session</span>
              </>
            )}
          </button>

          <button
            onClick={() => toggleRainSound()}
            className={`p-3 border rounded-xl transition-all cursor-pointer ${
              isRainActive 
                ? 'text-cyan-400 border-cyan-500/40 bg-cyan-500/5 glow-cyan shadow-[0_0_10px_rgba(34,211,238,0.1)]' 
                : 'text-slate-400 border-white/5 hover:text-cyan-300 bg-slate-950/40 hover:border-cyan-500/25'
            }`}
            title="Toggle Cozy Rain Sound Synth"
            id="timer-rain-synth"
          >
            <CloudRain className="w-5 h-5" />
          </button>
        </div>

        {/* Ambient rain volume control */}
        {isRainActive && (
          <div className="flex items-center gap-3 w-52 p-2 bg-slate-950/50 rounded-xl border border-white/5 animate-fade-in shadow-2xl">
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={rainVolume}
              onChange={(e) => changeRainVolume(parseFloat(e.target.value))}
              className="accent-cyan-400 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer w-full"
              id="rain-volume-range"
            />
          </div>
        )}

        {/* Companion focus state box */}
        <div className="w-full bg-slate-950/40 border border-white/5 rounded-2xl p-4 flex gap-3 items-center">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/15 font-bold text-lg text-indigo-400 uppercase font-mono">
            {companion[0]}
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wide">Companion Focus Status</h4>
            <p className="text-xs text-slate-400 leading-relaxed italic">{getCompanionStudyAction()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
