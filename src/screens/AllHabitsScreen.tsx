import React from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen, Title, TextBody, Button } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import { calculateCurrentStreak, isHabitDueOnDate } from '../utils/dates';
import { useNavigation } from '@react-navigation/native';
import type { Habit, Completion } from '../types';

const AllHabitsScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { habits, completions, categories } = useStore();
  const { colors } = useTheme();

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getScheduleText = (habit: Habit) => {
    const { schedule } = habit;
    switch (schedule.type) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return `Weekly (${schedule.daysOfWeek?.length || 0} days)`;
      case 'monthly':
        return `Monthly (${schedule.daysOfMonth?.length || 0} days)`;
      case 'custom':
        return 'Custom';
      default:
        return 'Unknown';
    }
  };

  const renderHabitItem = ({ item: habit }: { item: Habit }) => {
    const streak = calculateCurrentStreak(habit, completions);
    const dueToday = isHabitDueOnDate(habit, new Date());
    const categoryName = getCategoryName(habit.categoryId);
    const scheduleText = getScheduleText(habit);

    return (
      <TouchableOpacity 
        style={[styles.habitItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('HabitDetail', { id: habit.id })}
      >
        <View style={styles.habitContent}>
          <View style={styles.habitHeader}>
            <TextBody style={{ ...styles.habitName, color: colors.text }}>{habit.name}</TextBody>
            {dueToday && (
              <View style={[styles.dueBadge, { backgroundColor: colors.primary }]}>
                <TextBody style={{ ...styles.dueText, color: colors.background }}>Due Today</TextBody>
              </View>
            )}
          </View>
          
          <View style={styles.habitMeta}>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              Category: {categoryName}
            </TextBody>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              Schedule: {scheduleText}
            </TextBody>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              Streak: {streak} days
            </TextBody>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Screen>     
      {/* Add Habit CTA */}
      <View style={styles.ctaContainer}>
        <Button 
          label="Add New Habit" 
          onPress={() => navigation.navigate('HabitForm')}
        />
      </View>
      
      {habits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextBody style={{ ...styles.emptyText, color: colors.subtext }}>
            No habits yet. Add your first habit to get started.
          </TextBody>
        </View>
      ) : (
        <FlatList
          data={habits}
          keyExtractor={(habit) => habit.id}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          renderItem={renderHabitItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  ctaContainer: {
    marginBottom: 20,
  },
  habitItem: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  habitContent: {
    flex: 1,
  },
  habitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  dueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dueText: {
    fontSize: 12,
    fontWeight: '600',
  },
  habitMeta: {
    gap: 4,
  },
  metaText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default AllHabitsScreen;
