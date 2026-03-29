import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

import Header from "@/components/Header";
import { useColorScheme } from "@/hooks/useColorScheme";
import { loadAuthToken } from "@/store/authStore";
import { useAuth } from "@/hooks/api/useAuth";
import { Colors } from "@/constants/Colors";

export default function ProtectedLayout() {
  const colorScheme = useColorScheme();
  const themeColors = Colors[colorScheme as "light" | "dark"];
  const [loaded] = useFonts({
    SpaceMono: require("../../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const { status } = useAuth();

  useEffect(() => {
    loadAuthToken();
  }, []);

  if (status === "loading" || !loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: themeColors.background,
        }}
      >
        <ActivityIndicator size="large" color={themeColors.primary} />
      </View>
    );
  }

  if (status === "unauthenticated") {
    return <Redirect href="/login" />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{ header: () => <Header title="Loan Details" /> }}
            />
            <Stack.Screen name="loans" options={{ headerShown: false }} />
            <Stack.Screen name="(profile)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
