import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

export function LoadingScreen() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" />
            <Text style={styles.text}>Loading…</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'white'
    },
    text: {
        marginTop: 12,
        fontSize: 16,
        color: '#666'
    }
});
