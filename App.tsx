import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { useTheme } from "./src/theme/useTheme";
import { useStore } from "./src/store/useStore";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoggedOutStack from "./src/navigation/LoggedOutStack";
import LoggedInStack from "./src/navigation/LoggedInStack";
import { RootStackParamList } from "./src/types/navigation";

const RootStack = createNativeStackNavigator<RootStackParamList>();

function MainApp() {
  const { mode, colors } = useTheme();
  const { initializeNotifications } = useStore();
  const { isAuthenticated, loading } = useAuth();

  // Initialize notifications when app starts
  useEffect(() => {
    initializeNotifications().catch(console.error);
  }, [initializeNotifications]);

  const navTheme = {
    ...DefaultTheme,
    dark: mode === "dark",
    colors: {
      ...DefaultTheme.colors,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  // Show loading screen while checking authentication
  if (loading) {
    return null; // You can add a loading screen here
  }

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle={mode === "dark" ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
        translucent={false}
      />
      <NavigationContainer theme={navTheme}>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <RootStack.Screen
              name="LoggedInStack"
              component={LoggedInStack}
            />
          ) : (
            <RootStack.Screen
              name="LoggedOutStack"
              component={LoggedOutStack}
            />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
