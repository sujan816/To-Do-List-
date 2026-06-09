/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  updateDoc, 
  deleteDoc, 
  query, 
  onSnapshot, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Task, UserStats } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Recursive helper to clean undefined values so that Firestore writes do not crash on optional parameters
const cleanObj = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanObj(item));
  }
  if (typeof obj === 'object') {
    if (obj.constructor === Object) {
      const result: any = {};
      for (const key of Object.keys(obj)) {
        if (obj[key] !== undefined) {
          result[key] = cleanObj(obj[key]);
        }
      }
      return result;
    }
  }
  return obj;
};

export const subscribeToTasks = (userId: string, callback: (tasks: Task[]) => void) => {
  const path = `users/${userId}/tasks`;
  const q = query(collection(db, path), orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const tasks = snapshot.docs.map(doc => {
      const data = doc.data();
      return { 
        id: doc.id, 
        // Backward compatibility fallbacks
        category: data.category || 'routine',
        difficulty: data.difficulty || 'D',
        subTasks: data.subTasks || [],
        notes: data.notes || '',
        ...data 
      } as Task;
    });
    callback(tasks);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
};

export const addTaskDB = async (userId: string, task: Omit<Task, 'id'>) => {
  const path = `users/${userId}/tasks`;
  try {
    const newDocRef = doc(collection(db, path));
    await setDoc(newDocRef, cleanObj({
      ...task,
      userId,
      createdAt: Date.now(), // Firestore rules check this
    }));
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
};

export const updateTaskDB = async (userId: string, taskId: string, updates: Partial<Task>) => {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, cleanObj(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const deleteTaskDB = async (userId: string, taskId: string) => {
  const path = `users/${userId}/tasks/${taskId}`;
  try {
    await deleteDoc(doc(db, path));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

/**
 * Real-time stats listener for the current user.
 */
export const subscribeToUserStats = (userId: string, callback: (stats: UserStats) => void) => {
  const path = `users/${userId}`;
  const docRef = doc(db, path);
  
  return onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.data();
      
      // Inject standard fallbacks if variables are not yet written to Firestore (RPG stats)
      const rpgStats: UserStats = {
        level: data.level ?? 1,
        xp: data.xp ?? 0,
        gold: data.gold ?? 100,
        selectedCompanion: data.selectedCompanion ?? 'hikari',
        activeTheme: data.activeTheme ?? 'sakura',
        ownedThemes: data.ownedThemes ?? ['sakura'],
        avatarId: data.avatarId ?? 'adventurer',
        ownedAvatars: data.ownedAvatars ?? ['adventurer'],
        title: data.title ?? 'Level 1 Adventurer',
        ownedTitles: data.ownedTitles ?? ['Level 1 Adventurer'],
        stats: {
          mind: data.stats?.mind ?? 5,
          vitality: data.stats?.vitality ?? 5,
          discipline: data.stats?.discipline ?? 5,
          creative: data.stats?.creative ?? 5,
          spirit: data.stats?.spirit ?? 5,
        }
      };
      callback(rpgStats);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
};

/**
 * Easy updater for user stats document.
 */
export const updateUserStatsDB = async (userId: string, updates: Partial<UserStats>) => {
  const path = `users/${userId}`;
  try {
    const docRef = doc(db, path);
    await updateDoc(docRef, cleanObj(updates));
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
};

export const ensureUserDoc = async (userId: string, email: string, displayName: string, photoURL: string) => {
  const path = `users/${userId}`;
  try {
    const userDocRef = doc(db, path);
    const docSnap = await getDoc(userDocRef);
    
    // Initialize base profile fields along with RPG defaults if document doesn't exist
    if (!docSnap.exists()) {
      await setDoc(userDocRef, cleanObj({
        email,
        displayName,
        photoURL,
        createdAt: serverTimestamp(),
        // RPG defaults
        level: 1,
        xp: 0,
        gold: 100,
        selectedCompanion: 'hikari',
        activeTheme: 'sakura',
        ownedThemes: ['sakura'],
        avatarId: 'adventurer',
        ownedAvatars: ['adventurer'],
        title: 'Novice Outlaw',
        ownedTitles: ['Novice Outlaw'],
        stats: {
          mind: 5,
          vitality: 5,
          discipline: 5,
          creative: 5,
          spirit: 5,
        }
      }));
    } else {
      // Just update profile fields so we don't wipe active levels
      await setDoc(userDocRef, cleanObj({
        email,
        displayName,
        photoURL,
      }), { merge: true });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};
