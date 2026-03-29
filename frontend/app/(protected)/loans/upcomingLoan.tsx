import RecordList from "@/components/ui/RecordList";
import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { useRouter } from "expo-router";

export default function UpcomingLoans() {
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
          Upcoming Loans
        </Text>
        <Pressable onPress={() => router.push("/loans/")}>
          <Text style={{ color: colors.primary, fontWeight: "700" }}>
            View All
          </Text>
        </Pressable>
      </View>
      <RecordList module={"upcoming_loan"} />
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
