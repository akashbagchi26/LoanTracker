import { Loan } from "@/types/loan";
import { useFetchLoans } from "@/hooks/api/useFetchLoan";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

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

  const router = useRouter();
  const { data } = useFetchLoans(moduleFilterList);

  const loans = data?.loans;

  const showTag = useMemo(() => LOAN_STATUS_MODULES.includes(module), [module]);

  const handlePress = (id: string) => {
    router.push({ pathname: "/loans/[loanId]", params: { loanId: id } });
  };

  const renderItem = ({ item }: { item: Loan }) => {
    return (
      <Pressable style={styles.card} onPress={() => handlePress(item._id)}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.purpose || "Loan"}</Text>
          <Text style={styles.amount}>
            ₹{item.loan_amount_details.principal_sanction}
          </Text>
          <Text style={styles.date}>
            Due:{" "}
            {item.repayment_details.emi_date
              ? item.repayment_details.emi_date
              : "N/A"}
          </Text>
        </View>

        {showTag && (
          <Text style={styles.typeText}>
            {item.repayment_details.repayment_type?.toUpperCase() || "N/A"}
          </Text>
        )}
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
      style={showTag ? styles.limitedHeight : undefined}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 2,
    paddingBottom: 16,
  },
  limitedHeight: {
    maxHeight: 320,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fefefe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 2,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  amount: {
    fontSize: 15,
    color: "#555",
    marginTop: 2,
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#444",
  },
});
