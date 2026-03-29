import { Loan } from "@/types/loan";
import { useFetchLoans } from "@/hooks/api/useFetchLoan";
import { useRouter } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  module: string;
};

const LOAN_STATUS_MODULES = ["active_loan", "upcoming_loan", "close_loan"];

type FilterCriteria = { loan_status?: string; aspect?: string };

const filterList: Record<string, FilterCriteria> = {
  active_loan: { loan_status: "active" },
  close_loan: { loan_status: "closed" },
  upcoming_loan: { loan_status: "active" },
  given: { aspect: "given" },
  taken: { aspect: "taken" },
};

export default function RecordList({ module }: Props) {
  const moduleFilterList = filterList[module] || {};
  const theme = useColorScheme();
  const colors = Colors[theme];

  const router = useRouter();
  const { data } = useFetchLoans(moduleFilterList);

  const loans = data?.loans;
  const showTag = useMemo(() => LOAN_STATUS_MODULES.includes(module), [module]);

  const handlePress = (id: string) => {
    router.push({ pathname: "/loans/[loanId]", params: { loanId: id } });
  };

  const renderItem = ({ item }: { item: Loan }) => {
    const isEmi = item.repayment_details?.repayment_type === "emi";
    return (
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
        onPress={() => handlePress(item._id)}
      >
        <View style={styles.cardHeader}>
          <View
            style={[styles.iconContainer, { backgroundColor: colors.surface }]}
          >
            <Ionicons
              name={isEmi ? "calendar-outline" : "cash-outline"}
              size={20}
              color={colors.primary}
            />
          </View>
          <View style={styles.titleContainer}>
            <Text
              numberOfLines={1}
              style={[styles.name, { color: colors.text }]}
            >
              {item.purpose || "Loan"}
            </Text>
            <Text style={[styles.date, { color: colors.secondaryText }]}>
              Due: {item.repayment_details.emi_date || "N/A"}
            </Text>
          </View>
          <View style={styles.amountContainer}>
            <Text style={[styles.amount, { color: colors.text }]}>
              ₹{item.loan_amount_details.principal_sanction.toLocaleString()}
            </Text>
            {showTag && (
              <View style={[styles.tag, { backgroundColor: colors.surface }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>
                  {item.repayment_details.repayment_type?.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={loans}
      keyExtractor={(item) => item._id}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
          <Ionicons name="documents-outline" size={48} color={colors.icon} />
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No records found
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  container: {
    flex: 1,
    marginHorizontal: 5,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  date: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "500",
  },
  amountContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  amount: {
    fontSize: 17,
    fontWeight: "800",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
  },
});
