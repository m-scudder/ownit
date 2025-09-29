import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import type { Habit, HabitReminder, DayOfWeek } from '../types';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Request permissions for notifications
export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Notification permission denied');
    return false;
  }
  
  return true;
}

// Schedule notifications for a habit
export async function scheduleHabitNotifications(habit: Habit): Promise<void> {
  if (!habit.reminder?.enabled || !habit.reminder.time) {
    return;
  }

  // Cancel existing notifications for this habit
  await cancelHabitNotifications(habit.id);

  const [hours, minutes] = habit.reminder.time.split(':').map(Number);
  
  // Determine which days to schedule notifications
  let daysToSchedule: DayOfWeek[] = [];
  
  if (habit.reminder.daysOfWeek && habit.reminder.daysOfWeek.length > 0) {
    // Use specific reminder days
    daysToSchedule = habit.reminder.daysOfWeek;
  } else {
    // Use habit schedule days
    switch (habit.schedule.type) {
      case 'daily':
        daysToSchedule = [0, 1, 2, 3, 4, 5, 6]; // All days
        break;
      case 'weekly':
      case 'custom':
        daysToSchedule = habit.schedule.daysOfWeek || [];
        break;
      case 'monthly':
        // For monthly habits, schedule daily notifications
        daysToSchedule = [0, 1, 2, 3, 4, 5, 6];
        break;
    }
  }

  // Schedule notifications for each day
  for (const dayOfWeek of daysToSchedule) {
    const notificationId = `${habit.id}-${dayOfWeek}`;
    
    await Notifications.scheduleNotificationAsync({
      identifier: notificationId,
      content: {
        title: 'Habit Reminder',
        body: `Time to ${habit.name.toLowerCase()}!`,
        sound: true,
        data: { habitId: habit.id, dayOfWeek },
      },
      trigger: {
        weekday: dayOfWeek + 1, // Expo uses 1-7 (Monday-Sunday)
        hour: hours,
        minute: minutes,
        repeats: true,
      } as any,
    });
  }
}

// Cancel all notifications for a habit
export async function cancelHabitNotifications(habitId: string): Promise<void> {
  const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
  
  for (const notification of scheduledNotifications) {
    if (notification.identifier.startsWith(`${habitId}-`)) {
      await Notifications.cancelScheduledNotificationAsync(notification.identifier);
    }
  }
}

// Cancel all notifications
export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

// Get all scheduled notifications
export async function getScheduledNotifications() {
  return await Notifications.getAllScheduledNotificationsAsync();
}

// Update notifications when habit is updated
export async function updateHabitNotifications(habit: Habit): Promise<void> {
  await scheduleHabitNotifications(habit);
}

// Schedule notifications for all habits with reminders
export async function scheduleAllHabitNotifications(habits: Habit[]): Promise<void> {
  for (const habit of habits) {
    if (habit.reminder?.enabled) {
      await scheduleHabitNotifications(habit);
    }
  }
}
