import { apiService } from '@/api/api';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

// Custom SVG Components
const ClockIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 6v6l4 2" />
    </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m9 12 2 2 4-4" />
    </Svg>
);

const XCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m15 9-6 6" />
        <Path d="m9 9 6 6" />
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
}

const RequestsScreen = () => {
    const navigation = useNavigation();
    const [requests, setRequests] = useState<InstallationRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    My Requests
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

    const fetchRequests = async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setIsRefreshing(true);
            } else {
                setIsLoading(true);
            }
            setError(null);

            const response = await apiService.get('/installation-requests');
            
            if (response.success && response.data?.installationRequests) {
                setRequests(response.data.installationRequests);
            } else {
                setError('Failed to load requests');
            }
        } catch (err) {
            console.error('Error fetching requests:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

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
            month: 'short',
            year: 'numeric'
        });
    };

    const handleRequestPress = (request: InstallationRequest) => {
        router.push(`/(newuser)/request-detail/${request.id}`);
    };

    if (isLoading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50">
                <ActivityIndicator size="large" color="#254292" />
                <Text
                    className="mt-4 text-gray-600"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    Loading your requests...
                </Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-50 px-6">
                <Text
                    className="text-red-500 text-center text-lg mb-4"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    {error}
                </Text>
                <TouchableOpacity
                    className="bg-[#254292] px-6 py-3 rounded-2xl"
                    onPress={() => fetchRequests()}
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
            <ScrollView 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={() => fetchRequests(true)}
                        colors={['#254292']}
                    />
                }
            >
                <View className="p-4 gap-y-4 pb-24">
                    {requests.length === 0 ? (
                        <View className="flex-1 justify-center items-center py-20">
                            <Text
                                className="text-xl text-gray-600 text-center mb-2"
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            >
                                No Requests Yet
                            </Text>
                            <Text
                                className="text-gray-500 text-center"
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                            >
                                Your installation requests will appear here
                            </Text>
                        </View>
                    ) : (
                        requests.map((request) => (
                            <TouchableOpacity
                                key={request.id}
                                className="bg-white rounded-xl shadow-sm p-5"
                                onPress={() => handleRequestPress(request)}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-start justify-between mb-3">
                                    <View className="flex-1">
                                        <Text
                                            className="text-lg text-gray-900 mb-1"
                                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                        >
                                            {request.product.name}
                                        </Text>
                                        <Text
                                            className="text-sm text-gray-600"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            Request ID: #{request.id.slice(-8)}
                                        </Text>
                                    </View>
                                    <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                        <Text
                                            className="text-base"
                                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                        >
                                            {getStatusText(request.status)}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row items-center gap-4 mb-3">
                                    <View className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
                                        {getStatusIcon(request.status)}
                                    </View>
                                    <View className="flex-1">
                                        <Text
                                            className="text-sm text-gray-600"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            {request.franchise.city} • {request.orderType}
                                        </Text>
                                        <Text
                                            className="text-xs text-gray-500"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            Requested on {formatDate(request.createdAt)}
                                        </Text>
                                    </View>
                                </View>

                                {request.scheduledDate && (
                                    <View className="bg-blue-50 rounded-lg p-3 mt-3">
                                        <View className="flex-row items-center gap-2">
                                            <CalendarIcon size={16} color="#3b82f6" />
                                            <Text
                                                className="text-sm text-blue-900"
                                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                            >
                                                Scheduled: {formatDate(request.scheduledDate)}
                                            </Text>
                                        </View>
                                        {request.assignedTechnician && (
                                            <Text
                                                className="text-xs text-blue-700 mt-1"
                                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                            >
                                                Technician: {request.assignedTechnician.name}
                                            </Text>
                                        )}
                                    </View>
                                )}

                                {request.rejectionReason && (
                                    <View className="bg-red-50 rounded-lg p-3 mt-3">
                                        <Text
                                            className="text-sm text-red-900"
                                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                        >
                                            Rejection Reason:
                                        </Text>
                                        <Text
                                            className="text-sm text-red-700 mt-1"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            {request.rejectionReason}
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default RequestsScreen;