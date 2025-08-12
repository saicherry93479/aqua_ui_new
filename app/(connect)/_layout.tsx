import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';


export default function RootLayout() {



  return (

    <Stack  initialRouteName='(tabs)'>
      <Stack.Screen name='(tabs)' options={{ headerShown: false }}></Stack.Screen>

      <Stack.Screen name='service-detail/[id]' options={{ headerShown: false }} ></Stack.Screen>
      <Stack.Screen name='help-support' options={{ headerShown: true }} ></Stack.Screen>
   

    </Stack>

  );
}
