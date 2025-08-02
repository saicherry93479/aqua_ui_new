import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Keyboard,
} from 'react-native';
import {
    X,
    ArrowRight,
} from 'lucide-react-native';
import { DynamicInput } from '../DynamicInput';
import { router } from 'expo-router';
import { apiService } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';


interface LoginActionSheetProps {
    sheetId: string;
    payload?: {
        onConnect: (connectId: string, subscription?: any) => void;
        customerPhone?: string; // Add customer phone to payload
    };
}

// API service function


export function ConnectActionSheet({ sheetId, payload }: LoginActionSheetProps) {
    const [connectId, setConnectId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Connecting to account...');

    const {user } =useAuth()
    const handleClose = () => {
        Keyboard.dismiss();
        SheetManager.hide(sheetId);
        // Reset state when closing
        setConnectId('');
        setIsLoading(false);
        setLoadingMessage('Connecting to account...');
    };

    const checkSubscription = async (connectId: string) => {
        try {
            const data = {
                connectId,
                customerPhone:user?.phone,
            };
    
            const response = await apiService.post('/subscriptions/check', data);
            return response.data;
        } catch (error) {
            console.error('Subscription check error:', error);
            throw error;
        }
    };

    const validateConnectId = (id: string): string | null => {
        if (!id.trim()) {
            return 'Connect ID is required';
        }
        if (id.trim().length < 3) {
            return 'Connect ID must be at least 3 characters';
        }
        return null;
    };

    const handleConnect = async () => {
        Keyboard.dismiss();

        const validationError = validateConnectId(connectId);
        if (validationError) {
            return;
        }

        setIsLoading(true);
        setLoadingMessage('Connecting to account...');

        try {
            // Step 1: Connect to internal account (your existing logic)
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Step 2: Check subscription
            setLoadingMessage('Verifying subscription...');
            
            const subscriptionResult = await checkSubscription(
                connectId.trim(),
            
            );
            console.log('subscriptionResult ',subscriptionResult)

            if (!subscriptionResult.isValid) {
                // Handle invalid subscription
                Alert.alert(
                    'Subscription Issue',
                    subscriptionResult.message || 'Your subscription is not valid or has expired.',
                    [
                        {
                            text: 'Contact Support',
                            onPress: () => {
                                // Add your support contact logic here
                                console.log('Contact support pressed');
                            }
                        },
                        {
                            text: 'Try Again',
                            style: 'cancel'
                        }
                    ]
                );
                return;
            }

            // Step 3: Success - both connection and subscription are valid
            if (payload?.onConnect) {
                payload.onConnect(connectId.trim(), subscriptionResult.subscription);
            }

            const subscriptionInfo = subscriptionResult.subscription?.planName 
                ? `\nSubscription: ${subscriptionResult.subscription.planName}`
                : '';

            Alert.alert(
                'Connected Successfully',
                `Connected to internal account: ${connectId}${subscriptionInfo}`,
                [{ 
                    text: 'OK', 
                    onPress: () => {
                        handleClose();
                        router.replace('/(connect)/(tabs)');
                    } 
                }]
            );

        } catch (error) {
            console.error('Connection/Subscription error:', error);
            
            let errorMessage = 'Failed to connect. Please try again.';
            
           

            Alert.alert(
                'Connection Failed',
                errorMessage,
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoading(false);
            setLoadingMessage('Connecting to account...');
        }
    };

    const isConnectDisabled = !connectId.trim() || isLoading || validateConnectId(connectId) !== null;

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
                                {loadingMessage}
                            </Text>
                        </View>
                    </View>
                )}

                <View className="px-6 py-8">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <View className="flex-1">
                            <Text
                                className="text-xl md:text-4xl text-center !leading-[30px] md:!leading-[46px] text-black"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Account Connection
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
                        <DynamicInput
                            label="Connect ID"
                            placeholder="Enter your Connect ID"
                            value={connectId}
                            onChangeText={setConnectId}
                            validation={validateConnectId}
                            borderRadius={12}
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                            containerStyle={{ marginBottom: 24 }}
                        />
                    </View>

                    {/* Connect Button */}
                    <TouchableOpacity
                        className={`flex-row items-center justify-center py-3 rounded-xl ${isConnectDisabled
                                ? 'bg-gray-300'
                                : 'bg-[#4548b9]'
                            }`}
                        onPress={handleConnect}
                        disabled={isConnectDisabled}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <View className="flex-row items-center">
                                <ActivityIndicator size="small" color="white" />
                                <Text
                                    className="text-white text-base ml-2"
                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                >
                                    {loadingMessage.includes('Verifying') ? 'Verifying...' : 'Connecting...'}
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center">
                                <Text
                                    className={`text-base mr-2 ${isConnectDisabled ? 'text-gray-500' : 'text-white'
                                        }`}
                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                >
                                    Connect Account
                                </Text>
                                <ArrowRight
                                    size={20}
                                    color={isConnectDisabled ? '#6B7280' : 'white'}
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
                            Need help?{' '}
                            <Text
                                className="text-blue-600"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Contact Support
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>
        </ActionSheet>
    );
}

export default ConnectActionSheet;