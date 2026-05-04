/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { LayoutList, Ghost, LogOut, User as UserIcon } from 'lucide-react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Task, FilterType } from './types';
import TaskInput from './components/TaskInput';
import TaskItem from './components/TaskItem';
import TaskFilters from './components/TaskFilters';
import Auth from './components/Auth';
import { auth, logout } from './lib/firebase';
import { 
  subscribeToTasks, 
  addTaskDB, 
  updateTaskDB, 
  deleteTaskDB, 
  ensureUserDoc 
} from './lib/firestoreService';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
      if (u) {
        ensureUserDoc(u.uid, u.email || '', u.displayName || '', u.photoURL || '');
      }
    });
    return unsubscribe;
  }, []);

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

  const addTask = async (text: string, priority: 'low' | 'medium' | 'high', dueDate?: string) => {
    if (!user) return;
    await addTaskDB(user.uid, {
      text,
      completed: false,
      priority,
      dueDate,
      createdAt: Date.now(),
      userId: user.uid,
    });
  };

  const toggleTask = async (id: string) => {
    if (!user) return;
    const task = tasks.find(t => t.id === id);
    if (task) {
      await updateTaskDB(user.uid, id, { completed: !task.completed });
    }
  };

  const deleteTask = async (id: string) => {
    if (!user) return;
    await deleteTaskDB(user.uid, id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 bg-anime-primary rounded-xl shadow-lg glow-primary"
        />
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex flex-col items-center py-12 px-4 selection:bg-indigo-500/30">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
      
      <main className="w-full max-w-2xl z-10">
        <header className="flex items-center justify-between mb-10 px-2" id="app-header">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-anime-primary rounded-2xl flex items-center justify-center shadow-lg glow-primary transform -rotate-3 overflow-hidden">
              <LayoutList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                AniTask <span className="text-xs font-mono text-anime-primary bg-anime-primary/10 px-1.5 py-0.5 rounded">v1.1</span>
              </h1>
              <p className="text-slate-500 text-sm font-mono uppercase tracking-[0.2em]">Efficiency Protocol Activated</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-mono text-slate-300 uppercase tracking-wider">{user.displayName}</p>
              <p className="text-[10px] font-mono text-slate-600 uppercase">Authenticated</p>
            </div>
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-xl border border-white/10" />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10">
                <UserIcon className="w-5 h-5 text-slate-500" />
              </div>
            )}
            <button 
              onClick={logout}
              className="p-2 text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
              id="logout-btn"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        <TaskInput onAdd={addTask} />

        <TaskFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
          count={activeCount} 
        />

        <div className="space-y-4 min-h-[300px]">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-20 text-slate-600"
                id="empty-state"
              >
                <Ghost className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-mono text-xs uppercase tracking-widest">No activities detected in current sector</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="mt-12 text-center border-t border-white/5 pt-8">
          <p className="text-[10px] items-center justify-center gap-3 font-mono text-slate-600 uppercase tracking-widest flex">
            <span>Built by Sujan</span>
            <span className="w-1 h-1 bg-slate-700 rounded-full" />
            <span>2026 Proto-App</span>
          </p>
        </footer>
      </main>
    </div>
  );
}

