import React, { useState } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Screen, Title, TextField, Button, TextBody } from '../components/Neutral';
import { useStore } from '../store/useStore';

const CategoriesScreen: React.FC<any> = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useStore();
  const [name, setName] = useState('');

  const onAdd = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    addCategory(trimmed);
    setName('');
  };

  const onEdit = (id: string) => {
    Alert.prompt('Edit category', undefined, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: (value?: string) => value && updateCategory(id, value) }
    ], 'plain-text');
  };

  const onDelete = (id: string) => {
    Alert.alert('Delete category?', 'This will remove the category from habits.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCategory(id) }
    ]);
  };

  return (
    <Screen>
      <Title style={{ marginBottom: 12 }}>Categories</Title>
      <View style={{ flexDirection: 'row', marginBottom: 12, gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TextField value={name} onChangeText={setName} placeholder="New category" />
        </View>
        <Button label="Add" onPress={onAdd} />
      </View>

      {categories.length === 0 ? (
        <TextBody>No categories yet.</TextBody>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(c) => c.id}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flex: 1 }}>
                <TextBody>{item.name}</TextBody>
              </View>
              <Button label="Edit" onPress={() => onEdit(item.id)} />
              <Button label="Delete" onPress={() => onDelete(item.id)} />
            </View>
          )}
        />
      )}
    </Screen>
  );
};

export default CategoriesScreen;
