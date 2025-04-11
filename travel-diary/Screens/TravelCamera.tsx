import React, { useEffect, useState } from 'react';
import {
  View, Image, ScrollView, TouchableOpacity, Text, SafeAreaView, TextInput, Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../components/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import cameraStyles from '../styles/mainCamera';

// ✅ Notification handler setup
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function TravelCamera() {
  const { isDarkMode } = useTheme();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<string | null>(null);
  const [entryText, setEntryText] = useState('');

  useEffect(() => {
    (async () => {
      try {
        await registerForPushNotificationsAsync();

        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        setHasCameraPermission(cameraStatus === 'granted');

        const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
        setHasGalleryPermission(mediaStatus === 'granted');

        if (mediaStatus === 'granted') {
          const photos = await MediaLibrary.getAssetsAsync({
            first: 10,
            mediaType: ['photo'],
            sortBy: ['creationTime'],
          });

          const uris = await Promise.all(
            photos.assets.map(async (asset) => {
              const info = await MediaLibrary.getAssetInfoAsync(asset);
              return info?.localUri || asset.uri;
            })
          );

          setGalleryPhotos(uris);
        }

        const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
        if (locationStatus === 'granted') {
          const currentLocation = await Location.getCurrentPositionAsync({});
          const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          });

          if (reverseGeocode.length > 0) {
            const { city, country } = reverseGeocode[0];
            setLocation(`${city}, ${country}`);
          }
        }
      } catch (error) {
        console.error('Initialization Error:', error);
      }
    })();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (!Device.isDevice) {
      alert('Must use physical device for push notifications');
      return;
    }

    const { granted: existingPermission } = await Notifications.getPermissionsAsync();
    let finalPermission = existingPermission;

    if (!existingPermission) {
      const { granted: newPermission } = await Notifications.requestPermissionsAsync();
      finalPermission = newPermission;
    }

    if (!finalPermission) {
      alert('Permission for notifications not granted!');
      return;
    }

    if (!Constants.expoConfig?.extra?.eas?.projectId) {
      alert('Missing projectId in app config.');
      return;
    }

    const token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })
    ).data;

    console.log('Expo Push Token:', token);
  };

  const takePicture = async () => {
    if (!hasCameraPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const asset = await MediaLibrary.createAssetAsync(uri);
        const info = await MediaLibrary.getAssetInfoAsync(asset);
        if (info) {
          setImageUri(info.localUri || uri);
        }
      }
    } catch (error) {
      console.error('Camera Error:', error);
    }
  };

  const saveEntry = async () => {
    if (!imageUri || !location || !entryText.trim()) return;

    const newEntry = {
      imageUri,
      location,
      entryText,
      date: new Date().toISOString(),
    };

    try {
      const existingEntries = await AsyncStorage.getItem('travelEntries');
      const parsedEntries = existingEntries ? JSON.parse(existingEntries) : [];

      parsedEntries.push(newEntry);
      await AsyncStorage.setItem('travelEntries', JSON.stringify(parsedEntries));

      // ✅ Send a local notification after saving
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New Travel Entry Saved!',
          body: `Your memory from ${location} was added.`,
        },
        trigger: null,
      });

      setImageUri(null);
      setEntryText('');
    } catch (error) {
      console.error('Save Entry Error:', error);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[cameraStyles.container, isDarkMode && { backgroundColor: '#000' }]}>
        <TouchableOpacity onPress={takePicture} style={cameraStyles.button} disabled={hasCameraPermission === false}>
          <Text style={cameraStyles.buttonText}>Take a Picture</Text>
        </TouchableOpacity>

        {imageUri ? (
          <View style={cameraStyles.preview}>
            <Image source={{ uri: imageUri }} style={cameraStyles.image} />
            <TextInput
              placeholder="Share us your memorable trip!"
              value={entryText}
              onChangeText={setEntryText}
              multiline
              style={[cameraStyles.textInput, isDarkMode && { color: '#fff' }]}
              placeholderTextColor={isDarkMode ? '#ccc' : '#888'}
            />
            <TouchableOpacity onPress={saveEntry} style={cameraStyles.button}>
              <Text style={cameraStyles.buttonText}>Save Entry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={cameraStyles.preview}>
            <Text style={[cameraStyles.label, isDarkMode && { color: '#fff' }]}>
              Select or take a photo
            </Text>
          </View>
        )}

        {hasGalleryPermission !== false && (
          <>
            <Text style={[cameraStyles.label, isDarkMode && { color: '#fff' }]}>Gallery:</Text>
            <ScrollView horizontal contentContainerStyle={cameraStyles.galleryContainer}>
              {galleryPhotos.slice(0, 4).map((uri, index) => (
                <TouchableOpacity key={index} onPress={() => setImageUri(uri)}>
                  <Image source={{ uri }} style={cameraStyles.thumbnail} />
                </TouchableOpacity>
              ))}
              <TouchableOpacity onPress={openGallery} style={cameraStyles.addPhotoBox}>
                <Ionicons name="image" size={24} color="#fff" />
                <Text style={cameraStyles.addPhotoText}>Add Photo</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        )}

        {location && (
          <Text style={[cameraStyles.label, isDarkMode && { color: '#fff' }]}>
            Current Location: {location}
          </Text>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
