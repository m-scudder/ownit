import React, { useMemo, useState } from "react";
import {
  FlatList,
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Screen, Title, TextBody } from "../components/Neutral";
import { useStore } from "../store/useStore";
import {
  formatDateKey,
  isHabitDueOnDate,
  isCompletedOnDate,
  calculateCurrentStreak,
  hasReminder,
} from "@/utils/dates";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";
import { format } from "date-fns";
import type { Habit, Completion, Category } from "../types";

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const {
    habits,
    completions,
    categories,
    completeHabitToday,
    removeCompletion,
  } = useStore();
  const { colors } = useTheme();
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateKey(new Date()),
  );

  const todayKey = formatDateKey(new Date());
  const today = new Date();

  const getCategoryName = (categoryId?: string | null) => {
    if (!categoryId) return "No Category";
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown Category";
  };

  const getScheduleText = (habit: Habit) => {
    const { schedule } = habit;
    switch (schedule.type) {
      case "daily":
        return "Daily";
      case "weekly":
        return `Weekly (${schedule.daysOfWeek?.length || 0} days)`;
      case "monthly":
        return `Monthly (${schedule.daysOfMonth?.length || 0} days)`;
      case "custom":
        return "Custom";
      default:
        return "Unknown";
    }
  };

  const handleHabitToggle = (habit: Habit) => {
    const date = new Date(selectedDate);
    const isCompleted = isCompletedOnDate(habit.id, date, completions);

    if (isCompleted) {
      // Find and remove the completion
      const completion = completions.find(
        (c) => c.habitId === habit.id && c.date === selectedDate,
      );
      if (completion) {
        removeCompletion(completion.id);
      }
    } else {
      // Add completion
      completeHabitToday(habit.id, "", date);
    }
  };

  // Get habits that were due on the selected date and group by category
  const categorizedHabits = useMemo(() => {
    const date = new Date(selectedDate);
    const dueHabits = habits.filter((habit) => isHabitDueOnDate(habit, date));

    const grouped: { [key: string]: Habit[] } = {};

    // Group habits by category
    dueHabits.forEach((habit) => {
      const categoryName = getCategoryName(habit.categoryId);
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(habit);
    });

    // Sort categories alphabetically and sort habits within each category
    const sortedCategories = Object.keys(grouped).sort();
    const result: Array<{
      type: "header" | "habit";
      categoryName?: string;
      habit?: Habit;
    }> = [];

    sortedCategories.forEach((categoryName) => {
      // Add category header
      result.push({ type: "header", categoryName });

      // Add habits sorted alphabetically
      const sortedHabits = grouped[categoryName].sort((a, b) =>
        a.name.localeCompare(b.name),
      );
      sortedHabits.forEach((habit) => {
        result.push({ type: "habit", habit });
      });
    });

    return result;
  }, [habits, selectedDate, categories]);

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
    const completionDates = [...new Set(completions.map((c) => c.date))];
    completionDates.forEach((date) => {
      if (date !== selectedDate && date !== today) {
        marked[date] = {
          marked: true,
          dotColor: colors.success || "#4CAF50",
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
    selectedDayTextColor: "#ffffff",
    todayTextColor: colors.primary,
    dayTextColor: colors.text,
    textDisabledColor: colors.subtext,
    dotColor: colors.primary,
    selectedDotColor: "#ffffff",
    arrowColor: colors.text,
    disabledArrowColor: colors.subtext,
    monthTextColor: colors.text,
    indicatorColor: colors.primary,
    textDayFontWeight: "500" as const,
    textMonthFontWeight: "bold" as const,
    textDayHeaderFontWeight: "600" as const,
    textDayFontSize: 16,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 13,
  };

  const renderItem = ({
    item,
  }: {
    item: { type: "header" | "habit"; categoryName?: string; habit?: Habit };
  }) => {
    if (item.type === "header") {
      return (
        <View style={styles.categoryHeader}>
          <Title style={{ ...styles.categoryTitle, color: colors.text }}>
            {item.categoryName}
          </Title>
        </View>
      );
    }

    const habit = item.habit!;
    const streak = calculateCurrentStreak(habit, completions);
    const scheduleText = getScheduleText(habit);
    const date = new Date(selectedDate);
    const isCompleted = isCompletedOnDate(habit.id, date, completions);
    const habitHasReminder = hasReminder(habit);

    return (
      <View
        style={[
          styles.habitItem,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => handleHabitToggle(habit)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.checkbox,
              {
                borderColor: colors.border,
                backgroundColor: isCompleted ? colors.primary : "transparent",
              },
            ]}
          >
            {isCompleted && (
              <Ionicons name="checkmark" size={16} color={colors.background} />
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.habitContent}
          onPress={() => navigation.navigate("HabitDetail", { id: habit.id })}
          activeOpacity={0.7}
        >
          <View style={styles.habitNameContainer}>
            <TextBody
              style={{
                ...styles.habitName,
                color: isCompleted ? colors.subtext : colors.text,
                textDecorationLine: isCompleted ? "line-through" : "none",
              }}
            >
              {habit.name}
            </TextBody>
            {habitHasReminder && (
              <Ionicons
                name="notifications"
                size={16}
                color={colors.primary || "#007AFF"}
                style={styles.reminderIcon}
              />
            )}
          </View>

          <View style={styles.habitMeta}>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              Streak: {streak}
            </TextBody>
            <TextBody style={{ ...styles.metaText, color: colors.subtext }}>
              {scheduleText}
            </TextBody>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Screen>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Title>
          {selectedDate === todayKey
            ? "Today"
            : format(new Date(selectedDate), "EEEE, MMMM d, yyyy")}
        </Title>
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          style={{
            backgroundColor: colors.surface,
            borderRadius: 8,
            padding: 8,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Ionicons name="calendar-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {categorizedHabits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <TextBody style={{ ...styles.emptyText, color: colors.subtext }}>
            No habits due on this date. Add your first habit to get started.
          </TextBody>
        </View>
      ) : (
        <FlatList
          data={categorizedHabits}
          keyExtractor={(item, index) =>
            item.type === "header"
              ? `header-${item.categoryName}`
              : `habit-${item.habit!.id}`
          }
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        visible={showCalendar}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowCalendar(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  closeButton: {
    padding: 4,
  },
  calendar: {
    borderRadius: 8,
  },
  categoryHeader: {
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  categoryTitle: {
    ...fonts.styles.h2,
  },
  habitItem: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxContainer: {
    marginRight: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  habitContent: {
    flex: 1,
  },
  habitNameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  reminderIcon: {
    marginLeft: 8,
  },
  habitName: {
    ...fonts.styles.bodyMedium,
    flex: 1,
  },
  habitMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  metaText: {
    ...fonts.styles.caption,
    color: "#666",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    ...fonts.styles.body,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
});

export default HomeScreen;
