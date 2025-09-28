import React, { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Screen, Title, TextField, Button, Chip, TextBody } from '../components/Neutral';
import { useStore } from '../store/useStore';
import type { DayOfWeek, FrequencyType, HabitSchedule } from '../types';
import { toDayLabel } from '../utils/dates';

const DAYS: DayOfWeek[] = [0,1,2,3,4,5,6];

const HabitFormScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string | undefined = route?.params?.id;
  const { habits, categories, addHabit, updateHabit } = useStore();
  const editing = habits.find((h) => h.id === id);

  const [name, setName] = useState(editing?.name ?? '');
  const [categoryId, setCategoryId] = useState<string | null | undefined>(editing?.categoryId ?? null);
  const [frequency, setFrequency] = useState<FrequencyType>(editing?.schedule.type ?? 'daily');
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(editing?.schedule.daysOfWeek ?? []);
  const [daysOfMonthInput, setDaysOfMonthInput] = useState<string>((editing?.schedule.daysOfMonth ?? []).join(','));

  const schedule: HabitSchedule = useMemo(() => {
    if (frequency === 'monthly') {
      const dom = daysOfMonthInput
        .split(',')
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 31);
      return { type: 'monthly', daysOfMonth: dom };
    }
    if (frequency === 'weekly' || frequency === 'custom') {
      return { type: frequency, daysOfWeek };
    }
    return { type: 'daily' };
  }, [frequency, daysOfWeek, daysOfMonthInput]);

  const onSave = () => {
    if (!name.trim()) return;
    if (editing) {
      updateHabit(editing.id, { name: name.trim(), categoryId, schedule });
      navigation.goBack();
    } else {
      const newId = addHabit({ name: name.trim(), categoryId, schedule });
      navigation.replace('HabitDetail', { id: newId });
    }
  };

  return (
    <Screen>
      <Title style={{ marginBottom: 16 }}>{editing ? 'Edit Habit' : 'New Habit'}</Title>
      <TextField value={name} onChangeText={setName} placeholder="Habit name" style={{ marginBottom: 12 }} />

      <Title style={{ fontSize: 16, marginTop: 8, marginBottom: 8 }}>Category</Title>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        <Chip label="None" selected={!categoryId} onPress={() => setCategoryId(null)} />
        {categories.map((c) => (
          <Chip key={c.id} label={c.name} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
        ))}
      </View>
      <Button label="Manage Categories" onPress={() => navigation.navigate('Categories')} style={{ marginBottom: 16 }} />

      <Title style={{ fontSize: 16, marginBottom: 8 }}>Frequency</Title>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
        {(['daily','weekly','monthly','custom'] as FrequencyType[]).map((f) => (
          <Chip key={f} label={f} selected={frequency === f} onPress={() => setFrequency(f)} />
        ))}
      </View>

      {(frequency === 'weekly' || frequency === 'custom') && (
        <View style={{ marginBottom: 12 }}>
          <Title style={{ fontSize: 16, marginBottom: 8 }}>Days of week</Title>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {DAYS.map((d) => (
              <Chip key={d} label={toDayLabel(d)} selected={daysOfWeek.includes(d)} onPress={() => setDaysOfWeek((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))} />
            ))}
          </View>
        </View>
      )}

      {frequency === 'monthly' && (
        <View style={{ marginBottom: 12 }}>
          <Title style={{ fontSize: 16, marginBottom: 8 }}>Days of month</Title>
          <TextBody>Comma-separated days (1-31). Example: 1,15,28</TextBody>
          <TextField value={daysOfMonthInput} onChangeText={setDaysOfMonthInput} placeholder="e.g. 1,15,28" style={{ marginTop: 8 }} />
        </View>
      )}

      <Button label={editing ? 'Save' : 'Create'} onPress={onSave} />
    </Screen>
  );
};

export default HabitFormScreen;
