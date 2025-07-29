import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

interface GlobalLoaderProps {
  isVisible: boolean;
  message?: string;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({ 
  isVisible, 
  message = "Processing..." 
}) => {
  if (!isVisible) return null;

  return (
    <View className="absolute inset-0 bg-black/50 z-50 flex items-center justify-center">
      <View className="bg-white rounded-2xl p-6 items-center min-w-[200px]">
        <ActivityIndicator size="large" color="#1a1a1a" />
        <Text
          className="mt-4 text-base text-black text-center"
          style={{ fontFamily: 'PlusJakartaSans-Medium' }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
};