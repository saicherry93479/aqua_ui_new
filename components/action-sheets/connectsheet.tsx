import { apiService } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';
import {
    ArrowRight,
    X,
} from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import { DynamicInput } from '../DynamicInput';

interface LoginActionSheetProps {
    sheetId: string;
    payload?: {
        onConnect: (connectId: string, subscription?: any) => void;
        customerPhone?: string;
    };
}

export function ConnectActionSheet({ sheetId, payload }: LoginActionSheetProps) {
    const [connectId, setConnectId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('Connecting to account...');
    const [showSessionOptions, setShowSessionOptions] = useState(false);
    const [existingSession, setExistingSession] = useState<any>(null);

    const { user } = useAuth();
    const { createSession, checkExistingSession, endSession } = useSubscription();

    useEffect(() => {
        checkForExistingSession();
    }, []);

    const checkForExistingSession = async () => {
        try {
            const session = await checkExistingSession();
            if (session) {
                setExistingSession(session);
                setShowSessionOptions(true);
            }
        } catch (error) {
            console.error('Error checking existing session:', error);
        }
    };

    const resetComponentState = () => {
        setConnectId('');
        setIsLoading(false);
        setLoadingMessage('Connecting to account...');
        setShowSessionOptions(false);
        setExistingSession(null);
    };

    const handleClose = () => {
        Keyboard.dismiss();
        // Hide the sheet first, then reset state after a small delay
        SheetManager.hide(sheetId);
        
        // Reset state after the sheet is hidden to prevent flash of content
        setTimeout(() => {
            resetComponentState();
        }, 300); // Small delay to ensure sheet is fully hidden
    };

    const checkSubscription = async (connectId: string) => {
        try {
            const data = {
                connectId,
                customerPhone: user?.phone,
            };

            const response = await apiService.post('/subscriptions/check', data);
            console.log('response for connect ', response);
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

            const subscriptionResult = await checkSubscription(connectId.trim());
            console.log('subscriptionResult ', JSON.stringify(subscriptionResult));

            if (!subscriptionResult.isValid) {
                // Handle invalid subscription
                Alert.alert(
                    'Subscription Issue',
                    subscriptionResult.message || 'Your subscription is not valid or has expired.',
                    [
                        {
                            text: 'Contact Support',
                            onPress: () => {
                                handleClose();
                                router.push('/(newuser)/help-support');
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

            // Step 3: Create session
            await createSession(connectId.trim(), subscriptionResult.subscription);

            // Step 4: Success - both connection and subscription are valid
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
                        // Navigate to connect tabs without stack issues
                        setTimeout(() => {
                            router.replace('/(connect)/(tabs)');
                        }, 100);
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

    const handleContinueExistingSession = async () => {
        try {
            setIsLoading(true);
            setLoadingMessage('Resuming session...');

            // Refresh the existing session data
            const response = await apiService.post('/subscriptions/check', {
                connectId: existingSession.connectId,
                customerPhone: existingSession.subscription.customer.phone,
            });

            if (response.success && response.data.isValid) {
                await createSession(existingSession.connectId, response.data.subscription);

                Alert.alert(
                    'Session Resumed',
                    `Welcome back! Continuing with ${existingSession.connectId}`,
                    [{
                        text: 'OK',
                        onPress: () => {
                            handleClose();
                            // Navigate to connect tabs without stack issues
                            setTimeout(() => {
                                router.replace('/(connect)/(tabs)');
                            }, 100);
                        }
                    }]
                );
            } else {
                throw new Error('Session is no longer valid');
            }
        } catch (error) {
            console.error('Error resuming session:', error);
            Alert.alert('Error', 'Failed to resume session. Please try connecting again.');
            await endSession();
            setShowSessionOptions(false);
            setExistingSession(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNewSession = async () => {
        try {
            setIsLoading(true);
            await endSession();
            // Smoothly transition to connect form
            setShowSessionOptions(false);
            setExistingSession(null);
        } catch (error) {
            console.error('Error ending session:', error);
        } finally {
            setIsLoading(false);
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
                                {showSessionOptions ? 'Existing Session Found' : 'Account Connection'}
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

                    {showSessionOptions ? (
                        /* Session Options */
                        <View className="mb-8">
                            <View className="bg-blue-50 rounded-xl p-4 mb-6">
                                <Text className="text-blue-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    Previous Session
                                </Text>
                                <Text className="text-blue-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Connect ID: {existingSession?.connectId}
                                </Text>
                                <Text className="text-blue-800" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Plan: {existingSession?.subscription?.planName}
                                </Text>
                                <Text className="text-blue-700 text-sm mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Last accessed: {existingSession?.lastAccessed ? new Date(existingSession.lastAccessed).toLocaleDateString() : 'Unknown'}
                                </Text>
                            </View>

                            <View className="gap-3">
                                <TouchableOpacity
                                    className="py-4 rounded-xl bg-[#254292]"
                                    onPress={handleContinueExistingSession}
                                    disabled={isLoading}
                                >
                                    <Text
                                        className="text-white text-center text-base"
                                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                    >
                                        Continue Previous Session
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    className="py-4 rounded-xl bg-gray-100"
                                    onPress={handleNewSession}
                                    disabled={isLoading}
                                >
                                    <Text
                                        className="text-gray-700 text-center text-base"
                                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                    >
                                        Start New Session
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        /* Form */
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
                    )}

                    {!showSessionOptions && (
                        /* Connect Button */
                        <TouchableOpacity
                            className={`flex-row items-center justify-center py-3 rounded-xl ${isConnectDisabled
                                ? 'bg-gray-300'
                                : 'bg-[#254292]'
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
                    )}

                    {/* Footer */}
                    <TouchableOpacity className="mt-6" onPress={() => router.push('/(newuser)/help-support')}>
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
                    </TouchableOpacity>
                </View>
            </View>
        </ActionSheet>
    );
}

export default ConnectActionSheet;