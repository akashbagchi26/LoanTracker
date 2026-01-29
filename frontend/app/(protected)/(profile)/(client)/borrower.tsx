import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, StyleSheet } from "react-native";
import { Link, useRouter } from "expo-router";
import { Borrower } from "@/types/borrower";
import { useFetchBorrower } from "@/hooks/api/borrower/useFetchBorrower";

export default function BorrowerList() {
  const { data: borrows } = useFetchBorrower();
  const router = useRouter();

  const renderItem = ({ item }: { item: Borrower }) => (
    <Pressable
      style={styles.card}
      onPress={() =>
        router.push(
          `/(protected)/(profile)/(client)/add-edit-borrower?id=${item._id}`
        )
      }
    >
      <Text style={styles.name}>{item.name}</Text>
      <Text>📞 {item.contact?.phone_no ?? "N/A"}</Text>
      <Text>📧 {item.contact?.email ?? "N/A"}</Text>
      <Text>Active Loans: {item.loan_summery?.active_loan ?? "N/A"}</Text>
      <Text>
        Outstanding: ₹{item.loan_summery?.total_outstanding_amount ?? "N/A"}
      </Text>
      <Text>
        Monthly Due: ₹{item.loan_summery?.total_monthly_payment_due ?? "N/A"}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Link href="/(protected)/(profile)/(client)/add-edit-borrower" asChild>
        <Pressable style={styles.addButton}>
          <Text style={styles.addText}>+ Add Lent User</Text>
        </Pressable>
      </Link>

      <FlatList
        data={borrows}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  card: {
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  name: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  addButton: {
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
