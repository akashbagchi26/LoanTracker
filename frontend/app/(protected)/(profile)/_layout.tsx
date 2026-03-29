import { router, Stack } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function AuthLayout() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "800",
          color: colors.text,
        },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={[styles.backBtn, { backgroundColor: colors.surface }]}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
          ) : null,
      }}
    >
      <Stack.Screen name="profile" options={{ headerShown: true, title: "" }} />
      <Stack.Screen
        name="edit-profile"
        options={{ headerShown: true, title: "Edit Profile" }}
      />
      <Stack.Screen name="(client)" options={{ headerShown: false }} />
    </Stack>
  );
}

const styles = StyleSheet.create({
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
