export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0=Sunday

export interface HabitSchedule {
  type: FrequencyType;
  daysOfWeek?: DayOfWeek[]; // weekly/custom
  daysOfMonth?: number[]; // monthly (1-31)
}

export interface Habit {
  id: string;
  name: string;
  categoryId?: string | null;
  schedule: HabitSchedule;
  createdAt: string; // ISO
}

export interface Category {
  id: string;
  name: string;
  createdAt: string; // ISO
}

export interface Completion {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  note: string;
  createdAt: string; // ISO
}

export interface RootState {
  habits: Habit[];
  categories: Category[];
  completions: Completion[];
}
