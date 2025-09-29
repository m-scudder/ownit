import React, { useMemo, useState } from 'react';
import { View, TouchableOpacity, ScrollView } from 'react-native';
import { Screen, Title, TextField, Button, Chip, TextBody, SectionHeader } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { useTheme } from '../theme/useTheme';
import type { DayOfWeek, FrequencyType, HabitSchedule } from '../types';
import { toDayLabel } from '../utils/dates';

const DAYS: DayOfWeek[] = [0,1,2,3,4,5,6];

const HabitFormScreen: React.FC<any> = ({ route, navigation }) => {
  const id: string | undefined = route?.params?.id;
  const { habits, categories, addHabit, updateHabit, getSmartHabitSuggestions, getSmartScheduleSuggestion } = useStore();
  const { colors } = useTheme();
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

  const onSmartSuggestion = (suggestion: string) => {
    setName(suggestion);
    if (categoryId) {
      const selectedCategory = categories.find(c => c.id === categoryId);
      if (selectedCategory) {
        const smartSchedule = getSmartScheduleSuggestion(selectedCategory.name);
        setFrequency(smartSchedule.type);
        if (smartSchedule.daysOfWeek) {
          setDaysOfWeek(smartSchedule.daysOfWeek);
        }
      }
    }
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const smartSuggestions = selectedCategory ? getSmartHabitSuggestions(selectedCategory.name) : [];

  return (
    <Screen>
      <Title style={{ marginBottom: 24 }}>{editing ? 'Edit Habit' : 'New Habit'}</Title>
      
      <ScrollView 
        style={{ flex: 1 }} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Name Section */}
        <View style={{ marginBottom: 24 }}>
          <TextField value={name} onChangeText={setName} placeholder="Habit name" />
        </View>

        {/* Category Section */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader style={{ marginBottom: 12 }}>Category</SectionHeader>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            <Chip label="None" selected={!categoryId} onPress={() => setCategoryId(null)} />
            {categories.map((c) => (
              <Chip key={c.id} label={c.name} selected={categoryId === c.id} onPress={() => setCategoryId(c.id)} />
            ))}
          </View>
        </View>

        {/* Smart habit suggestions */}
        {smartSuggestions.length > 0 && !editing && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>
              💡 Smart suggestions for {selectedCategory?.name}
            </SectionHeader>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {smartSuggestions.slice(0, 4).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  onPress={() => onSmartSuggestion(suggestion)}
                >
                  <TextBody style={{ fontSize: 14 }}>{suggestion}</TextBody>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Frequency Section */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader style={{ marginBottom: 12 }}>Frequency</SectionHeader>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {(['daily','weekly','monthly','custom'] as FrequencyType[]).map((f) => (
              <Chip key={f} label={f} selected={frequency === f} onPress={() => setFrequency(f)} />
            ))}
          </View>
        </View>

        {/* Days of Week Section */}
        {(frequency === 'weekly' || frequency === 'custom') && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>Days of week</SectionHeader>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {DAYS.map((d) => (
                <Chip key={d} label={toDayLabel(d)} selected={daysOfWeek.includes(d)} onPress={() => setDaysOfWeek((s) => (s.includes(d) ? s.filter((x) => x !== d) : [...s, d]))} />
              ))}
            </View>
          </View>
        )}

        {/* Days of Month Section */}
        {frequency === 'monthly' && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>Days of month</SectionHeader>
            <TextBody style={{ marginBottom: 8, fontSize: 14 }}>Comma-separated days (1-31). Example: 1,15,28</TextBody>
            <TextField value={daysOfMonthInput} onChangeText={setDaysOfMonthInput} placeholder="e.g. 1,15,28" />
          </View>
        )}

        <Button label={editing ? 'Save' : 'Create'} onPress={onSave} />
      </ScrollView>
    </Screen>
  );
};

export default HabitFormScreen;
