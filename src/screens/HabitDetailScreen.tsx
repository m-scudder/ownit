import React, { useState } from 'react';
import { Alert, View, TouchableOpacity } from 'react-native';
import { Screen, Title, TextField, Button, TextBody, SectionHeader } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import { toDayLabel } from '../utils/dates';

const HabitDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string = route?.params?.id;
  const { habits, completeHabitToday, deleteHabit, updateHabit } = useStore();
  const { colors } = useTheme();
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

  const toggleReminder = () => {
    const newReminder = habit.reminder 
      ? { ...habit.reminder, enabled: !habit.reminder.enabled }
      : { enabled: true, time: '09:00' };
    
    updateHabit(habit.id, { reminder: newReminder });
  };

  return (
    <Screen>
      <Title style={{ marginBottom: 12 }}>{habit.name}</Title>

      {/* Reminder Section */}
      <View style={{ marginBottom: 24 }}>
        <SectionHeader style={{ marginBottom: 12 }}>🔔 Reminder</SectionHeader>
        
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 12,
            paddingHorizontal: 16,
            backgroundColor: colors.surface,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 12,
            marginBottom: 12,
          }}
          onPress={toggleReminder}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: colors.primary,
              backgroundColor: habit.reminder?.enabled ? colors.primary : 'transparent',
              marginRight: 12,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {habit.reminder?.enabled && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.background,
                }}
              />
            )}
          </View>
          <TextBody>
            {habit.reminder?.enabled ? 'Reminders enabled' : 'Enable reminders'}
          </TextBody>
        </TouchableOpacity>

        {habit.reminder?.enabled && (
          <View style={{ paddingLeft: 32 }}>
            <TextBody style={{ marginBottom: 4 }}>
              Time: {habit.reminder.time}
            </TextBody>
            <TextBody style={{ marginBottom: 4 }}>
              Days: Following habit schedule
            </TextBody>
          </View>
        )}
      </View>

      <Title style={{ fontSize: 16, marginBottom: 8 }}>Add today note</Title>
      <TextField value={note} onChangeText={setNote} placeholder="Write a short note..." multiline style={{ marginBottom: 8 }} />
      <Button label="Mark Completed" onPress={onComplete} />

      <View style={{ height: 16 }} />

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Button label="Edit" onPress={() => navigation.navigate('HabitForm', { id: habit.id })} />
        <Button label="Delete" onPress={onDeleteHabit} />
      </View>
    </Screen>
  );
};

export default HabitDetailScreen;
