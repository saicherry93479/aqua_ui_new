import { router } from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StatusBar,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const AgentIcon = () => <Svg

    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M9 2C6.38 2 4.25 4.13 4.25 6.75c0 2.57 2.01 4.65 4.63 4.74.08-.01.16-.01.22 0h.07a4.738 4.738 0 004.58-4.74C13.75 4.13 11.62 2 9 2zM14.08 14.15c-2.79-1.86-7.34-1.86-10.15 0-1.27.85-1.97 2-1.97 3.23s.7 2.37 1.96 3.21C5.32 21.53 7.16 22 9 22c1.84 0 3.68-.47 5.08-1.41 1.26-.85 1.96-1.99 1.96-3.23-.01-1.23-.7-2.37-1.96-3.21zM19.99 7.34c.16 1.94-1.22 3.64-3.13 3.87h-.05c-.06 0-.12 0-.17.02-.97.05-1.86-.26-2.53-.83 1.03-.92 1.62-2.3 1.5-3.8a4.64 4.64 0 00-.77-2.18 3.592 3.592 0 015.15 2.92z"
        fill="#ffffff"
    />
    <Path
        d="M21.99 16.59c-.08.97-.7 1.81-1.74 2.38-1 .55-2.26.81-3.51.78.72-.65 1.14-1.46 1.22-2.32.1-1.24-.49-2.43-1.67-3.38-.67-.53-1.45-.95-2.3-1.26 2.21-.64 4.99-.21 6.7 1.17.92.74 1.39 1.67 1.3 2.63z"
        fill="#ffffff"
    />
</Svg>

const LoginIcon = () => <Svg

    width={20}
    height={20}
    viewBox="0 0 20 20"
    fill="none"

>
    <Path
        d="M16.28 7.53V6.28C16.28 3.58 15.63 0 10 0S3.72 3.58 3.72 6.28v1.25C.92 7.88 0 9.3 0 12.79v1.86C0 18.75 1.25 20 5.35 20h9.3c4.1 0 5.35-1.25 5.35-5.35v-1.86c0-3.49-.92-4.91-3.72-5.26zM10 16.74c-1.67 0-3.02-1.36-3.02-3.02 0-1.67 1.36-3.02 3.02-3.02a3.03 3.03 0 013.02 3.02c0 1.67-1.35 3.02-3.02 3.02zm-4.65-9.3h-.23V6.28c0-2.93.83-4.88 4.88-4.88s4.88 1.95 4.88 4.88v1.17H5.35v-.01z"
        fill="#ffffff"
    />
</Svg>

const CallSvgIcon = () => <Svg

    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M11.05 14.95L9.2 16.8c-.39.39-1.01.39-1.41.01-.11-.11-.22-.21-.33-.32a28.414 28.414 0 01-2.79-3.27c-.82-1.14-1.48-2.28-1.96-3.41C2.24 8.67 2 7.58 2 6.54c0-.68.12-1.33.36-1.93.24-.61.62-1.17 1.15-1.67C4.15 2.31 4.85 2 5.59 2c.28 0 .56.06.81.18.26.12.49.3.67.56l2.32 3.27c.18.25.31.48.4.7.09.21.14.42.14.61 0 .24-.07.48-.21.71-.13.23-.32.47-.56.71l-.76.79c-.11.11-.16.24-.16.4 0 .08.01.15.03.23.03.08.06.14.08.2.18.33.49.76.93 1.28.45.52.93 1.05 1.45 1.58.1.1.21.2.31.3.4.39.41 1.03.01 1.43zM21.97 18.33c0 .28-.05.57-.15.85-.03.08-.06.16-.1.24-.17.36-.39.7-.68 1.02-.49.54-1.03.93-1.64 1.18-.01 0-.02.01-.03.01-.59.24-1.23.37-1.92.37-1.02 0-2.11-.24-3.26-.73s-2.3-1.15-3.44-1.98c-.39-.29-.78-.58-1.15-.89l3.27-3.27c.28.21.53.37.74.48.05.02.11.05.18.08.08.03.16.04.25.04.17 0 .3-.06.41-.17l.76-.75c.25-.25.49-.44.72-.56.23-.14.46-.21.71-.21.19 0 .39.04.61.13.22.09.45.22.7.39l3.31 2.35c.26.18.44.39.55.64.1.25.16.5.16.78z"
        fill="#ffffff"
    />
</Svg>

const successrequest = () => {
    const handleOkPress = () => {
        // Handle OK button press
        console.log('OK pressed');
    };

    const handleContinuePress = () => {
        // Handle Continue and Select Plan button press
        console.log('Continue and Select Plan pressed');
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

            {/* Success Header Section */}
            <View className="bg-green-100  py-4  mt-8 rounded-2xl items-center">
                {/* Success Checkmark */}
                <View className="w-10 h-10 border-green-600  border-2 rounded-full items-center justify-center mb-6">
                    <Text className="text-green-600 text-base font-bold">✓</Text>
                </View>

                {/* Success Title */}
                <Text
                    className="text-lg text-black text-center mb-2 "
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                    Thank you for choosing AquaHome!
                </Text>

                {/* Success Description */}
                <Text
                    className="text-base text-gray-600 text-center leading-6 w-[80%] mx-auto"
                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                >
                    Our sales team will reach out to you shortly and assist you to rent AquaHome Purifier
                </Text>
            </View>

            {/* What happens next section */}
            <View className="px-6 mt-8">
                <Text
                    className="text-xl text-black mb-8"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                    What happens next?
                </Text>

                {/* Step 1 */}
                <View className="flex-row items-start mb-8">
                    <View className="mr-4 mt-1">
                        <View className="w-2 h-2 bg-[#4548b9] rounded-full"></View>
                        <View className="w-0.5 h-12 bg-gray-300 ml-0.5 mt-2"></View>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-[#4548b9] rounded-xl items-center justify-center mr-4">
                            <CallSvgIcon></CallSvgIcon>
                        </View>
                        <View className="flex-1">
                            <Text
                                className="text-base w-[70%] text-black"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Our sales team will contact you shortly
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Step 2 */}
                <View className="flex-row items-start mb-8">
                    <View className="mr-4 mt-1">
                        <View className="w-2 h-2 bg-[#4548b9] rounded-full"></View>
                        <View className="w-0.5 h-12 bg-gray-300 ml-0.5 mt-2"></View>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-[#4548b9] rounded-xl items-center justify-center mr-4">
                            <AgentIcon></AgentIcon>
                        </View>
                        <View className="flex-1">
                            <Text
                                className="text-base w-[70%]  text-black"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                AquaHome agent will install the Purifier in next 24 - 48 hours.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Step 3 */}
                <View className="flex-row items-start mb-8">
                    <View className="mr-4 mt-1">
                        <View className="w-2 h-2 bg-[#4548b9] rounded-full"></View>
                    </View>
                    <View className="flex-row items-center flex-1">
                        <View className="w-12 h-12 bg-[#4548b9] rounded-xl items-center justify-center mr-4">
                            <LoginIcon></LoginIcon>
                        </View>
                        <View className="flex-1">
                            <Text
                                className="text-base w-[75%] text-black"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Login into AquaHome app and start enjoying healthiest water with AquaHome.
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Contact Section */}
            <View className="px-6 mt-4">
                <Text
                    className="text-center text-sm text-gray-700"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                    Talk to our Experts on +91-9986938426
                </Text>
            </View>

            {/* Bottom Buttons */}
            <View className="px-6 mt-auto mb-8">
                {/* OK Button */}
                <TouchableOpacity
                    className="bg-[#4548b9] py-3 rounded-xl mb-4"
                    onPress={handleOkPress}

                >
                    <Text
                        className="text-white text-center text-base"
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                    >
                        OK
                    </Text>
                </TouchableOpacity>

                {/* Continue and Select Plan Button */}
                <TouchableOpacity
                    className="bg-white border border-[#4548b9] py-3 rounded-xl"
                    onPress={() => router.push('/(newuser)/(tabs)/requests')}

                >
                    <Text
                        className="text-gray-800 text-center text-base"
                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                        Show Requests
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Bottom Indicator */}
            <View className="items-center mb-4">
                <View className="w-32 h-1 bg-black rounded-full"></View>
            </View>
        </SafeAreaView>
    );
};

export default successrequest;