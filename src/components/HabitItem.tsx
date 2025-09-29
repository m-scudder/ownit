import React, { memo } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import type { Habit, Completion } from "../types";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";
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
          <View style={styles.iconContainer}>
            {habit.requiresNote && (
              <Ionicons
                name="document-text"
                size={16}
                color="#FF9500"
                style={styles.noteIcon}
              />
            )}
            {habitHasReminder && (
              <Ionicons
                name="notifications"
                size={16}
                color={colors.primary || "#007AFF"}
                style={styles.reminderIcon}
              />
            )}
          </View>
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
          <Text style={styles.completeText}>
            {habit.requiresNote ? "Add Note" : "Complete"}
          </Text>
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
    iconContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    noteIcon: {
      marginLeft: 8,
    },
    name: {
      color: colors.text,
      ...fonts.styles.bodyMedium,
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
      ...fonts.styles.button,
    },
  });
