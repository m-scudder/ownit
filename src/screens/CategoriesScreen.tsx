import React, { useState } from "react";
import {
  Alert,
  FlatList,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ScreenWithHeader,
  Title,
  TextField,
  Button,
  TextBody,
} from "../components/Neutral";
import { useStore } from "../store/useStore";
import { useTheme } from "../theme/useTheme";
import { fonts } from "../theme/fonts";
import { ProfileStackScreenProps } from "../types/navigation";

const CategoriesScreen: React.FC<ProfileStackScreenProps<'Categories'>> = () => {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    getSuggestedCategories,
    getCategoryIcon,
  } = useStore();
  const { colors } = useTheme();
  const [name, setName] = useState("");

  const onAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setName("");
  };

  const onAddSuggested = (categoryName: string) => {
    addCategory(categoryName);
    // Show a smart completion message
    setTimeout(() => {
      Alert.alert(
        "🎉 Great choice!",
        `You've added "${categoryName}". Now you can create habits in this category and I'll suggest smart scheduling options!`,
        [{ text: "Awesome!", style: "default" }],
      );
    }, 100);
  };

  const onEdit = (id: string) => {
    Alert.prompt(
      "Edit category",
      undefined,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (value?: string) => value && updateCategory(id, value),
        },
      ],
      "plain-text",
    );
  };

  const onDelete = (id: string) => {
    Alert.alert(
      "Delete category?",
      "This will remove the category from habits.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCategory(id),
        },
      ],
    );
  };

  return (
    <ScreenWithHeader>
      {/* Add Category CTA */}
      <View style={styles.ctaContainer}>
        <View style={styles.addCategoryRow}>
          <View style={{ flex: 1 }}>
            <TextField
              value={name}
              onChangeText={setName}
              placeholder="New category name"
            />
          </View>
          <TouchableOpacity
            style={[styles.addIconButton, { backgroundColor: colors.primary }]}
            onPress={onAdd}
          >
            <Ionicons name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Show suggested categories if user has fewer than 3 categories */}
      {categories.length < 3 && (
        <View style={{ marginBottom: 20 }}>
          <TextBody style={{ marginBottom: 16 }}>
            {categories.length === 0
              ? "🎯 Let's organize your habits! Choose categories that match your goals:"
              : "✨ Add more categories to better organize your habits:"}
          </TextBody>
          <View style={styles.suggestedCategoriesContainer}>
            {getSuggestedCategories()
              .filter(
                (categoryName) =>
                  !categories.some((cat) => cat.name === categoryName),
              )
              .map((categoryName, index) => (
                <TouchableOpacity
                  key={index}
                  style={{
                    ...styles.suggestedCategoryButton,
                    backgroundColor: colors.primary,
                  }}
                  onPress={() => onAddSuggested(categoryName)}
                >
                  <TextBody
                    style={{
                      ...styles.suggestedCategoryText,
                      color: colors.background,
                    }}
                  >
                    {getCategoryIcon(categoryName)} {categoryName}
                  </TextBody>
                </TouchableOpacity>
              ))}
          </View>
        </View>
      )}

      {/* Show existing categories */}
      {categories.length > 0 ? (
        <FlatList
          data={categories}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <View style={{ flex: 1 }}>
                <TextBody>{item.name}</TextBody>
              </View>
              <Button label="Edit" onPress={() => onEdit(item.id)} />
              <Button label="Delete" onPress={() => onDelete(item.id)} />
            </View>
          )}
        />
      ) : (
        <TextBody style={{ textAlign: "center", marginTop: 20, opacity: 0.7 }}>
          No categories yet. Use the suggestions above or create your own!
        </TextBody>
      )}
    </ScreenWithHeader>
  );
};

const styles = StyleSheet.create({
  ctaContainer: {
    marginBottom: 20,
  },
  addCategoryRow: {
    flexDirection: "row",
    gap: 8,
  },
  suggestedCategoriesContainer: {
    gap: 12,
  },
  suggestedCategoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  suggestedCategoryText: {
    ...fonts.styles.label,
  },
  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});

export default CategoriesScreen;
