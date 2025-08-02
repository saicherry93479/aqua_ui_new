import React, { useEffect } from 'react';
import {
    ImageBackground,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SHEET_IDS } from './sheets';
import { apiService } from '@/api/api';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { router } from 'expo-router';

const AquaHomeOnboarding = () => {


    const { setUser, user } = useAuth();
    const { checkExistingSession } = useSubscription();

    useEffect(() => {
        checkForExistingSubscriptionSession();
    }, []);

    const checkForExistingSubscriptionSession = async () => {
        try {
            const session = await checkExistingSession();
            if (session) {
                // If there's an existing subscription session, show option to continue
                Alert.alert(
                    'Existing Session Found',
                    `You have an active session for ${session.connectId}. Would you like to continue?`,
                    [
                        {
                            text: 'Continue Session',
                            onPress: () => router.replace('/(connect)/(tabs)')
                        },
                        {
                            text: 'Stay Here',
                            style: 'cancel'
                        }
                    ]
                );
            }
        } catch (error) {
            console.error('Error checking subscription session:', error);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text
                    className="text-2xl text-black mb-8 px-2 leading-10"
                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                >
                    How would you like to use the app?
                </Text>

                {/* Login Card */}
                <Pressable onPress={() => {
                    SheetManager.show(SHEET_IDS.CONNECT_SHEET, {
                        payload: {

                        }
                    })
                }} className="mb-4 rounded-2xl overflow-hidden shadow-sm">
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=500&h=200&fit=crop' }}
                        className="h-40 justify-end"
                        imageStyle={{ opacity: 0.8 }}
                    >
                        <View className="bg-black/40 absolute inset-0" />
                        <View className="p-6 relative z-10">
                            <Text
                                className="text-white text-lg mb-1 leading-8"
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            >
                                I already have a AquaHome
                            </Text>
                            <Text
                                className="text-white/90 text-sm mb-4"
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                            >
                                Login to your account
                            </Text>
                            <View
                                className="bg-[#4548b9] px-8 py-2 rounded-xl self-start"

                            >
                                <Text
                                    className="text-white  text-sm"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    Login Now
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Pressable>

                {/* Subscribe Card */}
                <Pressable onPress={() => {

                    if(user?.hasOnboarded){
                        router.push('/(newuser)/(tabs)')
                    }else{

                    SheetManager.show('onboarding-sheet', {
                        payload: {
                            onComplete: async (data) => {
                                console.log('Onboarding completed with data:', data);

                                const response = await apiService.post('/auth/onboard', data)
                                console.log('onbaord response ',response)
                                if (response.success) {
                                    setUser(response.data.user)
                                }

                                return response
                                // Handle the onboarding data
                                // data will contain: { username, alternativePhone, city }
                            },
                        },
                    });
                }
                }} className="mb-4 rounded-2xl overflow-hidden shadow-sm">
                    <ImageBackground
                        source={{ uri: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=200&fit=crop' }}
                        className="h-40 justify-end"
                        imageStyle={{ opacity: 0.8 }}
                    >
                        <View className="bg-black/40 absolute inset-0" />
                        <View className="p-6 relative z-10">
                            <Text
                                className="text-white text-lg mb-1 leading-8"
                                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                            >
                                I want a new AquaHome
                            </Text>
                            <Text
                                className="text-white/90 text-sm mb-4"
                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                            >
                                Book your purifier now
                            </Text>
                            <View
                                className="bg-[#4548b9] px-8 py-2 rounded-xl self-start"

                            >
                                <Text
                                    className="text-white text-sm"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    Subscribe now
                                </Text>
                            </View>
                        </View>
                    </ImageBackground>
                </Pressable>


            </ScrollView>
        </SafeAreaView>
    );
};

export default AquaHomeOnboarding;