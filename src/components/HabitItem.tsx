import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Habit, Completion } from '../types';
import { colors } from '../theme/colors';
import { calculateCurrentStreak, isHabitDueOnDate } from '../utils/dates';

interface Props {
  habit: Habit;
  completions: Completion[];
  onPress: () => void;
  onComplete: () => void;
}

const HabitItemComponent: React.FC<Props> = ({ habit, completions, onPress, onComplete }) => {
  const streak = calculateCurrentStreak(habit, completions);
  const dueToday = isHabitDueOnDate(habit, new Date());
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{habit.name}</Text>
        <Text style={styles.meta}>Streak: {streak}</Text>
      </View>
      {dueToday && (
        <TouchableOpacity onPress={onComplete} style={styles.completeBtn}>
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export const HabitItem = memo(HabitItemComponent);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center'
  },
  name: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600'
  },
  meta: {
    color: colors.subtext,
    marginTop: 4
  },
  completeBtn: {
    backgroundColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8
  },
  completeText: {
    color: colors.text,
    fontWeight: '600'
  }
});
