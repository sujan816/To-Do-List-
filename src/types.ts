/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SubTask {
  id: string;
  text: string;
  completed: boolean;
}

export type QuestCategory = 'study' | 'fitness' | 'chores' | 'creative' | 'routine';
export type QuestDifficulty = 'D' | 'C' | 'B' | 'A' | 'S';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  subTasks?: SubTask[];
  notes?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  gold: number;
  lastActiveDate?: string;
  selectedCompanion: 'hikari' | 'ren' | 'kuro';
  activeTheme: 'sakura' | 'tokyo' | 'dungeon' | 'retro' | 'onepiece' | 'naruto' | 'deathnote' | 'breakingbad' | 'got';
  ownedThemes: string[];
  avatarId: string;
  ownedAvatars: string[];
  title: string;
  ownedTitles: string[];
  stats: {
    mind: number;       // Study
    vitality: number;   // Fitness
    discipline: number; // Chores
    creative: number;   // Creative
    spirit: number;     // Routine / Pomodoro
  };
}

export type FilterType = 'all' | 'completed' | 'pending';

export const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  primary: '#6366f1',
  accent: '#22c55e',
  danger: '#ef4444',
  text: '#f8fafc',
  textMuted: '#94a3b8',
};
