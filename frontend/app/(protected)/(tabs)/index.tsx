import { CardButton } from "@/components/ui/CardButton";
import TopTabNavigation from "@/components/ui/TopTabNavigation";
import React from "react";
import { StyleSheet, View } from "react-native";
import ActiveLoans from "../loans/active-loans";
import CloseLoans from "../loans/close-loans";
import UpcomingLoans from "../loans/upcomingLoan";
import LendBorrowButtons from "@/components/LendBorrowButtons";
import { useFetchStats } from "@/hooks/api/useFetchStats";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function HomeScreen() {
  const { data } = useFetchStats();
  const theme = useColorScheme();
  const colors = Colors[theme];

  const stats = data || {
    totalLent: 0,
    totalBorrower: 0,
    totalInterestEarned: 0,
    totalDuePayments: 0,
  };

  const tab = [
    { name: "Active", title: "Active", content: <ActiveLoans /> },
    { name: "Upcoming", title: "Upcoming", content: <UpcomingLoans /> },
    { name: "Closed", title: "Closed", content: <CloseLoans /> },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.cardGrid}>
        <CardButton
          title="Total Lent"
          subtitle={`₹ ${stats.totalLent}`}
          iconName="arrow-up"
          color="success"
        />
        <CardButton
          title="Due Payments"
          subtitle={`₹ ${stats.totalDuePayments}`}
          iconName="exclamation"
          color="error"
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
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  cardGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
});
