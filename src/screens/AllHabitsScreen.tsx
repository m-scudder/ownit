import React, { useMemo } from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Screen, Title, TextBody, Button } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import type { Habit, Completion, Category } from '../types';

const AllHabitsScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { habits, completions, categories } = useStore();
  const { colors } = useTheme();

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return 'No Category';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  // Group habits by category and sort alphabetically
  const categorizedHabits = useMemo(() => {
    const grouped: { [key: string]: Habit[] } = {};
    
    // Group habits by category
    habits.forEach(habit => {
      const categoryName = getCategoryName(habit.categoryId);
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(habit);
    });
    
    // Sort categories alphabetically and sort habits within each category
    const sortedCategories = Object.keys(grouped).sort();
    const result: Array<{ type: 'header' | 'habit'; categoryName?: string; habit?: Habit }> = [];
    
    sortedCategories.forEach(categoryName => {
      // Add category header
      result.push({ type: 'header', categoryName });
      
      // Add habits sorted alphabetically
      const sortedHabits = grouped[categoryName].sort((a, b) => a.name.localeCompare(b.name));
      sortedHabits.forEach(habit => {
        result.push({ type: 'habit', habit });
      });
    });
    
    return result;
  }, [habits, categories]);

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

  const renderItem = ({ item }: { item: { type: 'header' | 'habit'; categoryName?: string; habit?: Habit } }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.categoryHeader}>
          <Title style={{ ...styles.categoryTitle, color: colors.text }}>
            {item.categoryName}
          </Title>
        </View>
      );
    }

    const habit = item.habit!;
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
          data={categorizedHabits}
          keyExtractor={(item, index) => 
            item.type === 'header' ? `header-${item.categoryName}` : `habit-${item.habit!.id}`
          }
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderItem}
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
  categoryHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
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
