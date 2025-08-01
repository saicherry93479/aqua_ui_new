import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AquaHomeLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { sendOTP } = useAuth();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length <= 10) {
      setPhoneNumber(numericText);
    }
  };

  const isValidPhoneNumber = phoneNumber.length === 10;

  const handleRequestOTP = async () => {
    setIsLoading(true);
    try {
      await sendOTP(phoneNumber);
      router.push('/(auth)/otp');
    } catch (error) {
      console.error('Failed to send OTP:', error);
      // Optionally show toast or error UI
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header Section */}
        <View className={`bg-[#4548b9] ${isKeyboardVisible ? 'flex-[0.5]' : 'flex-[0.7]'} justify-center items-center`}>
          <View className="items-center">
            <View className="w-16 h-16 bg-white rounded-full mb-4 justify-center items-center">
              <Text className="text-[#4548b9] text-2xl" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>dp</Text>
            </View>
            <Text className="text-white text-xl" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              AquaHome
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View className={`bg-white ${isKeyboardVisible ? 'flex-[0.7]' : 'flex-[0.35]'} rounded-t-3xl px-6 pt-8 border-t border-gray-200`} style={{ borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
          <Text className="text-2xl text-gray-800 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Hey there!
          </Text>

          <Text className="text-gray-600 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Enter your mobile number
          </Text>

          <View className={`flex-row items-center border-2 ${phoneNumber.length > 0 && !isValidPhoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-1 mb-1`}>
            <Text className="text-gray-700 text-base mr-2" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              +91
            </Text>
            <TextInput
              className="flex-1 text-base text-gray-800"
              style={{ fontFamily: 'PlusJakartaSans-Regular' }}
              placeholder="Mobile number"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={handlePhoneNumberChange}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* Validation Error */}
          {phoneNumber.length > 0 && !isValidPhoneNumber && (
            <Text className="text-red-500 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              *Please enter a valid 10-digit phone number
            </Text>
          )}

          {/* OTP Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg mt-4 ${isValidPhoneNumber && !isLoading ? 'bg-[#4548b9]' : 'bg-gray-400'}`}
            disabled={!isValidPhoneNumber || isLoading}
            onPress={handleRequestOTP}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center text-base" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Request OTP
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AquaHomeLogin;
