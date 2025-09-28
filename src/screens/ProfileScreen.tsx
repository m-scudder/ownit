import { Screen, Button, Title, TextBody } from '@/components/Neutral';
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Screen>
      <Title style={{ marginBottom: 16 }}>Profile</Title>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <Text style={styles.sectionTitle}>Manage</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <Button label="Add Habit" onPress={() => navigation.navigate('HabitForm')} />
        <Button label="Categories" onPress={() => navigation.navigate('Categories')} />
      </View>
      <TextBody style={{ color: '#aaa' }}>Create new habits and manage categories here.</TextBody>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 16 },
  header: { color: '#fff', fontSize: 24, fontWeight: '600', marginBottom: 24 },
  sectionTitle: { color: '#bbb', fontSize: 14, marginTop: 24, marginBottom: 8 },
  item: { color: '#fff', fontSize: 16, paddingVertical: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { color: '#fff', fontSize: 16 },
});

export default ProfileScreen;


