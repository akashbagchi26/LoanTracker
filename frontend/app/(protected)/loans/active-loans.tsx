import RecordList from "@/components/ui/RecordList";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function ActiveLoans() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginHorizontal: 5,
        }}
      >
        <Text style={[styles.header, { color: colors.text }]}>
          Active Loans
        </Text>
        <Pressable onPress={() => router.push("/loans/")}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>
            View All
          </Text>
        </Pressable>
      </View>
      <RecordList module={"active_loan"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
});
