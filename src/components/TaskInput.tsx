/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Sparkles, BookOpen, Dumbbell, Home, Palette, Calendar, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import { QuestCategory, QuestDifficulty } from '../types';

interface TaskInputProps {
  onAdd: (
    text: string, 
    priority: 'low' | 'medium' | 'high', 
    category: QuestCategory,
    difficulty: QuestDifficulty,
    dueDate?: string
  ) => void;
  activeThemeStyle: any;
}

export default function TaskInput({ onAdd, activeThemeStyle }: TaskInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | null>(null);
  const [category, setCategory] = useState<QuestCategory | null>(null);
  const [difficulty, setDifficulty] = useState<QuestDifficulty | null>(null);
  const [dueDate, setDueDate] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!text.trim()) {
      setErrorMsg('Quest name or summary is required.');
      return;
    }
    if (!category) {
      setErrorMsg('Please select a Quest Guild Category.');
      return;
    }
    if (!difficulty) {
      setErrorMsg('Please select a Quest Rank & Difficulty.');
      return;
    }
    if (!priority) {
      setErrorMsg('Please select a Priority Gate.');
      return;
    }
    if (!dueDate) {
      setErrorMsg('Please choose a Quest Deadline.');
      return;
    }

    onAdd(text, priority, category, difficulty, dueDate);
    setText('');
    setCategory(null);
    setDifficulty(null);
    setPriority(null);
    setDueDate('');
    setErrorMsg(null);
  };

  const getCategoryIcon = (cat: QuestCategory) => {
    switch (cat) {
      case 'study': return <BookOpen className="w-3.5 h-3.5" />;
      case 'fitness': return <Dumbbell className="w-3.5 h-3.5" />;
      case 'chores': return <Home className="w-3.5 h-3.5" />;
      case 'creative': return <Palette className="w-3.5 h-3.5" />;
      case 'routine': return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-6" id="quest-form">
      {/* Search/Input bar */}
      <div className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Summon a new quest, adventurer..."
          className="w-full bg-slate-900/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl py-4.5 pl-5 pr-14 text-base outline-none transition-all placeholder:text-slate-500 focus:bg-slate-900/80 shadow-2xl"
          id="task-input"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-xl shadow-lg font-bold min-w-[40px] flex items-center justify-center ${activeThemeStyle.button} disabled:opacity-30 disabled:pointer-events-none`}
          disabled={!text.trim()}
          type="submit"
          id="add-task-btn"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </motion.button>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-400/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs font-mono" id="validation-error">
          <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 animate-bounce" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Grid of options: Category, Rank, Parameters */}
      <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4 space-y-3">
        {/* Row 1: Categories */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Quest Guild Category</span>
          <div className="grid grid-cols-5 gap-1.5 md:flex md:flex-wrap md:gap-2">
            {([
              { id: 'study', label: 'Study' },
              { id: 'fitness', label: 'Fitness' },
              { id: 'chores', label: 'Chores' },
              { id: 'creative', label: 'Creative' },
              { id: 'routine', label: 'Routine' }
            ] as const).map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`py-1.5 px-2.5 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1.5 ${
                  category === cat.id
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400 font-bold'
                    : 'border-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200'
                }`}
                id={`category-${cat.id}`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Difficulty Ranking */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Quest Rank & Diff</span>
            <div className="flex gap-1.5">
              {([
                { rank: 'D', reward: '10' },
                { rank: 'C', reward: '20' },
                { rank: 'B', reward: '40' },
                { rank: 'A', reward: '80' },
                { rank: 'S', reward: '150' },
              ] as const).map(({ rank, reward }) => (
                <button
                  key={rank}
                  type="button"
                  onClick={() => setDifficulty(rank)}
                  className={`flex-1 flex flex-col items-center justify-center py-1 rounded-lg border transition-all text-xs ${
                    difficulty === rank
                      ? 'bg-rose-500/10 border-rose-500 text-rose-400 font-bold'
                      : 'border-white/5 text-slate-500 hover:border-white/10 hover:text-slate-300'
                  }`}
                  id={`difficulty-rank-${rank}`}
                  title={`${reward} Gold & XP`}
                >
                  <span className="text-sm font-bold tracking-tight">{rank}</span>
                  <span className="text-[8px] opacity-70 font-mono">+{reward}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Row 3: Additional details */}
          <div className="flex gap-4">
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Priority Gate</span>
              <div className="flex gap-1">
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1.5 text-[10px] uppercase font-mono rounded-lg border transition-all ${
                      priority === p
                        ? p === 'high' ? 'bg-red-500/10 border-red-500 text-red-400' 
                          : p === 'medium' ? 'bg-amber-500/10 border-amber-500 text-amber-400'
                          : 'bg-slate-500/20 border-slate-400 text-slate-300'
                        : 'border-white/5 text-slate-500'
                    }`}
                    id={`priority-picker-${p}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Quest Deadline</span>
              <div className="relative flex items-center justify-center">
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-slate-900/30 border border-white/5 rounded-lg px-2.5 py-1.5 text-xs font-mono outline-none text-slate-400 focus:border-indigo-500/30 h-full"
                  id="due-date-picker"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
