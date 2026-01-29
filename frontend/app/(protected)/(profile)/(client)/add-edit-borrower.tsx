import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFetchBorrower } from "@/hooks/api/borrower/useFetchBorrower";
import { useForm, Controller } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { useAuth } from "@/hooks/api/useAuth";
import { useAddBorrower } from "@/hooks/api/borrower/useAddBorrower";
import { CreateBorrower } from "@/types/borrower";

export default function AddEditBorrower() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { mutate: addBorrower } = useAddBorrower();

  const { data: borrows } = useFetchBorrower();

  const borrowerDetails = borrows?.find((b) => b._id === id);

  type BorrowerFormValues = {
    name: string;
    phone_no: string;
    email: string;
    user_id?: string;
  };

  type FormField = {
    name: keyof BorrowerFormValues;
    placeholder: string;
    rules: any;
    type?: string;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  };

  const formFields: FormField[] = [
    {
      name: "user_id",
      placeholder: "User ID",
      rules: { required: "User ID is required" },
    },
    {
      name: "name",
      placeholder: "Name",
      rules: { required: "Name is required" },
    },
    {
      name: "phone_no",
      placeholder: "Phone Number",
      rules: { required: "Required" },
      keyboardType: "numeric",
    },
    {
      name: "email",
      placeholder: "Email ID",
      rules: { required: "Required" },
      keyboardType: "email-address",
    },
  ];

  const hiddenFields: string[] = ["user_id"];

  const filteredFields = useMemo(
    () => formFields.filter((field) => !hiddenFields.includes(field.name)),
    []
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BorrowerFormValues>({
    defaultValues: {
      name: borrowerDetails?.name || "",
      phone_no: borrowerDetails?.contact?.phone_no?.toString() || "",
      email: borrowerDetails?.contact?.email || "",
      user_id: borrowerDetails?._id || user.id,
    },
  });

  const onSubmit = (data: BorrowerFormValues) => {
    const payload: CreateBorrower = {
      user_id: data.user_id || "",
      name: data.name,
      contact: {
        phone_no: Number(data.phone_no),
        email: data.email,
      },
    };
    console.log("Form Data:", payload);
    addBorrower(payload);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={handleSubmit(onSubmit)}>
          <Text style={styles.saveButton}>Save</Text>
        </Pressable>
      ),
    });
  }, [navigation, handleSubmit]);

  return (
    <View style={styles.container}>
      {filteredFields.map((field) => (
        <View key={field.name} style={styles.fieldContainer}>
          <Controller
            control={control}
            name={field.name as keyof BorrowerFormValues}
            rules={field.rules}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                mode="outlined"
                label={field.placeholder}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value as string}
                keyboardType={field.keyboardType || "default"}
                style={styles.input}
                theme={{ colors: { primary: "#007AFF" } }}
              />
            )}
          />
          {errors[field.name] && (
            <Text style={styles.errorText}>
              {errors[field.name]?.message?.toString()}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", padding: 16 },
  scrollView: { paddingVertical: 15, paddingHorizontal: 16 },
  saveButton: { color: "#007AFF", fontSize: 16, fontWeight: "600" },
  fieldContainer: { marginBottom: 18 },
  input: { backgroundColor: "#fff", fontSize: 15 },
  errorText: { color: "red", marginTop: 4, fontSize: 12 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  picker: {},
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  datePickerText: { fontSize: 15, color: "#111" },
  datePickerPlaceholder: { fontSize: 15, color: "#9A9A9A" },
});
