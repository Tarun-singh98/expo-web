import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import "react-native-reanimated";

import { Platform } from "react-native";

import * as LocalAuthentication from "expo-local-authentication";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Check if the device supports biometrics
  useEffect(() => {
    const checkBiometricSupport = async () => {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      console.log(
        compatible,
        enrolled,
        "Check for compatible",
        typeof Platform.OS
      );
      setIsBiometricSupported(compatible && enrolled);
    };
    checkBiometricSupport();
  }, []);

  // Authenticate with biometrics on load
  useEffect(() => {
    if (loaded) {
      handleBiometricAuth();
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const handleBiometricAuth = async () => {
    if (!isBiometricSupported) {
      Alert.alert(
        "Biometric Not Supported",
        "Your device doesn't support biometrics or has no biometrics enrolled."
      );
      return;
    }

    const { success } = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to Continue",
      fallbackLabel: "Use Password",
    });

    if (success) {
      setIsAuthenticated(true);
    } else {
      Alert.alert("Authentication Failed", "Please try again.");
    }
  };

  if ((!loaded || !isAuthenticated) && Platform.OS !== "web") {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Authenticating...</Text>
        {isBiometricSupported && (
          <Button title="Retry Authentication" onPress={handleBiometricAuth} />
        )}
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
