import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native';
import { SheetManager } from 'react-native-actions-sheet';
import Svg, { Path } from 'react-native-svg';
import { SHEET_IDS } from '../../sheets';
import { apiService } from '@/api/api';

const { width } = Dimensions.get('window');

interface Product {
    id: string;
    name: string;
    description: string;
    images: string[];
    rentPrice: number;
    buyPrice: number;
    deposit: number;
    isRentable: boolean;
    isPurchasable: boolean;
    createdAt: string;
    updatedAt: string;
    isActive: boolean;
    categoryId: string;
}

interface Franchise {
    id: string;
    name: string;
    city: string;
    geoPolygon: any;
    ownerId?: string;
    isCompanyManaged: boolean;
    createdAt: string;
    isActive: boolean;
    ownerName: string;
    revenue: string;
    serviceAgentCount: string;
}

const AquaHomeProductPage = () => {
    const { id } = useLocalSearchParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState('BASIC');
    const [selectedDuration, setSelectedDuration] = useState('360');
    const [currentReview, setCurrentReview] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    const [franchises, setFranchises] = useState<Franchise[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const scrollViewRef = useRef(null);
    const navigation = useNavigation();

    // Static reviews data
    const reviews = [
        {
            text: "Good service! They have the option for relocation as well. Have been using the drink prime service for close to 3 years now.",
            author: "Richa Sharma",
            rating: 5
        },
        {
            text: "Overall experience was good in terms of delivery to installation, it was delivered the very next when I made the payment and installed on the same day.",
            author: "Shubham Singh",
            rating: 5
        },
        {
            text: "Excellent purifier, purifies water well, drink prime has improved my family health and wellness, able to connect wifi with the device.",
            author: "Sampath Meda",
            rating: 5
        },
        {
            text: "Good Product and Installation was really fast and smooth. Quality Test was done In front of us very transparent application and services.",
            author: "Sridhar Kulkarni",
            rating: 5
        },
        {
            text: "I never thought it would be so easy to get a good purifier on rent. Their service is so prompt, I got my purifier delivered and installed within 12 hours. Also their app is very user friendly",
            author: "Pratik Dasgupta",
            rating: 5
        }
    ];

    // Fetch product data
    const fetchProduct = async () => {
        try {
            setLoading(true);
            const response = await apiService.get(`/products/${id || 'prod_001'}`);
            if (response.data?.product) {
                setProduct(response.data.product);
            }
        } catch (err) {
            console.error('Error fetching product:', err);
            setError('Failed to load product data');
        }
    };

    // Fetch franchises data
    const fetchFranchises = async () => {
        try {
            const response = await apiService.get('/franchises');
            if (response.data) {
                setFranchises(response.data);
            }
        } catch (err) {
            console.error('Error fetching franchises:', err);
            setError('Failed to load franchise data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            await Promise.all([fetchProduct(), fetchFranchises()]);
        };
        loadData();
    }, [id]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className='text-lg' style={{
                    fontFamily: 'PlusJakartaSans-Bold'
                }}>
                    {product?.name || 'RO+ Water'}
                </Text>
            ),
            headerTitleAlign: 'center',
            headerLeft: () => null,
        });
    }, [navigation, product]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    // Extract cities from franchises
    const cities = franchises
        .filter(franchise => franchise.isActive)
        .map(franchise => franchise.city)
        .filter((city, index, array) => array.indexOf(city) === index); // Remove duplicates

    const handleInstallationRequest = () => {
        // Prepare city data with coordinates and geopolygon for map restriction


        SheetManager.show(SHEET_IDS.ENQUIRY_SHEET, {
            payload: {
                product: product,
                franchises: franchises,

                onSubmit: async (formData: any) => {

                    try {
                        const data = {
                            productId: product?.id,
                            orderType: formData.type,
                            name: formData.name,
                            phoneNumber: formData.mobile,
                            franchiseId: formData.city,
                            installationAddress: formData.address,
                            installationLatitude: formData.coordinates.latitude,
                            installationLongitude: formData.coordinates.longitude,

                        }

                        // Submit installation request
                        const response = await apiService.post('/installation-requests', data);

                        console.log('Installation request submitted:', response);
                        // Handle success (show success message, navigate, etc.)
                    } catch (error) {
                        console.error('Error submitting installation request:', error);
                        throw error;
                        // Handle error
                    }
                }
            }
        });
    };

    // Icon components (keeping the same)
    const LeftArrowIcon = () => (
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M15.5 19L8.5 12L15.5 5" stroke="#14142B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const StarIcon = ({ color = "#D86A00" }) => (
        <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <Path d="M6.61958 1.17082C6.73932 0.802295 7.26068 0.802296 7.38042 1.17082L8.70631 5.25147C8.75986 5.41628 8.91344 5.52786 9.08673 5.52786H13.3774C13.7649 5.52786 13.926 6.02371 13.6125 6.25147L10.1413 8.77345C10.0011 8.87531 9.94243 9.05586 9.99598 9.22066L11.3219 13.3013C11.4416 13.6698 11.0198 13.9763 10.7063 13.7485L7.23511 11.2265C7.09492 11.1247 6.90508 11.1247 6.76489 11.2265L3.29368 13.7485C2.98019 13.9763 2.5584 13.6698 2.67814 13.3013L4.00402 9.22067C4.05757 9.05586 3.99891 8.87531 3.85872 8.77345L0.387506 6.25147C0.0740204 6.02371 0.235132 5.52786 0.622621 5.52786H4.91327C5.08656 5.52786 5.24014 5.41628 5.29369 5.25147L6.61958 1.17082Z" fill={color} />
        </Svg>
    );

    const RightArrowIcon = () => (
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <Path d="M5.66675 3.33333L10.3334 8L5.66675 12.6667" stroke="#4548B9" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );

    const LargeStar = () => (
        <Svg width="18" height="17" viewBox="0 0 18 17" fill="none">
            <Path d="M8.52447 0.963525C8.67415 0.50287 9.32585 0.50287 9.47553 0.963525L11.1329 6.06434C11.1998 6.27035 11.3918 6.40983 11.6084 6.40983H16.9717C17.4561 6.40983 17.6575 7.02964 17.2656 7.31434L12.9266 10.4668C12.7514 10.5941 12.678 10.8198 12.745 11.0258L14.4023 16.1266C14.552 16.5873 14.0248 16.9704 13.6329 16.6857L9.29389 13.5332C9.11865 13.4059 8.88135 13.4059 8.70611 13.5332L4.3671 16.6857C3.97524 16.9704 3.448 16.5873 3.59768 16.1266L5.25503 11.0258C5.32197 10.8198 5.24864 10.5941 5.07339 10.4668L0.734384 7.31434C0.342527 7.02964 0.543915 6.40983 1.02828 6.40983H6.39159C6.6082 6.40983 6.80018 6.27035 6.86712 6.06434L8.52447 0.963525Z" fill="#D86A00" />
        </Svg>
    );

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" color="#4548b9" />
                <Text
                    className="mt-4 text-gray-600"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    Loading product details...
                </Text>
            </View>
        );
    }

    if (error || !product) {
        return (
            <View className="flex-1 justify-center items-center bg-white px-4">
                <Text
                    className="text-red-500 text-center text-lg mb-4"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    {error || 'Product not found'}
                </Text>
                <TouchableOpacity
                    className="bg-[#4548b9] px-6 py-3 rounded-2xl"
                    onPress={() => {
                        setError(null);
                        setLoading(true);
                        fetchProduct();
                        fetchFranchises();
                    }}
                >
                    <Text
                        className="text-white"
                        style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                    >
                        Retry
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
            <View className="grid grid-cols-1 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-y-8 relative mb-10">
                {/* Product Image Carousel */}
                <View className="flex flex-col gap-4 w-full justify-self-center">
                    <View className="overflow-hidden">
                        <Image
                            source={{ uri: product.images[selectedImage] }}
                            className="w-full h-[350]"
                            resizeMode="cover"
                        />
                    </View>

                    {/* Thumbnail Navigation */}
                    <View className="flex flex-row gap-3 justify-center items-center">
                        <TouchableOpacity className="flex items-center w-[24px] flex-shrink-0">
                            <LeftArrowIcon />
                        </TouchableOpacity>

                        <View className="flex flex-row gap-3 overflow-auto py-2 px-1">
                            {product.images.map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => setSelectedImage(index)}
                                >
                                    <Image
                                        source={{ uri: image }}
                                        className={`w-[64px] rounded-lg ${selectedImage === index ? 'scale-110 border-2 border-blue-500' : ''}`}
                                        style={{ width: 64, height: 64 }}
                                        resizeMode="cover"
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity className="flex flex-row items-center w-[24px] flex-shrink-0">
                            <View style={{ transform: [{ rotate: '180deg' }] }}>
                                <LeftArrowIcon />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Product Details & Pricing */}
                <View className="w-full px-4 justify-self-start">
                    <View className="border rounded-t-2xl text-title-active w-full">
                        {/* Header with Gradient */}
                        <View className="px-2 py-4 rounded-t-2xl bg-gradient-to-r from-purple-100 to-blue-100">
                            <Text
                                className="text-[20px] text-black w-fit bg-mineral-gradient"
                                style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                            >
                                {product.name}
                            </Text>
                            <Text
                                className="text-[15px] leading-[150%] text-gray-800 py-1 pb-1.5"
                                style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                            >
                                {product.description}
                            </Text>

                            <View className="w-full h-px bg-gray-200 my-4" />

                            <View className="flex flex-row justify-between">
                                <View>
                                    <Text
                                        className="text-[13px] text-gray-700 leading-[120%] mb-1"
                                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                    >
                                        7-days FREE
                                    </Text>
                                    <View className="flex flex-row items-end gap-1">
                                        <Text
                                            className="text-[32px] leading-tight text-green-600"
                                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                        >
                                            ₹{product.rentPrice}
                                        </Text>
                                        <Text
                                            className="text-xl text-gray-600"
                                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                        >
                                            /month
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex flex-col justify-center items-center px-6 rounded-3xl bg-lime-100 shadow-sm">
                                    <View className="flex flex-row gap-1 items-center">
                                        <StarIcon />
                                        <Text
                                            className="text-orange-600 text-xl"
                                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                        >
                                            4.8
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="w-full bg-[#4548b9] text-sm rounded-b-[24px] py-3.5"
                        onPress={handleInstallationRequest}
                    >
                        <Text
                            className="text-white text-center"
                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                        >
                            Request For Installation
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Reviews Section */}
                <View className="w-full flex flex-col gap-4 items-start px-4">
                    <LinearGradient
                        colors={['#f5f3ff', '#eff6ff', '#e0f2fe']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ borderRadius: 20 }}
                        className="px-6 md:px-8 w-full"
                    >
                        <View className="w-full pt-6 pb-3 md:pt-4 md:pb-3">
                            <View className="overflow-hidden">
                                <View className="flex flex-row">
                                    <View className="flex flex-col gap-4">
                                        <Text
                                            className="text-blue-900 text-sm leading-[25.20px] md:leading-snug"
                                            style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                        >
                                            {reviews[currentReview].text}
                                        </Text>
                                        <View>
                                            <View className="flex flex-row gap-2 text-sm">
                                                <Text
                                                    className="text-blue-900"
                                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                                >
                                                    - {reviews[currentReview].author}
                                                </Text>
                                                <View className="flex flex-row gap-1 items-center">
                                                    <LargeStar />
                                                    <Text
                                                        className="text-orange-600"
                                                        style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                                    >
                                                        {reviews[currentReview].rating}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/* Review Dots */}
                            <View className="absolute bottom-1 md:-bottom-0.5 right-0">
                                <View className="flex flex-row justify-center gap-2 mt-4">
                                    {reviews.map((_, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className={`rounded-full w-2.5 h-2.5 border ${currentReview === index ? 'bg-[#4548b9]' : 'bg-gray-200'}`}
                                            onPress={() => setCurrentReview(index)}
                                        />
                                    ))}
                                </View>
                            </View>
                        </View>

                        <View className="pt-2 pb-5 md:pb-3 border-t mt-2 border-gray-300 flex flex-row gap-1 md:justify-center items-center">
                            <Text
                                className="text-[#4548b9] text-[12px] md:text-center"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Check review in playstore
                            </Text>
                            <RightArrowIcon />
                        </View>
                    </LinearGradient>
                </View>
            </View>
        </ScrollView>
    );
};

export default AquaHomeProductPage;