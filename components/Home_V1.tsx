import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    Text,
    View
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

const BackIcon = () => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M9.57 5.93L3.5 12l6.07 6.07M20.5 12H3.67"
            stroke="#292D32"
            strokeWidth={2}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const StarIcon = ({ color = "#D86A00" }) => (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <Path d="M6.61958 1.17082C6.73932 0.802295 7.26068 0.802296 7.38042 1.17082L8.70631 5.25147C8.75986 5.41628 8.91344 5.52786 9.08673 5.52786H13.3774C13.7649 5.52786 13.926 6.02371 13.6125 6.25147L10.1413 8.77345C10.0011 8.87531 9.94243 9.05586 9.99598 9.22066L11.3219 13.3013C11.4416 13.6698 11.0198 13.9763 10.7063 13.7485L7.23511 11.2265C7.09492 11.1247 6.90508 11.1247 6.76489 11.2265L3.29368 13.7485C2.98019 13.9763 2.5584 13.6698 2.67814 13.3013L4.00402 9.22067C4.05757 9.05586 3.99891 8.87531 3.85872 8.77345L0.387506 6.25147C0.0740204 6.02371 0.235132 5.52786 0.622621 5.52786H4.91327C5.08656 5.52786 5.24014 5.41628 5.29369 5.25147L6.61958 1.17082Z" fill={color} />
    </Svg>
);

const copperProducts = [
    {
        id: 1,
        name: "AquaHome Copper Pro",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCn8Xq0NZjLTnruHqThxvgDdGZ72-pTxzgjv101iAqgcS8nLTbdx-6cEVHNnJe-z1_WJ3aPsphBitkQWb25laSSnAhhnfgJ-n3ORNQ8pCFJju8wIHyROOcuIcLvQxHJMg6ijpvWsdeiNKxBVRH_AF1u2ivHOLqrOA23P56PWbbJOirVyHNtO73WdPcdjHsquiPXD9VTYbze4lmBLhOL47CP5k3FKN1h89pl4s_H-ST4SxJJbU3AW7oP-V7Br-IP51QFY3egpE7ntA",
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
        image: "https://AquaHome.in/app/assets/4-mineral-mob-black-production.webp",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeNZNfVjMgkhHSKOvQyN9T11WD62lrh8xB80nx6nuazPZWxpyNjk7KADSIPd1UX7-M3A95YfjOHAv7-eVRsOkh-9DTlZYJFsGacmDMnaEk6w681sL1hJOJUtA-mPOCpJzwQVxBrwrDgbP2aUHfcNpu3duxe-YQnBdBXLVGM_xKSn7eeK6c0FU2EuNpIkL_WcxEqP3PfruOWQTY3zWBi8AErDDaOJ_gTWIHatWLb5NIkJfnUdWQZvglZBFSpI1F-uoZzdRn3BMr5A",
        price: "₹349",
        originalPrice: "₹449",
        rating: 4.6,
        reviews: "2.3k",
        features: ["Pure Copper", "Basic RO", "8L Tank", "LED Indicators"],
        gradient: ['#A45834', '#C57947', '#984D29']
    }
];

const alkalineProducts = [
    {
        id: 5,
        name: "AquaHome Alkaline Pro",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeNZNfVjMgkhHSKOvQyN9T11WD62lrh8xB80nx6nuazPZWxpyNjk7KADSIPd1UX7-M3A95YfjOHAv7-eVRsOkh-9DTlZYJFsGacmDMnaEk6w681sL1hJOJUtA-mPOCpJzwQVxBrwrDgbP2aUHfcNpu3duxe-YQnBdBXLVGM_xKSn7eeK6c0FU2EuNpIkL_WcxEqP3PfruOWQTY3zWBi8AErDDaOJ_gTWIHatWLb5NIkJfnUdWQZvglZBFSpI1F-uoZzdRn3BMr5A",
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
        image: "https://AquaHome.in/app/assets/5-mineral-mob-white-production.webp",
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
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCeNZNfVjMgkhHSKOvQyN9T11WD62lrh8xB80nx6nuazPZWxpyNjk7KADSIPd1UX7-M3A95YfjOHAv7-eVRsOkh-9DTlZYJFsGacmDMnaEk6w681sL1hJOJUtA-mPOCpJzwQVxBrwrDgbP2aUHfcNpu3duxe-YQnBdBXLVGM_xKSn7eeK6c0FU2EuNpIkL_WcxEqP3PfruOWQTY3zWBi8AErDDaOJ_gTWIHatWLb5NIkJfnUdWQZvglZBFSpI1F-uoZzdRn3BMr5A",
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
        image: "https://AquaHome.in/app/assets/5-mineral-mob-white-production.webp",
        price: "₹399",
        originalPrice: "₹529",
        rating: 4.6,
        reviews: "3.1k",
        features: ["pH Balanced", "Essential Minerals", "7L Tank", "Simple Controls"],
        gradient: ['#058EFA', '#4FA8FF', '#0066CC']
    }
];

const ProductCard = ({ product, onPress }) => {
    return (
        <Pressable
        
            onPress={onPress}
            style={{
                marginBottom: 16,
                backgroundColor: 'white',
                borderRadius: 16 
                // borderRadius: 16,
                // shadowColor: '#000',
                // shadowOffset: { width: 0, height: 2 },
                // shadowOpacity: 0.1,
                // shadowRadius: 8,
                // elevation: 4,
            }}
        >
            <View style={{ overflow: 'hidden', borderRadius: 16 }}     className='border'>
                {/* Product Image */}
                <View style={{ position: 'relative', height: 280 }}>
                    <Image
                        source={{ uri: product.image }}
                        style={{
                            width: '100%',
                            height: 280,
                        }}
                        resizeMode="cover"
                    />
                </View>

                {/* Product Details */}
                <View style={{ padding: 20 }}>
                    <Text
                        style={{
                            fontFamily: 'PlusJakartaSans-ExtraBold',
                            fontSize: 20,
                            color: '#14142B',
                            marginBottom: 16,
                        }}
                    >
                        {product.name}
                    </Text>

                    {/* Pricing and CTA */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                <Text
                                    style={{
                                        fontFamily: 'PlusJakartaSans-ExtraBold',
                                        fontSize: 24,
                                        color: '#22C55E',
                                    }}
                                >
                                    {product.price}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: 'PlusJakartaSans-Regular',
                                        fontSize: 16,
                                        color: '#6E7191',
                                    }}
                                >
                                    /month
                                </Text>
                            </View>
                        </View>

                        <LinearGradient
                            colors={product.gradient}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 16,
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PlusJakartaSans-SemiBold',
                                    fontSize: 16,
                                    color: 'white',
                                }}
                            >
                                Rent Now
                            </Text>
                        </LinearGradient>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const Index = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('copper');

    const products = selectedTab === 'copper' ? copperProducts : alkalineProducts;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text
                    style={{
                        fontSize: 24,
                        color: 'black',
                        fontFamily: 'PlusJakartaSans-SemiBold'
                    }}
                >
                    AquaHome
                </Text>
            ),
            headerTitleAlign: 'left',
            headerBackTitleVisible: false,
            headerLeft: () => (
                <Pressable
                    style={{ paddingHorizontal: 16 }}
                    onPress={() => router.replace('/intialscreen')}
                >
                    <BackIcon />
                </Pressable>
            )
        });
    }, [navigation]);

    const handleProductPress = (product) => {
        // Navigate to product details
        console.log('Product pressed:', product.name);
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            {/* Welcome Section */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 24,
                padding: 16,
                backgroundColor: '#F8F9FE'
            }}>
                <View style={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#22C55E',
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 16
                }}>
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
                <View style={{ flex: 1 }}>
                    <Text
                        style={{
                            fontSize: 18,
                            color: 'black',
                            marginBottom: 4,
                            fontFamily: 'PlusJakartaSans-Bold'
                        }}
                    >
                        All set!
                    </Text>
                    <Text
                        style={{
                            fontSize: 16,
                            color: '#6B7280',
                            fontFamily: 'PlusJakartaSans-Regular'
                        }}
                    >
                        Welcome to the AquaHome family
                    </Text>
                </View>
            </View>

            {/* Tab Selection */}
            <View style={{
                flexDirection: 'row',
                gap: 8,
                paddingHorizontal: 16,
                backgroundColor: 'white',
                marginBottom: 16,
                position: 'relative'
            }}>
                {/* Copper Tab */}
                <View style={{ position: 'relative', flex: 1 }}>
                    <Pressable
                        onPress={() => setSelectedTab('copper')}
                        style={{
                            height: 60,
                            borderRadius: 16,
                            overflow: 'hidden',
                            borderWidth: selectedTab === 'copper' ? 0 : 1.5,
                            borderColor: selectedTab === 'copper' ? 'transparent' : '#4E4B66',
                        }}
                    >
                        {selectedTab === 'copper' ? (
                            <LinearGradient
                                colors={['#A45834', '#C57947', '#984D29']}
                                locations={[0, 0.4, 1]}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: 'white',
                                        fontFamily: 'PlusJakartaSans-SemiBold'
                                    }}
                                >
                                    AquaHome Copper
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F7F7FC'
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: '#14142B',
                                        fontFamily: 'PlusJakartaSans-Regular'
                                    }}
                                >
                                    AquaHome Copper
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    {selectedTab === 'copper' && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                width: 0,
                                height: 0,
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
                <View style={{ position: 'relative', flex: 1 }}>
                    <Pressable
                        onPress={() => setSelectedTab('alkaline')}
                        style={{
                            height: 60,
                            borderRadius: 16,
                            overflow: 'hidden',
                            borderWidth: selectedTab === 'alkaline' ? 0 : 1.5,
                            borderColor: selectedTab === 'alkaline' ? 'transparent' : '#4E4B66',
                        }}
                    >
                        {selectedTab === 'alkaline' ? (
                            <LinearGradient
                                colors={['#058EFA', '#4FA8FF', '#0066CC']}
                                locations={[0, 0.4, 1]}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: 'white',
                                        fontFamily: 'PlusJakartaSans-SemiBold'
                                    }}
                                >
                                    AquaHome Alkaline
                                </Text>
                            </LinearGradient>
                        ) : (
                            <View style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: '#F7F7FC'
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontSize: 16,
                                        color: '#14142B',
                                        fontFamily: 'PlusJakartaSans-Regular'
                                    }}
                                >
                                    AquaHome Alkaline
                                </Text>
                            </View>
                        )}
                    </Pressable>
                    {selectedTab === 'alkaline' && (
                        <View
                            style={{
                                position: 'absolute',
                                bottom: -8,
                                left: '50%',
                                width: 0,
                                height: 0,
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

            {/* Products List */}
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingBottom: 20,
                }}
                showsVerticalScrollIndicator={false}
            >
                {products.map((product) => (
                    <ProductCard
                        key={`${selectedTab}-${product.id}`}
                        product={product}
                        onPress={() => handleProductPress(product)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

export default Index;