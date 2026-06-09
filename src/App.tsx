/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  LayoutList, Ghost, LogOut, User as UserIcon, Sword, Shield, 
  Map, Coins, Trophy, ShoppingBag, Eye, Bot, Loader2, Sparkles, Volume2 
} from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';

import { Task, FilterType, UserStats } from './types';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import Auth from './components/Auth';
import CompanionPanel from './components/CompanionPanel';
import PomodoroTimer from './components/PomodoroTimer';
import StatsProfile from './components/StatsProfile';
import GuildShop from './components/GuildShop';
import ThemeBackground from './components/ThemeBackground';

import { auth, logout } from './lib/firebase';
import { 
  subscribeToTasks, 
  addTaskDB, 
  updateTaskDB, 
  deleteTaskDB, 
  ensureUserDoc,
  subscribeToUserStats,
  updateUserStatsDB
} from './lib/firestoreService';
import { sfx } from './lib/audioSynth';

export const THEMES = {
  sakura: {
    id: 'sakura',
    name: 'Sakura Blossom',
    bodyBg: 'bg-slate-950 text-slate-100',
    surface: 'bg-indigo-950/20 border-pink-500/10',
    primaryText: 'text-pink-400',
    primaryBorder: 'border-pink-500/30',
    button: 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white',
    glow: 'shadow-[0_0_20px_rgba(244,114,182,0.15)]',
    radial: 'from-pink-900/10 via-slate-950 to-slate-950',
    accentText: 'text-pink-300'
  },
  tokyo: {
    id: 'tokyo',
    name: 'Cyberpunk Neo-Tokyo',
    bodyBg: 'bg-slate-950 text-slate-100',
    surface: 'bg-slate-900/40 border-cyan-500/20',
    primaryText: 'text-cyan-400',
    primaryBorder: 'border-cyan-500/30',
    button: 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600 text-slate-950 font-bold',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    radial: 'from-violet-950/15 via-slate-950 to-slate-950',
    accentText: 'text-cyan-300'
  },
  dungeon: {
    id: 'dungeon',
    name: 'Mystic Dungeon',
    bodyBg: 'bg-black text-slate-200',
    surface: 'bg-red-950/25 border-red-500/20',
    primaryText: 'text-red-500',
    primaryBorder: 'border-red-500/30',
    button: 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white',
    glow: 'shadow-[0_0_20px_rgba(220,38,38,0.2)]',
    radial: 'from-red-950/15 via-black to-black',
    accentText: 'text-red-400'
  },
  retro: {
    id: 'retro',
    name: 'Sunset Retro Arcade',
    bodyBg: 'bg-stone-950 text-stone-100',
    surface: 'bg-yellow-950/20 border-amber-500/20',
    primaryText: 'text-amber-400',
    primaryBorder: 'border-amber-500/30',
    button: 'bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-stone-950 font-semibold',
    glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    radial: 'from-amber-950/10 via-stone-950 to-stone-950',
    accentText: 'text-amber-300'
  },
  onepiece: {
    id: 'onepiece',
    name: 'Grand Line (One Piece)',
    bodyBg: 'bg-[#030d1e] text-indigo-50/95',
    surface: 'bg-blue-950/30 border-amber-500/20 shadow-[0_4px_20px_rgba(245,158,11,0.03)]',
    primaryText: 'text-amber-400 font-extrabold',
    primaryBorder: 'border-amber-500/30',
    button: 'bg-gradient-to-r from-red-600 via-[#e05638] to-yellow-500 hover:from-red-700 hover:to-yellow-600 text-slate-950 font-black',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.2)]',
    radial: 'from-amber-950/20 via-[#030d1e] to-black',
    accentText: 'text-red-500'
  },
  naruto: {
    id: 'naruto',
    name: 'Will of Fire (Naruto)',
    bodyBg: 'bg-[#0f0905] text-amber-50/95',
    surface: 'bg-orange-950/20 border-orange-500/25 shadow-[0_4px_20px_rgba(249,115,22,0.03)]',
    primaryText: 'text-orange-500 font-bold',
    primaryBorder: 'border-orange-500/30',
    button: 'bg-gradient-to-r from-orange-500 via-rose-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-extrabold tracking-wide',
    glow: 'shadow-[0_0_25px_rgba(249,115,22,0.25)]',
    radial: 'from-orange-950/20 via-[#0f0905] to-black',
    accentText: 'text-orange-400'
  },
  deathnote: {
    id: 'deathnote',
    name: 'Shinigami Realm (Death Note)',
    bodyBg: 'bg-neutral-950 text-neutral-200 font-mono',
    surface: 'bg-neutral-900/60 border-neutral-800 shadow-[0_4px_20px_rgba(255,255,255,0.01)]',
    primaryText: 'text-white tracking-widest font-bold font-serif uppercase',
    primaryBorder: 'border-neutral-700',
    button: 'bg-neutral-100 hover:bg-neutral-200 text-neutral-950 font-serif font-black uppercase tracking-widest border border-neutral-300',
    glow: 'shadow-[0_0_15px_rgba(255,255,255,0.12)]',
    radial: 'from-rose-950/15 via-neutral-950 to-black',
    accentText: 'text-red-500 font-serif'
  },
  breakingbad: {
    id: 'breakingbad',
    name: 'Albuquerque High (Breaking Bad)',
    bodyBg: 'bg-[#060b09] text-emerald-50',
    surface: 'bg-[#0e2217]/40 border-lime-500/20 shadow-[0_4px_20px_rgba(132,204,22,0.02)]',
    primaryText: 'text-lime-400 font-medium tracking-wide',
    primaryBorder: 'border-lime-500/25',
    button: 'bg-gradient-to-r from-lime-500 via-amber-400 to-cyan-500 hover:from-lime-600 hover:to-cyan-600 text-slate-950 font-bold tracking-widest',
    glow: 'shadow-[0_0_20px_rgba(132,204,22,0.25)]',
    radial: 'from-[#0e2217]/25 via-[#060b09] to-black',
    accentText: 'text-cyan-400'
  },
  got: {
    id: 'got',
    name: 'Westeros Iron (Game of Thrones)',
    bodyBg: 'bg-[#050608] text-slate-200',
    surface: 'bg-slate-950/40 border-slate-800 shadow-[0_4px_20px_rgba(51,65,85,0.05)]',
    primaryText: 'text-slate-300 font-serif tracking-widest uppercase',
    primaryBorder: 'border-slate-800',
    button: 'bg-gradient-to-r from-slate-800 via-zinc-850 to-cyan-950 hover:from-slate-700 hover:to-cyan-900 text-slate-300 border border-slate-700/50 font-serif font-bold tracking-wider',
    glow: 'shadow-[0_0_20px_rgba(148,163,184,0.1)]',
    radial: 'from-sky-950/10 via-[#050608] to-black',
    accentText: 'text-rose-500'
  }
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  
  // RPG State sync
  const [stats, setStats] = useState<UserStats | null>(null);
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('anitask_gemini_key') || '');
  const [hasServerKey, setHasServerKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'quests' | 'focus' | 'profile' | 'shop'>('quests');

  // Load and subscribe Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      setAuthLoading(false);
      if (u) {
        await ensureUserDoc(u.uid, u.email || '', u.displayName || '', u.photoURL || '');
      }
    });
    return unsubscribe;
  }, []);

  // Subscribe user tasks
  useEffect(() => {
    if (!user) {
      setTasks([]);
      return;
    }
    const unsubscribe = subscribeToTasks(user.uid, (syncedTasks) => {
      setTasks(syncedTasks);
    });
    return unsubscribe;
  }, [user]);

  // Subscribe User Stats
  useEffect(() => {
    if (!user) {
      setStats(null);
      return;
    }
    const unsubscribe = subscribeToUserStats(user.uid, (syncedStats) => {
      setStats(syncedStats);
    });
    return unsubscribe;
  }, [user]);

  // Check server-side Gemini key status on mount
  useEffect(() => {
    fetch("/api/gemini/status")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.hasServerKey) {
          setHasServerKey(true);
        }
      })
      .catch((err) => console.error("Error checking server-side Gemini key status:", err));
  }, []);

  // Sync Gemini key with localStorage
  const handleUpdateGeminiKey = (newKey: string) => {
    setGeminiKey(newKey);
    localStorage.setItem('anitask_gemini_key', newKey);
  };

  const currentThemeId = stats?.activeTheme || 'sakura';
  const activeThemeStyle = THEMES[currentThemeId as keyof typeof THEMES] || THEMES.sakura;

  // Add a new quest
  const handleAddQuest = async (
    text: string, 
    priority: 'low' | 'medium' | 'high', 
    category: any, 
    difficulty: any, 
    dueDate: string
  ) => {
    if (!user) return;
    sfx.playClick();
    await addTaskDB(user.uid, {
      text,
      completed: false,
      priority,
      category,
      difficulty,
      dueDate,
      subTasks: [],
      notes: '',
      createdAt: Date.now(),
      userId: user.uid,
    });
  };

  // Complete / Toggle Quest with XP rewards!
  const handleToggleQuest = async (id: string) => {
    if (!user || !stats) return;
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const nextCompleted = !task.completed;
    
    // Calculate Rewards if completing
    if (nextCompleted) {
      const difficultyRewardMap = {
        'S': 150,
        'A': 80,
        'B': 40,
        'C': 20,
        'D': 10,
      };
      
      const goldAndXp = difficultyRewardMap[task.difficulty || 'D'];
      let currentXp = stats.xp + goldAndXp;
      let currentGold = stats.gold + goldAndXp;
      let currentLevel = stats.level;

      // Handle Level Up
      let leveledUp = false;
      const xpNeeded = currentLevel * 100;
      if (currentXp >= xpNeeded) {
        currentXp = currentXp - xpNeeded;
        currentLevel += 1;
        currentGold += 50; // Bonus Level up gold!
        leveledUp = true;
      }

      // Attribute increment mapping
      const statBonusMap = {
        study: 'mind',
        fitness: 'vitality',
        chores: 'discipline',
        creative: 'creative',
        routine: 'spirit',
      };
      
      const categoryToBoost = task.category || 'routine';
      const attrKey = statBonusMap[categoryToBoost as keyof typeof statBonusMap] || 'spirit';
      
      const updatedAttrVal = (stats.stats as any)[attrKey] + 1;

      // Firestore stats payload
      const payload: Partial<UserStats> = {
        xp: currentXp,
        gold: currentGold,
        level: currentLevel,
        stats: {
          ...stats.stats,
          [attrKey]: updatedAttrVal
        }
      };

      await updateUserStatsDB(user.uid, payload);
      sfx.playQuestComplete();

      if (leveledUp) {
        setTimeout(() => {
          sfx.playLevelUp();
          alert(`⚔️ CONGRATULATIONS MASTER SLAYER! You reached Level ${currentLevel}!\n\n👑 Unlocked +50 Gold Level-up reward!`);
        }, 300);
      }
    }

    await updateTaskDB(user.uid, id, { completed: nextCompleted });
  };

  // Complete focus cycle rewards
  const handleTimerReward = async (xpGained: number, goldGained: number, statToBoost?: 'mind' | 'vitality' | 'discipline' | 'creative' | 'spirit') => {
    if (!user || !stats) return;
    
    let currentXp = stats.xp + xpGained;
    let currentGold = stats.gold + goldGained;
    let currentLevel = stats.level;
    let leveledUp = false;

    // Check for level up
    const xpNeeded = currentLevel * 100;
    if (currentXp >= xpNeeded) {
      currentXp = currentXp - xpNeeded;
      currentLevel += 1;
      currentGold += 50; 
      leveledUp = true;
    }

    // Boost Spirit or specified stats
    const attrKey = statToBoost || 'spirit';
    const updatedAttrVal = (stats.stats as any)[attrKey] + 1;

    const payload: Partial<UserStats> = {
      xp: currentXp,
      gold: currentGold,
      level: currentLevel,
      stats: {
        ...stats.stats,
        [attrKey]: updatedAttrVal
      }
    };

    await updateUserStatsDB(user.uid, payload);

    if (leveledUp) {
      setTimeout(() => {
        sfx.playLevelUp();
        alert(`⚔️ CONGRATULATIONS FOCUS SAVANT! You leveled up to Level ${currentLevel}!\n\n👑 Received +50 Level bonus Gold!`);
      }, 300);
    }
  };

  const handleUpdateTaskProps = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return;
    await updateTaskDB(user.uid, taskId, updates);
  };

  const handleDeleteQuest = async (id: string) => {
    if (!user) return;
    await deleteTaskDB(user.uid, id);
  };

  const handleUpdateStatsDirect = async (updates: Partial<UserStats>) => {
    if (!user) return;
    await updateUserStatsDB(user.uid, updates);
  };

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return tasks.filter((t) => t.completed);
      case 'pending':
        return tasks.filter((t) => !t.completed);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  const activeCount = tasks.filter(t => !t.completed).length;

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#05070f] flex flex-col gap-3 items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <span className="text-xs font-mono tracking-widest text-slate-500 uppercase">Synchronising Quest Server...</span>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col items-center ${activeThemeStyle.bodyBg} selection:bg-indigo-500/30 transition-all duration-300`}>
      {/* Immersive Theme-crafted atmosphere background context */}
      <ThemeBackground themeId={currentThemeId} />
      
      {/* Absolute Dynamic Radial Background glow matching theme */}
      <div className={`absolute inset-0 bg-radial bg-gradient-to-b ${activeThemeStyle.radial} pointer-events-none transition-all duration-500 z-0`} />
      
      {/* Sparkly grid decorative overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />

      {/* Main Container Core */}
      <main className="w-full max-w-4xl z-10 px-4 py-8 md:py-12 flex flex-col md:flex-row gap-6">
        
        {/* Left column: User dashboard & navigation controller */}
        <section className="w-full md:w-80 flex flex-col gap-4.5 self-start">
          {/* Header user overview */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Hero" className="w-[42px] h-[42px] rounded-xl border border-white/10" referrerPolicy="no-referrer" />
              ) : (
                <div className="w-[42px] h-[42px] rounded-xl bg-slate-800 flex items-center justify-center border border-white/5">
                  <UserIcon className="w-5 h-5 text-slate-500" />
                </div>
              )}
              <div className="min-w-0">
                <h2 className="text-xs font-bold leading-none text-slate-200 truncate">{user.displayName || "Quest Adventurer"}</h2>
                <span className="text-[10px] font-mono text-indigo-400 capitalize mt-1 block tracking-wider">Level {stats?.level || 1} Outlaw</span>
              </div>
            </div>

            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-rose-400 transition-colors bg-slate-950/30 hover:bg-rose-500/5 border border-white/5 hover:border-rose-500/10 rounded-xl"
              title="Logout from guild tavern"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Core Sidebar Tabs Selection */}
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-2.5 flex flex-col gap-1.5" id="navigation-tavern">
            <span className="text-[9px] font-mono tracking-wider text-slate-500 uppercase px-3 py-1">Guild Directory</span>
            
            {/* Quests board */}
            <button
              onClick={() => { sfx.playClick(); setActiveTab('quests'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-all cursor-pointer border ${
                activeTab === 'quests'
                  ? `bg-indigo-500/10 ${activeThemeStyle.primaryBorder} ${activeThemeStyle.primaryText} font-black`
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>Quests Bulletin</span>
            </button>

            {/* Pomodoro Timer Dojo */}
            <button
              onClick={() => { sfx.playClick(); setActiveTab('focus'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-all cursor-pointer border ${
                activeTab === 'focus'
                  ? `bg-indigo-500/10 ${activeThemeStyle.primaryBorder} ${activeThemeStyle.primaryText} font-black`
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              <Sword className="w-4 h-4" />
              <span>Focus Dojo</span>
            </button>

            {/* Stats profile achievements */}
            <button
              onClick={() => { sfx.playClick(); setActiveTab('profile'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-all cursor-pointer border ${
                activeTab === 'profile'
                  ? `bg-indigo-500/10 ${activeThemeStyle.primaryBorder} ${activeThemeStyle.primaryText} font-black`
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Attributes & Titles</span>
            </button>

            {/* Shop merchant */}
            <button
              onClick={() => { sfx.playClick(); setActiveTab('shop'); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold uppercase font-mono tracking-wider transition-all cursor-pointer border ${
                activeTab === 'shop'
                  ? `bg-indigo-500/10 ${activeThemeStyle.primaryBorder} ${activeThemeStyle.primaryText} font-black`
                  : 'border-transparent text-slate-400 hover:text-slate-100'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Guild Weaponry</span>
            </button>
          </div>

          {/* Quick HUD block info stats */}
          {stats && (
            <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3 font-mono">
              <span className="text-[9px] tracking-wider text-slate-500 uppercase">Interactive HUD Status</span>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">GOLD BALANCE:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5" /> {stats.gold} gp
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">ACTIVE MISSION:</span>
                <span className="text-indigo-400 font-bold">{activeCount} targets</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">COSMIC VISIBILITY:</span>
                <span className="text-emerald-400 font-bold capitalize">{stats.activeTheme}</span>
              </div>
            </div>
          )}

          {/* Mini companion interactive chat helper panel */}
          {stats && (
            <CompanionPanel
              stats={stats}
              onUpdateStats={handleUpdateStatsDirect}
              geminiKey={geminiKey || (hasServerKey ? 'server_active' : '')}
              onUpdateGeminiKey={handleUpdateGeminiKey}
            />
          )}
        </section>

        {/* Right column: Active tab views with full detailed animation switches */}
        <section className="flex-1 min-w-0" id="main-content-sector">
          <AnimatePresence mode="wait">
            
            {/* View 1: Quests board */}
            {activeTab === 'quests' && (
              <motion.div
                key="quests"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase flex items-center gap-2">
                      <Map className="w-6 h-6 text-indigo-400" /> Quests Bulletin
                    </h1>
                    <p className="text-slate-500 text-xs">Fulfill assignments below to secure coins, level up attributes, and expand stats.</p>
                  </div>
                </div>

                {/* Styled RPG Quest Input */}
                <TaskInput onAdd={handleAddQuest} activeThemeStyle={activeThemeStyle} />

                {/* Filters controls */}
                <TaskFilters 
                  currentFilter={filter} 
                  onFilterChange={setFilter} 
                  count={activeCount} 
                />

                {/* Tasks board list */}
                <div className="space-y-3 min-h-[350px]">
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggle={handleToggleQuest}
                        onDelete={handleDeleteQuest}
                        onUpdateTask={handleUpdateTaskProps}
                        geminiKey={geminiKey || (hasServerKey ? 'server_active' : '')}
                      />
                    ))
                  ) : (
                    <div 
                      className="flex flex-col items-center justify-center py-20 text-slate-600 border border-dashed border-white/5 rounded-2xl bg-slate-900/20"
                      id="empty-quests-state"
                    >
                      <Ghost className="w-12 h-12 mb-3 opacity-20" />
                      <p className="font-mono text-xs uppercase tracking-widest text-slate-500">No active bounty quests located.</p>
                      <p className="text-[11px] text-slate-600 mt-1 italic">Write a new assignment above to start leveling stats.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* View 2: Focus Dojo Pomodoro clock */}
            {activeTab === 'focus' && (
              <motion.div
                key="focus"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase flex items-center gap-2">
                    <Sword className="w-6 h-6 text-rose-500" /> Focus Dojo
                  </h1>
                  <p className="text-slate-500 text-xs">Activate concentration countdown triggers to gain level milestones and train Spirit attributes.</p>
                </div>

                {stats && (
                  <PomodoroTimer stats={stats} onReward={handleTimerReward} />
                )}
              </motion.div>
            )}

            {/* View 3: Stats profile */}
            {activeTab === 'profile' && stats && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase flex items-center gap-2">
                    <Trophy className="w-6 h-6 text-amber-500" /> Attribute Progression
                  </h1>
                  <p className="text-slate-500 text-xs">Observe your statistical levels built safely across real-time quest categories.</p>
                </div>

                <StatsProfile stats={stats} onUpdateStats={handleUpdateStatsDirect} />
              </motion.div>
            )}

            {/* View 4: Guild Shop */}
            {activeTab === 'shop' && stats && (
              <motion.div
                key="shop"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-white font-mono uppercase flex items-center gap-2">
                    <ShoppingBag className="w-6 h-6 text-amber-400" /> Guild Merchant
                  </h1>
                  <p className="text-slate-500 text-xs">Barter gold tokens for custom UI paint schemes and honorary status titles.</p>
                </div>

                <GuildShop stats={stats} onUpdateStats={handleUpdateStatsDirect} />
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* Humble Footer Credits */}
      <footer className="mt-auto py-8 text-center border-t border-white/5 w-full z-10">
        <p className="text-[10px] items-center justify-center gap-3 font-mono text-slate-600 uppercase tracking-widest flex">
          <span>AniTask Guild Terminal</span>
          <span className="w-1 h-1 bg-slate-800 rounded-full" />
          <span>Polished Edition</span>
        </p>
      </footer>
    </div>
  );
}
