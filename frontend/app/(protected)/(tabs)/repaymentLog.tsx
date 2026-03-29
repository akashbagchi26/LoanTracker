import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type RepaymentLog = {
  id: string;
  loanName: string;
  amount: number;
  date: string;
  status: "success" | "pending" | "failed";
};

const LOGS: RepaymentLog[] = [
  {
    id: "1",
    loanName: "HDFC Credit Card",
    amount: 500,
    date: "Mar 28, 2024",
    status: "success",
  },
  {
    id: "2",
    loanName: "SBI Personal Loan",
    amount: 1200,
    date: "Mar 25, 2024",
    status: "success",
  },
  {
    id: "3",
    loanName: "Axis Car Loan",
    amount: 450,
    date: "Mar 20, 2024",
    status: "failed",
  },
  {
    id: "4",
    loanName: "HDFC Credit Card",
    amount: 500,
    date: "Feb 28, 2024",
    status: "success",
  },
  {
    id: "5",
    loanName: "Bajaj Finance",
    amount: 2000,
    date: "Feb 15, 2024",
    status: "success",
  },
];

export default function RepaymentLog() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  const renderItem = ({ item }: { item: RepaymentLog }) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.logCard,
        { backgroundColor: colors.card, borderColor: colors.border },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor:
              item.status === "success"
                ? colors.success + "15"
                : colors.error + "15",
          },
        ]}
      >
        <Ionicons
          name={item.status === "success" ? "checkmark-circle" : "close-circle"}
          size={24}
          color={item.status === "success" ? colors.success : colors.error}
        />
      </View>

      <View style={styles.content}>
        <Text style={[styles.loanName, { color: colors.text }]}>
          {item.loanName}
        </Text>
        <Text style={[styles.date, { color: colors.secondaryText }]}>
          {item.date}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amount,
            {
              color: item.status === "success" ? colors.success : colors.error,
            },
          ]}
        >
          {item.status === "success" ? "-" : ""}₹{item.amount.toLocaleString()}
        </Text>
        <Text style={[styles.statusText, { color: colors.secondaryText }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={LOGS}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Repayment History
            </Text>
            <Text style={[styles.headerSub, { color: colors.secondaryText }]}>
              Track your recent payments
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  logCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  loanName: {
    fontSize: 16,
    fontWeight: "700",
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  amountContainer: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "800",
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    marginTop: 2,
  },
});
