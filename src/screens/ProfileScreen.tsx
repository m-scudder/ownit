import { Screen, TextBody, Title } from "@/components/Neutral";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";
import { Ionicons } from "@expo/vector-icons";

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
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: isDarkMode ? colors.primary : colors.border,
              alignItems: isDarkMode ? "flex-end" : "flex-start",
              justifyContent: "center",
              paddingHorizontal: 2,
            }}
            onPress={toggleTheme}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: colors.background,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={getStyles(colors).row}>
          <Text style={getStyles(colors).label}>Notifications</Text>
          <TouchableOpacity
            style={{
              width: 50,
              height: 30,
              borderRadius: 15,
              backgroundColor: notificationsEnabled ? colors.primary : colors.border,
              alignItems: notificationsEnabled ? "flex-end" : "flex-start",
              justifyContent: "center",
              paddingHorizontal: 2,
            }}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            <View
              style={{
                width: 26,
                height: 26,
                borderRadius: 13,
                backgroundColor: colors.background,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            />
          </TouchableOpacity>
        </View>
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
      ...fonts.styles.body,
    },
    sectionTitle: {
      color: colors.text,
      ...fonts.styles.h3,
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
      ...fonts.styles.bodyMedium,
      marginBottom: 2,
    },
    cardSubtitle: {
      color: colors.subtext,
      ...fonts.styles.bodySmall,
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
      ...fonts.styles.button,
    },
  });

export default ProfileScreen;
