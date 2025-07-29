import { LinearGradient } from 'expo-linear-gradient'
import { router, useNavigation } from 'expo-router'
import React, { useLayoutEffect, useState } from 'react'
import { Dimensions, Image, Pressable, Text, View, Animated } from 'react-native'
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler'
import ReanimatedAnimated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    interpolate,
    Extrapolate,
} from 'react-native-reanimated'
import Svg, { Path } from 'react-native-svg'

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

const BackIcon = () => <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
>
    <Path
        d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
        stroke="#292D32"
        strokeWidth={2}
        strokeMiterlimit={10}
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</Svg>

const StarIcon = ({ color = "#D86A00" }) => (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <Path d="M7.52447 0.963525C7.67415 0.50287 8.32585 0.50287 8.47553 0.963525L10.1329 6.06434C10.1998 6.27035 10.3918 6.40983 10.6084 6.40983H15.9717C16.4561 6.40983 16.6575 7.02964 16.2656 7.31434L11.9266 10.4668C11.7514 10.5941 11.678 10.8198 11.745 11.0258L13.4023 16.1266C13.552 16.5873 13.0248 16.9704 12.6329 16.6857L8.29389 13.5332C8.11865 13.4059 7.88135 13.4059 7.70611 13.5332L3.3671 16.6857C2.97524 16.9704 2.448 16.5873 2.59768 16.1266L4.25503 11.0258C4.32197 10.8198 4.24864 10.5941 4.07339 10.4668L-0.265616 7.31434C-0.657473 7.02964 -0.456085 6.40983 0.0282775 6.40983H5.39159C5.6082 6.40983 5.80018 6.27035 5.86712 6.06434L7.52447 0.963525Z" fill={color} />
    </Svg>
)

const HeartIcon = ({ filled = false }) => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
            fill={filled ? "#ff4458" : "transparent"}
            stroke={filled ? "#ff4458" : "#fff"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)

const CloseIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
            d="M18 6L6 18M6 6l12 12"
            stroke="#fff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)



const copperProducts = [
    {
        id: 1,
        name: "AquaHome Copper Pro",
        subtitle: "Premium Copper-Infused Water Purifier",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn8Xq0NZjLTnruHqThxvgDdGZ72-pTxzgjv101iAqgcS8nLTbdx-6cEVHNnJe-z1_WJ3aPsphBitkQWb25laSSnAhhnfgJ-n3ORNQ8pCFJju8wIHyROOcuIcLvQxHJMg6ijpvWsdeiNKxBVRH_AF1u2ivHOLqrOA23P56PWbbJOirVyHNtO73WdPcdjHsquiPXD9VTYbze4lmBLhOL47CP5k3FKN1h89pl4s_H-ST4SxJJbU3AW7oP-V7Br-IP51QFY3egpE7ntA",
        price: "₹399",
        originalPrice: "₹499",
        rating: 4.8,
        reviews: "2.1k",
        features: ["Copper Infusion", "UV + UF", "7L Tank", "Smart Display"],
        gradient: ['#A45834', '#C57947', '#984D29']
    },
    {
        id: 2,
        name: "AquaHome Copper Elite",
        subtitle: "Advanced Copper Water Treatment System",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeNZNfVjMgkhHSKOvQyN9T11WD62lrh8xB80nx6nuazPZWxpyNjk7KADSIPd1UX7-M3A95YfjOHAv7-eVRsOkh-9DTlZYJFsGacmDMnaEk6w681sL1hJOJUtA-mPOCpJzwQVxBrwrDgbP2aUHfcNpu3duxe-YQnBdBXLVGM_xKSn7eeK6c0FU2EuNpIkL_WcxEqP3PfruOWQTY3zWBi8AErDDaOJ_gTWIHatWLb5NIkJfnUdWQZvglZBFSpI1F-uoZzdRn3BMr5A",
        price: "₹449",
        originalPrice: "₹599",
        rating: 4.9,
        reviews: "1.8k",
        features: ["Enhanced Copper", "RO + UV", "10L Tank", "App Control"],
        gradient: ['#A45834', '#C57947', '#984D29']
    },
    {
        id: 3,
        name: "AquaHome Copper Max",
        subtitle: "Maximum Copper Benefits Water Purifier",
        image: "https://images.pexels.com/photos/927437/pexels-photo-927437.jpeg",
        price: "₹549",
        originalPrice: "₹699",
        rating: 4.7,
        reviews: "1.5k",
        features: ["Max Copper", "Multi-Stage", "12L Tank", "Touch Panel"],
        gradient: ['#A45834', '#C57947', '#984D29']
    },
    {
        id: 4,
        name: "AquaHome Copper Classic",
        subtitle: "Traditional Copper Water Purification",
        image: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
        price: "₹349",
        originalPrice: "₹449",
        rating: 4.6,
        reviews: "2.3k",
        features: ["Pure Copper", "Basic RO", "8L Tank", "LED Indicators"],
        gradient: ['#A45834', '#C57947', '#984D29']
    }
]

const alkalineProducts = [
    {
        id: 5,
        name: "AquaHome Alkaline Pro",
        subtitle: "Advanced Alkaline Water System",
        image: "https://images.pexels.com/photos/1000084/pexels-photo-1000084.jpeg",
        price: "₹499",
        originalPrice: "₹649",
        rating: 4.9,
        reviews: "3.2k",
        features: ["pH 8.5-9.5", "Mineral Rich", "9L Tank", "Digital Display"],
        gradient: ['#058EFA', '#4FA8FF', '#0066CC']
    },
    {
        id: 6,
        name: "AquaHome Alkaline Elite",
        subtitle: "Premium Alkaline Water Purifier",
        image: "https://images.pexels.com/photos/927437/pexels-photo-927437.jpeg",
        price: "₹599",
        originalPrice: "₹799",
        rating: 4.8,
        reviews: "2.7k",
        features: ["pH 9.0-10.0", "Antioxidants", "11L Tank", "Smart Tech"],
        gradient: ['#058EFA', '#4FA8FF', '#0066CC']
    },
    {
        id: 7,
        name: "AquaHome Alkaline Max",
        subtitle: "Maximum Alkaline Benefits System",
        image: "https://images.pexels.com/photos/2544829/pexels-photo-2544829.jpeg",
        price: "₹699",
        originalPrice: "₹899",
        rating: 4.9,
        reviews: "1.9k",
        features: ["pH 10.0+", "Ultra Rich", "15L Tank", "Voice Control"],
        gradient: ['#058EFA', '#4FA8FF', '#0066CC']
    },
    {
        id: 8,
        name: "AquaHome Alkaline Basic",
        subtitle: "Essential Alkaline Water Purifier",
        image: "https://images.pexels.com/photos/416978/pexels-photo-416978.jpeg",
        price: "₹399",
        originalPrice: "₹529",
        rating: 4.6,
        reviews: "3.1k",
        features: ["pH Balanced", "Essential Minerals", "7L Tank", "Simple Controls"],
        gradient: ['#058EFA', '#4FA8FF', '#0066CC']
    }
]

const ProductCard = ({ product, isTop, onSwipe, index, totalCards }) => {
    const translateX = useSharedValue(0)
    const translateY = useSharedValue(0)
    const rotate = useSharedValue(0)
    const scale = useSharedValue(isTop ? 1 : 0.95)
    const opacity = useSharedValue(isTop ? 1 : 0.8)

    React.useEffect(() => {
        scale.value = withSpring(isTop ? 1 : 0.95)
        opacity.value = withTiming(isTop ? 1 : 0.8)
    }, [isTop])

    const panGesture = Gesture.Pan()
        .enabled(isTop)
        .onChange((event) => {
            translateX.value = event.translationX
            translateY.value = event.translationY
            rotate.value = interpolate(
                event.translationX,
                [-screenWidth / 2, 0, screenWidth / 2],
                [-15, 0, 15],
                Extrapolate.CLAMP
            )
        })
        .onEnd((event) => {
            const shouldSwipe = Math.abs(event.translationX) > screenWidth * 0.3

            if (shouldSwipe) {
                const direction = event.translationX > 0 ? 'right' : 'left'
                translateX.value = withTiming(
                    event.translationX > 0 ? screenWidth : -screenWidth,
                    { duration: 300 },
                    () => runOnJS(onSwipe)(direction)
                )
                translateY.value = withTiming(event.translationY, { duration: 300 })
                rotate.value = withTiming(
                    event.translationX > 0 ? 30 : -30,
                    { duration: 300 }
                )
            } else {
                translateX.value = withSpring(0)
                translateY.value = withSpring(0)
                rotate.value = withSpring(0)
            }
        })

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { translateX: translateX.value },
                { translateY: translateY.value },
                { rotate: `${rotate.value}deg` },
                { scale: scale.value },
            ],
            opacity: opacity.value,
            zIndex: totalCards - index,
        }
    })

    return (
        <GestureDetector gesture={panGesture}>
            <ReanimatedAnimated.View
                style={[
                    animatedStyle,
                    {
                        position: 'absolute',
                        top: 20,
                        left: 16,
                        right: 16,
                        width: screenWidth - 32,
                        height: screenHeight * 0.55,
                    }
                ]}
            >
                <View className="flex-1 bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Product Image */}
                    <View className="flex-1 relative">
                        <Image
                            source={{ uri: product.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                        
                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            className="absolute bottom-0 left-0 right-0 h-32"
                        />

                        {/* Like/Dislike Indicators */}
                        <ReanimatedAnimated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: 50,
                                    right: 30,
                                    backgroundColor: '#00ff88',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    transform: [{ rotate: '15deg' }],
                                },
                                {
                                    opacity: interpolate(
                                        translateX.value,
                                        [0, screenWidth * 0.3],
                                        [0, 1],
                                        Extrapolate.CLAMP
                                    ),
                                }
                            ]}
                        >
                            <Text className="text-white font-bold text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                LIKE
                            </Text>
                        </ReanimatedAnimated.View>

                        <ReanimatedAnimated.View
                            style={[
                                {
                                    position: 'absolute',
                                    top: 50,
                                    left: 30,
                                    backgroundColor: '#ff4458',
                                    paddingHorizontal: 20,
                                    paddingVertical: 10,
                                    borderRadius: 20,
                                    transform: [{ rotate: '-15deg' }],
                                },
                                {
                                    opacity: interpolate(
                                        translateX.value,
                                        [-screenWidth * 0.3, 0],
                                        [1, 0],
                                        Extrapolate.CLAMP
                                    ),
                                }
                            ]}
                        >
                            <Text className="text-white font-bold text-lg" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                                NOPE
                            </Text>
                        </ReanimatedAnimated.View>
                    </View>

                    {/* Product Details */}
                    <View className="absolute bottom-0 left-0 right-0 p-6">
                        <Text
                            className="text-white text-2xl mb-2"
                            style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                        >
                            {product.name}
                        </Text>
                        <Text
                            className="text-white/90 text-base mb-4"
                            style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                        >
                            {product.subtitle}
                        </Text>

                        {/* Rating and Price */}
                        <View className="flex-row justify-between items-center mb-4">
                            <View className="flex-row items-center">
                                <StarIcon />
                                <Text
                                    className="text-white ml-2 text-lg"
                                    style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                                >
                                    {product.rating} ({product.reviews})
                                </Text>
                            </View>
                            <View className="flex-row items-center">
                                <Text
                                    className="text-gray-400 text-lg line-through mr-2"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    {product.originalPrice}
                                </Text>
                                <Text
                                    className="text-white text-2xl"
                                    style={{ fontFamily: 'PlusJakartaSans-ExtraBold' }}
                                >
                                    {product.price}
                                </Text>
                            </View>
                        </View>

                        {/* Features */}
                        <View className="flex-row flex-wrap gap-2">
                            {product.features.map((feature, idx) => (
                                <View key={idx} className="bg-white/20 px-3 py-1 rounded-full">
                                    <Text
                                        className="text-white text-sm"
                                        style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                    >
                                        {feature}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ReanimatedAnimated.View>
        </GestureDetector>
    )
}

const SwipeHint = ({ visible }) => {
    const fadeAnim = React.useRef(new Animated.Value(1)).current
    const slideAnim = React.useRef(new Animated.Value(0)).current

    React.useEffect(() => {
        if (visible) {
            const animation = Animated.loop(
                Animated.sequence([
                    Animated.timing(slideAnim, {
                        toValue: 30,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: -30,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(slideAnim, {
                        toValue: 0,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ])
            )
            animation.start()

            // Hide hint after 5 seconds
            setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }).start()
            }, 5000)

            return () => animation.stop()
        }
    }, [visible])

    if (!visible) return null

    return (
        <Animated.View
            style={[
                {
                    position: 'absolute',
                    bottom: 120,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    opacity: fadeAnim,
                    zIndex: 1000,
                }
            ]}
        >
            <Animated.View
                style={[
                    {
                        backgroundColor: 'rgba(0,0,0,0.8)',
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 25,
                        flexDirection: 'row',
                        alignItems: 'center',
                        transform: [{ translateX: slideAnim }],
                    }
                ]}
            >
                <Text
                    className="text-white text-base mr-2"
                    style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                >
                    👈 Swipe to browse products 👉
                </Text>
            </Animated.View>
        </Animated.View>
    )
}
const Index = () => {
    const navigation = useNavigation()
    const [selectedTab, setSelectedTab] = useState('copper')
    const [currentIndex, setCurrentIndex] = useState(0)
    const [showHint, setShowHint] = useState(true)
    const [hasInteracted, setHasInteracted] = useState(false)

    const products = selectedTab === 'copper' ? copperProducts : alkalineProducts

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text className="text-3xl text-black text-left" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                    AquaHome
                </Text>
            ),
            headerTitleAlign: 'left',
            headerBackTitleVisible: false,
            headerLeft: () => <Pressable className='px-4' onPress={() => router.replace('/intialscreen')}>
                <BackIcon></BackIcon>
            </Pressable>
        });
    }, [navigation]);

    const handleSwipe = (direction) => {
        if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
        }
        setCurrentIndex(prev => {
            const newIndex = prev + 1
            if (newIndex >= products.length) {
                return 0 // Reset to first card
            }
            return newIndex
        })
    }

    const handleTabChange = (tab) => {
        setSelectedTab(tab)
        setCurrentIndex(0) // Reset to first card when tab changes
        setShowHint(true) // Show hint again for new tab
        setHasInteracted(false)
    }

    const handleSkip = () => {
        if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
        }
        handleSwipe('left')
    }

    const handleLike = () => {
        if (!hasInteracted) {
            setHasInteracted(true)
            setShowHint(false)
        }
        handleSwipe('right')
    }

    return (
        <GestureHandlerRootView className='flex-1 ' style={{backgroundColor:'white'}}>
            {/* Welcome Section */}
            <View className='flex flex-row items-center mb-6 p-4 bg-[#F8F9FE]'>
                <View className='w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-4'>
                    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                        <Path
                            d="M7.5 12l3 3 7-7"
                            stroke="white"
                            strokeWidth={2.5}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </Svg>
                </View>
                <View className='flex-1'>
                    <Text
                        className='text-lg text-black mb-1'
                        style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                    >
                        All set!
                    </Text>
                    <Text
                        className='text-base text-gray-500'
                        style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                    >
                        Welcome to the AquaHome family
                    </Text>
                </View>
            </View>

            {/* Tab Selection */}
            <View className='flex flex-row gap-x-2 px-4 bg-white mb-4'>
                {/* Copper Tab */}
                <View className="relative flex-1">
                    <Pressable
                        onPress={() => handleTabChange('copper')}
                        className={`h-[60px] rounded-2xl overflow-hidden ${selectedTab === 'copper' ? '' : 'border-[1.5px] border-[#4E4B66]'}`}
                    >
                        {selectedTab === 'copper' ? (
                            <LinearGradient
                                colors={['#A45834', '#C57947', '#984D29']}
                                locations={[0, 0.4, 1]}
                                className="flex-1 items-center justify-center"
                            >
                                <Text
                                    className="text-center text-lg text-white"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    AquaHome Copper
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View className="flex-1 items-center justify-center bg-[#F7F7FC]">
                                <Text
                                    className="text-center text-lg text-[#14142B]"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    AquaHome Copper
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    {selectedTab === 'copper' && (
                        <View
                            className="absolute -bottom-2 left-1/2 w-0 h-0"
                            style={{
                                transform: [{ translateX: -8 }],
                                borderLeftWidth: 8,
                                borderRightWidth: 8,
                                borderTopWidth: 8,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderTopColor: '#984D29',
                            }}
                        />
                    )}
                </View>

                {/* Alkaline Tab */}
                <View className="relative flex-1">
                    <Pressable
                        onPress={() => handleTabChange('ro')}
                        className={`h-[60px] rounded-2xl overflow-hidden ${selectedTab === 'ro' ? '' : 'border-[1.5px] border-[#4E4B66]'}`}
                    >
                        {selectedTab === 'ro' ? (
                            <LinearGradient
                                colors={['#058EFA', '#4FA8FF', '#0066CC']}
                                locations={[0, 0.4, 1]}
                                className="flex-1 items-center justify-center"
                            >
                                <Text
                                    className="text-center text-lg text-white"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    AquaHome Alkaline
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View className="flex-1 items-center justify-center bg-[#F7F7FC]">
                                <Text
                                    className="text-center text-lg text-[#14142B]"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    AquaHome Alkaline
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    {selectedTab === 'ro' && (
                        <View
                            className="absolute -bottom-2 left-1/2 w-0 h-0"
                            style={{
                                transform: [{ translateX: -8 }],
                                borderLeftWidth: 8,
                                borderRightWidth: 8,
                                borderTopWidth: 8,
                                borderLeftColor: 'transparent',
                                borderRightColor: 'transparent',
                                borderTopColor: '#0066CC',
                            }}
                        />
                    )}
                </View>
            </View>

            {/* Cards Stack */}
            <View className="flex-1 relative bg-white" style={{ minHeight: screenHeight * 0.6 }}>
                <SwipeHint visible={showHint && !hasInteracted} />
                {products.map((product, index) => {
                    const isVisible = index >= currentIndex && index < currentIndex + 3
                    if (!isVisible) return null

                    return (
                        <ProductCard
                            key={`${selectedTab}-${product.id}`}
                            product={product}
                            isTop={index === currentIndex}
                            onSwipe={handleSwipe}
                            index={index - currentIndex}
                            totalCards={Math.min(3, products.length - currentIndex)}
                        />
                    )
                })}

                {/* No more cards message */}
                {currentIndex >= products.length && (
                    <View className="flex-1 items-center justify-center px-8">
                        <Text
                            className="text-2xl text-center text-gray-600 mb-4"
                            style={{ fontFamily: 'PlusJakartaSans-Bold' }}
                        >
                            No more products!
                        </Text>
                        <Text
                            className="text-lg text-center text-gray-500 mb-8"
                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                        >
                            You've seen all {selectedTab === 'copper' ? 'copper' : 'alkaline'} products.
                        </Text>
                        <Pressable
                            onPress={() => setCurrentIndex(0)}
                            className="bg-[#4548B9] px-8 py-4 rounded-2xl"
                        >
                            <Text
                                className="text-white text-lg"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Start Over
                            </Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {/* Action Buttons */}
            {currentIndex < products.length && (
                <View className="flex-row justify-center items-center gap-8 pb-8 px-8">
                    <Pressable
                        onPress={handleSkip}
                        className="w-16 h-16 bg-white rounded-full items-center justify-center shadow-lg border border-gray-200"
                    >
                        <CloseIcon />
                    </Pressable>
                    
                    <Pressable
                        onPress={handleLike}
                        className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full items-center justify-center shadow-xl"
                        style={{
                            shadowColor: '#ff4458',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.3,
                            shadowRadius: 8,
                        }}
                    >
                        <HeartIcon filled />
                    </Pressable>
                </View>
            )}
        </GestureHandlerRootView>
    )
}

export default Index