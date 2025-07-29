import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const AquaHomeSubscribe = () => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const scrollAnimation = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);

    const cities = [
        'Bangalore',
        'Chennai',
        'Delhi',
        'Hyderabad',
        'Mumbai',
        'Pune',
        'Kolkata',
        'Ahmedabad',
    ];

    const benefits = [
        { icon: '₹', text: '₹0 Upfront & Installation Cost' },
        { icon: '2', text: '2 lac+ Happy Customers' },
        { icon: '✓', text: 'Free Service & Maintenance' },
        { icon: '⚡', text: '24/7 Customer Support' }
    ];

    // Auto scroll animation for banner
    useEffect(() => {
        const startAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scrollAnimation, {
                        toValue: -200,
                        duration: 15000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(scrollAnimation, {
                        toValue: 0,
                        duration: 0,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };
        startAnimation();
    }, []);

    // Fix white space after keyboard hides
    useEffect(() => {
        const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
            scrollViewRef.current?.scrollTo({ y: 0, animated: false });
        });
        return () => keyboardHide.remove();
    }, []);

    const handlePhoneNumberChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        if (numericText.length <= 10) {
            setPhoneNumber(numericText);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city);
        setShowCityDropdown(false);
    };

    const isFormValid = name.trim() && phoneNumber.length === 10 && selectedCity;

    const renderCityItem = ({ item }) => (
        <TouchableOpacity
            style={{
                paddingVertical: 15,
                paddingHorizontal: 20,
                borderBottomWidth: 1,
                borderBottomColor: '#E5E7EB',
            }}
            onPress={() => handleCitySelect(item)}
        >
            <Text style={{ fontSize: 16, color: '#000', fontFamily: 'PlusJakartaSans-Regular' }}>
                {item}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    ref={scrollViewRef}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Hero Section */}
                    <View style={{ width: '100%', height: 400 }}>
                        <Image
                            source={require('/Users/sthipp005/Documents/personal/expo_intial/assets/images/onboardimage.jpeg')}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Auto-scrolling Benefits Banner */}
                    <View style={{ backgroundColor: '#4548b9', paddingVertical: 12, overflow: 'hidden' }}>
                        <Animated.View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                paddingHorizontal: 20,
                                transform: [{ translateX: scrollAnimation }],
                            }}
                        >
                            {[...benefits, ...benefits].map((benefit, index) => (
                                <View key={index} style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginRight: 40,
                                    minWidth: 200,
                                }}>
                                    <View style={{
                                        width: 24,
                                        height: 24,
                                        backgroundColor: 'white',
                                        borderRadius: 12,
                                        marginRight: 8,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <Text style={{ color: '#4548b9', fontSize: 12, fontWeight: 'bold' }}>
                                            {benefit.icon}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        color: 'white',
                                        fontSize: 14,
                                        fontFamily: 'PlusJakartaSans-SemiBold',
                                    }}>
                                        {benefit.text}
                                    </Text>
                                </View>
                            ))}
                        </Animated.View>
                    </View>

                    {/* Form Section */}
                    <View style={{ padding: 24 }}>
                        <Text style={{
                            fontSize: 20,
                            color: 'black',
                            marginBottom: 24,
                            fontFamily: 'PlusJakartaSans-Bold',
                        }}>
                            Find Your Perfect Purifier
                        </Text>

                        {/* Name Input */}
                        <TextInput
                            style={{
                                borderWidth: 2,
                                borderColor: '#D1D5DB',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                marginBottom: 16,
                                fontSize: 16,
                                fontFamily: 'PlusJakartaSans-Regular',
                            }}
                            placeholder="Enter your name*"
                            placeholderTextColor="#9CA3AF"
                            value={name}
                            onChangeText={setName}
                        />

                        {/* Phone Number Input */}
                        <TextInput
                            style={{
                                borderWidth: 2,
                                borderColor: '#D1D5DB',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                marginBottom: 16,
                                fontSize: 16,
                                fontFamily: 'PlusJakartaSans-Regular',
                            }}
                            placeholder="Alternative number"
                            placeholderTextColor="#9CA3AF"
                            value={phoneNumber}
                            onChangeText={handlePhoneNumberChange}
                            keyboardType="numeric"
                            maxLength={10}
                        />

                        {/* City Dropdown */}
                        <TouchableOpacity
                            style={{
                                borderWidth: 2,
                                borderColor: '#D1D5DB',
                                borderRadius: 12,
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                marginBottom: 16,
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                            onPress={() => setShowCityDropdown(true)}
                        >
                            <Text style={{
                                fontSize: 16,
                                color: selectedCity ? 'black' : '#9CA3AF',
                                fontFamily: 'PlusJakartaSans-Regular',
                            }}>
                                {selectedCity || 'Choose City*'}
                            </Text>
                            <Text style={{ color: '#9CA3AF', fontSize: 16 }}>▼</Text>
                        </TouchableOpacity>

                        {/* Proceed Button */}
                        <TouchableOpacity
                            style={{
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: isFormValid ? '#4548b9' : '#9CA3AF',
                                marginTop: 8,
                            }}
                            disabled={!isFormValid}
                        >
                            <Text style={{
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 18,
                                fontFamily: 'PlusJakartaSans-SemiBold',
                            }}>
                                Proceed
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* City Selection Modal */}
                <Modal
                    visible={showCityDropdown}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={() => setShowCityDropdown(false)}
                >
                    <TouchableOpacity
                        style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        activeOpacity={1}
                        onPress={() => setShowCityDropdown(false)}
                    >
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            width: '80%',
                            maxHeight: '60%',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3.84,
                            elevation: 5,
                        }}>
                            <View style={{
                                paddingVertical: 16,
                                paddingHorizontal: 20,
                                borderBottomWidth: 1,
                                borderBottomColor: '#E5E7EB',
                            }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: 'bold',
                                    color: 'black',
                                    fontFamily: 'PlusJakartaSans-Bold',
                                }}>
                                    Select City
                                </Text>
                            </View>
                            <FlatList
                                data={cities}
                                renderItem={renderCityItem}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AquaHomeSubscribe;
