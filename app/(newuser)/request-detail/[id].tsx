import { apiService } from '@/api/api';
import * as Clipboard from 'expo-clipboard';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import {
    Copy,
    CopyCheck
} from 'lucide-react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Alert, Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom SVG Components
const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m9 12 2 2 4-4" />
    </Svg>
);

const ClockIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 6v6l4 2" />
    </Svg>
);

const XCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m15 9-6 6" />
        <Path d="m9 9 6 6" />
    </Svg>
);

const UserIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <Circle cx="12" cy="7" r="4" />
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

const MapPinIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <Circle cx="12" cy="10" r="3" />
    </Svg>
);

const PhoneIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </Svg>
);

interface InstallationRequest {
    id: string;
    productId: string;
    customerId: string;
    orderType: string;
    name: string;
    phoneNumber: string;
    franchiseId: string;
    franchiseName: string;
    status: string;
    installationAddress: string;
    scheduledDate: string | null;
    assignedTechnicianId: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
    product: {
        id: string;
        name: string;
        rentPrice: number;
        buyPrice: number;
        deposit: number;
    };
    franchise: {
        id: string;
        name: string;
        city: string;
    };
    customer: {
        id: string;
        name: string | null;
        phone: string;
    };
    assignedTechnician: {
        id: string;
        name: string | null;
    } | null;
    subscription: {
        id: string;
        connectId: string;
        requestId: string
    } | null
}

export default function RequestDetailScreen() {
    const navigation = useNavigation();
    const { id } = useLocalSearchParams();
    const [request, setRequest] = useState<InstallationRequest | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCopied, setShowCopied] = useState(false);



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
                    Request Details
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

    const fetchRequestDetails = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await apiService.get(`/installation-requests/${id}`);

            console.log('response in request details  ', JSON.stringify(response))

            if (response.success && response.data) {
                setRequest(response.data.installationRequest);
            } else {
                setError('Failed to load request details');
            }
        } catch (err) {
            console.error('Error fetching request details:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchRequestDetails();
        }
    }, [id]);

    const handleCopy = async () => {
        await Clipboard.setStringAsync(request?.subscription ? request?.subscription?.connectId : '');
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000); // Hide after 2s
    };


    const getStatusColor = (status: string) => {
        switch (status) {
            case 'INSTALLATION_COMPLETED':
                return 'text-green-600 bg-green-100';
            case 'INSTALLATION_IN_PROGRESS':
                return 'text-blue-600 bg-blue-100';
            case 'INSTALLATION_SCHEDULED':
                return 'text-purple-600 bg-purple-100';
            case 'FRANCHISE_CONTACTED':
                return 'text-yellow-600 bg-yellow-100';
            case 'SUBMITTED':
                return 'text-gray-600 bg-gray-100';
            case 'CANCELLED':
            case 'REJECTED':
                return 'text-red-600 bg-red-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'INSTALLATION_COMPLETED':
                return <CheckCircleIcon size={20} color="#10b981" />;
            case 'INSTALLATION_IN_PROGRESS':
            case 'INSTALLATION_SCHEDULED':
            case 'FRANCHISE_CONTACTED':
                return <ClockIcon size={20} color="#3b82f6" />;
            case 'CANCELLED':
            case 'REJECTED':
                return <XCircleIcon size={20} color="#ef4444" />;
            default:
                return <ClockIcon size={20} color="#6b7280" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'SUBMITTED':
                return 'Submitted';
            case 'FRANCHISE_CONTACTED':
                return 'Franchise Contacted';
            case 'INSTALLATION_SCHEDULED':
                return 'Scheduled';
            case 'INSTALLATION_IN_PROGRESS':
                return 'In Progress';
            case 'INSTALLATION_COMPLETED':
                return 'Completed';
            case 'CANCELLED':
                return 'Cancelled';
            case 'REJECTED':
                return 'Rejected';
            default:
                return status;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`).catch(() => {
            Alert.alert('Error', 'Unable to make phone call');
        });
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#254292" />
                <Text
                    className="mt-4 text-gray-600"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    Loading request details...
                </Text>
            </View>
        );
    }


    if (error || !request) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 px-6">
                <Text
                    className="text-red-500 text-center text-lg mb-4"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    {error || 'Request not found'}
                </Text>
                <TouchableOpacity
                    className="bg-[#254292] px-6 py-3 rounded-2xl"
                    onPress={fetchRequestDetails}
                >
                    <Text
                        className="text-white"
                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-50">
            {request.subscription && request.subscription.requestId === request.id && (
                <View className="px-4">
                    <View className="bg-green-100 border border-green-400 rounded-xl p-4 flex-row items-start gap-3 shadow-sm">
                        <View className="bg-green-500 rounded-full w-12 h-12 flex items-center justify-center">
                            <Text className="text-white text-lg">✓</Text>
                        </View>

                        <View className="flex-1">
                            <Text
                                className="text-green-800 font-semibold text-base mb-1"
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            >
                                Subscription Active!
                            </Text>

                            <View className="flex-row items-center">
                                <Text
                                    className="text-green-700"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    Login using ID:{' '}
                                </Text>
                                <Text
                                    className="text-green-800 font-bold"
                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                >
                                    {request.subscription.connectId}
                                </Text>

                                <TouchableOpacity onPress={handleCopy} className="ml-2">
                                    {showCopied ? <CopyCheck size={18} color="#10B981"></CopyCheck> : <Copy size={18} color="#10B981" />}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            )}



            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4 gap-y-6 pb-24">
                    {/* Request Header */}
                    <View className="bg-white rounded-xl shadow-sm p-6">
                        <View className="flex-row items-start justify-between mb-4">
                            <View className="flex-1">
                                <Text className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    {request.product?.name}
                                </Text>
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Request ID: #{request.id.slice(-8)}
                                </Text>
                            </View>
                            <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                <Text className="text-xs" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    {getStatusText(request.status)}
                                </Text>
                            </View>
                        </View>

                        {/* Request Timeline */}
                        <View className="border-t border-gray-100 pt-4">
                            <View className="flex-row items-center gap-4 mb-3">
                                <CalendarIcon size={16} color="#6B7280" />
                                <View>
                                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Requested: {formatDate(request.createdAt)}
                                    </Text>
                                    {request.scheduledDate && (
                                        <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                            Scheduled: {formatDate(request.scheduledDate)}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View className="flex-row items-center gap-4">
                                <UserIcon size={16} color="#6B7280" />
                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Order Type: {request.orderType}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Product Details */}
                    <View className="bg-white rounded-xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Product Information
                        </Text>

                        <View className="gap-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Product Name
                                </Text>
                                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    {request.product?.name}
                                </Text>
                            </View>

                            <View className="flex-row justify-between">
                                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    {request.orderType === 'RENTAL' ? ' Monthly Rent' : 'Purchase Amount'}
                                </Text>
                                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    ₹{request.product.rentPrice}
                                </Text>
                            </View>

                            <View className="flex-row justify-between">
                                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Security Deposit
                                </Text>
                                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    ₹0
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Installation Address */}
                    <View className="bg-white rounded-xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Installation Address
                        </Text>

                        <View className="flex-row items-start gap-3">
                            <MapPinIcon size={20} color="#6B7280" />
                            <Text className="flex-1 text-gray-700 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                {request.installationAddress}
                            </Text>
                        </View>
                    </View>

                    {/* Franchise Information */}
                    <View className="bg-white rounded-xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Franchise Details
                        </Text>

                        <View className="gap-3">
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Franchise Name
                                </Text>
                                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    {request.franchise.name}
                                </Text>
                            </View>

                            <View className="flex-row justify-between">
                                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    City
                                </Text>
                                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                    {request.franchise.city}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Technician Information */}
                    {request.assignedTechnician && (
                        <View className="bg-white rounded-xl shadow-sm p-6">
                            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Assigned Technician
                            </Text>

                            <View className="flex-row items-center gap-4">
                                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center">
                                    <UserIcon size={24} color="#3b82f6" />
                                </View>
                                <View className="flex-1">
                                    <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                        {request.assignedTechnician.name || 'Technician'}
                                    </Text>
                                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        ID: {request.assignedTechnician.id.slice(-8)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {
                        request.completedDate && <View className="bg-white rounded-xl shadow-sm p-6">
                             <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Completed On
                            </Text>
                            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                        Date: {new Date(request.completedDate).toLocaleString()}
                                    </Text>
                        </View>
                    }

                    {/* Rejection Reason */}
                    {request.rejectionReason && (
                        <View className="bg-red-50 rounded-xl p-6 border border-red-100">
                            <Text className="text-lg text-red-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Rejection Reason
                            </Text>
                            <Text className="text-red-700 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                {request.rejectionReason}
                            </Text>
                        </View>
                    )}

                    {/* Contact Support */}
                    <View className="bg-white rounded-xl shadow-sm p-6">
                        <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Need Help?
                        </Text>

                        <TouchableOpacity
                            className="flex-row items-center justify-center gap-3 bg-[#254292] py-4 rounded-xl"
                            onPress={() => router.push('/(newuser)/help-support')}
                        >
                            <PhoneIcon size={20} color="white" />
                            <Text className="text-white text-base" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Call Support
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}