import React, { useState, useRef, useEffect } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Keyboard,
  Alert
} from 'react-native';
import {
  Shield,
  ChevronDown,
  X,
  CheckCircle,
  ArrowLeft,
  MapPin,
  Search
} from 'lucide-react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

interface InstallationFormActionSheetProps {
  sheetId: string;
  payload?: {
    onSubmit: (values: any) => void;
  };
}

const cities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur'
];

const GOOGLE_API_KEY = 'AIzaSyDBFyJk1ZsnnqxLC43WT_-OSCFZaG0OaNM';

export function InstallationFormActionSheet({ sheetId, payload }: InstallationFormActionSheetProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    city: '',
    address: '',
    coordinates: null as { latitude: number; longitude: number } | null
  });

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [errors, setErrors] = useState({
    name: false,
    mobile: false,
    city: false,
    location: false
  });

  const mapRef = useRef<MapView>(null);
  const autocompleteRef = useRef<any>(null);

  const validateStep1 = () => {
    const newErrors = {
      name: !formData.name.trim() || formData.name.trim().length < 2,
      mobile: !formData.mobile.trim() || !/^\d{10}$/.test(formData.mobile.trim()),
      city: !formData.city.trim(),
      location: false
    };

    setErrors(newErrors);
    return !newErrors.name && !newErrors.mobile && !newErrors.city;
  };

  const validateStep2 = () => {
    const newErrors = {
      ...errors,
      location: !formData.coordinates || !formData.address.trim()
    };

    setErrors(newErrors);
    return !newErrors.location;
  };

  const handleClose = () => {
    SheetManager.hide(sheetId);
  };

  const handleNext = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
    setErrors(prev => ({ ...prev, location: false }));
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (payload?.onSubmit) {
        payload.onSubmit(formData);
      }
      handleClose();
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCitySelect = (city: string) => {
    setFormData(prev => ({ ...prev, city }));
    setShowCityPicker(false);
    setErrors(prev => ({ ...prev, city: false }));
  };

  const handlePlaceSelect = (data: any, details: any) => {
    setIsSearchLoading(true);

    if (details?.geometry?.location) {
      const coordinates = {
        latitude: details.geometry.location.lat,
        longitude: details.geometry.location.lng,
      };

      setFormData(prev => ({
        ...prev,
        address: data.description || details.formatted_address,
        coordinates
      }));

      setErrors(prev => ({ ...prev, location: false }));

      // Animate map to selected location
      if (mapRef.current) {
        mapRef.current.animateToRegion({
          ...coordinates,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    }

    setIsSearchLoading(false);
  };

  const handleMapPress = (event: any) => {
    const coordinates = event.nativeEvent.coordinate;
    setFormData(prev => ({
      ...prev,
      coordinates,
      address: `${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}`
    }));
    setErrors(prev => ({ ...prev, location: false }));
  };

  const DotLoader = () => (
    <View className="flex-row justify-center items-center space-x-1">
      <View className="w-2 h-2 bg-white rounded-full animate-pulse" />
      <View className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      <View className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
    </View>
  );

  return (
    <ActionSheet
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,

      }}
      closable={true}
    >
      <View className=" relative">
        {/* Loading Overlay */}
        {isLoading && (
          <View className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
            <View className="bg-white rounded-2xl p-6 items-center">
              <ActivityIndicator size="large" color="#1a1a1a" />
              <Text
                className="mt-4 text-base text-black"
                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
              >
                Processing...
              </Text>
            </View>
          </View>
        )}

        <View className="r" >
          <View className="relative w-full py-[40px] px-4 md:py-[20px] lg:py-0 border-b border-[#aaaaaa]/20 md:px-[30px] lg:px-[60px]">

            {/* Header with Navigation */}
            <View className="flex-row items-center justify-between mb-4">
              {currentStep === 2 && (
                <TouchableOpacity
                  onPress={handleBack}
                  className="p-2"
                >
                  <ArrowLeft size={24} color="#000000" />
                </TouchableOpacity>
              )}

              <View className="flex-1">
                <Text
                  className="text-center text-sm"
                  style={{ fontFamily: 'PlusJakartaSans-Medium', color: '#666' }}
                >
                  Step {currentStep} of 2
                </Text>
              </View>

              <TouchableOpacity
                onPress={handleClose}
                className="p-2"
              >
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <View className="grow py-5">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  {/* Header */}
                  <View className="mb-6">
                    <Text
                      className="text-xl md:text-4xl text-center !leading-[30px] md:!leading-[46px] text-black"
                      style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                    >
                      Start Your 7-Day Risk-Free Trial
                    </Text>

                    <View className="mt-2 flex-row items-center justify-center">
                      <Shield size={18} color="#E0FF22" />
                      <Text
                        className="text-sm md:text-base font-normal text-center !leading-[21px] md:!leading-[24px] text-black ml-1"
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                      >
                        Trusted by a community of{' '}
                        <Text
                          className="font-semibold"
                          style={{ fontFamily: 'PlusJakartaSans-SemiBold', color: '#E0FF22' }}
                        >
                          1M+ across 9 cities
                        </Text>
                      </Text>
                    </View>
                  </View>

                  {/* Form */}
                  <View className="w-full flex flex-col gap-4">
                    {/* Name Field */}
                    <View className="w-full">
                      <TextInput
                        className={`flex min-h-9 w-full border text-sm bg-white md:text-base rounded-2xl py-3 md:py-[15px] px-[18px] ${errors.name ? 'border-red-500' : 'border-slate-200'
                          }`}
                        placeholder="Enter your name"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        value={formData.name}
                        onChangeText={(text) => {
                          setFormData(prev => ({ ...prev, name: text }));
                          if (errors.name && text.trim().length >= 2) {
                            setErrors(prev => ({ ...prev, name: false }));
                          }
                        }}
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                      />
                      {errors.name && (
                        <Text
                          className="text-red-500 text-xs mt-1 ml-4"
                          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                        >
                          Please enter a valid name (minimum 2 characters)
                        </Text>
                      )}
                    </View>

                    {/* Mobile Field */}
                    <View className="w-full">
                      <TextInput
                        className={`flex min-h-9 w-full border text-sm bg-white md:text-base rounded-2xl py-3 md:py-[15px] px-[18px] ${errors.mobile ? 'border-red-500' : 'border-slate-200'
                          }`}
                        placeholder="Enter your mobile number"
                        placeholderTextColor="rgba(0,0,0,0.4)"
                        keyboardType="numeric"
                        maxLength={10}
                        value={formData.mobile}
                        onChangeText={(text) => {
                          const numericText = text.replace(/[^0-9]/g, '');
                          setFormData(prev => ({ ...prev, mobile: numericText }));
                          if (errors.mobile && /^\d{10}$/.test(numericText)) {
                            setErrors(prev => ({ ...prev, mobile: false }));
                          }
                        }}
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                      />
                      {errors.mobile && (
                        <Text
                          className="text-red-500 text-xs mt-1 ml-4"
                          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                        >
                          Please enter a valid 10-digit mobile number
                        </Text>
                      )}
                    </View>

                    {/* City Field */}
                    <View className="w-full relative">
                      <TouchableOpacity
                        className={`flex min-h-9 w-full border bg-white rounded-2xl py-3 md:py-[15px] px-[18px] flex-row items-center justify-between ${errors.city ? 'border-red-500' : 'border-slate-200'
                          }`}
                        onPress={() => setShowCityPicker(!showCityPicker)}
                      >
                        <Text
                          className={`md:text-base ${formData.city ? 'text-black' : 'text-black/40'}`}
                          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                        >
                          {formData.city || 'Choose City'}
                        </Text>
                        <ChevronDown size={16} color="rgba(0,0,0,0.5)" />
                      </TouchableOpacity>

                      {errors.city && (
                        <Text
                          className="text-red-500 text-xs mt-1 ml-4"
                          style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                        >
                          Please select a city
                        </Text>
                      )}

                      {/* City Picker Dropdown */}
                      {showCityPicker && (
                        <View className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-2xl mt-1 z-50 max-h-48 shadow-lg">
                          <ScrollView nestedScrollEnabled>
                            {cities.map((city, index) => (
                              <TouchableOpacity
                                key={index}
                                className="py-3 px-4 border-b border-slate-100"
                                onPress={() => handleCitySelect(city)}
                              >
                                <Text
                                  className="text-base text-black"
                                  style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                  {city}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    {/* Next Button */}
                    <View className="w-full flex justify-center mt-4">
                      <TouchableOpacity
                        className="w-full rounded-2xl py-3 md:py-[15px] px-[18px]"
                        style={{
                          backgroundColor: '#1a1a1a'
                        }}
                        onPress={handleNext}
                      >
                        <Text
                          className="text-sm md:text-[18px] font-semibold text-center text-white"
                          style={{
                            fontFamily: 'PlusJakartaSans-SemiBold'
                          }}
                        >
                          Next
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              {/* Step 2: Location Selection */}
              {currentStep === 2 && (
                <>
                  {/* Header */}
                  <View className="mb-6">
                    <Text
                      className="text-xl md:text-3xl text-center !leading-[30px] md:!leading-[40px] text-black"
                      style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                    >
                      Select Installation Location
                    </Text>

                    <Text
                      className="mt-2 text-sm md:text-base text-center text-gray-600"
                      style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    >
                      Choose the exact location where you want the installation
                    </Text>
                  </View>

                  {/* Address Search */}
                  <View className="mb-4 relative">
                    <GooglePlacesAutocomplete
                      ref={autocompleteRef}
                      placeholder="Search for your address..."
                      predefinedPlaces={[]}
                      onPress={(data, details = null) => {
                        handlePlaceSelect(data, details);
                      }}
                      query={{
                        key: GOOGLE_API_KEY,
                        language: 'en',
                        components: 'country:in',
                      }}
                      fetchDetails={true}
                      enablePoweredByContainer={false}
                      debounce={300}
                      timeout={20000}
                      minLength={2}
                      nearbyPlacesAPI="GooglePlacesSearch"
                      GooglePlacesDetailsQuery={{
                        fields: 'geometry,formatted_address,name,rating,types,address_components',
                      }}
                      styles={{
                        container: {
                          flex: 0,
                          zIndex: 100,
                        },
                        textInputContainer: {
                          backgroundColor: 'transparent',
                          borderWidth: 0,
                          height: 50,
                          paddingHorizontal: 0,
                        },
                        textInput: {
                          height: 50,
                          borderRadius: 16,
                          borderWidth: 1,
                          borderColor: errors.location ? '#ef4444' : '#e2e8f0',
                          backgroundColor: '#ffffff',
                          paddingLeft: 48,
                          paddingRight: 16,
                          fontSize: 16,
                          color: '#000000',
                          fontFamily: 'PlusJakartaSans-Regular',
                        },
                        listView: {
                          backgroundColor: 'white',
                          borderRadius: 16,
                          marginTop: 8,
                          maxHeight: 300,
                          elevation: 4,
                          shadowColor: '#000',
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                        },
                        row: {
                          backgroundColor: 'white',
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: '#f1f5f9',
                        },
                        separator: {
                          height: 1,
                          backgroundColor: '#f1f5f9',
                        },
                        description: {
                          fontSize: 16,
                          color: '#000000',
                          fontWeight: '600',
                          fontFamily: 'PlusJakartaSans-SemiBold',
                        },
                        predefinedPlacesDescription: {
                          fontSize: 14,
                          color: '#64748b',
                          fontFamily: 'PlusJakartaSans-Regular',
                        },
                      }}
                      textInputProps={{
                        placeholderTextColor: '#94a3b8',
                        onChangeText: (text) => {
                          setSearchText(text);
                        },
                        value: searchText,
                        returnKeyType: 'search',
                        clearButtonMode: 'while-editing',
                      }}
                      renderLeftButton={() => (
                        <View style={{
                          position: 'absolute',
                          top: 0,
                          bottom: 0,
                          left: 16,
                          justifyContent: 'center',
                          zIndex: 10,
                        }}>
                          {isSearchLoading ? (
                            <ActivityIndicator size="small" color="#94a3b8" />
                          ) : (
                            <Search size={20} color="#94a3b8" />
                          )}
                        </View>
                      )}
                      listEmptyComponent={() => (
                        <View style={{ padding: 16 }}>
                          <Text style={{
                            textAlign: 'center',
                            color: '#6b7280',
                            fontSize: 14,
                            fontFamily: 'PlusJakartaSans-Regular'
                          }}>
                            {searchText.length > 0 ? 'No results found' : 'Start typing to search'}
                          </Text>
                        </View>
                      )}
                      onFail={(error) => {
                        console.error('GooglePlacesAutocomplete error:', error);
                        Alert.alert('Search Error', 'Unable to search locations. Please try again.');
                      }}
                      keyboardShouldPersistTaps="handled"
                      listViewDisplayed="auto"
                      keepResultsAfterBlur={false}
                      suppressDefaultStyles={false}
                    />

                    {errors.location && (
                      <Text
                        className="text-red-500 text-xs mt-1 ml-4"
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                      >
                        Please select a location on the map
                      </Text>
                    )}
                  </View>

                  {/* Map */}
                  <View className={`h-96 rounded-2xl overflow-hidden border-2 ${errors.location ? 'border-red-500' : (formData.coordinates ? 'border-black' : 'border-slate-200')
                    }`}>
                    <MapView
                      ref={mapRef}
                      provider={PROVIDER_GOOGLE}
                      style={{ flex: 1 }}
                      initialRegion={{
                        latitude: 28.6139,
                        longitude: 77.2090,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                      }}
                      onPress={handleMapPress}
                      showsUserLocation={true}
                      showsMyLocationButton={true}
                    >
                      {formData.coordinates && (
                        <Marker coordinate={formData.coordinates}>
                          <View className="bg-red-500 p-2 rounded-full">
                            <MapPin size={20} color="#ffffff" />
                          </View>
                        </Marker>
                      )}
                    </MapView>
                  </View>

                  {formData.coordinates && (
                    <View className="mt-4 p-4 bg-gray-50 rounded-2xl">
                      <Text
                        className="text-sm font-medium text-gray-700 mb-1"
                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                      >
                        Selected Location:
                      </Text>
                      <Text
                        className="text-sm text-gray-600"
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                      >
                        {formData.address}
                      </Text>
                    </View>
                  )}

                  {/* Submit Button */}
                  <View className="w-full flex justify-center mt-6">
                    <TouchableOpacity
                      className="w-full rounded-2xl py-3 md:py-[15px] px-[18px] border-4"
                      style={{
                        backgroundColor: '#EEF1FF',
                        borderColor: '#9FADF4'
                      }}
                      onPress={handleSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <DotLoader />
                      ) : (
                        <Text
                          className="text-sm md:text-[18px] font-semibold text-center"
                          style={{
                            fontFamily: 'PlusJakartaSans-SemiBold',
                            color: '#1a1a1a'
                          }}
                        >
                          Book Installation
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
}