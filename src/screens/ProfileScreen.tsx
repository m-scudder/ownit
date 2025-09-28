import { Screen} from '@/components/Neutral';
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

const ProfileScreen: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Screen>
      <View style={styles.row}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch value={notificationsEnabled} onValueChange={setNotificationsEnabled} />
      </View>

      <Text style={styles.sectionTitle}>Manage</Text>
      <Text style={styles.item}>Habits</Text>
      <Text style={styles.item}>Categories</Text>
      <Text style={styles.item}>Preferences</Text>
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


