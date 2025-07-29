import React, { useState } from 'react';
import ActionSheet, { SheetManager } from 'react-native-actions-sheet';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  Keyboard,
} from 'react-native';
import { X, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { GlobalLoader } from '../GlobalLoader';

interface CancelSubscriptionActionSheetProps {
  sheetId: string;
  payload?: {
    onCancel: (reason: string) => void;
  };
}

export function CancelSubscriptionActionSheet({ sheetId, payload }: CancelSubscriptionActionSheetProps) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleClose = () => {
    Keyboard.dismiss();
    SheetManager.hide(sheetId);
    // Reset state when closing
    setReason('');
    setIsLoading(false);
  };

  const handleCancel = async () => {
    if (!reason.trim()) {
      Alert.alert('Error', 'Please provide a reason for cancellation');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (payload?.onCancel) {
        payload.onCancel(reason.trim());
      }

      setIsSubmitted(true);
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ActionSheet
      id={sheetId}
      containerStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
      }}
      closable={true}
    >
      <View className="relative bg-white">
        <GlobalLoader isVisible={isLoading} message="Submitting cancellation request..." />

        <View className="px-6 py-8">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-1">
              <Text
                className="text-xl text-center text-black"
                style={{ fontFamily: 'PlusJakartaSans-Bold' }}
              >
                {isSubmitted ? 'Request Submitted' : 'Cancel Subscription'}
              </Text>
            </View>

            <TouchableOpacity onPress={handleClose} className="p-2">
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          {!isSubmitted ? (
            <>
              {/* Warning */}
              <View className="bg-orange-50 rounded-xl p-4 mb-6 border border-orange-200">
                <View className="flex-row items-start gap-3">
                  <AlertTriangle size={24} color="#f97316" />
                  <View className="flex-1">
                    <Text className="text-orange-900 mb-2" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                      Important Notice
                    </Text>
                    <Text className="text-orange-800 text-sm leading-5" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                      • Cancellation will take effect from your next billing cycle{'\n'}
                      • You'll continue to have access until the current period ends{'\n'}
                      • Our team will contact you within 24-48 hours{'\n'}
                      • Equipment pickup will be scheduled after confirmation
                    </Text>
                  </View>
                </View>
              </View>

              {/* Reason Input */}
              <View className="mb-6">
                <Text className="text-lg text-gray-900 mb-3" style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}>
                  Reason for Cancellation
                </Text>
                <TextInput
                  className="bg-gray-50 rounded-xl p-4 text-gray-900 min-h-[120px] border border-gray-200"
                  style={{
                    fontFamily: 'PlusJakartaSans-Regular',
                    textAlignVertical: 'top'
                  }}
                  placeholder="Please tell us why you want to cancel your subscription. Your feedback helps us improve our service."
                  placeholderTextColor="#9CA3AF"
                  value={reason}
                  onChangeText={setReason}
                  multiline
                  numberOfLines={5}
                />
              </View>

              {/* Action Buttons */}
              <View className="gap-3">
                <TouchableOpacity
                  className={`py-4 rounded-xl ${
                    reason.trim() ? 'bg-red-600' : 'bg-gray-300'
                  }`}
                  onPress={handleCancel}
                  disabled={!reason.trim() || isLoading}
                >
                  <Text
                    className={`text-center text-base ${
                      reason.trim() ? 'text-white' : 'text-gray-500'
                    }`}
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Submit Cancellation Request
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="py-4 rounded-xl bg-gray-100"
                  onPress={handleClose}
                >
                  <Text
                    className="text-center text-base text-gray-700"
                    style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                  >
                    Keep My Subscription
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Submitted State */
            <View className="items-center py-8">
              <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-6">
                <Text className="text-green-600 text-2xl">✓</Text>
              </View>

              <Text className="text-xl text-gray-900 mb-4 text-center" style={{ fontFamily: 'PlusJakartaSans-Bold' }}>
                Cancellation Request Submitted
              </Text>

              <Text className="text-gray-600 text-center mb-8 leading-6" style={{ fontFamily: 'PlusJakartaSans-Regular' }}>
                Thank you for your feedback. Our team will review your request and contact you within 24-48 hours to discuss the next steps.
              </Text>

              <TouchableOpacity
                className="w-full py-4 rounded-xl bg-[#4548b9]"
                onPress={handleClose}
              >
                <Text
                  className="text-center text-base text-white"
                  style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                >
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ActionSheet>
  );
}