import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import HabitFormScreen from './src/screens/HabitFormScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AllHabitsScreen from './src/screens/AllHabitsScreen';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './src/theme/useTheme';
import { CustomHeader } from './src/components/Neutral';

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Helper function to get screen titles
const getScreenTitle = (routeName) => {
  const titles = {
    'HabitForm': 'Add Habit',
    'Categories': 'Categories',
    'AllHabits': 'Habits',
    'HabitDetail': 'Habit Details',
  };
  return titles[routeName] || routeName;
};

function HomeStackNavigator() {
  const { colors } = useTheme();
  return (
    <HomeStack.Navigator
      screenOptions={{
        header: ({ route }) => <CustomHeader title={getScreenTitle(route.name)} />,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="HabitDetail" component={HabitDetailScreen} />
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const { colors } = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        header: ({ route }) => <CustomHeader title={getScreenTitle(route.name)} />,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="HabitForm" component={HabitFormScreen} />
      <ProfileStack.Screen name="Categories" component={CategoriesScreen} />
      <ProfileStack.Screen name="AllHabits" component={AllHabitsScreen} />
      <ProfileStack.Screen name="HabitDetail" component={HabitDetailScreen} />
    </ProfileStack.Navigator>
  );
}

export default function App() {
  const { mode, colors } = useTheme();
  const navTheme = {
    ...DefaultTheme,
    dark: mode === 'dark',
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary
    }
  };
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.subtext,
            tabBarIcon: ({ color, size, focused }) => {
              let iconName = 'ellipse';
              if (route.name === 'HomeTab') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'ProfileTab') {
                iconName = focused ? 'person' : 'person-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          })}
        >
          <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
          <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

