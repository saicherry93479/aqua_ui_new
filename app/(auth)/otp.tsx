import { router, useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useLayoutEffect, useState, useRef } from 'react';
import {
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const AquaHomeOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timer, setTimer] = useState(37);
    const navigation = useNavigation();
    const inputRefs = useRef([]);

    const { phoneNumber = '9515235212' } = useLocalSearchParams();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity>
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
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    // Auto-focus first input on mount
    useEffect(() => {
        if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
        }
    }, []);

    const handleOTPChange = (text, index) => {
        // Handle paste operation (when multiple characters are entered)
        if (text.length > 1) {
            const numericText = text.replace(/[^0-9]/g, '');
            const digits = numericText.split('').slice(0, 4);
            const newOTP = ['', '', '', ''];
            
            digits.forEach((digit, i) => {
                if (i < 4) {
                    newOTP[i] = digit;
                }
            });
            
            setOtp(newOTP);
            
            // Focus the next empty input or the last filled input
            const nextIndex = Math.min(digits.length, 3);
            if (inputRefs.current[nextIndex]) {
                inputRefs.current[nextIndex].focus();
            }
            return;
        }

        // Handle single character input
        const numericText = text.replace(/[^0-9]/g, '');
        
        if (numericText.length <= 1) {
            const newOTP = [...otp];
            newOTP[index] = numericText;
            setOtp(newOTP);

            // Auto-focus next input if current input is filled
            if (numericText && index < 3) {
                inputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace') {
            const newOTP = [...otp];
            
            if (newOTP[index] === '' && index > 0) {
                // If current input is empty, move to previous input and clear it
                newOTP[index - 1] = '';
                setOtp(newOTP);
                inputRefs.current[index - 1]?.focus();
            } else {
                // Clear current input
                newOTP[index] = '';
                setOtp(newOTP);
            }
        }
    };

    const handleInputFocus = (index) => {
        // Select all text when input is focused for better UX
        if (inputRefs.current[index]) {
            inputRefs.current[index].setSelection(0, 1);
        }
    };

    const isOTPComplete = otp.every(digit => digit !== '');

    const handleResendOTP = () => {
        if (timer === 0) {
            setTimer(37);
            setOtp(['', '', '', '']);
            // Focus first input after resend
            inputRefs.current[0]?.focus();
            // Add resend OTP logic here
        }
    };

    const formatTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleContinue = () => {
        if (isOTPComplete) {
            const otpValue = otp.join('');
            console.log('OTP entered:', otpValue);
            // You can add OTP verification logic here
            router.replace('/intialscreen');
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
                    Submit the 4-digit OTP we sent to your mobile number{' '}
                    <Text className="text-black font-medium" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                        {phoneNumber}
                    </Text>
                </Text>

                {/* OTP Input Boxes */}
                <View className="flex-row justify-center mb-12">
                    {otp.map((digit, index) => (
                        <View key={index} className="mx-2">
                            <TextInput
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                className={`w-14 h-14 border-2 ${
                                    digit ? 'border-[#4548b9]' : 'border-gray-300'
                                } rounded-lg text-center text-xl text-black`}
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                value={digit}
                                onChangeText={(text) => handleOTPChange(text, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                onFocus={() => handleInputFocus(index)}
                                keyboardType="numeric"
                                maxLength={1}
                                selectTextOnFocus={true}
                                autoComplete="sms-otp" // Enables autofill for OTP
                                textContentType="oneTimeCode" // iOS autofill support
                                blurOnSubmit={false}
                                returnKeyType="next"
                            />
                        </View>
                    ))}
                </View>

                {/* Continue Button */}
                <TouchableOpacity
                    className={`py-4 rounded-lg mb-8 ${
                        isOTPComplete ? 'bg-[#4548b9]' : 'bg-gray-400'
                    }`}
                    disabled={!isOTPComplete}
                    onPress={handleContinue}
                >
                    <Text
                        className="text-white text-center text-base"
                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                    >
                        Continue
                    </Text>
                </TouchableOpacity>

                {/* Resend Code */}
                <View className="items-center">
                    {timer > 0 ? (
                        <Text className="text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                            Resend code in {formatTimer(timer)}
                        </Text>
                    ) : (
                        <TouchableOpacity onPress={handleResendOTP}>
                            <Text
                                className="text-[#4548b9]"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            >
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