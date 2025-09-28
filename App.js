import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import HabitFormScreen from './src/screens/HabitFormScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import HabitDetailScreen from './src/screens/HabitDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff', contentStyle: { backgroundColor: '#000' } }}>
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Ownit' }} />
        <Stack.Screen name="HabitForm" component={HabitFormScreen} options={{ title: 'Habit' }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ title: 'Categories' }} />
        <Stack.Screen name="HabitDetail" component={HabitDetailScreen} options={{ title: 'Details' }} />
      </Stack.Navigator>
    </NavigationContainer>
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
