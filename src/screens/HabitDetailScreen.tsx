import React, { useState } from 'react';
import { Alert, View } from 'react-native';
import { Screen, Title, TextField, Button } from '../components/Neutral';
import { useStore } from '../store/useStore';

const HabitDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string = route?.params?.id;
  const { habits, completeHabitToday, deleteHabit } = useStore();
  const habit = habits.find((h) => h.id === id);
  const [note, setNote] = useState('');


  if (!habit) {
    return (
      <Screen>
        <Title>Habit not found.</Title>
      </Screen>
    );
  }

  const onComplete = () => {
    if (!note.trim()) return;
    completeHabitToday(habit.id, note.trim());
    setNote('');
  };

  const onDeleteHabit = () => {
    Alert.alert('Delete habit?', 'This will remove the habit and its completions.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteHabit(habit.id); navigation.popToTop(); } }
    ]);
  };

  return (
    <Screen>
      <Title style={{ marginBottom: 12 }}>{habit.name}</Title>

      <Title style={{ fontSize: 16, marginBottom: 8 }}>Add today note</Title>
      <TextField value={note} onChangeText={setNote} placeholder="Write a short note..." multiline style={{ marginBottom: 8 }} />
      <Button label="Mark Completed" onPress={onComplete} />

      <View style={{ height: 16 }} />

      {/* <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Edit" onPress={() => navigation.navigate('HabitForm', { id: habit.id })} />
        <Button label="Delete" onPress={onDeleteHabit} />
      </View> */}
    </Screen>
  );
};

export default HabitDetailScreen;
