import { MyBottomSheet } from "@/components/MyBottomSheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFetchLoanById } from "@/hooks/api/useFetchLoan";

export default function LoanDetailsPage() {
  const router = useRouter();
  const { loanId } = useLocalSearchParams<{ loanId: string }>();
  const { data: loan } = useFetchLoanById(loanId);

  const sheetRef = useRef<BottomSheet>(null);

  if (!loan) {
    return <Text style={styles.error}>Loan not found.</Text>;
  }

  const {
    loan_amount_details,
    repayment_details,
    interest_rate_details,
    loan_status,
  } = loan;

  const progress =
    (loan_amount_details.total_amount_paid /
      (loan_amount_details.total_amount_paid +
        loan_amount_details.total_outstanding)) *
    100;

  const { repayment_type, emi_date } = repayment_details;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Loan Header */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{loan.purpose}</Text>
            <View
              style={[
                styles.badge,
                loan_status === "active"
                  ? styles.active
                  : loan_status === "closed"
                    ? styles.closed
                    : styles.overdue,
              ]}
            >
              <Text style={styles.badgeText}>{loan_status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.amount}>
            ₹{loan_amount_details.total_outstanding.toLocaleString()}
          </Text>
          <Text style={styles.subLabel}>
            Outstanding • {repayment_type === "emi" ? "EMI" : "Due"} Date:{" "}
            {emi_date?.toLocaleString() ?? "N/A"}
            {repayment_type === "emi" && " of every week"}
          </Text>
        </View>

        {/* EMI / Loan Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Repayment Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Sanctioned</Text>
            <Text style={styles.value}>
              ₹{loan_amount_details.principal_sanction.toLocaleString()}
            </Text>
          </View>
          {repayment_details.emi_amount && repayment_details.tenure_month && (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>EMI Amount</Text>
                <Text style={styles.value}>
                  ₹{repayment_details.emi_amount?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Tenure</Text>
                <Text style={styles.value}>
                  {repayment_details.tenure_month} months
                </Text>
              </View>
            </>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Paid</Text>
            <Text style={styles.value}>
              ₹{loan_amount_details.total_amount_paid.toLocaleString()}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{progress?.toFixed(0)}% Paid</Text>
        </View>

        {/* Interest Info */}
        {repayment_details.repayment_type === "emi" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interest Details</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Rate</Text>
              <Text style={styles.value}>
                {interest_rate_details.rate_pa}% p.a.
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Type</Text>
              <Text style={styles.value}>
                {interest_rate_details.rate_type}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Outstanding Interest</Text>
              <Text style={styles.value}>
                ₹{loan_amount_details.interest_outstanding.toLocaleString()}
              </Text>
            </View>
          </View>
        )}

        {/* Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Timeline</Text>
          <View style={styles.timelineItem}>
            <View style={styles.dot} />
            <Text style={styles.timelineText}>
              Loan Created on{" "}
              {loan.distribution_date
                ? new Date(loan.distribution_date).toLocaleDateString()
                : "N/A"}
            </Text>
          </View>
          <View style={styles.timelineItem}>
            <View style={[styles.dot, { backgroundColor: "#2196F3" }]} />
            <Text style={styles.timelineText}>
              Total Paid: ₹
              {loan_amount_details.total_amount_paid.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* CTA Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => sheetRef.current?.expand()}
          >
            <Text style={styles.buttonPrimaryText}>Pay Now</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={styles.buttonSecondary}
            onPress={() =>
              router.push({
                pathname: "/(protected)/loans/add-loan",
                params: { existingLoan: JSON.stringify(loan) },
              })
            }
          >
            <Text style={styles.buttonSecondaryText}>Edit Loan</Text>
          </TouchableOpacity> */}
        </View>
      </ScrollView>
      <MyBottomSheet
        ref={sheetRef}
        loanId={loanId}
        loanType={repayment_details.repayment_type}
        prePaid={
          repayment_details.repayment_type === "emi"
            ? repayment_details.emi_amount
            : loan_amount_details.total_outstanding
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F8FA", padding: 16 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    marginBottom: 16,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between" },
  title: { fontSize: 20, fontWeight: "600", color: "#222" },
  amount: { fontSize: 28, fontWeight: "700", color: "#2E7D32", marginTop: 6 },
  subLabel: { fontSize: 14, color: "#555", marginTop: 4 },

  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: { fontSize: 12, fontWeight: "600", color: "#fff" },
  active: { backgroundColor: "#2E7D32" },
  closed: { backgroundColor: "#9E9E9E" },
  overdue: { backgroundColor: "#D32F2F" },

  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 14, fontWeight: "500", color: "#222" },

  progressBar: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    marginTop: 10,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: "#2E7D32" },
  progressText: { fontSize: 12, color: "#666", marginTop: 4 },

  timelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 10,
  },
  timelineText: { fontSize: 13, color: "#555" },

  buttonGroup: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    marginBottom: 40,
  },
  buttonPrimary: {
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonPrimaryText: { color: "#fff", fontWeight: "600" },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonSecondaryText: { color: "#333", fontWeight: "600" },

  error: { color: "red", fontSize: 16, textAlign: "center", marginTop: 20 },
});
