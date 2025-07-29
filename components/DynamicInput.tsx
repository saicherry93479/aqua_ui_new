import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TextInputProps,
} from 'react-native';

interface DynamicInputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  borderRadius?: number;
  error?: string;
  validation?: (value: string) => string | null; // Return error message or null if valid
  containerStyle?: object;
  inputStyle?: object;
  labelStyle?: object;
  errorStyle?: object;
}

export const DynamicInput: React.FC<DynamicInputProps> = ({
  label,
  placeholder,
  borderRadius = 12,
  error,
  validation,
  containerStyle = {},
  inputStyle = {},
  labelStyle = {},
  errorStyle = {},
  value = '',
  onChangeText,
  ...textInputProps
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleChangeText = (text: string) => {
    if (!hasStartedTyping && text.length > 0) {
      setHasStartedTyping(true);
    }

    // Run validation if provided
    if (validation) {
      const validationError = validation(text);
      setInternalError(validationError);
    }

    if (onChangeText) {
      onChangeText(text);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  // Determine border color based on state
  const getBorderStyle = () => {
    const currentError = error || internalError;
    
    if (currentError) {
      return 'border-red-500'; // Red for error
    }
    
    if (hasStartedTyping && validation) {
      const validationResult = validation(value as string);
      if (!validationResult) {
        return 'border-black'; // Black for valid
      }
      return 'border-red-500'; // Red for invalid
    }
    
    if (isFocused) {
      return 'border-red-500'; // Red when typing (until validation succeeds)
    }
    
    return 'border-slate-200'; // Gray default
  };

  const currentError = error || internalError;

  // Get border radius class
  const getBorderRadiusClass = () => {
    if (borderRadius === 8) return 'rounded-lg';
    if (borderRadius === 16) return 'rounded-2xl';
    if (borderRadius === 20) return 'rounded-[20px]';
    if (borderRadius === 24) return 'rounded-3xl';
    return 'rounded-xl'; // Default for 12px
  };

  return (
    <View className="w-full" style={containerStyle}>
      {/* Label */}
      {label && (
        <Text
          className="text-sm text-gray-700 mb-2"
          style={[
            { fontFamily: 'PlusJakartaSans-Medium' },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      {/* Input */}
      <TextInput
        className={`w-full border ${getBorderStyle()} ${getBorderRadiusClass()} py-3 px-4 text-sm text-black bg-white`}
        style={[
          { fontFamily: 'PlusJakartaSans-Regular' },
          inputStyle,
        ]}
        placeholder={placeholder}
        // placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...textInputProps}
      />

      {/* Error Message */}
      {currentError && (
        <Text
          className="text-red-500 text-xs mt-1.5 ml-1"
          style={[
            { fontFamily: 'PlusJakartaSans-Regular' },
            errorStyle,
          ]}
        >
          {currentError}
        </Text>
      )}
    </View>
  );
};