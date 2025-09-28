import React, { useMemo, useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Screen, Title, TextField, Button, TextBody } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { sortByDateDesc } from '../utils/dates';

const HabitDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string = route?.params?.id;
  const { habits, completions, completeHabitToday, removeCompletion, deleteHabit } = useStore();
  const habit = habits.find((h) => h.id === id);
  const [note, setNote] = useState('');

  const entries = useMemo(() => completions.filter((c) => c.habitId === id).sort((a, b) => sortByDateDesc(a.date, b.date)), [completions, id]);

  if (!habit) {
    return (
      <Screen>
        <TextBody>Habit not found.</TextBody>
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

      <Title style={{ fontSize: 16, marginBottom: 8 }}>History</Title>
      {entries.length === 0 ? (
        <TextBody>No completions yet.</TextBody>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextBody>{item.date}</TextBody>
                <TextBody style={{ color: '#AAA' }}>{item.note}</TextBody>
              </View>
              <Button label="Remove" onPress={() => removeCompletion(item.id)} />
            </View>
          )}
        />
      )}

      <View style={{ height: 16 }} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Edit" onPress={() => navigation.navigate('HabitForm', { id: habit.id })} />
        <Button label="Delete" onPress={onDeleteHabit} />
      </View>
    </Screen>
  );
};

export default HabitDetailScreen;
