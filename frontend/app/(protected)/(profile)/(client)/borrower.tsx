import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { Borrower } from "@/types/borrower";
import { useFetchBorrower } from "@/hooks/api/borrower/useFetchBorrower";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function BorrowerList() {
  const { data: borrows } = useFetchBorrower();
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];

  const renderItem = ({ item }: { item: Borrower }) => (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.9 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
      onPress={() =>
        router.push(
          `/(protected)/(profile)/(client)/add-edit-borrower?id=${item._id}`,
        )
      }
    >
      <View style={styles.cardHeader}>
        <View
          style={[styles.avatarBox, { backgroundColor: colors.primary + "15" }]}
        >
          <Text style={[styles.avatarText, { color: colors.primary }]}>
            {item.name?.charAt(0).toUpperCase() || "U"}
          </Text>
        </View>
        <View style={styles.titleInfo}>
          <Text style={[styles.name, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.phone, { color: colors.secondaryText }]}>
            <Ionicons name="call-outline" size={12} />{" "}
            {item.contact?.phone_no ?? "N/A"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.icon} />
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
            Outstanding
          </Text>
          <Text style={[styles.statValue, { color: colors.error }]}>
            ₹
            {Number(
              item.loan_summery?.total_outstanding_amount || 0,
            ).toLocaleString()}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
            Active Loans
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>
            {item.loan_summery?.active_loan || 0}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() =>
          router.push("/(protected)/(profile)/(client)/add-edit-borrower")
        }
        style={[styles.addButton, { backgroundColor: "#10b981" }]}
      >
        <Ionicons
          name="add-circle"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.addText}>Add New Lent User</Text>
      </TouchableOpacity>

      <FlatList
        data={borrows}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={48} color={colors.icon} />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
              No users found
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "800",
  },
  titleInfo: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  phone: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: "100%",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
  },
  addButton: {
    height: 56,
    borderRadius: 18,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  addText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: 80,
    alignItems: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },
});
