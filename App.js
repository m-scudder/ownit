import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import HabitFormScreen from './src/screens/HabitFormScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

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
  return (
    <ProfileStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff', contentStyle: { backgroundColor: '#000' } }}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <ProfileStack.Screen name="HabitForm" component={HabitFormScreen} options={{ title: 'Habit' }} />
      <ProfileStack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
    </ProfileStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer theme={navTheme}>
        <Tab.Navigator screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: '#111', borderTopColor: '#222' },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#888'
        }}>
          <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home' }} />
          <Tab.Screen name="ProfileTab" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#000',
    card: '#111',
    text: '#fff',
    border: '#222',
    primary: '#e5e5e5'
  }
};
