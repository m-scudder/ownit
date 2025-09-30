import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Root Stack Navigator Types
export type RootStackParamList = {
  LoggedOutStack: NavigatorScreenParams<LoggedOutStackParamList>;
  LoggedInStack: NavigatorScreenParams<LoggedInStackParamList>;
};

// Logged Out Stack Types
export type LoggedOutStackParamList = {
  PhoneLogin: undefined;
  OTPVerification: {
    phoneNumber: string;
  };
};

// Logged In Stack Types
export type LoggedInStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
};

// Main Tabs Types
export type MainTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

// Home Stack Types
export type HomeStackParamList = {
  Home: undefined;
  HabitDetail: {
    id: string;
  };
};

// Profile Stack Types
export type ProfileStackParamList = {
  Profile: undefined;
  HabitForm: {
    habitId?: string; // Optional for editing existing habits
  };
  Categories: undefined;
  AllHabits: undefined;
  HabitDetail: {
    id: string;
  };
};

// Screen Props Types
export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, T>;

export type LoggedOutStackScreenProps<T extends keyof LoggedOutStackParamList> = NativeStackScreenProps<LoggedOutStackParamList, T>;

export type LoggedInStackScreenProps<T extends keyof LoggedInStackParamList> = NativeStackScreenProps<LoggedInStackParamList, T>;

export type MainTabsScreenProps<T extends keyof MainTabsParamList> = BottomTabScreenProps<MainTabsParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = NativeStackScreenProps<HomeStackParamList, T>;

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = NativeStackScreenProps<ProfileStackParamList, T>;

// Navigation Hook Types
export type LoggedOutStackNavigationProp = LoggedOutStackScreenProps<keyof LoggedOutStackParamList>['navigation'];
export type LoggedInStackNavigationProp = LoggedInStackScreenProps<keyof LoggedInStackParamList>['navigation'];
export type HomeStackNavigationProp = HomeStackScreenProps<keyof HomeStackParamList>['navigation'];
export type ProfileStackNavigationProp = ProfileStackScreenProps<keyof ProfileStackParamList>['navigation'];
export type MainTabsNavigationProp = MainTabsScreenProps<keyof MainTabsParamList>['navigation'];

// Route Types
export type LoggedOutStackRouteProp<T extends keyof LoggedOutStackParamList> = LoggedOutStackScreenProps<T>['route'];
export type LoggedInStackRouteProp<T extends keyof LoggedInStackParamList> = LoggedInStackScreenProps<T>['route'];
export type HomeStackRouteProp<T extends keyof HomeStackParamList> = HomeStackScreenProps<T>['route'];
export type ProfileStackRouteProp<T extends keyof ProfileStackParamList> = ProfileStackScreenProps<T>['route'];
export type MainTabsRouteProp<T extends keyof MainTabsParamList> = MainTabsScreenProps<T>['route'];

// Union types for screens used in multiple stacks
export type HabitDetailScreenProps = 
  | HomeStackScreenProps<'HabitDetail'>
  | ProfileStackScreenProps<'HabitDetail'>;
