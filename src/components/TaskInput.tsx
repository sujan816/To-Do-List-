/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface TaskInputProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => void;
}

export default function TaskInput({ onAdd }: TaskInputProps) {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAdd(text, priority, dueDate || undefined);
    setText('');
    setDueDate('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-8" id="task-form">
      <div className="relative group">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done, Senpai?"
          className="w-full bg-anime-surface/50 border border-white/5 focus:border-anime-primary/50 rounded-2xl py-4 pl-5 pr-14 text-lg outline-none transition-all placeholder:text-slate-600 focus:bg-anime-surface/80 shadow-2xl"
          id="task-input"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-anime-primary text-white rounded-xl shadow-lg glow-primary disabled:opacity-50 disabled:grayscale"
          disabled={!text.trim()}
          type="submit"
          id="add-task-btn"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      <div className="flex flex-wrap items-center gap-4 px-2">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-slate-500 tracking-tighter">Priority:</span>
          {(['low', 'medium', 'high'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`text-[10px] uppercase font-mono px-2 py-1 rounded border transition-all ${
                priority === p 
                  ? 'bg-anime-primary/20 border-anime-primary text-anime-primary' 
                  : 'border-white/5 text-slate-500 hover:border-white/20'
              }`}
              id={`priority-${p}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono text-slate-500 tracking-tighter">Due:</span>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="bg-transparent border border-white/5 rounded px-2 py-0.5 text-[10px] font-mono outline-none text-slate-400 focus:border-anime-primary/30"
            id="due-date-input"
          />
        </div>
        
        <div className="ml-auto flex items-center gap-1 text-anime-primary/40">
          <Sparkles className="w-3 h-3" />
          <span className="text-[10px] uppercase font-mono">Anime Study Vibe</span>
        </div>
      </div>
    </form>
  );
}
