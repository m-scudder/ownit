import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { CustomHeader } from '../components/Neutral';
import ProfileScreen from '../screens/ProfileScreen';
import HabitFormScreen from '../screens/HabitFormScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import AllHabitsScreen from '../screens/AllHabitsScreen';
import HabitDetailScreen from '../screens/HabitDetailScreen';
import { ProfileStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

// Helper function to get screen titles
const getScreenTitle = (routeName: keyof ProfileStackParamList): string => {
  const titles: Record<keyof ProfileStackParamList, string> = {
    Profile: 'Profile',
    HabitForm: 'Add Habit',
    Categories: 'Categories',
    AllHabits: 'Habits',
    HabitDetail: 'Habit Details',
  };
  return titles[routeName] || routeName;
};

const ProfileStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader title={getScreenTitle(route.name as keyof ProfileStackParamList)} />
        ),
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HabitForm"
        component={HabitFormScreen}
        options={{ title: 'Add Habit' }}
      />
      <Stack.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{ title: 'Categories' }}
      />
      <Stack.Screen
        name="AllHabits"
        component={AllHabitsScreen}
        options={{ title: 'Habits' }}
      />
      <Stack.Screen
        name="HabitDetail"
        component={HabitDetailScreen}
        options={{ title: 'Habit Details' }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStack;
