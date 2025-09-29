import React, { useMemo } from 'react';
import { FlatList, View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Screen, Title, TextBody, Button } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import type { Habit, Completion, Category } from '../types';

const AllHabitsScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { habits, completions, categories, deleteHabit } = useStore();
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

  const handleDeleteHabit = (habit: Habit) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to delete "${habit.name}"? This will remove the habit and all its completions.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => deleteHabit(habit.id) 
        }
      ]
    );
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
        onPress={() => navigation.navigate('HabitForm', { id: habit.id })}
        activeOpacity={0.7}
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
        
        <View style={styles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color={colors.text === '#FFFFFF' ? '#CCCCCC' : '#666666'} 
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderHiddenItem = ({ item }: { item: { type: 'header' | 'habit'; categoryName?: string; habit?: Habit } }) => {
    if (item.type === 'header') {
      return <View style={{ height: 0 }} />;
    }

    const habit = item.habit!;

    return (
      <View style={styles.hiddenItemContainer}>
        <TouchableOpacity
          style={[styles.hiddenButton, styles.deleteButton, { backgroundColor: '#FF4444' }]}
          onPress={() => handleDeleteHabit(habit)}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <TextBody style={styles.hiddenButtonText}>Delete</TextBody>
        </TouchableOpacity>
      </View>
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
        <SwipeListView
          data={categorizedHabits}
          keyExtractor={(item, index) => 
            item.type === 'header' ? `header-${item.categoryName}` : `habit-${item.habit!.id}`
          }
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-80}
          disableRightSwipe={true}
          showsVerticalScrollIndicator={false}
          stopRightSwipe={-80}
          stopLeftSwipe={0}
          swipeToOpenPercent={30}
          swipeToClosePercent={15}
          friction={1000}
          tension={100}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  habitContent: {
    flex: 1,
  },
  arrowContainer: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
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
  hiddenItemContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  hiddenButton: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  deleteButton: {
    backgroundColor: '#FF4444',
  },
  hiddenButtonText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
});

export default AllHabitsScreen;
