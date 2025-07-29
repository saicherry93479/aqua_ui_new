import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import Svg, { Path } from 'react-native-svg';

const PhoneIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </Svg>
);

const MailIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <Path d="M22 6l-10 7L2 6" />
  </Svg>
);

const MapPinIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <Path d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
  </Svg>
);

const UserIcon = ({ size = 24, color = "currentColor" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Path d="M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
  </Svg>
);

export default function HelpSupportScreen() {
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
          Help & Support
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

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`).catch(() => {
      Alert.alert('Error', 'Unable to make phone call');
    });
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('Error', 'Unable to open email client');
    });
  };

  const areaManager = {
    name: 'Rajesh Kumar',
    designation: 'Area Manager - Bangalore',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@aquahome.com',
    address: 'AquaHome Bangalore Office, MG Road, Bangalore - 560001'
  };

  const companyOwner = {
    name: 'Suresh Patel',
    designation: 'Founder & CEO',
    phone: '+91 99999 88888',
    email: 'suresh@aquahome.com',
    address: 'AquaHome Head Office, Mumbai - 400001'
  };

  const ContactCard = ({ person, type }) => (
    <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <View className="flex-row items-center mb-4">
        <View className="w-12 h-12 bg-[#4548b9] rounded-full items-center justify-center mr-4">
          <UserIcon size={24} color="white" />
        </View>
        <View className="flex-1">
          <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
            {person.name}
          </Text>
          <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            {person.designation}
          </Text>
        </View>
      </View>

      {/* Contact Options */}
      <View className="gap-4">
        {/* Phone */}
        <TouchableOpacity
          className="flex-row items-center p-4 bg-gray-50 rounded-xl"
          onPress={() => handleCall(person.phone)}
        >
          <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mr-4">
            <PhoneIcon size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Phone
            </Text>
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {person.phone}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Email */}
        <TouchableOpacity
          className="flex-row items-center p-4 bg-gray-50 rounded-xl"
          onPress={() => handleEmail(person.email)}
        >
          <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-4">
            <MailIcon size={20} color="#3b82f6" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Email
            </Text>
            <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
              {person.email}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Address */}
        <View className="flex-row items-start p-4 bg-gray-50 rounded-xl">
          <View className="w-10 h-10 bg-orange-100 rounded-full items-center justify-center mr-4 mt-1">
            <MapPinIcon size={20} color="#f97316" />
          </View>
          <View className="flex-1">
            <Text className="text-sm text-gray-600 mb-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Address
            </Text>
            <Text className="text-base text-gray-900 leading-5" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              {person.address}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="p-4 pb-24">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl text-gray-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Need Help?
            </Text>
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Get in touch with our support team for any assistance
            </Text>
          </View>

          {/* Area Manager */}
          <View className="mb-2">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Your Area Manager
            </Text>
            <ContactCard person={areaManager} type="area_manager" />
          </View>

          {/* Company Owner */}
          <View className="mb-2">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Company Leadership
            </Text>
            <ContactCard person={companyOwner} type="company_owner" />
          </View>

          {/* Emergency Contact */}
          <View className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <Text className="text-lg text-red-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Emergency Support
            </Text>
            <Text className="text-red-700 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              For urgent issues or emergencies, call our 24/7 helpline
            </Text>
            <TouchableOpacity
              className="bg-red-600 py-3 rounded-xl"
              onPress={() => handleCall('+91 1800-123-4567')}
            >
              <Text className="text-white text-center" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                Call Emergency Helpline
              </Text>
            </TouchableOpacity>
          </View>

          {/* Business Hours */}
          <View className="bg-white rounded-2xl shadow-sm p-6 mt-6">
            <Text className="text-lg text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
              Business Hours
            </Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Monday - Friday
                </Text>
                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  9:00 AM - 6:00 PM
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Saturday
                </Text>
                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  9:00 AM - 2:00 PM
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                  Sunday
                </Text>
                <Text className="text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Closed
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}