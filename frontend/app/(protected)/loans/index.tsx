import { Link } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useFetchLoans } from "@/hooks/api/useFetchLoan";

type RecordItem = {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  type: string;
};

export default function ViewAllRecordsPage() {
  const { data } = useFetchLoans();
  const loans = data?.loans;

  const renderRecord = ({ item }: ListRenderItemInfo<RecordItem>) => (
    <Link
      href={{
        pathname: "/loans/[loanId]",
        params: { loanId: item.id },
      }}
      asChild
    >
      <Pressable style={styles.card}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.amount}>₹{item.amount}</Text>
          <Text style={styles.date}>Due: {item.dueDate}</Text>
        </View>
        <View style={styles.chip}>
          <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
        </View>
      </Pressable>
    </Link>
  );

  const records: RecordItem[] = (loans ?? []).map((loan: any) => ({
    id: loan._id,
    name: loan.purpose,
    amount: Number(loan.loan_amount_details.principal_sanction),
    dueDate: loan.emi_date ? loan.emi_date : "N/A",
    type: loan.loan_type,
  }));

  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        paddingBottom: 25,
        paddingTop: 10,
        paddingHorizontal: 10,
      }}
      renderItem={renderRecord}
    />
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    marginTop: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
  },
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
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fefefe",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginHorizontal: 2,
  },
  textContainer: {
    marginLeft: 12,
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
