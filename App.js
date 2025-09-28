import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import HabitFormScreen from './src/screens/HabitFormScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { useTheme } from './src/theme/useTheme';

const HomeStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <HomeStack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ title: 'Details' }} />
    </HomeStack.Navigator>
  );
}

function ProfileStackNavigator() {
  const { colors } = useTheme();
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="HabitForm" component={HabitFormScreen} options={{ title: 'Habit' }} />
      <ProfileStack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
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
          screenOptions={{
            headerShown: false,
            tabBarStyle: { backgroundColor: colors.surface, borderTopColor: colors.border },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.subtext
          }}
        >
          <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
          <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

