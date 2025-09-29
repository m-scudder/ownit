import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Habit, Completion } from "../types";
import { useTheme } from "../theme/useTheme";
import {
  calculateCurrentStreak,
  isHabitDueOnDate,
  isCompletedOnDate,
  hasReminder,
} from "../utils/dates";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  habit: Habit;
  completions: Completion[];
  onPress: () => void;
  onComplete: () => void;
  selectedDate?: Date;
}

const HabitItemComponent: React.FC<Props> = ({
  habit,
  completions,
  onPress,
  onComplete,
  selectedDate,
}) => {
  const streak = calculateCurrentStreak(habit, completions);
  const today = new Date();
  const date = selectedDate || today;
  const dueToday = isHabitDueOnDate(habit, date);
  const isCompleted = isCompletedOnDate(habit.id, date, completions);
  const isPastDate = date < today;
  const habitHasReminder = hasReminder(habit);
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={{ flex: 1 }}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{habit.name}</Text>
          {habitHasReminder && (
            <Ionicons
              name="notifications"
              size={16}
              color={colors.primary || "#007AFF"}
              style={styles.reminderIcon}
            />
          )}
        </View>
        <Text style={styles.meta}>Streak: {streak}</Text>
        {isCompleted && (
          <View style={styles.completedIndicator}>
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={colors.success || "#4CAF50"}
            />
            <Text
              style={[
                styles.meta,
                { color: colors.success || "#4CAF50", marginLeft: 4 },
              ]}
            >
              Completed
            </Text>
          </View>
        )}
      </View>
      {dueToday && !isPastDate && !isCompleted && (
        <TouchableOpacity onPress={onComplete} style={styles.completeBtn}>
          <Text style={styles.completeText}>Complete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

export const HabitItem = memo(HabitItemComponent);

const getStyles = (colors: {
  surface: string;
  text: string;
  subtext: string;
  border: string;
}) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 14,
      flexDirection: "row",
      alignItems: "center",
    },
    nameContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    name: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },
    reminderIcon: {
      marginLeft: 8,
    },
    meta: {
      color: colors.subtext,
      marginTop: 4,
    },
    completedIndicator: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    completeBtn: {
      backgroundColor: colors.border,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 8,
    },
    completeText: {
      color: colors.text,
      fontWeight: "600",
    },
  });
