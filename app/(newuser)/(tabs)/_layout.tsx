import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { Path } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const NormalrequestIcon = () => <Svg

    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M3 9.11v5.77C3 17 3 17 5 18.35l5.5 3.18c.83.48 2.18.48 3 0l5.5-3.18c2-1.35 2-1.35 2-3.46V9.11C21 7 21 7 19 5.65l-5.5-3.18c-.82-.48-2.17-.48-3 0L5 5.65C3 7 3 7 3 9.11z"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    />
    <Path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</Svg>

const FillRequestIcon = ({ color = "#292D32" }) => (
    <Svg
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
    >
        <Path
            d="M18.94 5.42l-5.17-2.99c-.99-.57-2.54-.57-3.53 0L5.02 5.44c-2.07 1.4-2.19 1.61-2.19 3.84v5.43c0 2.23.12 2.45 2.23 3.87l5.17 2.99c.5.29 1.14.43 1.77.43.63 0 1.27-.14 1.76-.43l5.22-3.01c2.07-1.4 2.19-1.61 2.19-3.84V9.28c0-2.23-.12-2.44-2.23-3.86zM12 15.25c-1.79 0-3.25-1.46-3.25-3.25S10.21 8.75 12 8.75s3.25 1.46 3.25 3.25-1.46 3.25-3.25 3.25z"
            fill={color}
        />
    </Svg>
);

const ProfileNormalIcon = () => <Svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M12.16 10.87c-.1-.01-.22-.01-.33 0a4.42 4.42 0 01-4.27-4.43C7.56 3.99 9.54 2 12 2a4.435 4.435 0 01.16 8.87zM7.16 14.56c-2.42 1.62-2.42 4.26 0 5.87 2.75 1.84 7.26 1.84 10.01 0 2.42-1.62 2.42-4.26 0-5.87-2.74-1.83-7.25-1.83-10.01 0z"
        stroke="#292D32"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
    />
</Svg>


const ProfileFillIcon = ({ color = "#292D32" }) => <Svg

    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M12 2C9.38 2 7.25 4.13 7.25 6.75c0 2.57 2.01 4.65 4.63 4.74.08-.01.16-.01.22 0h.07a4.738 4.738 0 004.58-4.74C16.75 4.13 14.62 2 12 2zM17.08 14.15c-2.79-1.86-7.34-1.86-10.15 0-1.27.85-1.97 2-1.97 3.23s.7 2.37 1.96 3.21C8.32 21.53 10.16 22 12 22c1.84 0 3.68-.47 5.08-1.41 1.26-.85 1.96-1.99 1.96-3.23-.01-1.23-.7-2.37-1.96-3.21z"
        fill={color}
    />
</Svg>




const HomeIcon = ({ color = "#292D32" }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M2 22h20"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M2.95 22L3 9.97c0-.61.29-1.19.77-1.57l7-5.45c.72-.56 1.73-.56 2.46 0l7 5.44c.49.38.77.96.77 1.58V22"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinejoin="round"
        />
        <Path
            d="M13 17h-2c-.83 0-1.5.67-1.5 1.5V22h5v-3.5c0-.83-.67-1.5-1.5-1.5zM9.5 13.75h-2c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1zM16.5 13.75h-2c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1z"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinejoin="round"
        />
        <Path
            d="M19 7l-.03-3h-4.4"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const HomeFillIcon = ({ color = "#292D32" }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M22 21.25h-1V9.98c0-.62-.28-1.2-.77-1.58L19 7.44l-.02-2.45c0-.55-.45-.99-1-.99h-3.41l-1.34-1.04c-.72-.57-1.74-.57-2.46 0l-7 5.44c-.49.38-.77.96-.77 1.57l-.05 11.28H2c-.41 0-.75.34-.75.75s.34.75.75.75h20c.41 0 .75-.34.75-.75s-.34-.75-.75-.75zm-15.5-8.5v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1zm8 8.5h-5V18.5c0-.83.67-1.5 1.5-1.5h2c.83 0 1.5.67 1.5 1.5v2.75zm3-8.5c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-1.5c0-.55.45-1 1-1h2c.55 0 1 .45 1 1v1.5z"
            fill={color}
        />
    </Svg>
);

export default function TabLayout() {
    const colorScheme = useColorScheme();
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#254292',
                tabBarInactiveTintColor: '#8E8E93',

                tabBarButton: HapticTab,
                tabBarBackground: TabBarBackground,
                tabBarLabelStyle: {
                    fontFamily: 'PlusJakartaSans-SemiBold',
                    fontSize: 12,
                    marginTop: 4,
                 

                },
                tabBarStyle: Platform.select({
                    ios: {
                        position: 'absolute',
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderTopWidth: 0,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        elevation: 5,
                        paddingTop: 5,
                    },
                    android: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderTopWidth: 0,
                        elevation: 8,
                        shadowColor: '#000',
                        shadowOffset: {
                            width: 0,
                            height: -2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 3,
                        paddingTop: 5,
                    },
                    default: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        borderTopWidth: 0,
                        paddingTop: 5,
                    },
                }),
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused, color }) =>
                        focused ? <HomeFillIcon color={color} /> : <HomeIcon color={color} />,
                    headerShadowVisible: false
                }}
            />
            <Tabs.Screen
                name="requests"
                options={{
                    title: 'Requests',
                    tabBarIcon: ({ focused, color }) =>
                        focused ? <FillRequestIcon color={color} /> : <NormalrequestIcon />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused, color }) =>
                        focused ? <ProfileFillIcon color={color} /> : <ProfileNormalIcon />,
                }}
            />
        </Tabs>
    );
}