import { Screen, Button, Title, TextBody } from '@/components/Neutral';
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/useTheme';

const ProfileScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { mode, colors, toggleTheme } = useTheme();
  const isDarkMode = mode === 'dark';
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Screen>
      <Title style={{ marginBottom: 16 }}>Profile</Title>
      <View style={getStyles(colors).row}>
        <Text style={getStyles(colors).label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>

      <View style={getStyles(colors).row}>
        <Text style={getStyles(colors).label}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <Text style={getStyles(colors).sectionTitle}>Manage</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Button label="Add Habit" onPress={() => navigation.navigate('HabitForm')} />
        <Button label="Categories" onPress={() => navigation.navigate('Categories')} />
      </View>
      <TextBody style={{ color: colors.subtext }}>Create new habits and manage categories here.</TextBody>
    </Screen>
  );
};

const getStyles = (colors: { text: string; subtext?: string }) =>
  StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
    label: { color: colors.text, fontSize: 16 },
    sectionTitle: { color: colors.text, fontSize: 14, marginTop: 24, marginBottom: 8, opacity: 0.8 }
  });

export default ProfileScreen;


