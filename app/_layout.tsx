import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';
import 'react-native-get-random-values';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { SheetProvider } from 'react-native-actions-sheet';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext'
import { NotificationPermissionModal, useNotificationPermissionModal } from '@/components/NotificationModal';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Loading Screen Component
const LoadingScreen: React.FC = () => {
  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#FFFFFF' 
    }}>
      <ActivityIndicator size="large" color="#007AFF" />
      <StatusBar style="dark" backgroundColor="#ffffff" />
    </View>
  );
};

function useProtectedRoute(user: any, isLoading: boolean) {
  const segments = useSegments();

  useEffect(() => {
    // Don't do anything while loading
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inConnectGroup = segments[0] === '(connect)';
    const inNewUserGroup = segments[0] === '(newuser)';
    const onInitialScreen = segments.includes('intialscreen');

    if (!user) {
      // User is not authenticated
      if (!inAuthGroup && !inConnectGroup) {
        // Redirect to auth if not already there
        router.replace('/(auth)');
      }
    } else {
      // User is authenticated
      if (inAuthGroup || inConnectGroup) {
        // Redirect authenticated user away from auth screens
        router.replace('/intialscreen');
      }
    }
  }, [user, segments, isLoading]);
}

export function RootLayoutNav() {
  useFrameworkReady();
  const colorScheme = useColorScheme();
  const { isLoading, user } = useAuth();
  
  // Use the protected route hook
  useProtectedRoute(user, isLoading);
  
  const [loaded, error] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  });
  const { shouldShow, hideModal } = useNotificationPermissionModal();

  if (!loaded && !error) {
    return <LoadingScreen />;
  }

  // Show loading screen while auth is initializing
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={{ flex: 1, paddingBottom: 0, backgroundColor: 'white' }}>
        <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>
          <SheetProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'none', // Disable animations to prevent flicker
              }}
            >
              <Stack.Screen name='(connect)' />
              <Stack.Screen name="(newuser)" />
              <Stack.Screen name='(auth)' />
              <Stack.Screen name='intialscreen' />
              <Stack.Screen name="+not-found" />
            </Stack>
            <StatusBar style="dark" backgroundColor="#ffffff" />
            <NotificationPermissionModal
              visible={shouldShow}
              onClose={hideModal}
            />
          </SheetProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <RootLayoutNav />
      </SubscriptionProvider>
    </AuthProvider>
  );
}