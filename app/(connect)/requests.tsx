import React, { useState, useLayoutEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useNavigation } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

// Custom SVG Components
const PlusIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M12 5v14" />
        <Path d="M5 12h14" />
    </Svg>
);

const WrenchIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </Svg>
);

const FilterIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="3" />
        <Path d="M12 1v6" />
        <Path d="M12 17v6" />
        <Path d="M1 12h6" />
        <Path d="M17 12h6" />
    </Svg>
);

const ClockIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="M12 6v6l4 2" />
    </Svg>
);

const CheckCircleIcon = ({ size = 20, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" />
        <Path d="m9 12 2 2 4-4" />
    </Svg>
);

const XIcon = ({ size = 24, color = "currentColor" }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <Path d="M18 6L6 18" />
        <Path d="M6 6l12 12" />
    </Svg>
);

const ServicesScreen = () => {
    const navigation = useNavigation();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedServiceType, setSelectedServiceType] = useState('');
    const [description, setDescription] = useState('');

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
                    Services
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

    const serviceTypes = [
        { id: 'filter', name: 'Filter Replacement', icon: FilterIcon },
        { id: 'maintenance', name: 'Maintenance Check', icon: WrenchIcon },
        { id: 'repair', name: 'Repair Service', icon: WrenchIcon },
    ];

    const serviceHistory = [
        {
            id: '1',
            type: 'Filter Replacement',
            date: '15 Feb 2024',
            status: 'completed',
            technician: 'Rajesh Kumar',
            description: 'Replaced all filters and tested water quality'
        },
        {
            id: '2',
            type: 'Maintenance Check',
            date: '20 Nov 2023',
            status: 'completed',
            technician: 'Amit Singh',
            description: 'Complete system check and cleaning'
        },
        {
            id: '3',
            type: 'Repair Service',
            date: '05 Oct 2023',
            status: 'completed',
            technician: 'Priya Sharma',
            description: 'Fixed water flow issue'
        },
    ];

    const currentRequests = [
        {
            id: '1',
            type: 'Filter Replacement',
            date: '25 Mar 2024',
            status: 'scheduled',
            technician: 'Vikash Yadav',
            scheduledTime: '2:00 PM - 4:00 PM'
        }
    ];

    const handleSubmitRequest = () => {
        if (!selectedServiceType || !description.trim()) {
            Alert.alert('Error', 'Please select service type and add description');
            return;
        }

        Alert.alert(
            'Service Request Submitted',
            'Your service request has been submitted successfully. Our team will contact you within 24 hours.',
            [{ text: 'OK', onPress: () => {
                setShowRequestModal(false);
                setSelectedServiceType('');
                setDescription('');
            }}]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600 bg-green-100';
            case 'scheduled':
                return 'text-blue-600 bg-blue-100';
            case 'in-progress':
                return 'text-orange-600 bg-orange-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <CheckCircleIcon size={20} color="#10b981" />;
            case 'scheduled':
                return <ClockIcon size={20} color="#3b82f6" />;
            default:
                return <ClockIcon size={20} color="#6b7280" />;
        }
    };

    return (
        <View className="flex-1 bg-gray-50">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className="p-4 gap-y-6 pb-24">
                    {/* Request Service Button */}
                    <TouchableOpacity
                        className="bg-[#4548b9] rounded-2xl p-6 shadow-lg"
                        onPress={() => setShowRequestModal(true)}
                    >
                        <View className="flex-row items-center justify-between">
                            <View className="flex-1">
                                <Text className="text-white text-xl mb-2" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                    Need Service?
                                </Text>
                                <Text className="text-blue-100 text-sm" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                    Request maintenance, filter change, or repair
                                </Text>
                            </View>
                            <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                                <PlusIcon size={24} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* Current Service Requests */}
                    {currentRequests.length > 0 && (
                        <View>
                            <Text className="text-xl text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                Current Requests
                            </Text>
                            <View className="gap-y-3">
                                {currentRequests.map((request) => (
                                    <View key={request.id} className="bg-white rounded-xl shadow-sm p-5">
                                        <View className="flex-row items-start justify-between mb-3">
                                            <View className="flex-1">
                                                <Text className="text-lg text-gray-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                    {request.type}
                                                </Text>
                                                <Text className="text-sm text-gray-600" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                    Requested on {request.date}
                                                </Text>
                                            </View>
                                            <View className={`px-3 py-1 rounded-full ${getStatusColor(request.status)}`}>
                                                <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                    {request.status}
                                                </Text>
                                            </View>
                                        </View>
                                        
                                        <View className="bg-blue-50 rounded-lg p-3">
                                            <Text className="text-sm text-blue-900 mb-1" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                Scheduled Time
                                            </Text>
                                            <Text className="text-sm text-blue-700" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {request.scheduledTime}
                                            </Text>
                                            <Text className="text-xs text-blue-600 mt-1" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                Technician: {request.technician}
                                            </Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Service History */}
                    <View>
                        <Text className="text-xl text-gray-900 mb-4" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Service History
                        </Text>
                        <View className="gap-y-3">
                            {serviceHistory.map((service) => (
                                <View key={service.id} className="bg-white rounded-xl shadow-sm p-5">
                                    <View className="flex-row items-start gap-4">
                                        <View className="w-12 h-12 rounded-full bg-green-50 items-center justify-center">
                                            {getStatusIcon(service.status)}
                                        </View>
                                        <View className="flex-1">
                                            <View className="flex-row items-center justify-between mb-2">
                                                <Text className="text-base text-gray-900" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                    {service.type}
                                                </Text>
                                                <View className={`px-3 py-1 rounded-full ${getStatusColor(service.status)}`}>
                                                    <Text className="text-xs capitalize" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                                        {service.status}
                                                    </Text>
                                                </View>
                                            </View>
                                            <Text className="text-sm text-gray-600 mb-2" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {service.date} • {service.technician}
                                            </Text>
                                            <Text className="text-sm text-gray-500" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                                                {service.description}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Service Request Modal */}
            <Modal
                visible={showRequestModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowRequestModal(false)}
            >
                <View className="flex-1 bg-white">
                    {/* Header */}
                    <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
                        <Text className="text-xl text-gray-900" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                            Request Service
                        </Text>
                        <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                            <XIcon size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="flex-1 p-4">
                        {/* Service Type Selection */}
                        <View className="mb-6">
                            <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Select Service Type
                            </Text>
                            <View className="gap-3">
                                {serviceTypes.map((type) => {
                                    const IconComponent = type.icon;
                                    const isSelected = selectedServiceType === type.id;
                                    
                                    return (
                                        <TouchableOpacity
                                            key={type.id}
                                            className={`p-4 rounded-xl border-2 ${
                                                isSelected 
                                                    ? 'border-[#4548b9] bg-blue-50' 
                                                    : 'border-gray-200 bg-white'
                                            }`}
                                            onPress={() => setSelectedServiceType(type.id)}
                                        >
                                            <View className="flex-row items-center gap-3">
                                                <IconComponent 
                                                    size={24} 
                                                    color={isSelected ? '#4548b9' : '#6B7280'} 
                                                />
                                                <Text 
                                                    className={`text-base ${
                                                        isSelected ? 'text-[#4548b9]' : 'text-gray-700'
                                                    }`}
                                                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                                                >
                                                    {type.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Description */}
                        <View className="mb-6">
                            <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                                Description
                            </Text>
                            <TextInput
                                className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[120px]"
                                style={{ 
                                    fontFamily: 'PlusJakartaSans-Regular',
                                    textAlignVertical: 'top'
                                }}
                                placeholder="Describe the issue or service needed..."
                                placeholderTextColor="#9CA3AF"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                numberOfLines={5}
                            />
                        </View>
                    </ScrollView>

                    {/* Submit Button */}
                    <View className="p-4 border-t border-gray-200">
                        <TouchableOpacity
                            className={`py-4 rounded-xl ${
                                selectedServiceType && description.trim() 
                                    ? 'bg-[#4548b9]' 
                                    : 'bg-gray-300'
                            }`}
                            onPress={handleSubmitRequest}
                            disabled={!selectedServiceType || !description.trim()}
                        >
                            <Text 
                                className={`text-center text-base ${
                                    selectedServiceType && description.trim() 
                                        ? 'text-white' 
                                        : 'text-gray-500'
                                }`}
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Submit Request
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default ServicesScreen;