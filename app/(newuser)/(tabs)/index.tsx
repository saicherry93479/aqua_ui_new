import { apiService } from '@/api/api';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useNavigation } from 'expo-router';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
    ActivityIndicator,
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

const ProductCard = ({ product, onPress }) => {
    return (
        <Pressable
            onPress={onPress}
            style={{
                marginBottom: 16,
                backgroundColor: 'white',
                borderRadius: 16
            }}
        >
            <View style={{ overflow: 'hidden', borderRadius: 16 }} className='border'>
                {/* Product Image */}
                <View style={{ position: 'relative', height: 280 }}>
                    <Image
                        source={{ uri: product.images && product.images.length > 0 ? product.images[0] : "" }}
                        style={{
                            width: '100%',
                            height: 280,
                        }}
                        resizeMode="contain"
                    />
                </View>

                {/* Product Details */}
                <View style={{ padding: 20 }}>
                    <Text
                        style={{
                            fontFamily: 'PlusJakartaSans-SemiBold',
                            fontSize: 18,
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
                                    ₹{product.rentPrice}
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

                        <View
                            // colors={['#254292', '#8d90f2', '#254292']}
                            style={{
                                paddingHorizontal: 20,
                                paddingVertical: 12,
                                borderRadius: 16,
                                backgroundColor: '#254292'
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: 'PlusJakartaSans-SemiBold',
                                    fontSize: 16,
                                    color: 'white',
                                }}
                            >
                                Rent/Buy
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

const Index = () => {
    const navigation = useNavigation();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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

    const fetchCategories = async () => {
        try {
            const response = await apiService.get('/categories/');
            if (response.data.categories && response.data.categories.length > 0) {
                const activeCategories = response.data.categories.filter(cat => cat.isActive);
                setCategories(activeCategories);
                // Set first category as selected by default
                if (activeCategories.length > 0) {
                    setSelectedCategory(activeCategories[0].id);
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await apiService.get('/products/');
            if (response.data.products) {
                const activeProducts = response.data.products.filter(product => product.isActive);
                setProducts(activeProducts);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const loadData = async () => {
        setIsLoading(true);
        await Promise.all([fetchCategories(), fetchProducts()]);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleProductPress = (product) => {
        console.log('Product pressed:', product.name);
        router.push(`/(newuser)/products/${product.id}`)
    };

    // Filter products by selected category
    const filteredProducts = selectedCategory
        ? products.filter(product => product.categoryId === selectedCategory)
        : products;

    if (isLoading) {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator size="large" color="#254292" />
                <Text style={{
                    marginTop: 16,
                    fontSize: 16,
                    color: '#6B7280',
                    fontFamily: 'PlusJakartaSans-Regular'
                }}>
                    Loading products...
                </Text>
            </View>
        );
    }

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

            {/* Horizontal Scrollable Categories */}
            <View style={{ marginBottom: 16 }}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        gap: 8,
                    }}
                >
                    {categories.map((category) => (
                        <View key={category.id} style={{ position: 'relative' }}>
                            <Pressable
                                onPress={() => setSelectedCategory(category.id)}
                                style={{
                                    height: 50,

                                    borderRadius: 18,
                                    overflow: 'hidden',
                                    borderWidth: selectedCategory === category.id ? 0 : 1.5,
                                    borderColor: selectedCategory === category.id ? 'transparent' : '#4E4B66',
                                    minWidth: 160,
                                }}
                            >
                                {selectedCategory === category.id ? (
                                    <View


                                        style={{
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                            backgroundColor: '#254292'
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
                                            {category.name}
                                        </Text>
                                    </View>
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
                                            {category.name}
                                        </Text>
                                    </View>
                                )}
                            </Pressable>
                            {selectedCategory === category.id && (
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
                                        borderTopColor: '#254292',
                                    }}
                                />

                            )}
                        </View>
                    ))}
                </ScrollView>
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
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onPress={() => handleProductPress(product)}
                        />
                    ))
                ) : (
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 40
                    }}>
                        <Text style={{
                            fontSize: 18,
                            color: '#6B7280',
                            fontFamily: 'PlusJakartaSans-Regular'
                        }}>
                            No products available
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Index;