import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    FlatList,
    Pressable,
} from 'react-native';
import {
    ChevronDown,
    Check,
    X,
} from 'lucide-react-native';
import { DynamicInput } from './DynamicInput';

export interface SelectOption {
    id: string;
    label: string;
    value: string;
    subtitle?: string;
    icon?: React.ReactNode;
}

interface DynamicSelectProps {
    label?: string;
    placeholder?: string;
    options: SelectOption[];
    value?: SelectOption | null;
    onSelect: (option: SelectOption | null) => void;
    error?: string;
    validation?: (value: SelectOption | null) => string | null;
    borderRadius?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    modalTitle?: string;
    containerStyle?: object;
    selectStyle?: object;
    labelStyle?: object;
    errorStyle?: object;
    disabled?: boolean;
    required?: boolean;
}

export const DynamicSelect: React.FC<DynamicSelectProps> = ({
    label,
    placeholder = 'Select an option',
    options = [],
    value,
    onSelect,
    error,
    validation,
    borderRadius = 12,
    searchable = true,
    searchPlaceholder = 'Search...',
    modalTitle = 'Select Option',
    containerStyle = {},
    selectStyle = {},
    labelStyle = {},
    errorStyle = {},
    disabled = false,
    required = false,
}) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [hasInteracted, setHasInteracted] = useState(false);
    const [internalError, setInternalError] = useState<string | null>(null);

    // Filter options based on search query
    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (option.subtitle && option.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Handle modal open
    const handleOpenModal = () => {
        if (disabled) return;
        setHasInteracted(true);
        setSearchQuery('');
        setIsModalVisible(true);
    };

    // Handle option selection
    const handleSelectOption = (option: SelectOption) => {
        onSelect(option);
        setIsModalVisible(false);

        // Run validation if provided
        if (validation) {
            const validationError = validation(option);
            setInternalError(validationError);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setIsModalVisible(false);
        setSearchQuery('');
    };

    // Clear selection
    const handleClearSelection = () => {
        onSelect(null);
        if (validation) {
            const validationError = validation(null);
            setInternalError(validationError);
        }
    };

    // Get border style based on state
    const getBorderStyle = () => {
        const currentError = error || internalError;

        if (currentError && hasInteracted) {
            return 'border-red-500 ';
        }

        if (hasInteracted && validation && value) {
            const validationResult = validation(value);
            if (!validationResult) {
                return 'border-black ';
            }
            return 'border-red-500 ';
        }

        return 'border-slate-200 ';
    };

    // Get border radius class
    const getBorderRadiusClass = () => {
        if (borderRadius === 8) return 'rounded-lg';
        if (borderRadius === 16) return 'rounded-2xl';
        if (borderRadius === 20) return 'rounded-[20px]';
        if (borderRadius === 24) return 'rounded-3xl';
        return 'rounded-xl';
    };

    const currentError = error || internalError;
    const showError = currentError && hasInteracted;

    return (
        <View className="w-full" style={containerStyle}>
            {/* Label */}
            {label && (
                <View className="flex-row items-center mb-2">
                    <Text
                        className="text-sm text-gray-700"
                        style={[
                            { fontFamily: 'PlusJakartaSans-Medium' },
                            labelStyle,
                        ]}
                    >
                        {label}
                    </Text>
                    
                </View>
            )}

            {/* Select Button */}
            <TouchableOpacity
                className={`w-full border ${getBorderStyle()} ${getBorderRadiusClass()} p-3 px-4 flex-row items-center justify-between ${disabled ? 'opacity-50' : ''
                    }`}
                style={selectStyle}
                onPress={handleOpenModal}
                disabled={disabled}
                activeOpacity={0.7}
            >
                <View className="flex-row items-center flex-1">
                    {value?.icon && (
                        <View className="mr-3">
                            {value.icon}
                        </View>
                    )}
                    <View className="flex-1">
                        <Text
                            className={`text-sm ${value ? 'text-black' : 'text-gray-500'
                                }`}
                            style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                            numberOfLines={1}
                        >
                            {value
                                ? `${value.label}${value.subtitle ? ', ' + value.subtitle : ''}`
                                : placeholder}

                        </Text>
                       
                    </View>
                </View>

                <View className="flex-row items-center">
                    {value && !disabled && (
                        <TouchableOpacity
                            className="p-1 mr-2"
                            onPress={(e) => {
                                e.stopPropagation();
                                handleClearSelection();
                            }}
                        >
                            {/* <X size={18} color="#6B7280" /> */}
                        </TouchableOpacity>
                    )}
                    <ChevronDown
                        size={20}
                        color={disabled ? "#9CA3AF" : "#6B7280"}
                    />
                </View>
            </TouchableOpacity>

            {/* Error Message */}
            {showError && (
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

            {/* Modal */}
            <Modal
                visible={isModalVisible}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleCloseModal}
            >
                <View className="flex-1 bg-white">
                    {/* Header */}
                    <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
                        <TouchableOpacity onPress={handleCloseModal}>
                            <Text
                                className="text-blue-600 text-base"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                        <Text
                            className="text-lg text-black"
                            style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                        >
                            {modalTitle}
                        </Text>
                        <TouchableOpacity
                            onPress={handleCloseModal}
                        >
                            <Text
                                className="text-blue-600 text-base"
                                style={{ fontFamily: 'PlusJakartaSans-SemiBold' }}
                            >
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Search */}
                    {searchable && (
                        <View className="px-6 py-4">
                            <DynamicInput
                                placeholder={searchPlaceholder}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                borderRadius={borderRadius}
                                autoCapitalize="words"
                                containerStyle={{ marginBottom: 0 }}
                            />
                        </View>
                    )}

                    {/* Options List */}
                    <FlatList
                        data={filteredOptions}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="flex-row items-center justify-between px-6 py-4 border-b border-gray-100"
                                onPress={() => handleSelectOption(item)}
                                activeOpacity={0.7}
                            >
                                <View className="flex-row items-center flex-1">
                                    {item.icon && (
                                        <View className="mr-3">
                                            {item.icon}
                                        </View>
                                    )}
                                    <View className="flex-1">
                                        <Text
                                            className="text-base text-black"
                                            style={{ fontFamily: 'PlusJakartaSans-Medium' }}
                                        >
                                            {item.label}
                                        </Text>
                                        {item.subtitle && (
                                            <Text
                                                className="text-sm text-gray-500 mt-0.5"
                                                style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                            >
                                                {item.subtitle}
                                            </Text>
                                        )}
                                    </View>
                                </View>
                                {value?.id === item.id && (
                                    <Check size={20} color="#4548b9" />
                                )}
                            </TouchableOpacity>
                        )}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="px-6 py-8 items-center">
                                <Text
                                    className="text-gray-500 text-base"
                                    style={{ fontFamily: 'PlusJakartaSans-Regular' }}
                                >
                                    No options found
                                </Text>
                            </View>
                        }
                    />
                </View>
            </Modal>
        </View>
    );
};