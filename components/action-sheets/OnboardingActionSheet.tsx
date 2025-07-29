import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Keyboard,
    ScrollView,
} from 'react-native';
import {
    X,
    ArrowRight,
    MapPin,
} from 'lucide-react-native';
import { DynamicInput } from '../DynamicInput';
import { DynamicSelect, SelectOption } from '../DynamicSelect';
import { router } from 'expo-router';

interface OnboardingActionSheetProps {
    sheetId: string;
    payload?: {
        onComplete: (data: OnboardingData) => void;
    };
}

interface OnboardingData {
    username: string;
    alternativePhone: string;
    city: string;
}

// Sample cities data - convert to SelectOption format
const CITY_OPTIONS: SelectOption[] = [
    {
        id: '1',
        label: 'Mumbai',
        value: 'mumbai',
        subtitle: 'Maharashtra',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '2',
        label: 'Delhi',
        value: 'delhi',
        subtitle: 'Delhi',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '3',
        label: 'Bangalore',
        value: 'bangalore',
        subtitle: 'Karnataka',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '4',
        label: 'Hyderabad',
        value: 'hyderabad',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '5',
        label: 'Chennai',
        value: 'chennai',
        subtitle: 'Tamil Nadu',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '6',
        label: 'Kolkata',
        value: 'kolkata',
        subtitle: 'West Bengal',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '7',
        label: 'Pune',
        value: 'pune',
        subtitle: 'Maharashtra',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '8',
        label: 'Jaipur',
        value: 'jaipur',
        subtitle: 'Rajasthan',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '9',
        label: 'Lucknow',
        value: 'lucknow',
        subtitle: 'Uttar Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '10',
        label: 'Kanpur',
        value: 'kanpur',
        subtitle: 'Uttar Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '11',
        label: 'Nagpur',
        value: 'nagpur',
        subtitle: 'Maharashtra',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '12',
        label: 'Indore',
        value: 'indore',
        subtitle: 'Madhya Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '13',
        label: 'Thane',
        value: 'thane',
        subtitle: 'Maharashtra',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '14',
        label: 'Bhopal',
        value: 'bhopal',
        subtitle: 'Madhya Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '15',
        label: 'Visakhapatnam',
        value: 'visakhapatnam',
        subtitle: 'Andhra Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
];

export function OnboardingActionSheet({ sheetId, payload }: OnboardingActionSheetProps) {
    const [username, setUsername] = useState('');
    const [alternativePhone, setAlternativePhone] = useState('');
    const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        Keyboard.dismiss();
        SheetManager.hide(sheetId);
        // Reset state when closing
        setUsername('');
        setAlternativePhone('');
        setSelectedCity(null);
        setIsLoading(false);
    };

    const validateUsername = (name: string): string | null => {
        if (!name.trim()) {
            return 'Username is required';
        }
        if (name.trim().length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (name.trim().length > 20) {
            return 'Username must be less than 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(name.trim())) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return null;
    };

    const validatePhone = (phone: string): string | null => {
        if (!phone.trim()) {
            return 'Alternative phone number is required';
        }
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone.trim())) {
            return 'Please enter a valid 10-digit phone number';
        }
        return null;
    };

    const validateCity = (city: SelectOption | null): string | null => {
        if (!city) {
            return 'Please select a city';
        }
        return null;
    };

    const handleComplete = async () => {
        Keyboard.dismiss();

        const usernameError = validateUsername(username);
        const phoneError = validatePhone(alternativePhone);
        const cityError = validateCity(selectedCity);

        if (usernameError || phoneError || cityError) {
            return; // Components will show the errors
        }

        setIsLoading(true);

        try {
            // Simulate API call for onboarding
            await new Promise(resolve => setTimeout(resolve, 2000));

            const onboardingData: OnboardingData = {
                username: username.trim(),
                alternativePhone: alternativePhone.trim(),
                city: selectedCity!.label,
            };

            if (payload?.onComplete) {
                payload.onComplete(onboardingData);
            }

            Alert.alert(
                'Onboarding Complete!',
                'Welcome! Your profile has been set up successfully.',
                [{ text: 'OK', onPress: handleClose }]
            );
            router.replace('/(newuser)/(tabs)')

        } catch (error) {
            Alert.alert(
                'Onboarding Failed',
                'Something went wrong. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        username.trim() &&
        alternativePhone.trim() &&
        selectedCity &&
        validateUsername(username) === null &&
        validatePhone(alternativePhone) === null &&
        validateCity(selectedCity) === null;

    const isCompleteDisabled = !isFormValid || isLoading;

    return (
        <ActionSheet
            id={sheetId}
            containerStyle={{
                paddingHorizontal: 0,
                paddingBottom: 0,
            }}
            closable={false}
            closeOnTouchBackdrop={false}
            gestureEnabled={false}
        >
            <View className="relative bg-white">
                {/* Loading Overlay */}
                {isLoading && (
                    <View className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
                        <View className="bg-white rounded-2xl p-6 items-center min-w-[200px]">
                            <ActivityIndicator size="large" color="#1a1a1a" />
                            <Text
                                className="mt-4 text-base text-black text-center"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            >
                                Setting up your profile...
                            </Text>
                        </View>
                    </View>
                )}

                <ScrollView className="max-h-[80vh]" showsVerticalScrollIndicator={false}>
                    <View className="px-6 py-8">
                        {/* Header */}
                        <View className="flex-row items-center justify-between mb-6">
                            <View className="flex-1">

                                <Text
                                    className="text-xl md:text-4xl text-center !leading-[30px] md:!leading-[46px] text-black"
                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                >
                                    Complete Your Profile
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleClose}
                                className="p-2"
                                disabled={isLoading}
                            >
                                <X size={24} color="#000000" />
                            </TouchableOpacity>
                        </View>

                        {/* Form */}
                        <View className="mb-8">
                            {/* Username Input */}
                            <DynamicInput
                                label="Username"
                                placeholder="Enter your username"
                                value={username}
                                onChangeText={setUsername}
                                validation={validateUsername}
                                borderRadius={12}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                                containerStyle={{ marginBottom: 24 }}
                                maxLength={20}
                                required
                            />

                            {/* Alternative Phone Input */}
                            <DynamicInput
                                label="Alternative Phone Number"
                                placeholder="Enter alternative phone number"
                                value={alternativePhone}
                                onChangeText={setAlternativePhone}
                                validation={validatePhone}
                                borderRadius={12}
                                keyboardType="phone-pad"
                                editable={!isLoading}
                                containerStyle={{ marginBottom: 24 }}
                                maxLength={10}
                                required
                            />

                            {/* City Selection */}
                            <DynamicSelect
                                label="City"
                                placeholder="Select your city"
                                options={CITY_OPTIONS}
                                value={selectedCity}
                                onSelect={setSelectedCity}
                                validation={validateCity}
                                borderRadius={12}
                                searchable={true}
                                searchPlaceholder="Search cities..."
                                modalTitle="Select City"
                                disabled={isLoading}
                                required
                                containerStyle={{ marginBottom: 24 }}
                            />
                        </View>

                        {/* Complete Button */}
                        <TouchableOpacity
                            className={`flex-row items-center justify-center py-4 rounded-xl ${isCompleteDisabled
                                    ? 'bg-gray-300'
                                    : 'bg-[#4548b9]'
                                }`}
                            onPress={handleComplete}
                            disabled={isCompleteDisabled}
                            activeOpacity={0.8}
                        >
                            {isLoading ? (
                                <View className="flex-row items-center">
                                    <ActivityIndicator size="small" color="white" />
                                    <Text
                                        className="text-white text-base ml-2"
                                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                    >
                                        Setting up...
                                    </Text>
                                </View>
                            ) : (
                                <View className="flex-row items-center">
                                    <Text
                                        className={`text-base mr-2 ${isCompleteDisabled ? 'text-gray-500' : 'text-white'
                                            }`}
                                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                    >
                                        Complete Setup
                                    </Text>
                                    <ArrowRight
                                        size={20}
                                        color={isCompleteDisabled ? '#6B7280' : 'white'}
                                    />
                                </View>
                            )}
                        </TouchableOpacity>

                        {/* Footer */}
                        <View className="mt-6">
                            <Text
                                className="text-center text-sm text-gray-500"
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                            >
                                By continuing, you agree to our{' '}
                                <Text
                                    className="text-blue-600"
                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                >
                                    Terms of Service
                                </Text>
                                {' '}and{' '}
                                <Text
                                    className="text-blue-600"
                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                >
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </ActionSheet>
    );
}

export default OnboardingActionSheet;