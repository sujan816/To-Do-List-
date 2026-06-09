/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Trash2, Calendar, BookOpen, Dumbbell, Home, Palette, 
  Sparkles, ChevronDown, ChevronUp, CheckSquare, Square, RefreshCw, AlertCircle
} from 'lucide-react';
import { Task, SubTask } from '../types';
import { sfx } from '../lib/audioSynth';
import { breakdownQuest } from '../lib/geminiHelper';

interface TaskItemProps {
  key?: string;
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  geminiKey: string;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdateTask, geminiKey }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newSubText, setNewSubText] = useState('');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const rankColors: Record<string, string> = {
    'S': 'text-rose-500 border-rose-500 bg-rose-500/5',
    'A': 'text-amber-500 border-amber-500 bg-amber-500/5',
    'B': 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5',
    'C': 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5',
    'D': 'text-slate-400 border-white/5 bg-slate-400/5',
  };

  const categoryIcons = {
    study: <BookOpen className="w-3.5 h-3.5 text-indigo-400" />,
    fitness: <Dumbbell className="w-3.5 h-3.5 text-rose-400" />,
    chores: <Home className="w-3.5 h-3.5 text-emerald-400" />,
    creative: <Palette className="w-3.5 h-3.5 text-pink-400" />,
    routine: <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />,
  };

  const handleToggleSub = (subId: string) => {
    sfx.playClick();
    if (!task.subTasks) return;
    const updated = task.subTasks.map((st) => 
      st.id === subId ? { ...st, completed: !st.completed } : st
    );
    onUpdateTask(task.id, { subTasks: updated });
  };

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubText.trim()) return;
    sfx.playClick();
    
    const newSub: SubTask = {
      id: Date.now().toString(),
      text: newSubText.trim(),
      completed: false
    };

    const currentSubs = task.subTasks || [];
    onUpdateTask(task.id, { subTasks: [...currentSubs, newSub] });
    setNewSubText('');
  };

  const handleDeleteSub = (subId: string) => {
    sfx.playClick();
    if (!task.subTasks) return;
    const updated = task.subTasks.filter((st) => st.id !== subId);
    onUpdateTask(task.id, { subTasks: updated });
  };

  const handleSmartBreakdown = async () => {
    sfx.playClick();
    setIsGenerating(true);

    if (geminiKey) {
      const steps = await breakdownQuest(geminiKey, task.text);
      const newSubs: SubTask[] = steps.map((s, idx) => ({
        id: `${Date.now()}-${idx}`,
        text: s,
        completed: false
      }));
      onUpdateTask(task.id, { subTasks: newSubs });
    } else {
      // Offline fallback generator based on category
      setTimeout(() => {
        const fallbacks: Record<string, string[]> = {
          study: ["Locate quiet study workspace", "Set 25-minute Pomodoro block", "Eliminate phone distraction", "Submit or file progress review"],
          fitness: ["Warm up safely for 5 minutes", "Execute core training routine set", "Stretch major limbs and cool down", "Rehydrate fully"],
          chores: ["Gather all primary cleaning tools", "Execute task stage-by-stage", "Discard garbage wastes securely", "Wash and storage materials"],
          creative: ["Draft high level design layout", "Execute standard focus drawing/coding", "Review spacing visual details", "Export and save project backup"],
          routine: ["Prepare relevant environment items", "Complete focused habit loop", "Reflect and record progress logs"]
        };
        const steps = fallbacks[task.category] || fallbacks.routine;
        const newSubs: SubTask[] = steps.map((s, idx) => ({
          id: `${Date.now()}-${idx}`,
          text: s,
          completed: false
        }));
        onUpdateTask(task.id, { subTasks: newSubs });
        setIsGenerating(false);
      }, 700);
      return;
    }
    setIsGenerating(false);
  };

  const formatQuestDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const percentComplete = () => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const finished = task.subTasks.filter(s => s.completed).length;
    return Math.round((finished / task.subTasks.length) * 100);
  };

  if (isConfirmingDelete) {
    return (
      <div 
        className="bg-red-950/20 border border-red-550/20 hover:border-red-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors shadow-2xl"
        id={`quest-abandon-confirm-${task.id}`}
      >
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Trash2 className="w-5 h-5 text-rose-500 flex-shrink-0 animate-bounce" />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-mono font-bold text-rose-500 uppercase tracking-widest leading-none">ABANDON BOUNTY QUEST?</h4>
            <p className="text-xs text-slate-400 font-semibold truncate mt-1">"{task.text}" (Reward and gold progress will be lost)</p>
          </div>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              sfx.playClick();
              onDelete(task.id);
            }}
            className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-red-650 to-rose-650 hover:from-red-500 hover:to-rose-500 text-white rounded-xl transition-all cursor-pointer shadow-lg"
            id={`confirm-abandon-${task.id}`}
          >
            Abandon
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setIsConfirmingDelete(false);
            }}
            className="px-3.5 py-1.5 text-xs font-medium bg-slate-900 border border-white/5 text-slate-400 hover:text-slate-200 rounded-xl transition-all cursor-pointer"
            id={`cancel-abandon-${task.id}`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/40 border border-white/5 hover:border-white/10 rounded-2xl overflow-hidden transition-all shadow-xl hover:shadow-2xl" id={`quest-card-${task.id}`}>
      {/* Primary header panel toggling expansion */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-4 flex items-center justify-between cursor-pointer group gap-4 select-none"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Custom Checkbox Action on main check */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              sfx.playQuestComplete();
              onToggle(task.id);
            }}
            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 ${
              task.completed 
                ? 'bg-emerald-500 border-emerald-500 text-slate-950' 
                : 'border-white/15 group-hover:border-indigo-500 text-transparent hover:bg-indigo-500/10'
            }`}
            id={`toggle-checkbox-${task.id}`}
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          {/* Quest details */}
          <div className="min-w-0 flex-1">
            <h4 className={`text-sm font-semibold truncate leading-snug ${
              task.completed ? 'line-through text-slate-500' : 'text-slate-100 group-hover:text-indigo-400'
            }`}>
              {task.text}
            </h4>
            
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {/* Category */}
              <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                {categoryIcons[task.category] || categoryIcons.routine}
                <span className="capitalize">{task.category}</span>
              </div>

              {/* Priority marker */}
              {task.priority === 'high' && (
                <span className="text-[8px] tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-1 py-0.5 rounded font-bold font-mono">
                  CRITICAL
                </span>
              )}

              {/* Due Date */}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                  <Calendar className="w-3 h-3" />
                  <span>{formatQuestDate(task.dueDate)}</span>
                </div>
              )}

              {/* Subtasks percentage bar */}
              {task.subTasks && task.subTasks.length > 0 && (
                <span className="text-[10px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1.5 py-0.5 rounded">
                  {percentComplete()}% STEPS
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Difficulty badge & expand toggle */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border ${rankColors[task.difficulty] || rankColors.D}`}>
            {task.difficulty}-RANK
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              sfx.playClick();
              setIsConfirmingDelete(true);
            }}
            className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/5 transition-colors"
            title="Abandon Quest"
            id={`quick-delete-task-btn-${task.id}`}
          >
            <Trash2 className="w-4.5 h-4.5" />
          </button>

          <div className="text-slate-500 group-hover:text-slate-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded sub-details drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-slate-950/20 px-4 pb-4.5 pt-3 space-y-4"
          >
            {/* Notes Section */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">QUEST RECORD NOTES</span>
              <textarea
                value={task.notes || ''}
                onChange={(e) => onUpdateTask(task.id, { notes: e.target.value })}
                placeholder="Log secondary quest notes, guidelines, or details..."
                className="w-full bg-slate-950/40 border border-white/5 rounded-xl p-2.5 text-xs outline-none focus:border-indigo-500/20 text-slate-300 resize-none h-14"
                id={`notes-textarea-${task.id}`}
              />
            </div>

            {/* Sub-steps checklists */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase font-mono tracking-wider text-slate-500">QUEST STEPS CYCLE</span>
                <button
                  type="button"
                  onClick={handleSmartBreakdown}
                  disabled={isGenerating}
                  className="text-[9px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 py-1 px-2.5 rounded-lg flex items-center gap-1.5 font-mono cursor-pointer disabled:opacity-50"
                  id={`smart-breakdown-${task.id}`}
                >
                  <RefreshCw className={`w-3 h-3 ${isGenerating ? 'animate-spin' : ''}`} />
                  <span>{geminiKey ? "AI RE-GENERATE STEPS" : "FILL SAMPLE STEPS"}</span>
                </button>
              </div>

              {/* Steps checklist items */}
              {task.subTasks && task.subTasks.length > 0 ? (
                <div className="space-y-1.5">
                  {task.subTasks.map((st) => (
                    <div 
                      key={st.id} 
                      className="flex items-center justify-between bg-slate-950/30 p-2.5 rounded-lg border border-white/5 hover:border-white/10"
                    >
                      <button
                        onClick={() => handleToggleSub(st.id)}
                        className="flex items-center gap-2.5 text-xs text-left text-slate-300 hover:text-slate-100 flex-grow min-w-0"
                      >
                        {st.completed ? (
                          <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                        ) : (
                          <Square className="w-3.5 h-3.5 text-slate-600 flex-shrink-0 hover:text-indigo-500" />
                        )}
                        <span className={`truncate ${st.completed ? 'line-through text-slate-500' : ''}`}>
                          {st.text}
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeleteSub(st.id)}
                        className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-rose-500/5 transition-colors"
                        title="Delete Step"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-3 text-slate-600 text-[11px] leading-relaxed italic border border-dashed border-white/5 rounded-xl">
                  No sub-steps added yet. Click the button above for automatic breakdown!
                </div>
              )}

              {/* Add manual step text input */}
              <form onSubmit={handleAddSub} className="flex gap-2 pt-1.5">
                <input
                  type="text"
                  value={newSubText}
                  onChange={(e) => setNewSubText(e.target.value)}
                  placeholder="Insert custom manual sub-step..."
                  className="flex-grow bg-slate-950/60 border border-white/5 rounded-lg px-2.5 py-1.5 text-[11px] outline-none text-slate-300 focus:border-indigo-400/20"
                  id={`add-sub-input-${task.id}`}
                />
                <button
                  type="submit"
                  disabled={!newSubText.trim()}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold px-3.5 rounded-lg disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Add Step
                </button>
              </form>
            </div>

            {/* Delete Quest Button */}
            <div className="flex justify-between items-center pt-2.5 border-t border-white/5">
              {!geminiKey && (
                <div className="flex items-center gap-1.5 text-[9px] text-slate-500 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-600" />
                  <span>Activating AI Mentor unlocks customized steps.</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => {
                  sfx.playClick();
                  setIsConfirmingDelete(true);
                }}
                className="ml-auto text-xs font-semibold text-rose-500 hover:text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                id={`delete-task-btn-${task.id}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Abandon Quest</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
