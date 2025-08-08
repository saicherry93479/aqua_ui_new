import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useColorScheme } from '@/hooks/useColorScheme';
import Svg, { Path } from 'react-native-svg';

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

const RequestFillIcon = ({ color = "#292D32" }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M20.21 7.82l-7.7 4.46c-.31.18-.7.18-1.02 0L3.792 7.82c-.55-.32-.69-1.07-.27-1.54.29-.33.62-.6.97-.79l5.42-3c1.16-.65 3.04-.65 4.2 0l5.42 3c.35.19.68.47.97.79.4.47.26 1.22-.29 1.54zM11.431 14.14v6.82c0 .76-.77 1.26-1.45.93-2.06-1.01-5.53-2.9-5.53-2.9-1.22-.69-2.22-2.43-2.22-3.86V9.97c0-.79.83-1.29 1.51-.9l7.19 4.17c.3.19.5.53.5.9zM12.57 14.14v6.82c0 .76.77 1.26 1.45.93 2.06-1.01 5.53-2.9 5.53-2.9 1.22-.69 2.22-2.43 2.22-3.86V9.97c0-.79-.83-1.29-1.51-.9l-7.19 4.17c-.3.19-.5.53-.5.9z"
            fill={color}
        />
    </Svg>
);

const ProfileIcon = ({ color = "#292D32" }) => (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
        <Path
            d="M12 15a3 3 0 100-6 3 3 0 000 6z"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M2 12.88v-1.76c0-1.04.85-1.9 1.9-1.9 1.81 0 2.55-1.28 1.64-2.85-.52-.9-.21-2.07.7-2.59l1.73-.99c.79-.47 1.81-.19 2.28.6l.11.19c.9 1.57 2.38 1.57 3.29 0l.11-.19c.47-.79 1.49-1.07 2.28-.6l1.73.99c.91.52 1.22 1.69.7 2.59-.91 1.57-.17 2.85 1.64 2.85 1.04 0 1.9.85 1.9 1.9v1.76c0 1.04-.85 1.9-1.9 1.9-1.81 0-2.55 1.28-1.64 2.85.52.91.21 2.07-.7 2.59l-1.73.99c-.79.47-1.81.19-2.28-.6l-.11-.19c-.9-1.57-2.38-1.57-3.29 0l-.11.19c-.47.79-1.49 1.07-2.28.6l-1.73-.99a1.899 1.899 0 01-.7-2.59c.91-1.57.17-2.85-1.64-2.85-1.05 0-1.9-.86-1.9-1.9z"
            stroke={color}
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

const PaymentsNormalIcon = () => (
    <Svg

        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"

    >
        <Path
            d="M14.262 15.998h-5"
            stroke="#292D32"
            strokeWidth={1.5}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M12.66 2.518l-.03.07-2.9 6.73H6.88c-.68 0-1.33.14-1.92.39l1.75-4.18.04-.1.07-.16c.02-.06.04-.12.07-.17 1.31-3.03 2.79-3.72 5.77-2.58z"
            stroke="#292D32"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M18.05 9.518c-.45-.14-.93-.2-1.41-.2H9.73l2.9-6.73.03-.07c.15.05.29.12.44.18l2.21.93c1.23.51 2.09 1.04 2.61 1.68.1.12.18.23.25.36.09.14.16.28.2.43.04.09.07.18.09.26.27.84.11 1.87-.41 3.16z"
            stroke="#292D32"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M21.522 14.198v1.95c0 .2-.01.4-.02.6-.19 3.49-2.14 5.25-5.84 5.25h-7.8c-.24 0-.48-.02-.71-.05-3.18-.21-4.88-1.91-5.09-5.09-.03-.23-.05-.47-.05-.71v-1.95c0-2.01 1.22-3.74 2.96-4.49.6-.25 1.24-.39 1.92-.39h9.76c.49 0 .97.07 1.41.2 1.99.61 3.46 2.47 3.46 4.68z"
            stroke="#292D32"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6.71 5.528l-1.75 4.18A4.894 4.894 0 002 14.198v-2.93c0-2.84 2.02-5.21 4.71-5.74zM21.52 11.268v2.93c0-2.2-1.46-4.07-3.46-4.67.52-1.3.67-2.32.42-3.17-.02-.09-.05-.18-.09-.26 1.86.96 3.13 2.93 3.13 5.17z"
            stroke="#292D32"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);

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

const PsymnetsFillIcon = ({ color = "#292D32" }) => <Svg

    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"

>
    <Path
        d="M11.942 2.21l-2.41 5.61h-2.41c-.4 0-.79.03-1.17.11l1-2.4.04-.09.06-.16c.03-.07.05-.13.08-.18 1.16-2.69 2.46-3.53 4.81-2.89zM18.732 8.09l-.02-.01c-.6-.17-1.21-.26-1.83-.26h-6.26l2.25-5.23.03-.07c.14.05.29.12.44.17l2.21.93c1.23.51 2.09 1.04 2.62 1.68.09.12.17.23.25.36.09.14.16.28.2.43.04.09.07.17.09.26.15.51.16 1.09.02 1.74zM18.292 9.52c-.45-.13-.92-.2-1.41-.2h-9.76c-.68 0-1.32.13-1.92.39a4.894 4.894 0 00-2.96 4.49v1.95c0 .24.02.47.05.71.22 3.18 1.92 4.88 5.1 5.09.23.03.46.05.71.05h7.8c3.7 0 5.65-1.76 5.84-5.26.01-.19.02-.39.02-.59V14.2a4.9 4.9 0 00-3.47-4.68zm-3.79 7.23h-5c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h5c.41 0 .75.34.75.75s-.34.75-.75.75z"
        fill={color}
    />
</Svg>
export default function TabLayout() {


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
                    // headerShadowVisible: false
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
                name="payments"
                options={{
                    title: 'Payments',
                    tabBarIcon: ({ focused, color }) =>
                        focused ? <PsymnetsFillIcon color={color} /> : <PaymentsNormalIcon />,
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