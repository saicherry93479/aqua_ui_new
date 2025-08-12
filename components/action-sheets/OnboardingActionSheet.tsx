import { router } from 'expo-router';
import {
    ArrowRight,
    MapPin,
    X,
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { DynamicInput } from '../DynamicInput';
import { DynamicSelect, SelectOption } from '../DynamicSelect';

interface OnboardingActionSheetProps {
    sheetId: string;
    payload?: {
        onComplete: (data: OnboardingData) => {
            success: boolean
        };
    };
}

// Updated to match API schema
interface OnboardingData {
    name: string; // Changed from username to name
    alternativePhone?: string; // Made optional as per API
    city: string;
}

// API Response interfaces
interface User {
    id: string;
    phone: string;
    name: string;
    city: string;
    alternativePhone: string | null;
    role: 'admin' | 'customer' | 'franchise_owner' | 'service_agent';
    hasOnboarded: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

interface OnboardingResponse {
    message: string;
    user: User;
}

interface ErrorResponse {
    statusCode: number;
    error: string;
    message: string;
}
const CITY_OPTIONS: SelectOption[] = [
    {
        id: '1',
        label: 'Suryapet',
        value: 'suryapet',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '2',
        label: 'Nalgonda',
        value: 'nalgonda',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '3',
        label: 'Khammam',
        value: 'khammam',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '4',
        label: 'Jaggayyapeta',
        value: 'jaggayyapeta',
        subtitle: 'Andhra Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '5',
        label: 'Mahbubabad',
        value: 'mahbubabad',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '6',
        label: 'Nandigama',
        value: 'nandigama',
        subtitle: 'Andhra Pradesh',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '7',
        label: 'Bhongir',
        value: 'bhongir',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '8',
        label: 'Devarkonda',
        value: 'devarkonda',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '9',
        label: 'Yellandu',
        value: 'yellandu',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '10',
        label: 'Gudur',
        value: 'gudur',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '11',
        label: 'Jangaon',
        value: 'jangaon',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '12',
        label: 'Warangal',
        value: 'warangal',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '13',
        label: 'Kodad',
        value: 'kodad',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '14',
        label: 'Huzurnagar',
        value: 'huzurnagar',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '15',
        label: 'Neredcherla',
        value: 'neredcherla',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '16',
        label: 'Thirumalagiri',
        value: 'thirumalagiri',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '17',
        label: 'Chilkur',
        value: 'chilkur',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '18',
        label: 'Garidepally',
        value: 'garidepally',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '19',
        label: 'Madhavaram',
        value: 'madhavaram',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '20',
        label: 'Munagala',
        value: 'munagala',
        subtitle: 'Telangana',
        icon: <MapPin size={20} color="#6B7280" />
    },
    {
        id: '21',
        label: 'Other',
        value: 'other',
        subtitle: 'Not listed above',
        icon: <MapPin size={20} color="#6B7280" />
    }
];

export function OnboardingActionSheet({ sheetId, payload }: OnboardingActionSheetProps) {
    const [name, setName] = useState(''); // Changed from username to name
    const [alternativePhone, setAlternativePhone] = useState('');
    const [selectedCity, setSelectedCity] = useState<SelectOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClose = () => {
        Keyboard.dismiss();
        SheetManager.hide(sheetId);
        // Reset state when closing
        setName('');
        setAlternativePhone('');
        setSelectedCity(null);
        setIsLoading(false);
    };

    // Updated validation to match API requirements
    const validateName = (name: string): string | null => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) { // API requires minLength: 2
            return 'Name must be at least 2 characters';
        }
        if (name.trim().length > 50) {
            return 'Name must be less than 50 characters';
        }
        return null;
    };

    const validatePhone = (phone: string): string | null => {
        // Phone is optional, but if provided must match pattern
        if (!phone.trim()) {
            return null; // Optional field
        }
        const phoneRegex = /^\d{10}$/; // API pattern: "^\\d{10}$"
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

        const nameError = validateName(name);
        const phoneError = validatePhone(alternativePhone);
        const cityError = validateCity(selectedCity);

        if (nameError || phoneError || cityError) {
            return; // Components will show the errors
        }

        setIsLoading(true);

        try {
            const onboardingData: OnboardingData = {
                name: name.trim(),
                city: selectedCity!.label,
            };

            // Only include alternativePhone if it's provided
            if (alternativePhone.trim()) {
                onboardingData.alternativePhone = alternativePhone.trim();
            }



            if (payload?.onComplete) {
                const response: { success: boolean } = await payload.onComplete(onboardingData);

                if (response.success) {
                    // Show success message from API response
                    Alert.alert(
                        'Onboarding Complete!',
                        'Welcome! Your profile has been set up successfully.',
                        [{
                            text: 'OK',
                            onPress: () => {
                                handleClose();
                                router.replace('/(newuser)/(tabs)');
                            }
                        }]
                    );
                } else {
                    Alert.alert(
                        'Unable to Process',
                        'Error',
                        [{
                            text: 'OK',
                            onPress: () => {
                                handleClose();

                            }
                        }]
                    );
                }
            } else {
                Alert.alert(
                    'Unable to Process',
                    'Error',
                    [{
                        text: 'OK',
                        onPress: () => {
                            handleClose();

                        }
                    }]
                );
            }



        } catch (error) {
            console.error('Onboarding error:', error);

            let errorMessage = 'Something went wrong. Please try again.';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            Alert.alert(
                'Onboarding Failed',
                errorMessage,
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid =
        name.trim() &&
        selectedCity &&
        validateName(name) === null &&
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
                            {/* Name Input - Updated */}
                            <DynamicInput
                                label="Full Name"
                                placeholder="Enter your full name"
                                value={name}
                                onChangeText={setName}
                                validation={validateName}
                                borderRadius={12}
                                autoCapitalize="words"
                                autoCorrect={false}
                                editable={!isLoading}
                                containerStyle={{ marginBottom: 24 }}
                                maxLength={50}
                                required
                            />

                            {/* Alternative Phone Input - Now Optional */}
                            <DynamicInput
                                label="Alternative Phone Number"
                                placeholder="Enter alternative phone number (optional)"
                                value={alternativePhone}
                                onChangeText={setAlternativePhone}
                                validation={validatePhone}
                                borderRadius={12}
                                keyboardType="phone-pad"
                                editable={!isLoading}
                                containerStyle={{ marginBottom: 24 }}
                                maxLength={10}
                                required={false} // Made optional
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
                                : 'bg-[#254292]'
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