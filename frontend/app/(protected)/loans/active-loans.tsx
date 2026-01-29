import RecordList from "@/components/ui/RecordList";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function ActiveLoans() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 5,
        }}
      >
        <Text style={styles.header}>Active Loans</Text>
        <Pressable onPress={() => router.push("/loans/")}>
          <Text style={{ color: "#007AFF" }}>View All</Text>
        </Pressable>
      </View>
      <RecordList module={"active_loan"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
});
