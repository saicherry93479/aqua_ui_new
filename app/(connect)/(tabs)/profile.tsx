import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, router } from 'expo-router';
import { SheetManager } from 'react-native-actions-sheet';
import { SHEET_IDS } from '../../sheets';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

// Custom SVG Components
const UserIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <Circle cx="12" cy="7" r="4" />
    </Svg>
);

const PhoneIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
);

const MailIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <Polyline points="22,6 12,13 2,6" />
    </Svg>
);

const MapPinIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <Circle cx="12" cy="10" r="3" />
    </Svg>
);

const SettingsIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="3" />
        <Path d="M12 1v6" />
        <Path d="M12 17v6" />
        <Path d="M1 12h6" />
        <Path d="M17 12h6" />
    </Svg>
);

const HelpCircleIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <Path d="M12 17h.01" />
    </Svg>
);

const LogOutIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <Polyline points="16,17 21,12 16,7" />
        <Path d="M21 12H9" />
    </Svg>
);

const ChevronRightIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M9 18l6-6-6-6" />
    </Svg>
);

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { currentSession, endSession } = useSubscription();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text
                    style={{
                        fontSize: 20,
                        color: '#1F2937',
                        fontFamily: 'PlusJakartaSans-Bold'
                    }}
                >
                    Profile
                </Text>
            ),
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
            headerShadowVisible: false,
            headerStyle: {
                backgroundColor: '#FFFFFF',
            }
        });
    }, [navigation]);

    const userInfo = currentSession ? {
        name: currentSession.subscription.customer.name,
        email: currentSession.subscription.customer.alternativePhone || 'Not provided',
        phone: currentSession.subscription.customer.phone,
        address: currentSession.subscription.franchise.city,
        customerId: currentSession.subscription.customer.id.slice(-8),
        planType: currentSession.subscription.planName,
        connectId: currentSession.connectId
    } : {
        name: 'User',
        email: 'Not available',
        phone: 'Not available',
        address: 'Not available',
        customerId: 'N/A',
        planType: 'No active plan',
        connectId: 'N/A'
    };

    const handleEndSession = () => {
        Alert.alert(
            'End Session',
            'Are you sure you want to end this session? You can reconnect anytime.',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'End Session', style: 'destructive', onPress: async () => {
                    try {
                        await endSession();
                        router.replace('/intialscreen');
                    } catch (error) {
                        console.error('Error ending session:', error);
                        Alert.alert('Error', 'Failed to end session');
                    }
                }}
            ]
        );
    };

    const menuItems = [
     
        {
            icon: HelpCircleIcon,
            title: 'Help & Support', 
            subtitle: 'Get help and contact support',
            onPress: () => router.push('/(connect)/help-support')
        },
        {
            icon: LogOutIcon,
            title: 'Cancel Subscription',
            subtitle: 'Cancel your current subscription',
            onPress: () => {
                SheetManager.show(SHEET_IDS.CANCEL_SUBSCRIPTION_SHEET, {
                    payload: {
                       
                    }
                });
            }
        }
    ];

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4 gap-y-6 pb-24">
                    {/* Profile Header */}
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        <View className="items-center mb-6">
                            <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                {userInfo.name}
                            </Text>
                            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Customer ID: {userInfo.customerId}
                            </Text>
                        </View>

                        <View className="bg-blue-50 rounded-xl p-4">
                            <Text className="text-sm text-blue-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Current Plan
                            </Text>
                            <Text className="text-base text-blue-700" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                {userInfo.planType}
                            </Text>
                            <Text className="text-xs text-blue-600 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Connect ID: {userInfo.connectId}
                            </Text>
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Contact Information
                        </Text>
                        
                        <View className="gap-y-4">
                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                    <PhoneIcon size={20} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Phone Number
                                    </Text>
                                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {userInfo.phone}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-center gap-4">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                    <MailIcon size={20} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Alternative Phone
                                    </Text>
                                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {userInfo.email}
                                    </Text>
                                </View>
                            </View>

                            <View className="flex-row items-start gap-4">
                                <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                    <MapPinIcon size={20} color="#6B7280" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        City
                                    </Text>
                                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {userInfo.address}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Menu Items */}
                    <View className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {menuItems.map((item, index) => {
                            const IconComponent = item.icon;
                            return (
                                <TouchableOpacity
                                    key={index}
                                    className={`p-5 flex-row items-center gap-4 ${
                                        index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                                    onPress={item.onPress}
                                >
                                    <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
                                        <IconComponent size={20} color="#6B7280" />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                            {item.title}
                                        </Text>
                                        <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                            {item.subtitle}
                                        </Text>
                                    </View>
                                    <ChevronRightIcon size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity
                        className="bg-white rounded-2xl shadow-sm p-5 flex-row items-center justify-center gap-3"
                        onPress={handleEndSession}
                    >
                        <LogOutIcon size={20} color="#EF4444" />
                        <Text className="text-red-500 text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                            End Session
                        </Text>
                    </TouchableOpacity>

                    {/* App Version */}
                    <View className="items-center">
                        <Text className="text-xs text-gray-400" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            AquaHome v1.0.0
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default ProfileScreen;