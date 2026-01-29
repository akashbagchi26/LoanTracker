import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInput, MD3LightTheme as DefaultTheme } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import SelectDropdown from "react-native-select-dropdown";
import { useAddLoan } from "@/hooks/api/useAddLoan";
import { useUpdateLoan } from "@/hooks/api/useUpdateLoan";
import { searchBorrower } from "@/lib/api/borrower";
import { useDebounce } from "@/hooks/useDebounce";
import useAuthStore from "@/store/authStore";

/* ---------- Types ---------- */
type LoanFormData = {
  lender_id: string;
  loan_type: string;
  loan_status: string;
  distribution_date: string | null;
  principal_sanction: string;
  total_amount_paid: string;
  principal_outstanding: string;
  interest_outstanding: string;
  total_outstanding: string;
  repayment_type: "emi" | "onetime";
  emi_amount: string;
  tenure_month: string;
  emi_date: number | null;
  rate_pa: string;
  rate_type: "simple" | "variable";
  purpose: string;
};

type FormFieldBase = {
  name: keyof LoanFormData;
  placeholder?: string;
  label?: string;
  rules?: Record<string, any>;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  dep?: "emi";
};
type TextField = FormFieldBase & { type?: undefined };
type DateField = FormFieldBase & { type: "date" };
type DropdownField = FormFieldBase & {
  type: "dropdown";
  options: { label: string; value: string }[];
};
type AutoCompleteDropdownField = FormFieldBase & {
  type: "autoCompleteDropdown";
};
type FormField =
  | TextField
  | DateField
  | DropdownField
  | AutoCompleteDropdownField;

const dateNumber = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: (i + 1).toString(),
}));

/* ---------- Form Fields ---------- */
const formFields: FormField[] = [
  {
    name: "lender_id",
    placeholder: "Lender ID",
    type: "autoCompleteDropdown",
    rules: { required: "Lender ID is required" },
  },
  {
    name: "loan_type",
    label: "Loan Type",
    type: "dropdown",
    rules: { required: "Type is required" },
    options: [
      { label: "Select Loan Type", value: "" },
      { label: "Personal Loan", value: "personal_loan" },
      { label: "Card Loan", value: "card_loan" },
    ],
  },
  {
    name: "loan_status",
    placeholder: "Loan Status",
    rules: { required: "Loan status is required" },
  },
  { name: "distribution_date", label: "Distribution Date", type: "date" },
  {
    name: "principal_sanction",
    placeholder: "Principal Sanction",
    rules: { required: "Required" },
    keyboardType: "numeric",
  },
  {
    name: "total_amount_paid",
    placeholder: "Total Amount Paid",
    keyboardType: "numeric",
  },
  {
    name: "principal_outstanding",
    placeholder: "Principal Outstanding",
    rules: { required: "Required" },
    keyboardType: "numeric",
    dep: "emi",
  },
  {
    name: "interest_outstanding",
    placeholder: "Interest Outstanding",
    rules: { required: "Required" },
    keyboardType: "numeric",
    dep: "emi",
  },
  {
    name: "total_outstanding",
    placeholder: "Total Outstanding",
    rules: { required: "Required" },
    keyboardType: "numeric",
  },
  {
    name: "repayment_type",
    label: "Repayment Type",
    type: "dropdown",
    rules: { required: "Repayment Type is required" },
    options: [
      { label: "Select Repayment Type", value: "" },
      { label: "Onetime", value: "onetime" },
      { label: "EMI", value: "emi" },
    ],
  },
  {
    name: "emi_amount",
    placeholder: "EMI Amount",
    keyboardType: "numeric",
    dep: "emi",
  },
  {
    name: "tenure_month",
    placeholder: "Tenure (Months)",
    keyboardType: "numeric",
    dep: "emi",
  },
  {
    name: "emi_date",
    label: "EMI Date Will be",
    type: "dropdown",
    dep: "emi",
    options: dateNumber,
  },
  {
    name: "rate_type",
    label: "Select Rate Type",
    type: "dropdown",
    rules: { required: "Rate type is required" },
    dep: "emi",
    options: [
      { label: "Select Rate Type", value: "" },
      { label: "Simple", value: "simple" },
      { label: "Variable", value: "variable" },
    ],
  },
  {
    name: "rate_pa",
    placeholder: "Rate Per Annum (%)",
    rules: { required: "Required" },
    keyboardType: "numeric",
    dep: "emi",
  },
  { name: "purpose", placeholder: "Purpose", rules: { required: "Required" } },
];

const nonEditableFields: (keyof LoanFormData)[] = [
  "interest_outstanding",
  "total_outstanding",
  "emi_amount",
  "principal_outstanding",
];

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007AFF",
    onPrimary: "#FFFFFF",
    background: "#F9FAFB",
    surface: "#FFFFFF",
    outline: "#D1D5DB",
    error: "#EF4444",
    onSurfaceVariant: "#9CA3AF",
  },
};

export default function AddLoan() {
  const navigation = useNavigation();
  const { existingLoan } = useLocalSearchParams<{ existingLoan?: string }>();

  const conditionalHidden: (keyof LoanFormData)[] = useMemo(
    () => (!existingLoan ? [] : ["lender_id"]),
    [existingLoan],
  );

  const hiddenFields: (keyof LoanFormData)[] = useMemo(
    () => ["loan_status", ...conditionalHidden],
    [conditionalHidden],
  );

  const parsedLoan = existingLoan ? JSON.parse(existingLoan) : null;
  const loanId = parsedLoan?._id || undefined;

  const [datePickerFor, setDatePickerFor] = useState<keyof LoanFormData | null>(
    null,
  );
  const [borrowerOptions, setBorrowerOptions] = useState<
    { id: string; title: string }[]
  >([]);
  const [query, setQuery] = useState("");

  const addHook = useAddLoan();
  // call the update hook normally; guard returns later
  const updateHook = useUpdateLoan?.();
  const addMutate = (addHook as any)?.mutateAsync ?? (addHook as any)?.mutate;
  const updateMutate =
    (updateHook as any)?.mutateAsync ?? (updateHook as any)?.mutate;

  /* ---------- USER ITEM (always present) ---------- */
  const { user } = useAuthStore();
  const userItem = useMemo(
    () => ({ id: user?.id ?? "USER", title: user?.name ?? "Yourself" }),
    [user?.id, user?.name],
  );

  /* ---------- INITIAL VALUES ---------- */
  const initialValues = useMemo(() => {
    if (!parsedLoan) {
      return {
        lender_id: "",
        loan_type: "",
        loan_status: "active",
        distribution_date: null,
        principal_sanction: "",
        total_amount_paid: "",
        principal_outstanding: "",
        interest_outstanding: "",
        total_outstanding: "",
        repayment_type: "onetime",
        emi_amount: "",
        tenure_month: "",
        emi_date: null,
        rate_pa: "",
        rate_type: "simple",
        purpose: "",
      } as LoanFormData;
    }
    return {
      lender_id: parsedLoan.lender_id ?? "",
      loan_type: parsedLoan.loan_type ?? "",
      loan_status: parsedLoan.loan_status ?? "active",
      distribution_date: parsedLoan.distribution_date ?? null,
      principal_sanction: String(
        parsedLoan.loan_amount_details?.principal_sanction ?? "",
      ),
      total_amount_paid: String(
        parsedLoan.loan_amount_details?.total_amount_paid ?? "",
      ),
      principal_outstanding: String(
        parsedLoan.loan_amount_details?.principal_outstanding ?? "",
      ),
      interest_outstanding: String(
        parsedLoan.loan_amount_details?.interest_outstanding ?? "",
      ),
      total_outstanding: String(
        parsedLoan.loan_amount_details?.total_outstanding ?? "",
      ),
      repayment_type: parsedLoan.repayment_details?.repayment_type ?? "onetime",
      emi_amount: String(parsedLoan.repayment_details?.payment_made ?? ""),
      tenure_month: "",
      emi_date: null,
      rate_pa: String(parsedLoan.interest_rate_details?.rate_pa ?? ""),
      rate_type: parsedLoan.interest_rate_details?.rate_type ?? "simple",
      purpose: parsedLoan.purpose ?? "",
    } as LoanFormData;
  }, [parsedLoan]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    watch,
  } = useForm<LoanFormData>({ values: initialValues });

  const [
    repayment_type,
    principal_sanction,
    total_amount_paid,
    tenure_month,
    rate_pa,
    rate_type,
  ] = watch([
    "repayment_type",
    "principal_sanction",
    "total_amount_paid",
    "tenure_month",
    "rate_pa",
    "rate_type",
  ]);

  /* ---------- CALCULATIONS ---------- */
  useEffect(() => {
    const pSanction = Number(principal_sanction || 0);
    const paid = Number(total_amount_paid || 0);
    const totalPrincipal = Math.max(0, pSanction - paid);
    setValue("principal_outstanding", totalPrincipal.toFixed(2));

    if (repayment_type === "emi" && Number(tenure_month) > 0) {
      const n = Number(tenure_month);
      const annualRate = Number(rate_pa || 0);
      let emi = 0;
      let totalInterest = 0;

      if (rate_type === "simple") {
        totalInterest = totalPrincipal * (annualRate / 100) * (n / 12);
        emi = (totalPrincipal + totalInterest) / n;
      } else if (rate_type === "variable") {
        const monthlyRate = ((annualRate || 0) + 2) / 12 / 100;
        emi =
          monthlyRate > 0
            ? (totalPrincipal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
              (Math.pow(1 + monthlyRate, n) - 1)
            : totalPrincipal / n;
        let outstanding = totalPrincipal;
        for (let i = 0; i < n; i++) {
          const interest = outstanding * monthlyRate;
          totalInterest += interest;
          outstanding -= Math.max(0, emi - interest);
        }
      }

      setValue("emi_amount", emi.toFixed(2));
      setValue("interest_outstanding", totalInterest.toFixed(2));
      setValue(
        "total_outstanding",
        (totalPrincipal + totalInterest).toFixed(2),
      );
    } else {
      setValue("total_outstanding", totalPrincipal.toFixed(2));
      setValue("interest_outstanding", "0.00");
      setValue("emi_amount", "0.00");
    }
  }, [
    repayment_type,
    principal_sanction,
    total_amount_paid,
    tenure_month,
    rate_pa,
    rate_type,
    setValue,
  ]);

  const filteredFields = useMemo(
    () =>
      formFields
        .filter((f) => !hiddenFields.includes(f.name))
        .filter((f) => repayment_type === "emi" || f.dep !== "emi"),
    [repayment_type, hiddenFields],
  );

  /* ---------- SUBMIT ---------- */
  const onSubmit = useCallback(
    async (data: LoanFormData) => {
      const normalized = {
        ...data,
        distribution_date: data.distribution_date
          ? new Date(data.distribution_date).toISOString()
          : null,
        emi_date: data.emi_date ?? 1,
        principal_sanction: Number(data.principal_sanction || 0),
        total_amount_paid: Number(data.total_amount_paid || 0),
        principal_outstanding: Number(data.principal_outstanding || 0),
        interest_outstanding: Number(data.interest_outstanding || 0),
        total_outstanding: Number(data.total_outstanding || 0),
        emi_amount: Number(data.emi_amount || 0),
        tenure_month: Number(data.tenure_month || 0),
        rate_pa: Number(data.rate_pa || 0),
      };
      try {
        if (loanId && updateMutate) {
          await updateMutate({ loanId, ...normalized });
        } else if (addMutate) {
          await addMutate(normalized);
        }
      } catch (err) {
        console.error("Failed to submit loan:", err);
      }
    },
    [loanId, addMutate, updateMutate],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={styles.headerRightContainer}
        >
          <Text style={styles.saveButton}>{loanId ? "Update" : "Save"}</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit, onSubmit, loanId]);

  /* ---------- DATE PICKER ---------- */
  const onDateChange = (_: any, selectedDate?: Date) => {
    // Only set value if user selected a date; on cancel selectedDate is undefined
    if (datePickerFor) {
      if (selectedDate) {
        setValue(datePickerFor, selectedDate.toISOString(), {
          shouldValidate: true,
        });
      }
    }
    setDatePickerFor(null);
  };

  const debouncedQuery = useDebounce(query, 500);

  const handleSearchBorrowers = useCallback(
    async (q: string) => {
      try {
        const results = q.trim() ? await searchBorrower(q) : [];
        const filtered = results.filter((r) => r._id !== user?.id);
        setBorrowerOptions(
          filtered.map((el: any) => ({ id: el._id, title: el.name })),
        );
      } catch (err) {
        console.error("Error searching borrowers:", err);
        setBorrowerOptions([userItem]);
      }
    },
    [user?.id, userItem],
  );

  useEffect(() => {
    if (debouncedQuery) {
      handleSearchBorrowers(debouncedQuery);
    } else {
      setBorrowerOptions([userItem]);
    }
  }, [debouncedQuery, handleSearchBorrowers, userItem]);

  useEffect(() => {
    if (!existingLoan && user?.id) {
      setValue("lender_id", user.id || "USER");
    }
  }, [existingLoan, user?.id, setValue]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollView}
          enableOnAndroid
          extraScrollHeight={300}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {filteredFields.map((field) => {
            const isDisabled = nonEditableFields.includes(field.name);
            return (
              <View key={field.name} style={styles.fieldContainer}>
                <Controller
                  control={control}
                  name={field.name}
                  rules={field.rules}
                  render={({ field: { onChange, onBlur, value } }) => {
                    switch (field.type) {
                      case "date": {
                        const dateVal = getValues(field.name);
                        return (
                          <TouchableOpacity
                            onPress={() =>
                              !isDisabled && setDatePickerFor(field.name)
                            }
                            style={[
                              styles.datePickerButton,
                              isDisabled && styles.disabledField,
                            ]}
                          >
                            <Text
                              style={[
                                styles.datePickerText,
                                isDisabled && styles.disabledText,
                              ]}
                            >
                              {dateVal
                                ? new Date(dateVal).toLocaleDateString()
                                : field.label || field.placeholder}
                            </Text>
                          </TouchableOpacity>
                        );
                      }

                      case "dropdown":
                        return (
                          <SelectDropdown
                            data={field.options?.map((opt) => opt.label) ?? []}
                            defaultValue={
                              field.options?.find((opt) => opt.value === value)
                                ?.label
                            }
                            onSelect={(selectedItem, index) => {
                              const val = field.options?.[index]?.value ?? "";
                              onChange(val);
                            }}
                            renderButton={(selectedItem) => (
                              <View style={styles.dropdownButton}>
                                <Text style={styles.dropdownButtonText}>
                                  {selectedItem ?? field.label}
                                </Text>
                              </View>
                            )}
                            renderItem={(item, index) => (
                              <TouchableOpacity
                                key={index}
                                style={styles.dropdownRow}
                              >
                                <Text>{item}</Text>
                              </TouchableOpacity>
                            )}
                            dropdownStyle={styles.dropdownStyle}
                          />
                        );

                      case "autoCompleteDropdown":
                        return (
                          <AutocompleteDropdown
                            dataSet={borrowerOptions}
                            onChangeText={(text) => {
                              if (!isDisabled) {
                                setQuery(text);
                                if (!text.trim()) setValue(field.name, "");
                              }
                            }}
                            onSelectItem={(item) =>
                              !isDisabled && onChange(item?.id)
                            }
                            textInputProps={{
                              placeholder: field.label || "Enter Borrower Name",
                              placeholderTextColor:
                                theme.colors.onSurfaceVariant,
                              editable: !isDisabled,
                            }}
                            inputContainerStyle={[
                              styles.autoCompleteInput,
                              isDisabled && styles.disabledField,
                            ]}
                            clearOnFocus={false}
                            closeOnBlur
                            showClear={false}
                          />
                        );

                      default:
                        return (
                          <TextInput
                            mode="outlined"
                            label={field.label || field.placeholder}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={(value as string) ?? ""}
                            keyboardType={field.keyboardType || "default"}
                            style={styles.input}
                            theme={theme}
                            outlineStyle={[
                              { borderRadius: 12 },
                              isDisabled && styles.disabledOutline,
                            ]}
                            editable={!isDisabled}
                            contentStyle={
                              isDisabled ? styles.disabledContent : undefined
                            }
                          />
                        );
                    }
                  }}
                />
                {errors[field.name] && (
                  <Text style={styles.errorText}>
                    {errors[field.name]?.message as string}
                  </Text>
                )}
              </View>
            );
          })}
        </KeyboardAwareScrollView>

        {datePickerFor && (
          <DateTimePicker
            value={
              getValues(datePickerFor)
                ? new Date(getValues(datePickerFor) as string)
                : new Date()
            }
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------- STYLES (unchanged) ---------- */
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { paddingVertical: 20, paddingHorizontal: 16, paddingBottom: 32 },
  headerRightContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
  },
  saveButton: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  fieldContainer: { marginBottom: 24 },
  input: {
    backgroundColor: theme.colors.surface,
    fontSize: 16,
    fontFamily: "System",
  },
  disabledOutline: { borderColor: theme.colors.outline },
  disabledContent: { color: "#000" },
  dropdownButton: {
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  dropdownButtonText: { fontSize: 16, color: "#000", fontFamily: "System" },
  dropdownRow: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outline,
  },
  dropdownStyle: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    maxHeight: 200,
    marginTop: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  datePickerButton: {
    height: 50,
    justifyContent: "center",
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  datePickerText: { fontSize: 16, color: "#000", fontFamily: "System" },
  disabledText: { color: theme.colors.onSurfaceVariant },
  autoCompleteInput: {
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 8,
    fontFamily: "System",
    fontWeight: "500",
  },
  disabledField: {
    backgroundColor: "#F9FAFB",
    opacity: 0.6,
    borderColor: theme.colors.outline,
  },
});
