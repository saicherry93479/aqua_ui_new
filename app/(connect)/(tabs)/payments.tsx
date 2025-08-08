import { apiService } from '@/api/api';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import Svg, { Path, Polyline } from 'react-native-svg';
import { RefreshCw } from 'lucide-react-native';

// Custom SVG Components
const CreditCardIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M1 4h22v16H1z" />
        <Path d="M1 10h22" />
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
    const { currentSession } = useSubscription();
    const [payments, setPayments] = useState([]);
    const [subscriptionDetails, setSubscriptionDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const subscription = currentSession?.subscription;

    useEffect(() => {
        fetchSubPayments();
    }, []);

    const fetchSubPayments = async () => {
        if (!currentSession?.subscription?.id) {
            setError('No subscription found');
            return;
        }

        setIsLoading(true);
        setError(null);

        // Create timeout promise
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 second timeout
        });

        try {
            const apiPromise = apiService.get(`/payments/subscription/${currentSession.subscription.id}`);
            const results = await Promise.race([apiPromise, timeoutPromise]);

            console.log('results in payments ', JSON.stringify(results));

            if (results.success && results.data?.result) {
                setPayments(results.data.result.payments || []);
                setSubscriptionDetails(results.data.result.subscriptionDetails || null);
            } else {
                setError('Failed to fetch payment data');
            }
        } catch (e) {
            console.log('Error fetching payments:', e);
            if (e.message === 'Request timeout') {
                setError('Request timed out. Please try again.');
            } else {
                setError('Failed to load payments');
            }
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 2000)
        }
    };

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
            },
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleReload}
                    style={{
                        marginRight: 16,
                        padding: 4,
                        opacity: isLoading ? 0.5 : 1,
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size={24} color="#1F2937" />
                    ) : (
                        <RefreshCw
                            size={24}
                            color="#1F2937"
                        />
                    )}
                </TouchableOpacity>
            ),
        });
    }, [navigation, isLoading]);

    const handleReload = () => {
        console.log('Reload pressed');
        fetchSubPayments();
    };

    // Calculate payment summary
    const totalPaid = payments.reduce((sum, payment) => {
        return payment.status === 'COMPLETED' ? sum + payment.amount : sum;
    }, 0);

    const completedPayments = payments.filter(payment => payment.status === 'COMPLETED');

    // Get upcoming payment info
    const upcomingPayment = {
        amount: subscription?.monthlyAmount || 899,
        dueDate: subscriptionDetails?.nextPaymentDate
            ? new Date(subscriptionDetails.nextPaymentDate).toLocaleDateString()
            : subscription?.nextPaymentDate
                ? new Date(subscription.nextPaymentDate).toLocaleDateString()
                : 'Not available',
        daysLeft: subscriptionDetails?.nextPaymentDate
            ? Math.ceil((new Date(subscriptionDetails.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
            : subscription?.nextPaymentDate
                ? Math.ceil((new Date(subscription.nextPaymentDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                : 0
    };

    const getPaymentMethodIcon = (method) => {
        return <CreditCardIcon size={20} color="#6B7280" />;
    };

    const getPaymentStatus = (status) => {
        switch (status) {
            case 'COMPLETED':
                return { text: 'PAID', bgColor: 'bg-green-100', textColor: 'text-green-700' };
            case 'PENDING':
                return { text: 'PENDING', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
            case 'FAILED':
                return { text: 'FAILED', bgColor: 'bg-red-100', textColor: 'text-red-700' };
            default:
                return { text: 'UNKNOWN', bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
        }
    };

    if (error) {
        return (
            <View className="flex-1 bg-gray-50 justify-center items-center p-4">
                <Text className="text-red-600 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    {error}
                </Text>
                <TouchableOpacity
                    onPress={fetchSubPayments}
                    className="bg-[#254292] px-6 py-3 rounded-xl"
                    disabled={isLoading}
                >
                    <Text className="text-white text-center" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                        {isLoading ? 'Retrying...' : 'Retry'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4 gap-y-6 pb-24">
                    {/* Upcoming Payment Card */}
                    <View className="bg-white rounded-2xl p-6 border border-orange-100">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-12 h-12 rounded-full bg-[#254292] items-center justify-center">
                                <CalendarIcon size={20} color="white" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    Next Payment Due
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    {new Date(upcomingPayment.dueDate).toDateString() || 'N/A'}
                                </Text>
                            </View>
                            {upcomingPayment.daysLeft > 0 && (
                                <View className="bg-orange-100 px-3 py-1 rounded-full">
                                    <Text className="text-orange-700 text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {upcomingPayment.daysLeft} days left
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-3xl text-[#254292]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                ₹{upcomingPayment.amount}
                            </Text>
                            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                Monthly Rental
                            </Text>
                        </View>
                    </View>

                    {/* Payment Summary */}
                    <View className="bg-white rounded-2xl shadow-sm p-6">
                        <View className="flex-row items-center justify-between mb-4">
                            <Text className="text-lg text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Payment Summary
                            </Text>
                            {isLoading && (
                                <ActivityIndicator size={20} color="#254292" />
                            )}
                        </View>

                        <View className="flex-row justify-between gap-4">
                            <View className="flex-1 bg-gray-50 rounded-xl p-4">
                                <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    ₹{totalPaid.toLocaleString()}
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Total Paid
                                </Text>
                            </View>

                            <View className="flex-1 bg-gray-50 rounded-xl p-4">
                                <Text className="text-2xl text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    {completedPayments.length}
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

                        {isLoading && payments.length === 0 ? (
                            <View className="bg-white rounded-xl shadow-sm p-8 items-center">
                                <ActivityIndicator size={32} color="#254292" />
                                <Text className="text-gray-600 mt-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Loading payment history...
                                </Text>
                            </View>
                        ) : payments.length === 0 ? (
                            <View className="bg-white rounded-xl shadow-sm p-8 items-center">
                                <Text className="text-gray-600 text-center" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    No payment history found
                                </Text>
                            </View>
                        ) : (
                            <View className="gap-y-3">
                                {payments.map((payment) => {
                                    const status = getPaymentStatus(payment.status);
                                    return (
                                        <View key={payment.id} className="bg-white rounded-xl shadow-sm p-5">
                                            <View className="flex-row items-start justify-between mb-3">
                                                <View className="flex-1">
                                                    <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                        ₹{payment.amount}
                                                    </Text>
                                                    <Text className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                        {payment.type === 'SUBSCRIPTION' ? 'Monthly Rental' : payment.type}
                                                    </Text>
                                                    <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                        {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'Date not available'}
                                                    </Text>
                                                </View>
                                                <View className="items-end">
                                                    <View className={`${status.bgColor} px-3 py-1 rounded-full mb-2`}>
                                                        <Text className={`${status.textColor} text-xs`} style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                            {status.text}
                                                        </Text>
                                                    </View>
                                                    {payment.status === 'COMPLETED' && (
                                                        <TouchableOpacity className="flex-row items-center gap-1">
                                                            <DownloadIcon size={16} color="#6B7280" />
                                                            <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                                                                Receipt
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                            </View>

                                            <View className="border-t border-gray-100 pt-3">
                                                <View className="flex-row items-center justify-between">
                                                    <View className="flex-row items-center gap-2">
                                                        {getPaymentMethodIcon(payment.paymentMethod)}
                                                        <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                            {payment.paymentMethod}
                                                        </Text>
                                                    </View>
                                                    {payment.razorpayPaymentId && (
                                                        <Text className="text-xs text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                            {payment.razorpayPaymentId}
                                                        </Text>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default PaymentsScreen;