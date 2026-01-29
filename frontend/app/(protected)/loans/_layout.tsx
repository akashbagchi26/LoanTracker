import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export default function LoansLayout() {
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
      <Stack.Screen name="index" options={{ headerShown: true }} />
      <Stack.Screen name="[loanId]" options={{ title: "Loan Detail" }} />
      <Stack.Screen name="add-loan" options={{ title: "Add Loan" }} />
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
