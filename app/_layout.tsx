import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
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
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export function RootLayoutNav() {
  useFrameworkReady()
  const colorScheme = useColorScheme();
  const { isLoading, isAuthenticated } = useAuth();
  const [loaded, error] = useFonts({
    'PlusJakartaSans-Regular': PlusJakartaSans_400Regular,
    'PlusJakartaSans-Medium': PlusJakartaSans_500Medium,
    'PlusJakartaSans-SemiBold': PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold': PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold': PlusJakartaSans_800ExtraBold,
  });
  const { shouldShow, hideModal } = useNotificationPermissionModal();


  if (!loaded && !error) {
    return null;
  }




  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
     <SafeAreaProvider style={{ flex: 1, paddingBottom: 0,backgroundColor:'white' }}>

        <ThemeProvider value={colorScheme === 'dark' ? DefaultTheme : DefaultTheme}>


          <SheetProvider>
            <Stack initialRouteName='(connect)'>
              <Stack.Screen name='(connect)' options={{ headerShown: false }}></Stack.Screen>
              <Stack.Screen name="(newuser)" options={{ headerShown: false }} />
              <Stack.Screen name='(auth)' options={{ headerShown: false }}></Stack.Screen>

              <Stack.Screen name='intialscreen' options={{ headerShown: false }} ></Stack.Screen>
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