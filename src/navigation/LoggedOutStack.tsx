import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme/useTheme';
import { CustomHeader } from '../components/Neutral';
import PhoneLoginScreen from '../screens/PhoneLoginScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import { LoggedOutStackParamList, LoggedOutStackScreenProps } from '../types/navigation';

const Stack = createNativeStackNavigator<LoggedOutStackParamList>();

// Helper function to get screen titles
const getScreenTitle = (routeName: keyof LoggedOutStackParamList): string => {
  const titles: Record<keyof LoggedOutStackParamList, string> = {
    PhoneLogin: 'Sign In',
    OTPVerification: 'Verify Phone',
  };
  return titles[routeName] || routeName;
};

const LoggedOutStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        header: ({ route }) => (
          <CustomHeader title={getScreenTitle(route.name as keyof LoggedOutStackParamList)} />
        ),
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="PhoneLogin"
        component={PhoneLoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OTPVerification"
        component={OTPVerificationScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default LoggedOutStack;
