import { useAuth, UserRole } from '@/contexts/AuthContext';
import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const AquaHomeOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigation = useNavigation();
  const inputRefs = useRef([]);
  const { sendOTP } = useAuth();

  const { verifyOTP } = useAuth();
  const { phoneNumber } = useLocalSearchParams();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Text className="text-lg text-black" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            Change number
          </Text>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerTitle: () => <View></View>
    });
  }, [navigation]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleOTPChange = (text, index) => {
    const numericText = text.replace(/[^0-9]/g, '');

    // Handle paste
    if (text.length > 1) {
      const digits = numericText.split('').slice(0, 6);
      const newOTP = ['', '', '', '', '', ''];
      digits.forEach((digit, i) => {
        if (i < 6) newOTP[i] = digit;
      });
      setOtp(newOTP);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    if (numericText.length <= 1) {
      const newOTP = [...otp];
      newOTP[index] = numericText;
      setOtp(newOTP);
      if (numericText && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace') {
      const newOTP = [...otp];
      if (newOTP[index] === '' && index > 0) {
        newOTP[index - 1] = '';
        setOtp(newOTP);
        inputRefs.current[index - 1]?.focus();
      } else {
        newOTP[index] = '';
        setOtp(newOTP);
      }
    }
  };

  const handleInputFocus = (index) => {
    inputRefs.current[index]?.setSelection(0, 1);
  };

  const isOTPComplete = otp.every((digit) => digit !== '');

  const handleResendOTP = async () => {
    if (timer === 0) {
      setTimer(30);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      // Add resend logic here
      await sendOTP(phoneNumber as string,UserRole.CUSTOMER)

    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = async () => {
    if (!isOTPComplete) return;
    const otpValue = otp.join('');
    try {
      setIsVerifying(true);
      const result = await verifyOTP(otpValue, UserRole.CUSTOMER);
      if (result.success) {
        router.replace(result.nextScreen); // '/' or '/OnboardDetails'
      } else {
        Alert.alert('Error', 'OTP verification failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-8">
        {/* Title */}
        <Text className="text-3xl text-black mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
          Enter OTP
        </Text>

        {/* Subtitle */}
        <Text className="text-gray-600 mb-8 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
          Submit the 6-digit OTP we sent to your mobile number{' '}
          <Text className="text-black font-medium" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
            {phoneNumber}
          </Text>
        </Text>

        {/* OTP Input Boxes */}
        <View className="flex-row justify-center mb-12">
          {otp.map((digit, index) => (
            <View key={index} className="mx-1">
              <TextInput
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={`w-10 h-12 border-2 ${digit ? 'border-[#254292]' : 'border-gray-300'
                  } rounded-md text-center text-lg text-black`}
                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                value={digit}
                onChangeText={(text) => handleOTPChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                onFocus={() => handleInputFocus(index)}
                keyboardType="numeric"
                maxLength={1}
                selectTextOnFocus={true}
                autoComplete="sms-otp"
                textContentType="oneTimeCode"
                blurOnSubmit={false}
                returnKeyType="next"
              />
            </View>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          className={`py-4 rounded-lg mb-8 ${isOTPComplete && !isVerifying ? 'bg-[#254292]' : 'bg-gray-400'
            }`}
          disabled={!isOTPComplete || isVerifying}
          onPress={handleContinue}
        >
          {isVerifying ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center text-base" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
              Continue
            </Text>
          )}
        </TouchableOpacity>

        {/* Resend Code */}
        <View className="items-center">
          {timer > 0 ? (
            <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
              Resend code in {formatTimer(timer)}
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP}>
              <Text className="text-[#254292]" style={{ fontFamily: 'PlusJakartaSans-Medium' }}>
                Resend code
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AquaHomeOTP;
