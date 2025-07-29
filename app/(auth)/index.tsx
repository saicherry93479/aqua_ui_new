import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
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

  // useEffect(() => {
  //   router.replace('/(connect)');  // force navigation to (newuser)
  // }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener?.remove();
      keyboardDidShowListener?.remove();
    };
  }, []);

  const handlePhoneNumberChange = (text) => {
    // Remove any non-numeric characters
    const numericText = text.replace(/[^0-9]/g, '');
    // Limit to 10 digits
    if (numericText.length <= 10) {
      setPhoneNumber(numericText);
    }
  };

  const isValidPhoneNumber = phoneNumber.length === 10;
  const inputBorderColor = phoneNumber.length > 0 && !isValidPhoneNumber ? 'border-red-500' : 'border-gray-300';

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar backgroundColor="#6366f1" barStyle="light-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header Section with Logo */}
        <View className={`bg-[#4548b9] ${isKeyboardVisible ? 'flex-[0.5]' : 'flex-[0.7]'} justify-center items-center`}>
          <View className="items-center">
            {/* Logo placeholder - you can replace with actual logo */}
            <View className="w-16 h-16 bg-white rounded-full mb-4 justify-center items-center">
              <Text className="text-[#4548b9] text-2xl" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>dp</Text>
            </View>
            <Text className="text-white text-xl" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              AquaHome
            </Text>
          </View>
        </View>

        {/* Bottom Section with Form */}
        <View className={`bg-white ${isKeyboardVisible ? 'flex-[0.7]' : 'flex-[0.35]'} rounded-t-3xl px-6 pt-8 border-t  border-gray-200`} style={{
          borderTopRightRadius: 12,
          borderTopLeftRadius: 12
        }}>
          <Text className="text-2xl text-gray-800 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Hey there!
          </Text>

          <Text className="text-gray-600 mb-4" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
            Enter your mobile number
          </Text>

          {/* Phone Number Input */}
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

          {/* Error Message */}
          {phoneNumber.length > 0 && !isValidPhoneNumber && (
            <Text className="text-red-500 text-sm mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              *Please enter a valid 10-digit phone number
            </Text>
          )}

          {/* Request OTP Button */}
          <TouchableOpacity
            className={`py-4 rounded-lg mt-4 ${isValidPhoneNumber
                ? 'bg-[#4548b9]'
                : 'bg-gray-400'
              }`}
            disabled={!isValidPhoneNumber}
            onPress={()=>{
              router.push('/(auth)/otp')
            }}
          >
            <Text className="text-white text-center text-base" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Request OTP
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AquaHomeLogin;