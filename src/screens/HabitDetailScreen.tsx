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
    if (!note.trim()) return;
    completeHabitToday(habit.id, note.trim());
    setNote("");
  };

  return (
    <ScreenWithHeader>
      <Title style={{ marginBottom: 12 }}>{habit.name}</Title>
      <TextField
        value={note}
        onChangeText={setNote}
        placeholder="Write a short note..."
        multiline
        style={{ marginBottom: 8 }}
      />
      <Button label="Mark Completed" onPress={onComplete} />
    </ScreenWithHeader>
  );
};

export default HabitDetailScreen;
