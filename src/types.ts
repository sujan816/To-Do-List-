/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  userId: string;
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
