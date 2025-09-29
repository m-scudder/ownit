import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Category, Completion, Habit, HabitSchedule, RootState, ThemeMode } from '../types';
import { formatDateKey } from '../utils/dates';

// Suggested categories for first-time users
const SUGGESTED_CATEGORIES = [
  'Health & Fitness',
  'Mind & Well-being',
  'Productivity & Learning',
  'Personal Growth & Lifestyle'
];

// Smart habit suggestions based on categories
const SMART_HABIT_SUGGESTIONS: Record<string, string[]> = {
  'Health & Fitness': [
    'Drink 8 glasses of water',
    'Exercise for 30 minutes',
    'Take 10,000 steps',
    'Eat 5 servings of fruits/vegetables',
    'Get 8 hours of sleep',
    'Stretch for 10 minutes',
    'Take vitamins',
    'Walk outside for 15 minutes'
  ],
  'Mind & Well-being': [
    'Meditate for 10 minutes',
    'Practice gratitude',
    'Journal for 5 minutes',
    'Take deep breaths',
    'Practice mindfulness',
    'Read for 20 minutes',
    'Listen to calming music',
    'Take a digital detox break'
  ],
  'Productivity & Learning': [
    'Read for 30 minutes',
    'Learn something new',
    'Practice a skill',
    'Review daily goals',
    'Organize workspace',
    'Take notes',
    'Complete one important task',
    'Plan tomorrow'
  ],
  'Personal Growth & Lifestyle': [
    'Practice a hobby',
    'Connect with friends/family',
    'Declutter one area',
    'Try something new',
    'Practice self-care',
    'Set personal boundaries',
    'Express creativity',
    'Reflect on values'
  ]
};

// Smart category icons/emojis
const CATEGORY_ICONS: Record<string, string> = {
  'Health & Fitness': '💪',
  'Mind & Well-being': '🧘',
  'Productivity & Learning': '📚',
  'Personal Growth & Lifestyle': '🌱'
};

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

interface Actions {
  addCategory: (name: string) => string;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;
  getSuggestedCategories: () => string[];
  getSmartHabitSuggestions: (categoryName: string) => string[];
  getCategoryIcon: (categoryName: string) => string;
  getSmartScheduleSuggestion: (categoryName: string) => HabitSchedule;

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
      getSuggestedCategories: () => SUGGESTED_CATEGORIES,
      getSmartHabitSuggestions: (categoryName: string) => SMART_HABIT_SUGGESTIONS[categoryName] || [],
      getCategoryIcon: (categoryName: string) => CATEGORY_ICONS[categoryName] || '📝',
      getSmartScheduleSuggestion: (categoryName: string) => {
        // Smart scheduling based on category type
        switch (categoryName) {
          case 'Health & Fitness':
            return { type: 'daily' }; // Most health habits are daily
          case 'Mind & Well-being':
            return { type: 'daily' }; // Mindfulness practices are typically daily
          case 'Productivity & Learning':
            return { type: 'weekly', daysOfWeek: [1, 3, 5] }; // Weekdays for learning
          case 'Personal Growth & Lifestyle':
            return { type: 'weekly', daysOfWeek: [0, 6] }; // Weekends for personal time
          default:
            return { type: 'daily' };
        }
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
