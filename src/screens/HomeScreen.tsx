import React, { useMemo, useState } from 'react';
import { FlatList, View, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Screen, Title, TextBody } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { HabitItem } from '../components/HabitItem';
import { formatDateKey, isHabitDueOnDate, isCompletedOnDate } from '@/utils/dates';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/useTheme';
import { format } from 'date-fns';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { habits, completions, completeHabitToday } = useStore();
  const { colors } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(formatDateKey(new Date()));
  
  const todayKey = formatDateKey(new Date());
  const today = new Date();

  // Get habits that were due on the selected date
  const items = useMemo(() => {
    const date = new Date(selectedDate);
    return habits.filter(habit => isHabitDueOnDate(habit, date));
  }, [habits, selectedDate]);

  // Mark dates with completed habits
  const markedDates = useMemo(() => {
    const marked: any = {};
    
    // Mark today
    const today = formatDateKey(new Date());
    marked[today] = {
      marked: true,
      dotColor: colors.primary,
      selectedColor: colors.primary,
    };

    // Mark selected date
    if (selectedDate !== today) {
      marked[selectedDate] = {
        selected: true,
        selectedColor: colors.primary,
      };
    }

    // Mark dates with completions
    const completionDates = [...new Set(completions.map(c => c.date))];
    completionDates.forEach(date => {
      if (date !== selectedDate && date !== today) {
        marked[date] = {
          marked: true,
          dotColor: colors.success || '#4CAF50',
        };
      }
    });

    return marked;
  }, [selectedDate, completions, colors]);

  const calendarTheme = {
    backgroundColor: colors.background,
    calendarBackground: colors.background,
    textSectionTitleColor: colors.text,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#ffffff',
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.subtext,
    dotColor: colors.primary,
    selectedDotColor: '#ffffff',
    arrowColor: colors.text,
    disabledArrowColor: colors.subtext,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: '500' as const,
    textMonthFontWeight: 'bold' as const,
    textDayHeaderFontWeight: '600' as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
  };

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <Title>{selectedDate === todayKey ? 'Today' : format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</Title>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.border
          }}
        >
          <Ionicons name="calendar-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <TextBody>No habits yet. Add your first habit.</TextBody>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(h) => h.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              completions={completions}
              selectedDate={new Date(selectedDate)}
              onPress={() => navigation.navigate('HabitDetail', { id: item.id })}
              onComplete={() => navigation.navigate('HabitDetail', { id: item.id, focusNote: true })}
            />
          )}
        />
      )}

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.modalHeader}>
              <Title>Select Date</Title>
              <TouchableOpacity
                onPress={() => setShowCalendar(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Calendar
              onDayPress={(day) => {
                setSelectedDate(day.dateString);
                setShowCalendar(false);
              }}
              markedDates={markedDates}
              theme={calendarTheme}
              style={styles.calendar}
            />
          </View>
        </View>
      </Modal>
    </Screen>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  calendar: {
    borderRadius: 8,
  },
});

export default HomeScreen;
