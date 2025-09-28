import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Screen, Title, TextBody } from '../components/Neutral';
import { useStore } from '../store/useStore';
import { HabitItem } from '../components/HabitItem';
import { formatDateKey, isHabitDueOnDate } from '@/utils/dates';

const HomeScreen: React.FC<any> = ({ navigation }) => {
  const { habits, completions, completeHabitToday } = useStore();
  const todayKey = formatDateKey(new Date());
  const today = new Date();

  const items = useMemo(() => habits, [habits]);

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title>Today</Title>
      </View>

      {items.length === 0 ? (
        <TextBody>No habits yet. Add your first habit.</TextBody>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(h) => h.id}
          contentContainerStyle={{ gap: 12 }}
          renderItem={({ item }) => (
            <HabitItem
              habit={item}
              completions={completions}
              onPress={() => navigation.navigate('HabitDetail', { id: item.id })}
              onComplete={() => navigation.navigate('HabitDetail', { id: item.id, focusNote: true })}
            />
          )}
        />
      )}
    </Screen>
  );
};

export default HomeScreen;
