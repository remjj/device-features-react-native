import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';
import { useFocusEffect } from '@react-navigation/native';
import diaryStyles from '../styles/diaryStyle';
import Icon from 'react-native-vector-icons/Ionicons';

const Diary = () => {
  const { isDarkMode } = useTheme();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMenuIndex, setShowMenuIndex] = useState<number | null>(null);

  const fetchEntries = async () => {
    try {
      const storedEntries = await AsyncStorage.getItem('travelEntries');
      if (storedEntries) {
        setEntries(JSON.parse(storedEntries));
      }
    } catch (error) {
      console.error('Failed to load travel entries:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchEntries();
    }, [])
  );

  const deleteEntry = async (index: number) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this entry?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedEntries = entries.filter((_, i) => i !== index);
            await AsyncStorage.setItem('travelEntries', JSON.stringify(updatedEntries));
            setEntries(updatedEntries);
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item, index }: { item: any; index: number }) => (
    <View style={[diaryStyles.entryContainer, isDarkMode && { backgroundColor: '#1a1a1a' }]}>
      <Image source={{ uri: item.imageUri }} style={diaryStyles.image} />
      <View style={diaryStyles.textWrapper}>
        <Text style={[diaryStyles.description, isDarkMode && { color: '#fff' }]}>{item.entryText}</Text>
        <Text style={[diaryStyles.location, isDarkMode && { color: '#fff' }]}>Location: {item.location}</Text>
        <Text style={[diaryStyles.date, isDarkMode && { color: '#fff' }]}>Date: {new Date(item.date).toLocaleString()}</Text>
      </View>
      <View style={diaryStyles.optionsContainer}>
        <TouchableOpacity onPress={() => setShowMenuIndex(showMenuIndex === index ? null : index)}>
          <Icon name="ellipsis-horizontal" size={24} color={isDarkMode ? '#fff' : '#CEE7E6'} />
        </TouchableOpacity>
        {showMenuIndex === index && (
          <View style={diaryStyles.menu}>
            <TouchableOpacity onPress={() => deleteEntry(index)}>
              <Text style={diaryStyles.menuItem}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[diaryStyles.container, isDarkMode && { backgroundColor: '#000' }]}>
      <Text style={[diaryStyles.title, isDarkMode && { color: '#fff' }]}>My Travel Diary</Text>
      {loading ? (
        <ActivityIndicator size="large" color={isDarkMode ? '#fff' : '#000'} />
      ) : entries.length === 0 ? (
        <Text style={[diaryStyles.noEntries, isDarkMode && { color: '#fff' }]}>No travel entries yet.</Text>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={diaryStyles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Diary;
