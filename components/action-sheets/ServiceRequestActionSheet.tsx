import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Image,
  Keyboard,
} from 'react-native';
import {
  X,
  ArrowLeft,
  ArrowRight,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react-native';
import { GlobalLoader } from '../GlobalLoader';
import * as ImagePicker from 'expo-image-picker';

interface ServiceRequestActionSheetProps {
  sheetId: string;
  payload?: {
    onSubmit: (data: ServiceRequestData) => void;
  };
}

interface ServiceRequestData {
  serviceType: string;
  description: string;
  photos: string[];
}

const serviceTypes = [
  { id: 'filter', name: 'Filter Replacement', icon: '🔧' },
  { id: 'maintenance', name: 'Maintenance Check', icon: '⚙️' },
  { id: 'repair', name: 'Repair Service', icon: '🛠️' },
  { id: 'installation', name: 'Installation', icon: '📦' },
  { id: 'others', name: 'Others', icon: '❓' },
];

export function ServiceRequestActionSheet({ sheetId, payload }: ServiceRequestActionSheetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServiceType, setSelectedServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const handleClose = () => {
    Keyboard.dismiss();
    SheetManager.hide(sheetId);
    // Reset state
    setCurrentStep(1);
    setSelectedServiceType('');
    setDescription('');
    setPhotos([]);
    setIsLoading(false);
  };

  const handleNext = () => {
    if (currentStep === 1 && !selectedServiceType) {
      Alert.alert('Error', 'Please select a service type');
      return;
    }
    if (currentStep === 2 && !description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to take photos');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Media library permission is required to select photos');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (photos.length >= 4) {
      Alert.alert('Limit reached', 'You can upload maximum 4 photos');
      return;
    }

    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setPhotos(prev => [...prev, result.assets[0].uri]);
    }
  };

  const pickPhoto = async () => {
    if (photos.length >= 4) {
      Alert.alert('Limit reached', 'You can upload maximum 4 photos');
      return;
    }

    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: 4 - photos.length,
    });

    if (!result.canceled) {
      const newPhotos = result.assets.map(asset => asset.uri);
      setPhotos(prev => [...prev, ...newPhotos].slice(0, 4));
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Add Photo',
      'Choose an option',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickPhoto },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const requestData: ServiceRequestData = {
        serviceType: selectedServiceType,
        description: description.trim(),
        photos,
      };

      if (payload?.onSubmit) {
        payload.onSubmit(requestData);
      }

      Alert.alert(
        'Request Submitted',
        'Your service request has been submitted successfully. Our team will contact you shortly.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionSheet
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      closable={true}
    >
      <View className="relative bg-white">
        <GlobalLoader isVisible={isLoading} message="Submitting request..." />

        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            {currentStep > 1 && (
              <TouchableOpacity onPress={handleBack} className="p-2">
                <ArrowLeft size={24} color="#000000" />
              </TouchableOpacity>
            )}

            <View className="flex-1">
              <Text
                className="text-center text-sm text-gray-600"
                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
              >
                Step {currentStep} of 3
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} className="p-2">
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView className="max-h-[70vh]" showsVerticalScrollIndicator={false}>
            {/* Step 1: Service Type Selection */}
            {currentStep === 1 && (
              <View>
                <Text
                  className="text-xl text-center text-black mb-6"
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  Select Service Type
                </Text>

                <View className="gap-3">
                  {serviceTypes.map((type) => (
                    <TouchableOpacity
                      key={type.id}
                      className={`p-4 rounded-xl border-2 ${
                        selectedServiceType === type.id
                          ? 'border-[#4548b9] bg-blue-50'
                          : 'border-gray-200 bg-white'
                      }`}
                      onPress={() => setSelectedServiceType(type.id)}
                    >
                      <View className="flex-row items-center gap-3">
                        <Text className="text-2xl">{type.icon}</Text>
                        <Text
                          className={`text-base ${
                            selectedServiceType === type.id ? 'text-[#4548b9]' : 'text-gray-700'
                          }`}
                          style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                        >
                          {type.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity
                  className={`mt-6 py-4 rounded-xl ${
                    selectedServiceType ? 'bg-[#4548b9]' : 'bg-gray-300'
                  }`}
                  onPress={handleNext}
                  disabled={!selectedServiceType}
                >
                  <View className="flex-row items-center justify-center">
                    <Text
                      className={`text-base mr-2 ${
                        selectedServiceType ? 'text-white' : 'text-gray-500'
                      }`}
                      style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                      Next
                    </Text>
                    <ArrowRight size={20} color={selectedServiceType ? 'white' : '#6B7280'} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 2: Description */}
            {currentStep === 2 && (
              <View>
                <Text
                  className="text-xl text-center text-black mb-6"
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  Describe the Issue
                </Text>

                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[120px] border border-gray-200"
                  style={{
                    fontFamily: 'PlusJakartaSans-Regular',
                    textAlignVertical: 'top'
                  }}
                  placeholder="Please describe the issue or service needed in detail..."
                  placeholderTextColor="#9CA3AF"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={5}
                />

                <TouchableOpacity
                  className={`mt-6 py-4 rounded-xl ${
                    description.trim() ? 'bg-[#4548b9]' : 'bg-gray-300'
                  }`}
                  onPress={handleNext}
                  disabled={!description.trim()}
                >
                  <View className="flex-row items-center justify-center">
                    <Text
                      className={`text-base mr-2 ${
                        description.trim() ? 'text-white' : 'text-gray-500'
                      }`}
                      style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                      Next
                    </Text>
                    <ArrowRight size={20} color={description.trim() ? 'white' : '#6B7280'} />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Photo Upload */}
            {currentStep === 3 && (
              <View>
                <Text
                  className="text-xl text-center text-black mb-2"
                  style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                  Add Photos
                </Text>
                <Text
                  className="text-sm text-center text-gray-600 mb-6"
                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                >
                  Upload up to 4 photos to help us understand the issue better
                </Text>

                {/* Photo Grid */}
                <View className="flex-row flex-wrap gap-3 mb-6">
                  {photos.map((photo, index) => (
                    <View key={index} className="relative">
                      <Image
                        source={{ uri: photo }}
                        className="w-20 h-20 rounded-lg"
                        resizeMode="cover"
                      />
                      <TouchableOpacity
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                        onPress={() => removePhoto(index)}
                      >
                        <Trash2 size={12} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}

                  {/* Add Photo Button */}
                  {photos.length < 4 && (
                    <TouchableOpacity
                      className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg items-center justify-center"
                      onPress={showPhotoOptions}
                    >
                      <Camera size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Photo Action Buttons */}
                <View className="flex-row gap-3 mb-6">
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-3 bg-gray-100 rounded-xl"
                    onPress={takePhoto}
                    disabled={photos.length >= 4}
                  >
                    <Camera size={20} color={photos.length >= 4 ? '#9CA3AF' : '#374151'} />
                    <Text
                      className={`ml-2 ${photos.length >= 4 ? 'text-gray-400' : 'text-gray-700'}`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      Take Photo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center py-3 bg-gray-100 rounded-xl"
                    onPress={pickPhoto}
                    disabled={photos.length >= 4}
                  >
                    <Upload size={20} color={photos.length >= 4 ? '#9CA3AF' : '#374151'} />
                    <Text
                      className={`ml-2 ${photos.length >= 4 ? 'text-gray-400' : 'text-gray-700'}`}
                      style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                      Upload
                    </Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  className="py-4 rounded-xl bg-[#4548b9]"
                  onPress={handleSubmit}
                >
                  <Text
                    className="text-white text-center text-base"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Submit Request
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </ActionSheet>
  );
}