import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from 'expo-router';
import Svg, { Path, Circle, Polyline } from 'react-native-svg';

// Custom SVG Components
const CreditCardIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M1 4h22v16H1z" />
        <Path d="M1 10h22" />
    </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m9 12 2 2 4-4" />
    </Svg>
);

const DownloadIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <Polyline points="7,10 12,15 17,10" />
        <Path d="M12 15V3" />
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

const PaymentsScreen = () => {
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
                    Payments
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

    const paymentHistory = [
        {
            id: '1',
            amount: 899,
            date: '20 Apr 2024',
            status: 'paid',
            method: 'UPI',
            transactionId: 'TXN123456789',
            description: 'Monthly Rental - April 2024'
        },
        {
            id: '2',
            amount: 899,
            date: '20 Mar 2024',
            status: 'paid',
            method: 'Credit Card',
            transactionId: 'TXN123456788',
            description: 'Monthly Rental - March 2024'
        },
        {
            id: '3',
            amount: 899,
            date: '20 Feb 2024',
            status: 'paid',
            method: 'UPI',
            transactionId: 'TXN123456787',
            description: 'Monthly Rental - February 2024'
        },
        {
            id: '4',
            amount: 899,
            date: '20 Jan 2024',
            status: 'paid',
            method: 'Net Banking',
            transactionId: 'TXN123456786',
            description: 'Monthly Rental - January 2024'
        },
        {
            id: '5',
            amount: 899,
            date: '20 Dec 2023',
            status: 'paid',
            method: 'UPI',
            transactionId: 'TXN123456785',
            description: 'Monthly Rental - December 2023'
        },
    ];

    const upcomingPayment = {
        amount: 899,
        dueDate: '20 May 2024',
        daysLeft: 5
    };

    const getPaymentMethodIcon = (method: string) => {
        return <CreditCardIcon size={20} color="#6B7280" />;
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4 gap-y-6 pb-24">
                    {/* Upcoming Payment Card */}
                    <View className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-12 h-12 rounded-full bg-[#4548b9] items-center justify-center">
                                <CalendarIcon size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    Next Payment Due
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    {upcomingPayment.dueDate}
                                </Text>
                            </View>
                            <View className="bg-orange-100 px-3 py-1 rounded-full">
                                <Text className="text-orange-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    {upcomingPayment.daysLeft} days left
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-3xl text-[#4548b9]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                ₹{upcomingPayment.amount}
                            </Text>
                            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Monthly Rental
                            </Text>
                        </View>

                        <TouchableOpacity className="bg-[#4548b9] rounded-xl py-4 shadow-lg">
                            <Text className="text-white text-center text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Pay Now
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Payment Summary */}
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Payment Summary
                        </Text>
                        
                        <View className="flex-row justify-between gap-4">
                            <View className="flex-1 bg-gray-50 rounded-xl p-4">
                                <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    ₹4,495
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Total Paid
                                </Text>
                            </View>
                            
                            <View className="flex-1 bg-gray-50 rounded-xl p-4">
                                <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    5
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Payments Made
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Payment History */}
                    <View>
                        <Text className="text-xl text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Payment History
                        </Text>
                        
                        <View className="gap-y-3">
                            {paymentHistory.map((payment) => (
                                <View key={payment.id} className="bg-white rounded-xl shadow-sm p-5">
                                    <View className="flex-row items-start justify-between mb-3">
                                        <View className="flex-1">
                                            <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                ₹{payment.amount}
                                            </Text>
                                            <Text className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {payment.description}
                                            </Text>
                                            <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {payment.date}
                                            </Text>
                                        </View>
                                        <View className="items-end">
                                            <View className="bg-green-100 px-3 py-1 rounded-full mb-2">
                                                <Text className="text-green-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                    PAID
                                                </Text>
                                            </View>
                                            <TouchableOpacity className="flex-row items-center gap-1">
                                                <DownloadIcon size={16} color="#6B7280" />
                                                <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                                                    Receipt
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    
                                    <View className="border-t border-gray-100 pt-3">
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center gap-2">
                                                {getPaymentMethodIcon(payment.method)}
                                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                    {payment.method}
                                                </Text>
                                            </View>
                                            <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {payment.transactionId}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Auto-pay Setup */}
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Auto-Pay Setup
                        </Text>
                        <Text className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Never miss a payment. Set up automatic payments for your monthly rental.
                        </Text>
                        <TouchableOpacity className="bg-gray-100 rounded-xl py-3">
                            <Text className="text-center text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Setup Auto-Pay
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default PaymentsScreen;