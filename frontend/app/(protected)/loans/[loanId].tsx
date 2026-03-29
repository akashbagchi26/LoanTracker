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
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function LoanDetailsPage() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { loanId } = useLocalSearchParams<{ loanId: string }>();
  const { data: loan } = useFetchLoanById(loanId);

  const sheetRef = useRef<BottomSheet>(null);

  if (!loan) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, justifyContent: "center" },
        ]}
      >
        <Text style={[styles.error, { color: colors.error }]}>
          Loan not found.
        </Text>
      </View>
    );
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Loan Header Card */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                {loan.purpose || "Loan Details"}
              </Text>
              <Text style={[styles.typeText, { color: colors.secondaryText }]}>
                {repayment_type?.toUpperCase()} •{" "}
                {loan.loan_type?.replace("_", " ")}
              </Text>
            </View>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor:
                    loan_status === "active"
                      ? colors.success + "20"
                      : colors.secondaryText + "20",
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color:
                      loan_status === "active"
                        ? colors.success
                        : colors.secondaryText,
                  },
                ]}
              >
                {loan_status.toUpperCase()}
              </Text>
            </View>
          </View>

          <View style={styles.amountSection}>
            <Text style={[styles.amountLabel, { color: colors.secondaryText }]}>
              Outstanding Balance
            </Text>
            <Text style={[styles.amount, { color: colors.text }]}>
              ₹{loan_amount_details.total_outstanding.toLocaleString()}
            </Text>
          </View>

          <View style={[styles.infoBar, { backgroundColor: colors.surface }]}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={colors.primary}
            />
            <Text style={[styles.infoBarText, { color: colors.secondaryText }]}>
              Next Due:{" "}
              <Text style={{ color: colors.text, fontWeight: "700" }}>
                {emi_date || "N/A"}
              </Text>
            </Text>
          </View>
        </View>

        {/* Financial Highlights */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Sanctioned
            </Text>
            <Text style={[styles.statValue, { color: colors.text }]}>
              ₹{loan_amount_details.principal_sanction.toLocaleString()}
            </Text>
          </View>
          <View
            style={[
              styles.statCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
              Paid So Far
            </Text>
            <Text style={[styles.statValue, { color: colors.success }]}>
              ₹{loan_amount_details.total_amount_paid.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Repayment Progress */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Repayment Progress
            </Text>
            <Text style={[styles.progressPercent, { color: colors.primary }]}>
              {progress?.toFixed(0)}%
            </Text>
          </View>
          <View
            style={[styles.progressBar, { backgroundColor: colors.surface }]}
          >
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: colors.primary },
              ]}
            />
          </View>
        </View>

        {/* Detailed Breakdown */}
        <View
          style={[
            styles.section,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text, marginBottom: 16 },
            ]}
          >
            Loan Details
          </Text>

          {repayment_details.emi_amount ? (
            <DetailRow
              label="Monthly EMI"
              value={`₹${repayment_details.emi_amount.toLocaleString()}`}
              colors={colors}
            />
          ) : null}
          {repayment_details.tenure_month ? (
            <DetailRow
              label="Tenure"
              value={`${repayment_details.tenure_month} Months`}
              colors={colors}
            />
          ) : null}

          <DetailRow
            label="Interest Rate"
            value={`${interest_rate_details.rate_pa}% (${interest_rate_details.rate_type})`}
            colors={colors}
          />
          <DetailRow
            label="Created On"
            value={
              loan.distribution_date
                ? new Date(loan.distribution_date).toLocaleDateString()
                : "N/A"
            }
            colors={colors}
            isLast
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[styles.buttonPrimary, { backgroundColor: colors.primary }]}
            onPress={() => sheetRef.current?.expand()}
          >
            <Ionicons
              name="card-outline"
              size={20}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.buttonPrimaryText}>Make a Payment</Text>
          </TouchableOpacity>
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

const DetailRow = ({ label, value, colors, isLast = false }: any) => (
  <View
    style={[
      styles.row,
      !isLast && {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: 12,
        marginBottom: 12,
      },
    ]}
  >
    <Text style={[styles.label, { color: colors.secondaryText }]}>{label}</Text>
    <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },
  card: {
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  typeText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    letterSpacing: 0.5,
  },

  amountSection: { marginTop: 24 },
  amountLabel: {
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  amount: { fontSize: 36, fontWeight: "900", marginTop: 4, letterSpacing: -1 },

  infoBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
  },
  infoBarText: { fontSize: 14, marginLeft: 8, fontWeight: "500" },

  badge: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 11, fontWeight: "800" },

  statsGrid: { flexDirection: "row", gap: 12, marginBottom: 20 },
  statCard: { flex: 1, padding: 16, borderRadius: 20, borderWidth: 1 },
  statLabel: { fontSize: 12, fontWeight: "600", marginBottom: 4 },
  statValue: { fontSize: 16, fontWeight: "800" },

  section: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  progressPercent: { fontSize: 16, fontWeight: "800" },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 14, fontWeight: "600" },
  value: { fontSize: 14, fontWeight: "700" },

  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: { height: "100%" },

  buttonGroup: { marginTop: 10 },
  buttonPrimary: {
    height: 60,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonPrimaryText: { color: "#fff", fontWeight: "800", fontSize: 16 },

  error: { fontSize: 16, fontWeight: "700", textAlign: "center" },
});
