import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { CustomHeader } from '../components/Neutral';
import HomeScreen from '../screens/HomeScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import { HomeStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

// Helper function to get screen titles
const getScreenTitle = (routeName: keyof HomeStackParamList): string => {
  const titles: Record<keyof HomeStackParamList, string> = {
    Home: 'Home',
    HabitDetail: 'Habit Details',
  };
  return titles[routeName] || routeName;
};

const HomeStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader title={getScreenTitle(route.name as keyof HomeStackParamList)} />
        ),
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: 'Habit Details' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
