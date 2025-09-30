import React, { useMemo, useState } from "react";
import { View, TouchableOpacity, ScrollView, Platform } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
  ScreenWithHeader,
  Title,
  TextField,
  Button,
  Chip,
  TextBody,
  SectionHeader,
} from "../components/Neutral";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";
import type {
  DayOfWeek,
  FrequencyType,
  HabitSchedule,
  HabitReminder,
} from "../types";
import { toDayLabel } from "../utils/dates";
import { requestNotificationPermissions } from "../utils/notifications";
import { ProfileStackScreenProps } from "../types/navigation";

const DAYS: DayOfWeek[] = [0, 1, 2, 3, 4, 5, 6];

const HabitFormScreen: React.FC<ProfileStackScreenProps<'HabitForm'>> = ({ route, navigation }) => {
  const id: string | undefined = route.params.habitId;
  const {
    habits,
    categories,
    addHabit,
    updateHabit,
    getSmartHabitSuggestions,
    getSmartScheduleSuggestion,
  } = useStore();
  const { colors } = useTheme();
  const editing = habits.find((h) => h.id === id);

  const [name, setName] = useState(editing?.name ?? "");
  const [categoryId, setCategoryId] = useState<string | null | undefined>(
    editing?.categoryId ?? null,
  );
  const [frequency, setFrequency] = useState<FrequencyType>(
    editing?.schedule.type ?? "daily",
  );
  const [daysOfWeek, setDaysOfWeek] = useState<DayOfWeek[]>(
    editing?.schedule.daysOfWeek ?? [],
  );
  const [daysOfMonthInput, setDaysOfMonthInput] = useState<string>(
    (editing?.schedule.daysOfMonth ?? []).join(","),
  );

  // Reminder states
  const [reminderEnabled, setReminderEnabled] = useState(
    editing?.reminder?.enabled ?? false,
  );
  const [reminderTime, setReminderTime] = useState(() => {
    if (editing?.reminder?.time) {
      const [hours, minutes] = editing.reminder.time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date;
    }
    const date = new Date();
    date.setHours(9, 0, 0, 0);
    return date;
  });
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Note requirement state
  const [requiresNote, setRequiresNote] = useState(
    editing?.requiresNote ?? false,
  );

  const schedule: HabitSchedule = useMemo(() => {
    if (frequency === "monthly") {
      const dom = daysOfMonthInput
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n) && n >= 1 && n <= 31);
      return { type: "monthly", daysOfMonth: dom };
    }
    if (frequency === "weekly" || frequency === "custom") {
      return { type: frequency, daysOfWeek };
    }
    return { type: "daily" };
  }, [frequency, daysOfWeek, daysOfMonthInput]);

  const reminder: HabitReminder | undefined = useMemo(() => {
    if (!reminderEnabled) return undefined;
    const timeString = `${reminderTime.getHours().toString().padStart(2, "0")}:${reminderTime.getMinutes().toString().padStart(2, "0")}`;
    return {
      enabled: reminderEnabled,
      time: timeString,
    };
  }, [reminderEnabled, reminderTime]);

  const onSave = async () => {
    if (!name.trim()) return;

    // Request notification permissions if reminder is enabled
    let finalReminder = reminder;
    if (reminderEnabled) {
      const hasPermission = await requestNotificationPermissions();
      if (!hasPermission) {
        // Still allow saving the habit but without notifications
        console.log(
          "Notification permission denied, saving habit without reminders",
        );
        finalReminder = undefined; // Disable reminder if no permission
      }
    }

    if (editing) {
      updateHabit(editing.id, {
        name: name.trim(),
        categoryId,
        schedule,
        reminder: finalReminder,
        requiresNote,
      });
      navigation.goBack();
    } else {
      addHabit({
        name: name.trim(),
        categoryId,
        schedule,
        reminder: finalReminder,
        requiresNote,
      });
      navigation.goBack();
    }
  };

  const onSmartSuggestion = (suggestion: string) => {
    setName(suggestion);
    if (categoryId) {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      if (selectedCategory) {
        const smartSchedule = getSmartScheduleSuggestion(selectedCategory.name);
        setFrequency(smartSchedule.type);
        if (smartSchedule.daysOfWeek) {
          setDaysOfWeek(smartSchedule.daysOfWeek);
        }
      }
    }
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const smartSuggestions = selectedCategory
    ? getSmartHabitSuggestions(selectedCategory.name)
    : [];

  return (
    <ScreenWithHeader>
      <Title style={{ marginBottom: 24 }}>
        {editing ? "Edit Habit" : "New Habit"}
      </Title>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Habit Name Section */}
        <View style={{ marginBottom: 24 }}>
          <TextField
            value={name}
            onChangeText={setName}
            placeholder="Habit name"
          />
        </View>

        {/* Category Section */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader style={{ marginBottom: 12 }}>Category</SectionHeader>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <Chip
              label="None"
              selected={!categoryId}
              onPress={() => setCategoryId(null)}
            />
            {categories.map((c) => (
              <Chip
                key={c.id}
                label={c.name}
                selected={categoryId === c.id}
                onPress={() => setCategoryId(c.id)}
              />
            ))}
          </View>
        </View>

        {/* Smart habit suggestions */}
        {smartSuggestions.length > 0 && !editing && !name.trim() && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>
              💡 Smart suggestions for {selectedCategory?.name}
            </SectionHeader>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {smartSuggestions.slice(0, 4).map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 16,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                  }}
                  onPress={() => onSmartSuggestion(suggestion)}
                >
                  <TextBody style={{ ...fonts.styles.bodySmall }}>{suggestion}</TextBody>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Frequency Section */}
        <View style={{ marginBottom: 24 }}>
          <SectionHeader style={{ marginBottom: 12 }}>Frequency</SectionHeader>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {(["daily", "weekly", "monthly", "custom"] as FrequencyType[]).map(
              (f) => (
                <Chip
                  key={f}
                  label={f}
                  selected={frequency === f}
                  onPress={() => setFrequency(f)}
                />
              ),
            )}
          </View>
        </View>

        {/* Days of Week Section */}
        {(frequency === "weekly" || frequency === "custom") && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>
              Days of week
            </SectionHeader>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {DAYS.map((d) => (
                <Chip
                  key={d}
                  label={toDayLabel(d)}
                  selected={daysOfWeek.includes(d)}
                  onPress={() =>
                    setDaysOfWeek((s) =>
                      s.includes(d) ? s.filter((x) => x !== d) : [...s, d],
                    )
                  }
                />
              ))}
            </View>
          </View>
        )}

        {/* Days of Month Section */}
        {frequency === "monthly" && (
          <View style={{ marginBottom: 24 }}>
            <SectionHeader style={{ marginBottom: 12 }}>
              Days of month
            </SectionHeader>
            <TextBody style={{ marginBottom: 8, ...fonts.styles.bodySmall }}>
              Comma-separated days (1-31). Example: 1,15,28
            </TextBody>
            <TextField
              value={daysOfMonthInput}
              onChangeText={setDaysOfMonthInput}
              placeholder="e.g. 1,15,28"
            />
          </View>
        )}

        {/* Reminder Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <SectionHeader>Enable Reminder</SectionHeader>
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: reminderEnabled
                  ? colors.primary
                  : colors.border,
                alignItems: reminderEnabled ? "flex-end" : "flex-start",
                justifyContent: "center",
                paddingHorizontal: 2,
              }}
              onPress={() => setReminderEnabled(!reminderEnabled)}
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

          {reminderEnabled && (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 16,
                paddingHorizontal: 16,
                backgroundColor: colors.surface,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
              }}
              onPress={() => setShowTimePicker(true)}
            >
              <TextBody>Reminder time</TextBody>
              <TextBody style={{ color: colors.primary, ...fonts.styles.button }}>
                {reminderTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TextBody>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime}
              mode="time"
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              themeVariant={colors.background === "#FFFFFF" ? "light" : "dark"}
              onChange={(event, selectedTime) => {
                if (event.type === "set" && selectedTime) {
                  setReminderTime(selectedTime);
                }
                setShowTimePicker(false);
              }}
            />
          )}
        </View>

        {/* Note Requirement Section */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              <SectionHeader>Require Note for Completion</SectionHeader>
              {/* <TextBody style={{ ...fonts.styles.bodySmall, marginTop: 4 }}>
                When enabled, this habit cannot be marked as completed without adding a note
              </TextBody> */}
            </View>
            <TouchableOpacity
              style={{
                width: 50,
                height: 30,
                borderRadius: 15,
                backgroundColor: requiresNote
                  ? colors.primary
                  : colors.border,
                alignItems: requiresNote ? "flex-end" : "flex-start",
                justifyContent: "center",
                paddingHorizontal: 2,
                marginLeft: 16,
              }}
              onPress={() => setRequiresNote(!requiresNote)}
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

        <Button label={editing ? "Save" : "Create"} onPress={onSave} />
      </ScrollView>
    </ScreenWithHeader>
  );
};

export default HabitFormScreen;
