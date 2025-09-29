import React, { useState } from "react";
import {
  ScreenWithHeader,
  Title,
  TextField,
  Button,
  TextBody,
} from "../components/Neutral";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme/useTheme";

const HabitDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string = route?.params?.id;
  const { habits, completeHabitToday } = useStore();
  const { colors } = useTheme();
  const habit = habits.find((h) => h.id === id);
  const [note, setNote] = useState("");

  if (!habit) {
    return (
      <ScreenWithHeader>
        <Title>Habit not found.</Title>
      </ScreenWithHeader>
    );
  }

  const onComplete = () => {
    // For habits that require notes, check if note is provided
    if (habit.requiresNote && !note.trim()) {
      return; // Don't complete if note is required but not provided
    }
    completeHabitToday(habit.id, note.trim());
    setNote("");
    navigation.goBack(); // Navigate back after completion
  };

  return (
    <ScreenWithHeader>
      <Title style={{ marginBottom: 12 }}>{habit.name}</Title>
      <TextField
        value={note}
        onChangeText={setNote}
        placeholder={habit.requiresNote ? "Write a note (required)..." : "Write a short note (optional)..."}
        multiline
        style={{ marginBottom: 8 }}
      />
      <Button 
        label="Mark Completed" 
        onPress={onComplete}
        disabled={habit.requiresNote && !note.trim()}
      />
    </ScreenWithHeader>
  );
};

export default HabitDetailScreen;
