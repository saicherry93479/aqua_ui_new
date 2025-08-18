import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

import {
  getAuth,
  signInWithPhoneNumber,
  signOut
} from '@react-native-firebase/auth';
import { router } from 'expo-router';
import { apiService } from '@/api/api';
import { PushNotificationService } from '@/utils/PushNotificationService';

export enum UserRole {
  CUSTOMER = 'customer',
}

export interface User {
  id: string;
  phone: string;
  role: UserRole;
  customerType: UserRole;
  franchiseId?: string;
  franchiseName?: string;
  permissions: string[];
  hasOnboarded: boolean;
  name: string;
  email?: string;
  avatar?: string;
  address?: string;
  alternativePhone?: string
}

export interface ViewAsState {
  isViewingAs: boolean;
  originalUser: User | null;
  currentViewRole: UserRole | null;
  targetFranchiseId?: string;
  targetUserId?: string;
  targetFranchiseName?: string;
  targetUserName?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  viewAsState: ViewAsState;

  // Auth methods
  sendOTP: (phoneNumber: string, customerType: UserRole) => Promise<any>;
  verifyOTP: (otp: string, role: string) => Promise<{
    nextScreen: string;
    success: boolean;
  }>;
  logout: () => Promise<void>;

  // Refresh user data
  refreshUser: () => Promise<void>;
  setUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [confirmation, setConfirmation] = useState<any>(null);
  const [viewAsState, setViewAsState] = useState<ViewAsState>({
    isViewingAs: false,
    originalUser: null,
    currentViewRole: null,
  });

  const isAuthenticated = !!user;
  const pushNotificationService = PushNotificationService.getInstance();

  useEffect(() => {
    initializeAuth();
    const listeners = pushNotificationService.setupNotificationListeners();
  }, []);

  useEffect(() => {
    if (user) {
      // Initialize push notifications after successful login
      pushNotificationService.initializePushNotifications();
    }
  }, [user]);

  const initializeAuth = async () => {
    try {
      const [accessToken, userProfile, viewAsData] = await AsyncStorage.multiGet([
        'accessToken',
        'userProfile',
        'viewAsState'
      ]);

      if (accessToken[1] && userProfile[1]) {
        const parsedUser = JSON.parse(userProfile[1]);

        if (viewAsData[1]) {
          const parsedViewAs = JSON.parse(viewAsData[1]);
          setViewAsState(parsedViewAs);
        }

        // Set user first to prevent auth screen from showing
        setUser(parsedUser);

        // Validate token with backend
        try {
          await refreshUser();
        } catch (error) {
          // If refresh fails during initialization, clear everything
          console.log('Token validation failed during initialization');
          await clearAuthData();
          setUser(null);
          setViewAsState({
            isViewingAs: false,
            originalUser: null,
            currentViewRole: null,
          });
        }
      }
    } catch (error) {
      console.log('Auth initialization error:', error);
      await clearAuthData();
    } finally {
      // Only set loading false after everything is complete
      setIsLoading(false);
    }
  };

  const sendOTP = async (phoneNumber: string, customerType: UserRole = UserRole.CUSTOMER): Promise<any> => {
    try {
      console.log('=== Starting OTP Process ===');
      console.log('Phone number:', phoneNumber);
      console.log('Customer type:', customerType);
      console.log('Platform:', Platform.OS);

      // Validate phone number format
      if (!phoneNumber || phoneNumber.replace(/\D/g, '').length !== 10) {
        Alert.alert(
          'Invalid Phone Number',
          'Please enter a valid 10-digit phone number'
        );
        return null;
      }

      const formattedPhone = '+91' + phoneNumber.replace(/\D/g, '');
      console.log('Formatted phone:', formattedPhone);

      const confirmation = await signInWithPhoneNumber(
        getAuth(),
        formattedPhone,
      );

      console.log('=== OTP Sent Successfully ===');
      setConfirmation(confirmation);
      // return confirmation;


    } catch (error: any) {
      console.log('=== OTP Error ===');
      console.log('Error details:', error);

      const errorCode = error?.code;
      const errorMessage = error?.message;

      let userFriendlyTitle = 'Error';
      let userFriendlyMessage = 'Unable to send OTP. Please try again.';

      switch (errorCode) {
        case 'auth/too-many-requests':
          userFriendlyTitle = 'Too Many Attempts';
          userFriendlyMessage = 'You have made too many OTP requests. Please wait 15-30 minutes before trying again.';
          break;

        case 'auth/quota-exceeded':
          userFriendlyTitle = 'Service Temporarily Unavailable';
          userFriendlyMessage = 'Daily SMS limit reached. Please try again tomorrow or contact support.';
          break;

        case 'auth/invalid-phone-number':
          userFriendlyTitle = 'Invalid Phone Number';
          userFriendlyMessage = 'Please enter a valid Indian phone number (10 digits).';
          break;

        case 'auth/missing-phone-number':
          userFriendlyTitle = 'Phone Number Required';
          userFriendlyMessage = 'Please enter your phone number to continue.';
          break;

        case 'auth/captcha-check-failed':
          userFriendlyTitle = 'Verification Failed';
          userFriendlyMessage = 'Security verification failed. Please try again.';
          break;

        case 'auth/web-storage-unsupported':
          userFriendlyTitle = 'Browser Not Supported';
          userFriendlyMessage = 'Please use a supported browser or try the mobile app.';
          break;

        case 'auth/network-request-failed':
          userFriendlyTitle = 'Network Error';
          userFriendlyMessage = 'Please check your internet connection and try again.';
          break;

        case 'auth/app-deleted':
        case 'auth/app-not-authorized':
        case 'auth/invalid-api-key':
        case 'auth/invalid-app-credential':
          userFriendlyTitle = 'App Error';
          userFriendlyMessage = 'There\'s an issue with the app. Please update the app or contact support.';
          break;

        case 'auth/operation-not-allowed':
          userFriendlyTitle = 'Feature Unavailable';
          userFriendlyMessage = 'Phone authentication is temporarily unavailable. Please contact support.';
          break;

        case 'auth/user-disabled':
          userFriendlyTitle = 'Account Suspended';
          userFriendlyMessage = 'Your account has been suspended. Please contact support for assistance.';
          break;

        case 'auth/invalid-user-token':
        case 'auth/user-token-expired':
        case 'auth/requires-recent-login':
          userFriendlyTitle = 'Session Expired';
          userFriendlyMessage = 'Please close and reopen the app, then try again.';
          break;

        case 'auth/timeout':
          userFriendlyTitle = 'Request Timeout';
          userFriendlyMessage = 'The request took too long. Please check your connection and try again.';
          break;

        case 'auth/missing-app-credential':
          userFriendlyTitle = 'App Configuration Error';
          userFriendlyMessage = 'App is not properly configured. Please contact support.';
          break;

        case 'auth/invalid-app-id':
          userFriendlyTitle = 'App ID Error';
          userFriendlyMessage = 'Invalid app configuration. Please update the app.';
          break;

        case 'auth/recaptcha-not-enabled':
          userFriendlyTitle = 'Security Feature Required';
          userFriendlyMessage = 'Security verification is required but not enabled. Please contact support.';
          break;

        case 'auth/missing-recaptcha-token':
          userFriendlyTitle = 'Security Verification Failed';
          userFriendlyMessage = 'Security verification incomplete. Please try again.';
          break;

        default:
          if (errorMessage?.toLowerCase().includes('network')) {
            userFriendlyTitle = 'Connection Problem';
            userFriendlyMessage = 'Unable to connect to our servers. Please check your internet connection.';
          } else if (errorMessage?.toLowerCase().includes('timeout')) {
            userFriendlyTitle = 'Slow Connection';
            userFriendlyMessage = 'Your connection is slow. Please try again with a better network.';
          } else if (errorMessage?.toLowerCase().includes('firebase')) {
            userFriendlyTitle = 'Service Error';
            userFriendlyMessage = 'Our authentication service is having issues. Please try again in a few minutes.';
          } else {
            userFriendlyTitle = 'Unexpected Error';
            userFriendlyMessage = 'Something unexpected happened. Please try again or contact support.';
          }

          if (__DEV__) {
            console.warn('Unknown Firebase Auth Error:', {
              code: errorCode,
              message: errorMessage,
              platform: Platform.OS,
              fullError: error
            });
          }
          break;
      }

      const alertButtons = [
        {
          text: 'OK',
          style: 'default' as const,
        }
      ];

      if ([
        'auth/network-request-failed',
        'auth/timeout',
        'auth/internal-error',
        'auth/captcha-check-failed'
      ].includes(errorCode)) {
        alertButtons.push({
          text: 'Retry',
          style: 'default' as const,
          onPress: () => {
            setTimeout(() => {
              sendOTP(phoneNumber, customerType);
            }, 1000);
          },
        });
      }

      Alert.alert(userFriendlyTitle, userFriendlyMessage, alertButtons);
      throw error;
    }
  };

  const verifyOTP = async (otp: string, role: string): Promise<{
    nextScreen: string;
    success: boolean;
  }> => {
    try {
      setIsLoading(true);
      if (!confirmation) {
        throw new Error('No OTP confirmation found. Please request a new OTP.');
      }

      const result = await confirmation.confirm(otp);
      const idToken = await result.user.getIdToken();

      console.log('OTP verification successful, sending to backend...');

      const response = await apiService.post('/auth/login', {
        idToken,
        role: 'customer'
      });

      console.log('Backend login response:', response);

      if (response.success) {
        const { accessToken, refreshToken, user: userData } = response.data;

        console.log('userData', userData);

        await AsyncStorage.multiSet([
          ['accessToken', accessToken],
          ['refreshToken', refreshToken],
          ['userProfile', JSON.stringify(userData)],
        ]);

        setUser(userData);
        setConfirmation(null);

        let nextScreen = userData ? '/intialscreen' : '/';

        return {
          nextScreen: nextScreen,
          success: true,
        };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error: any) {
      console.log('Verify OTP error:', error);
      setConfirmation(null);

      if (error.code === 'auth/invalid-verification-code') {
        throw new Error('Invalid OTP. Please check the code and try again.');
      } else if (error.code === 'auth/code-expired') {
        throw new Error('OTP has expired. Please request a new code.');
      } else {
        throw new Error(error.message || 'OTP verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut(getAuth());
      await clearAuthData();

      setUser(null);
      setConfirmation(null);
      setViewAsState({
        isViewingAs: false,
        originalUser: null,
        currentViewRole: null,
      });
      router.replace('/(auth)');
    } catch (error) {
      console.log('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuthData = async () => {
    await AsyncStorage.multiRemove([
      'accessToken',
      'refreshToken',
      'userProfile',
      'viewAsState'
    ]);
  };

  const refreshUser = async () => {
    try {
      const response = await apiService.get('/auth/me');
      console.log('response in refreshuser ', response);

      if (response.success) {
        const updatedUser = {
          ...response.data.user,
          hasOnboarded: response.data.user.hasOnboarded,
        };

        setUser(updatedUser);

        // Update AsyncStorage with fresh user data
        await AsyncStorage.setItem('userProfile', JSON.stringify(updatedUser));

        // Only navigate if we're not already on the right screen
        // Remove automatic navigation from refreshUser to prevent conflicts
        // Let the RootLayout handle navigation based on auth state

      } else {
        throw new Error('Failed to refresh user data');
      }
    } catch (error: any) {
      console.log('Refresh user error:', error);

      await clearAuthData();
      setUser(null);
      setViewAsState({
        isViewingAs: false,
        originalUser: null,
        currentViewRole: null,
      });

      // Only navigate to auth if we're not already there
      router.replace('/(auth)');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    viewAsState,
    sendOTP,
    verifyOTP,
    logout,
    refreshUser,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};