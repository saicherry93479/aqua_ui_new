import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Svg, { Path, Circle } from 'react-native-svg';
import { apiService } from '@/api/api';

// Icons (keeping your existing icons)
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

const MapPinIcon = ({ size = 16, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Circle cx="12" cy="10" r="3" />
  </Svg>
);

const PhoneIcon = ({ size = 16, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

export default function ServiceDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetchServiceRequest();
  }, []);

  const fetchServiceRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.get(`/service-requests/${id}`);
      
      if (response.success) {
        setService(response.data.serviceRequest);
      } else {
        setError('Failed to load service details');
      }
    } catch (err) {
      console.log('error', err);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
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
          Service Details
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

  const getStatusConfig = (status) => {
    const configs = {
      'COMPLETED': {
        color: 'text-green-600 bg-green-100',
        icon: <CheckCircleIcon size={20} color="#10b981" />
      },
      'SCHEDULED': {
        color: 'text-blue-600 bg-blue-100',
        icon: <ClockIcon size={20} color="#3b82f6" />
      },
      'IN_PROGRESS': {
        color: 'text-orange-600 bg-orange-100',
        icon: <ClockIcon size={20} color="#f59e0b" />
      },
      'CREATED': {
        color: 'text-gray-600 bg-gray-100',
        icon: <ClockIcon size={20} color="#6b7280" />
      }
    };
    return configs[status] || configs['CREATED'];
  };

  const formatServiceType = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseImages = (imagesField) => {
    if (!imagesField) return [];
    if (Array.isArray(imagesField)) return imagesField;
    try {
      return JSON.parse(imagesField);
    } catch {
      return [];
    }
  };

  const getAssignedTechnicianName = () => {
    if (service.assignedAgent) {
      return service.assignedAgent.name;
    }
    return service.assignedToId || 'Unassigned';
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#4548b9" />
        <Text className="text-lg text-gray-600 mt-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Loading service details...
        </Text>
      </View>
    );
  }

  if (error || !service) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="text-lg text-gray-600 text-center mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          {error || 'Service not found'}
        </Text>
        <TouchableOpacity 
          onPress={fetchServiceRequest}
          className="bg-[#4548b9] px-6 py-3 rounded-lg"
        >
          <Text className="text-white text-center" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Retry
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const statusConfig = getStatusConfig(service.status);
  const beforeImages = parseImages(service.beforeImages);
  const afterImages = parseImages(service.afterImages);

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-y-6 pb-24">
          {/* Service Header */}
          <View className="bg-white rounded-xl shadow-sm p-6">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {formatServiceType(service.type)}
                </Text>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Service ID: #{service.id}
                </Text>
                {service.product && (
                  <Text className="text-sm text-gray-600 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    Product: {service.product.name}
                  </Text>
                )}
              </View>
              <View className={`px-3 py-1 rounded-full flex-row items-center gap-2 ${statusConfig.color}`}>
                {statusConfig.icon}
                <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {service.status.replace('_', ' ')}
                </Text>
              </View>
            </View>

            {/* Service Timeline */}
            <View className="border-t border-gray-100 pt-4 gap-y-3">
              <View className="flex-row items-center gap-4">
                <CalendarIcon size={16} color="#6B7280" />
                <View>
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    Requested: {formatDate(service.createdAt)}
                  </Text>
                  {service.scheduledDate && (
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      Scheduled: {formatDate(service.scheduledDate)}
                    </Text>
                  )}
                  {service.completedDate && (
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      Completed: {formatDate(service.completedDate)}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-4">
                <UserIcon size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Technician: {getAssignedTechnicianName()}
                </Text>
              </View>

              {/* Installation specific details */}
              {service.installationRequest && (
                <>
                  <View className="flex-row items-center gap-4">
                    <MapPinIcon size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600 flex-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      {service.installationRequest.installationAddress}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-4">
                    <PhoneIcon size={16} color="#6B7280" />
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      Contact: {service.installationRequest.phoneNumber}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>

          {/* Customer Information */}
          {service.customer && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Customer Information
              </Text>
              <View className="gap-y-2">
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Name: {service.customer.name}
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Phone: {service.customer.phone}
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  City: {service.customer.city}
                </Text>
              </View>
            </View>
          )}

          {/* Service Description */}
          <View className="bg-white rounded-xl shadow-sm p-6">
            <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Service Description
            </Text>
            <Text className="text-gray-700 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              {service.description}
            </Text>
          </View>

          {/* Before Photos */}
          {beforeImages.length > 0 && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Before Service ({beforeImages.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {beforeImages.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      className="w-32 h-32 rounded-lg"
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* After Photos */}
          {afterImages.length > 0 && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                After Service ({afterImages.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {afterImages.map((photo, index) => (
                    <Image
                      key={index}
                      source={{ uri: photo }}
                      className="w-32 h-32 rounded-lg"
                      resizeMode="cover"
                    />
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Payment Information */}
          {(service.requirePayment || service.installationRequest?.razorpayPaymentLink) && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Payment Information
              </Text>
              {service.requirePayment ? (
                <Text className="text-2xl text-[#4548b9]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  Payment Required
                </Text>
              ) : (
                <Text className="text-lg text-green-600" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Payment Completed
                </Text>
              )}
              {service.installationRequest?.autoPaymentEnabled && (
                <Text className="text-sm text-gray-600 mt-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Auto-payment enabled for subscription
                </Text>
              )}
            </View>
          )}

          {/* Subscription Information */}
          {service.subscription && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Subscription Details
              </Text>
              <View className="gap-y-2">
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Plan: {service.subscription.planName}
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Connect ID: {service.subscription.connectId}
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Monthly Amount: ₹{service.subscription.monthlyAmount}
                </Text>
                <Text className="text-gray-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Next Payment: {formatDate(service.subscription.nextPaymentDate)}
                </Text>
              </View>
            </View>
          )}

          {/* Action Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity className="flex-1 bg-gray-100 py-4 rounded-xl">
              <Text className="text-center text-gray-700" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Download Report
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className="flex-1 bg-[#4548b9] py-4 rounded-xl">
              <Text className="text-center text-white" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Contact Support
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}