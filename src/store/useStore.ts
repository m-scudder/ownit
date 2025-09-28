import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, Completion, Habit, HabitSchedule, RootState, ThemeMode } from '../types';
import { formatDateKey } from '../utils/dates';

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

interface Actions {
  addCategory: (name: string) => string;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  addHabit: (input: { name: string; categoryId?: string | null; schedule: HabitSchedule }) => string;
  updateHabit: (id: string, updates: Partial<Pick<Habit, 'name' | 'categoryId' | 'schedule'>>) => void;
  deleteHabit: (id: string) => void;

  completeHabitToday: (habitId: string, note: string, date?: Date) => void;
  removeCompletion: (completionId: string) => void;

  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export const useStore = create<RootState & Actions>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      habits: [],
      categories: [],
      completions: [],

      addCategory: (name) => {
        const id = generateId();
        const next: Category = { id, name, createdAt: new Date().toISOString() };
        set((s) => ({ categories: [next, ...s.categories] }));
        return id;
      },
      updateCategory: (id, name) => {
        set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)) }));
      },
      deleteCategory: (id) => {
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          habits: s.habits.map((h) => (h.categoryId === id ? { ...h, categoryId: null } : h))
        }));
      },

      addHabit: ({ name, categoryId = null, schedule }) => {
        const id = generateId();
        const next: Habit = { id, name, categoryId, schedule, createdAt: new Date().toISOString() };
        set((s) => ({ habits: [next, ...s.habits] }));
        return id;
      },
      updateHabit: (id, updates) => {
        set((s) => ({ habits: s.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)) }));
      },
      deleteHabit: (id) => {
        set((s) => ({
          habits: s.habits.filter((h) => h.id !== id),
          completions: s.completions.filter((c) => c.habitId !== id)
        }));
      },

      completeHabitToday: (habitId, note, date = new Date()) => {
        const key = formatDateKey(date);
        const exists = get().completions.find((c) => c.habitId === habitId && c.date === key);
        if (exists) return; // do not duplicate per-day
        const next: Completion = {
          id: generateId(),
          habitId,
          date: key,
          note,
          createdAt: new Date().toISOString()
        };
        set((s) => ({ completions: [next, ...s.completions] }));
      },
      removeCompletion: (completionId) => {
        set((s) => ({ completions: s.completions.filter((c) => c.id !== completionId) }));
      },

      setTheme: (mode) => set(() => ({ theme: mode })),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' }))
    }),
    {
      name: 'ownit-store',
      storage: createJSONStorage(() => AsyncStorage)
    }
  )
);
