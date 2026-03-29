import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type LentItem = {
  id: string;
  source: string;
  amount: number;
  type?: string;
};

type LoanChain = {
  id: number;
  name: string;
  lent: LentItem[];
};

const loanChains: LoanChain[] = [
  {
    id: 1,
    name: "Ram Kumar",
    lent: [
      {
        id: "HDFC-RAM-001",
        source: "HDFC Credit Card",
        amount: 500,
        type: "credit",
      },
      {
        id: "AXIS-RAM-002",
        source: "AXIS Credit Card",
        amount: 100,
        type: "credit",
      },
      { id: "SBI-RAM-003", source: "SBI Loan", amount: 3000, type: "loan" },
    ],
  },
  {
    id: 2,
    name: "Sham Sharma",
    lent: [
      {
        id: "ICICI-SHAM-001",
        source: "ICICI Credit Card",
        amount: 5000,
        type: "credit",
      },
      {
        id: "HDFC-SHAM-002",
        source: "HDFC Credit Card",
        amount: 7000,
        type: "credit",
      },
    ],
  },
  {
    id: 3,
    name: "Sita Devi",
    lent: [],
  },
  {
    id: 4,
    name: "Gita Singh",
    lent: [
      {
        id: "PNB-GITA-001",
        source: "PNB Home Loan",
        amount: 150000,
        type: "loan",
      },
    ],
  },
  {
    id: 5,
    name: "Arjun Verma",
    lent: [
      {
        id: "KOTAK-ARJUN-001",
        source: "Kotak Credit Card",
        amount: 2500,
        type: "credit",
      },
      {
        id: "BAJAJ-ARJUN-002",
        source: "Bajaj Finserv Loan",
        amount: 50000,
        type: "loan",
      },
    ],
  },
  {
    id: 6,
    name: "Priya Mehta",
    lent: [
      {
        id: "AMEX-PRIYA-001",
        source: "American Express Card",
        amount: 12000,
        type: "credit",
      },
    ],
  },
  {
    id: 7,
    name: "Rohan Joshi",
    lent: [
      {
        id: "SBI-ROHAN-001",
        source: "SBI Credit Card",
        amount: 800,
        type: "credit",
      },
      {
        id: "HDFC-ROHAN-002",
        source: "HDFC Personal Loan",
        amount: 75000,
        type: "loan",
      },
      {
        id: "AXIS-ROHAN-003",
        source: "AXIS Credit Card",
        amount: 3200,
        type: "credit",
      },
    ],
  },
  {
    id: 8,
    name: "Kavita Patel",
    lent: [],
  },
  {
    id: 9,
    name: "Vikram Reddy",
    lent: [
      {
        id: "ICICI-VIKRAM-001",
        source: "ICICI Car Loan",
        amount: 350000,
        type: "loan",
      },
    ],
  },
  {
    id: 10,
    name: "Anjali Gupta",
    lent: [
      {
        id: "CITI-ANJALI-001",
        source: "CITI Credit Card",
        amount: 9500,
        type: "credit",
      },
    ],
  },
  {
    id: 11,
    name: "Suresh Iyer",
    lent: [
      {
        id: "HDFC-SURESH-001",
        source: "HDFC Credit Card",
        amount: 4500,
        type: "credit",
      },
      {
        id: "SBI-SURESH-002",
        source: "SBI Credit Card",
        amount: 1500,
        type: "credit",
      },
    ],
  },
];

export default function LoanChainList() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  const renderLentItem = ({ item }: { item: LentItem }) => (
    <View style={[styles.lentItem, { borderBottomColor: colors.border }]}>
      <View style={styles.sourceGroup}>
        <Ionicons
          name={item.type === "credit" ? "card" : "business"}
          size={18}
          color={item.type === "credit" ? colors.primary : colors.success}
          style={{ marginRight: 12 }}
        />
        <Text style={[styles.source, { color: colors.text }]}>
          {item.source}
        </Text>
      </View>
      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: colors.text }]}>
          ₹{item.amount.toLocaleString()}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor:
                (item.type === "credit" ? colors.primary : colors.success) +
                "20",
            },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: item.type === "credit" ? colors.primary : colors.success,
              },
            ]}
          >
            {item.type}
          </Text>
        </View>
      </View>
    </View>
  );

  const calculateTotal = (lent: LentItem[]) =>
    lent.reduce((total, item) => total + item.amount, 0);

  const renderGroup = ({ item }: { item: LoanChain }) =>
    item.lent && item.lent.length > 0 ? (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.itemCount, { color: colors.secondaryText }]}>
              {item.lent.length} active entries
            </Text>
          </View>
          <View style={styles.totalGroup}>
            <Text style={[styles.totalLabel, { color: colors.secondaryText }]}>
              Total Debt
            </Text>
            <Text style={[styles.totalAmount, { color: colors.primary }]}>
              ₹{calculateTotal(item.lent).toLocaleString()}
            </Text>
          </View>
        </View>
        <FlatList
          data={item.lent}
          keyExtractor={(item) => item.id}
          renderItem={renderLentItem}
          scrollEnabled={false}
          style={styles.innerList}
        />
      </View>
    ) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={loanChains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGroup}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  itemCount: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  totalGroup: {
    alignItems: "flex-end",
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "900",
  },
  innerList: {
    marginTop: 8,
  },
  lentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
  },
  sourceGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  source: {
    fontSize: 14,
    fontWeight: "600",
  },
  amountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  amount: {
    fontSize: 14,
    fontWeight: "800",
  },
  badge: {
    borderRadius: 6,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
});
