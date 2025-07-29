
import { router, Stack } from "expo-router";
import { useLayoutEffect } from "react";



export default function AuthLayout() {



    return (
        <Stack>
            <Stack.Screen name="index" options={{ headerShown: false, }} />
            <Stack.Screen name="otp" options={{ headerShown: true, headerShadowVisible: false }} />

        </Stack>
    )
}