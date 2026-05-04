/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Trash2, CheckCircle2, Circle, Calendar } from 'lucide-react';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string;
}

export default function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.01 }}
      className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${
        task.completed 
          ? 'bg-anime-surface/40 border-anime-accent/20 grayscale-[0.5]' 
          : 'bg-anime-surface border-white/5 hover:border-anime-primary/50'
      }`}
      id={`task-${task.id}`}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`flex-shrink-0 transition-colors ${
          task.completed ? 'text-anime-accent' : 'text-slate-500 hover:text-anime-primary'
        }`}
        id={`toggle-${task.id}`}
      >
        {task.completed ? (
          <CheckCircle2 className="w-6 h-6 glow-accent" />
        ) : (
          <Circle className="w-6 h-6" />
        )}
      </button>

      <div className="flex-grow min-w-0">
        <p className={`text-lg font-medium transition-all truncate ${
          task.completed ? 'text-slate-500 line-through' : 'text-slate-200'
        }`}>
          {task.text}
        </p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] uppercase font-mono text-anime-primary/70">
              <Calendar className="w-3 h-3" />
              {task.dueDate}
            </span>
          )}
          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
            task.priority === 'high' ? 'border-red-500/30 text-red-400 bg-red-400/5' :
            task.priority === 'medium' ? 'border-orange-500/30 text-orange-400 bg-orange-400/5' :
            'border-slate-500/30 text-slate-400 bg-slate-400/5'
          }`}>
            {task.priority}
          </span>
        </div>
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-400 transition-all"
        id={`delete-${task.id}`}
        aria-label="Delete task"
      >
        <Trash2 className="w-5 h-5" />
      </button>
    </motion.div>
  );
}
