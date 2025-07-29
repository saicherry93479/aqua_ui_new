import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import { Dimensions, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Custom SVG Components
const CheckCircleIcon = ({ size = 16, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <Polyline points="22,4 12,14.01 9,11.01" />
    </Svg>
);

const WalletIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <Path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </Svg>
);

const ArrowRightIcon = ({ size = 16, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 256 256" fill={color}>
        <Path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z" />
    </Svg>
);

const CheckCircle2Icon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m9 12 2 2 4-4" />
    </Svg>
);

const WrenchIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
);

const DropletIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </Svg>
);

const CalendarIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M8 2v4" />
        <Path d="M16 2v4" />
        <Path d="M3 10h18" />
        <Path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6z" />
    </Svg>
);

const WaterPurifierApp = () => {
    const navigation = useNavigation();

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
                    AquaHome
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

    return (
        <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
            {/* Hero Section */}
            {/* <LinearGradient
                colors={['#4548b9', '#6366f1']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="mx-4 mt-4 rounded-2xl overflow-hidden"
            >
                <View className="p-6">
                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-white text-lg mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Welcome back!
                            </Text>
                            <Text className="text-blue-100 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Your water is pure and safe
                            </Text>
                        </View>
                        <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                            <DropletIcon size={24} color="white" />
                        </View>
                    </View>
                    
                    <View className="bg-white/10 rounded-xl p-4">
                        <Text className="text-white text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                            Device Status
                        </Text>
                        <View className="flex-row items-center gap-2">
                            <View className="w-3 h-3 bg-green-400 rounded-full" />
                            <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Working Perfectly
                            </Text>
                        </View>
                    </View>
                </View>
            </LinearGradient> */}

             {/* Rental Plan Card */}
             <View className="bg-[#4548b9] mx-4 rounded-2xl shadow-sm p-5">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl text-white" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Your Plan Details
                        </Text>
                        <View className="bg-green-100 px-3 py-1 rounded-full">
                            <Text className="text-green-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                ACTIVE
                            </Text>
                        </View>
                    </View>
                    
                    <Text className="text-white mb-4 text-base" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                        AquaPure Pro Model
                    </Text>

                    <View className="flex-row gap-4 mb-6">
                        <View className="flex-1 bg-gray-50 rounded-xl p-4">
                            <Text className="text-sm text-black mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Plan Start
                            </Text>
                            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                21 May 2023
                            </Text>
                        </View>
                        <View className="flex-1 bg-gray-50 rounded-xl p-4">
                            <Text className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Plan End
                            </Text>
                            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                20 May 2025
                            </Text>
                        </View>
                    </View>

                    <View className="border-t border-gray-100 pt-4 hidden">
                        <Text className="text-base text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                            Included Services
                        </Text>
                        <View className="gap-y-3">
                            <View className="flex-row items-center gap-3">
                                <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                                    <CheckCircleIcon size={14} color="#10b981" />
                                </View>
                                <Text className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Quarterly Filter Replacement
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                                    <CheckCircleIcon size={14} color="#10b981" />
                                </View>
                                <Text className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Annual Maintenance Check
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-3">
                                <View className="w-6 h-6 bg-green-100 rounded-full items-center justify-center">
                                    <CheckCircleIcon size={14} color="#10b981" />
                                </View>
                                <Text className="text-sm text-gray-700 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    24/7 Customer Support
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>


            <View className="p-4 gap-y-6 pb-24">
                {/* Quick Stats */}
                <View className="flex-row gap-3 hidden">
                    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            847L
                        </Text>
                        <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Water Purified
                        </Text>
                        <Text className="text-xs text-green-600 mt-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                            This month
                        </Text>
                    </View>
                    
                    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                        <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            98%
                        </Text>
                        <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Filter Health
                        </Text>
                        <Text className="text-xs text-green-600 mt-1" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                            Excellent
                        </Text>
                    </View>
                </View>

                {/* Upcoming Payment Card */}
                <View className="bg-white rounded-2xl p-5 border border-orange-100">
                    <View className="flex-row items-center gap-3 mb-4">
                        <View className="w-12 h-12 rounded-full bg-[#4548b9] items-center justify-center shadow-lg">
                            <WalletIcon size={20} color="white" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Next Payment Due
                            </Text>
                            <View className="flex-row items-center gap-2">
                                <CalendarIcon size={16} color="#6B7280" />
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                                    May 20, 2024
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-between mb-4">
                        <View>
                            <Text className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Monthly Rental
                            </Text>
                            <Text className="text-3xl text-[#4548b9]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                ₹899
                            </Text>
                        </View>
                        <View className="bg-orange-100 px-3 py-1 rounded-full">
                            <Text className="text-orange-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                5 days left
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity 
                        className="bg-[#4548b9] rounded-xl py-4 flex-row items-center justify-center gap-2 shadow-lg"
                        onPress={() => router.push('/(connect)/payments')}
                    >
                        <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                            Pay Now
                        </Text>
                        <ArrowRightIcon size={16} color="white" />
                    </TouchableOpacity>
                </View>

               
                {/* Recent Activity */}
                <View>
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Recent Activity
                        </Text>
                        <TouchableOpacity onPress={() => router.push('/(connect)/requests')}>
                            <Text className="text-[#4548b9] text-sm" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                View All
                            </Text>
                        </TouchableOpacity>
                    </View>
                    
                    <View className="gap-y-3">
                        <View className="bg-white rounded-xl shadow-sm p-4 flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center">
                                <CheckCircle2Icon size={24} color="#10b981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    Filter Replacement
                                </Text>
                                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    15 Feb 2024 • Completed
                                </Text>
                            </View>
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-green-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    DONE
                                </Text>
                            </View>
                        </View>

                        <View className="bg-white rounded-xl shadow-sm p-4 flex-row items-center gap-4">
                            <View className="w-12 h-12 rounded-full bg-blue-50 items-center justify-center">
                                <WrenchIcon size={24} color="#3b82f6" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-base text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    Maintenance Check
                                </Text>
                                <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    20 Nov 2023 • Completed
                                </Text>
                            </View>
                            <View className="bg-green-100 px-3 py-1 rounded-full">
                                <Text className="text-green-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    DONE
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View className="bg-white rounded-2xl shadow-sm p-5">
                    <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                        Quick Actions
                    </Text>
                    
                    <View className="gap-3">
                        <TouchableOpacity 
                            className="bg-[#4548b9] rounded-xl py-4 px-5 flex-row items-center justify-between"
                            onPress={() => router.push('/(connect)/requests')}
                        >
                            <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Request Service
                            </Text>
                            <ArrowRightIcon size={16} color="white" />
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                            className="bg-gray-100 rounded-xl py-4 px-5 flex-row items-center justify-between"
                            onPress={() => router.push('/(connect)/payments')}
                        >
                            <Text className="text-gray-700 text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                View Payment History
                            </Text>
                            <ArrowRightIcon size={16} color="#6B7280" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default WaterPurifierApp;