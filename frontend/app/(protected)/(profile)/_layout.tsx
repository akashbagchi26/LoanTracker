import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "500",
          color: "black",
        },
        headerLeft: ({ canGoBack }) =>
          canGoBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.headerRightContainer}
            >
              <Text style={styles.saveButton}>Back</Text>
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
  headerRightContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  saveButton: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
});
