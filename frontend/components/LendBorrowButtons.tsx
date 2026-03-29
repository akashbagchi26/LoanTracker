import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function LendBorrowButtons() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <View style={styles.container}>
      {/* Add Loan Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => router.push("/(protected)/loans/add-loan")}
      >
        <Ionicons
          name="add-circle"
          size={20}
          color="#fff"
          style={styles.icon}
        />
        <Text style={styles.text}>Add Loan</Text>
      </TouchableOpacity>

      <View style={styles.spacer} />

      {/* Lent User Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, { backgroundColor: "#10b981" }]} // Emerald/Green for Users/Borrowers
        onPress={() => router.push("/(protected)/(profile)/(client)/borrower")}
      >
        <Ionicons name="people" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.text}>Lent User</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 4,
    width: "100%",
  },
  button: {
    flex: 1,
    height: 56,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  icon: {
    marginRight: 10,
  },
  spacer: {
    width: 14,
  },
  text: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
