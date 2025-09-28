import { format, subDays } from 'date-fns';
import type { Completion, Habit } from '../types';

export const formatDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export const isHabitDueOnDate = (habit: Habit, date: Date): boolean => {
  const dow = date.getDay() as 0 | 1 | 2 | 3 | 4 | 5 | 6;
  const dom = date.getDate();
  const { schedule } = habit;
  switch (schedule.type) {
    case 'daily':
      return true;
    case 'weekly':
      return (schedule.daysOfWeek ?? []).includes(dow);
    case 'custom':
      return (schedule.daysOfWeek ?? []).includes(dow);
    case 'monthly':
      return (schedule.daysOfMonth ?? []).includes(dom);
    default:
      return false;
  }
};

export const isCompletedOnDate = (
  habitId: string,
  date: Date,
  completions: Completion[]
): boolean => {
  const key = formatDateKey(date);
  return completions.some((c) => c.habitId === habitId && c.date === key);
};

export const calculateCurrentStreak = (
  habit: Habit,
  completions: Completion[],
  today: Date = new Date(),
  maxLookbackDays = 365
): number => {
  let streak = 0;
  let cursor = today;
  for (let i = 0; i < maxLookbackDays; i += 1) {
    const due = isHabitDueOnDate(habit, cursor);
    if (!due) {
      cursor = subDays(cursor, 1);
      continue;
    }
    const completed = isCompletedOnDate(habit.id, cursor, completions);
    if (!completed) break;
    streak += 1;
    cursor = subDays(cursor, 1);
  }
  return streak;
};

export const sortByDateDesc = (a: string, b: string): number => (a > b ? -1 : 1);

export const toDayLabel = (d: number): string => ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d] ?? '';
