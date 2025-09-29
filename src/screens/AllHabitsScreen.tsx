import React from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen, Title, TextBody, Button } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
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
    const categoryName = getCategoryName(habit.categoryId);
    const scheduleText = getScheduleText(habit);

    return (
      <TouchableOpacity 
        style={[styles.habitItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
        onPress={() => navigation.navigate('HabitDetail', { id: habit.id })}
      >
        <View style={styles.habitContent}>
          <TextBody style={{ ...styles.habitName, color: colors.text }}>{habit.name}</TextBody>
          
          <View style={styles.habitMeta}>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              {categoryName}
            </TextBody>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              {scheduleText}
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
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderHabitItem}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
};

const styles = StyleSheet.create({
  ctaContainer: {
    marginBottom: 12,
  },
  habitItem: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  habitContent: {
    flex: 1,
  },
  habitName: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  habitMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 13,
    color: '#666',
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
