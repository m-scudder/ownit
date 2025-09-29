import { Screen, TextBody, Title } from "@/components/Neutral";
import React from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/useTheme";
import { Ionicons } from "@expo/vector-icons";
import {
  testNotification,
  requestNotificationPermissions,
} from "../utils/notifications";

const ProfileScreen: React.FC<any> = () => {
  const navigation = useNavigation<any>();
  const { mode, colors, toggleTheme } = useTheme();
  const isDarkMode = mode === "dark";
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  return (
    <Screen>
      {/* Settings Section */}
      <View style={getStyles(colors).settingsSection}>
        <Title style={getStyles(colors).sectionTitle}>Settings</Title>
        <View style={getStyles(colors).row}>
          <Text style={getStyles(colors).label}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleTheme} />
        </View>
        <View style={getStyles(colors).row}>
          <Text style={getStyles(colors).label}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </View>
        <TouchableOpacity
          style={getStyles(colors).testButton}
          onPress={async () => {
            const hasPermission = await requestNotificationPermissions();
            if (hasPermission) {
              await testNotification();
            } else {
              console.log("Notification permission denied");
            }
          }}
        >
          <Text style={getStyles(colors).testButtonText}>
            Test Notification
          </Text>
        </TouchableOpacity>
      </View>

      {/* Categories Row */}
      <View style={getStyles(colors).managementSection}>
        <Title style={getStyles(colors).sectionTitle}>Manage</Title>
        <TouchableOpacity
          style={getStyles(colors).managementCard}
          onPress={() => navigation.navigate("Categories")}
        >
          <View style={getStyles(colors).cardContent}>
            <View style={getStyles(colors).cardLeft}>
              <Ionicons
                name="folder-outline"
                size={24}
                color={colors.primary}
              />
              <View style={getStyles(colors).cardText}>
                <Text style={getStyles(colors).cardTitle}>Categories</Text>
                {/* <Text style={getStyles(colors).cardSubtitle}>Organize your habits by category</Text> */}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Habits Row */}
      <View style={getStyles(colors).managementSection}>
        <TouchableOpacity
          style={getStyles(colors).managementCard}
          onPress={() => navigation.navigate("AllHabits")}
        >
          <View style={getStyles(colors).cardContent}>
            <View style={getStyles(colors).cardLeft}>
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={colors.primary}
              />
              <View style={getStyles(colors).cardText}>
                <Text style={getStyles(colors).cardTitle}>Habits</Text>
                {/* <Text style={getStyles(colors).cardSubtitle}>View your habits</Text> */}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
          </View>
        </TouchableOpacity>
      </View>
    </Screen>
  );
};

const getStyles = (colors: any) =>
  StyleSheet.create({
    settingsSection: {
      marginBottom: 32,
    },
    managementSection: {
      marginBottom: 12,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    label: {
      color: colors.text,
      fontSize: 16,
    },
    sectionTitle: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 12,
    },
    managementCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    cardContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    cardLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    cardText: {
      marginLeft: 12,
      flex: 1,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 2,
    },
    cardSubtitle: {
      color: colors.subtext,
      fontSize: 14,
    },
    testButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      marginTop: 8,
      alignItems: "center",
    },
    testButtonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: "600",
    },
  });

export default ProfileScreen;
