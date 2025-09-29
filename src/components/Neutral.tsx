import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput as RNTextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";

export const Screen: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <SafeAreaView style={[styles.screen, style]}>{children}</SafeAreaView>;
};

export const ScreenWithHeader: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <SafeAreaView style={[styles.screenWithHeader, style]}>{children}</SafeAreaView>;
};

export const Title: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <Text style={[styles.title, style]}>{children}</Text>;
};

export const TextBody: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <Text style={[styles.text, style]}>{children}</Text>;
};

export const Button: React.FC<{
  label: string;
  onPress: () => void;
  tone?: "default" | "danger" | "ghost";
  disabled?: boolean;
  style?: ViewStyle;
}> = ({ label, onPress, tone = "default", disabled, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        tone === "danger" && { backgroundColor: colors.border },
        tone === "ghost" && {
          backgroundColor: "transparent",
          borderColor: colors.border,
          borderWidth: 1,
        },
        disabled && { opacity: 0.6 },
        style,
      ]}
    >
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
};

export const TextField: React.FC<{
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  multiline?: boolean;
  style?: ViewStyle;
}> = ({ value, onChangeText, placeholder, multiline, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <RNTextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.subtext}
      style={[
        styles.input,
        multiline && { minHeight: 100, textAlignVertical: "top" },
        style,
      ]}
      multiline={multiline}
    />
  );
};

export const Row: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <View style={[styles.row, style]}>{children}</View>;
};

export const Chip: React.FC<{
  label: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}> = ({ label, selected, onPress, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        selected && { backgroundColor: colors.border },
        style,
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

export const SectionHeader: React.FC<{
  children: React.ReactNode;
  style?: TextStyle;
}> = ({ children, style }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  return <Text style={[styles.sectionHeader, style]}>{children}</Text>;
};

const getStyles = (colors: {
  background: string;
  surface: string;
  border: string;
  text: string;
  subtext: string;
}) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    screenWithHeader: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
    },
    title: {
      color: colors.text,
      ...fonts.styles.h1,
    },
    sectionHeader: {
      color: colors.subtext,
      ...fonts.styles.sectionHeader,
    },
    text: {
      color: colors.text,
      ...fonts.styles.body,
    },
    button: {
      backgroundColor: colors.surface,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      color: colors.text,
      ...fonts.styles.button,
    },
    input: {
      backgroundColor: colors.surface,
      color: colors.text,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 10,
      ...fonts.styles.input,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    chip: {
      backgroundColor: colors.surface,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 8,
    },
  });

// Export CustomHeader
export { default as CustomHeader } from "./CustomHeader";
