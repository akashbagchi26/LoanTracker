import { CardButton } from "@/components/ui/CardButton";
import TopTabNavigation from "@/components/ui/TopTabNavigation";
import React from "react";
import { StyleSheet, View } from "react-native";
import ActiveLoans from "../loans/active-loans";
import CloseLoans from "../loans/close-loans";
import UpcomingLoans from "../loans/upcomingLoan";
import LendBorrowButtons from "@/components/LendBorrowButtons";
import { useFetchStats } from "@/hooks/api/useFetchStats";

export default function HomeScreen() {
  const { data } = useFetchStats();

  const stats = data?.data || "";

  const tab = [
    { name: "Active", title: "Active", content: <ActiveLoans /> },
    { name: "Upcoming", title: "Upcoming", content: <UpcomingLoans /> },
    { name: "Closed", title: "Closed", content: <CloseLoans /> },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.cardGrid}>
        <CardButton
          title="Total Lent"
          subtitle={`₹ ${stats.totalLent}`}
          iconName="arrow-up"
          color="green.button"
        />
        <CardButton
          title="Total Borrowed"
          subtitle={`₹ ${stats.totalBorrower}`}
          iconName="arrow-down"
          color="ocean.button"
        />
      </View>

      <View style={styles.cardGrid}>
        <CardButton
          title="Interest Earned"
          subtitle={`₹ ${stats.totalInterestEarned}`}
          iconName="percentage"
          color="lavender.button"
        />
        <CardButton
          title="Due Payments"
          subtitle={`₹ ${stats.totalDuePayments}`}
          iconName="exclamation"
          color="grass.button"
        />
      </View>

      <TopTabNavigation tabs={tab} />
      <LendBorrowButtons />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 5,
    backgroundColor: "#fff",
  },
  cardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
