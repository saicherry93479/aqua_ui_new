import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useLocalSearchParams } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import Svg, { Path, Circle } from 'react-native-svg';

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

const StarIcon = ({ filled = false, size = 16 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fbbf24" : "none"} stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </Svg>
);

export default function ServiceDetailScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const { serviceRequests } = useSubscription();
  
  const service = serviceRequests.find(req => req.id === id);

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

  if (!service) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-lg text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Service not found
        </Text>
      </View>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'SCHEDULED':
        return 'text-blue-600 bg-blue-100';
      case 'IN_PROGRESS':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon size={20} color="#10b981" />;
      case 'SCHEDULED':
        return <ClockIcon size={20} color="#3b82f6" />;
      default:
        return <ClockIcon size={20} color="#6b7280" />;
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 gap-y-6 pb-24">
          {/* Service Header */}
          <View className="bg-white rounded-xl shadow-sm p-6">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                  {service.type.charAt(0).toUpperCase() + service.type.slice(1).toLowerCase()}
                </Text>
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Service ID: #{service.id}
                </Text>
              </View>
              <View className={`px-3 py-1 rounded-full ${getStatusColor(service.status)}`}>
                <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  {service.status}
                </Text>
              </View>
            </View>

            {/* Service Timeline */}
            <View className="border-t border-gray-100 pt-4">
              <View className="flex-row items-center gap-4 mb-3">
                <CalendarIcon size={16} color="#6B7280" />
                <View>
                  <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                    Requested: {new Date(service.createdAt).toLocaleDateString()}
                  </Text>
                  {service.completedDate && (
                    <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      Completed: {new Date(service.completedDate).toLocaleDateString()}
                    </Text>
                  )}
                </View>
              </View>

              <View className="flex-row items-center gap-4">
                <UserIcon size={16} color="#6B7280" />
                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Technician: {service.assignedToId || 'Unassigned'}
                </Text>
              </View>
            </View>
          </View>

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
          {service.beforeImages && JSON.parse(service.beforeImages).length > 0 && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Before Service
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {JSON.parse(service.beforeImages).map((photo, index) => (
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
          {service.afterImages && JSON.parse(service.afterImages).length > 0 && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                After Service
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-3">
                  {JSON.parse(service.afterImages).map((photo, index) => (
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

          {/* Service Cost */}
          {service.requirePayment && (
            <View className="bg-white rounded-xl shadow-sm p-6">
              <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Service Cost
              </Text>
              <Text className="text-2xl text-[#4548b9]" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Payment Required
              </Text>
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