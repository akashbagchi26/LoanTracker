import { useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useFetchBorrower } from "@/hooks/api/borrower/useFetchBorrower";
import { useForm, Controller } from "react-hook-form";
import { TextInput } from "react-native-paper";
import { useAuth } from "@/hooks/api/useAuth";
import { useAddBorrower } from "@/hooks/api/borrower/useAddBorrower";
import { CreateBorrower } from "@/types/borrower";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function AddEditBorrower() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useAuth();
  const { mutate: addBorrower } = useAddBorrower();
  const theme = useColorScheme();
  const colors = Colors[theme];

  const { data: borrows } = useFetchBorrower();
  const borrowerDetails = borrows?.find((b) => b._id === id);

  type BorrowerFormValues = {
    name: string;
    phone_no: string;
    email: string;
    user_id?: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
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
    addBorrower(payload);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleSubmit]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View
          style={[
            styles.infoCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.secondaryText }]}>
            Basic Information
          </Text>

          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Borrower Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.name}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  textColor={colors.text}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  theme={{
                    colors: {
                      primary: colors.primary,
                      text: colors.text,
                      placeholder: colors.secondaryText,
                    },
                  }}
                />
              )}
            />
            {errors.name && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {errors.name.message}
              </Text>
            )}
          </View>

          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="phone_no"
              rules={{ required: "Required" }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Contact Phone"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="numeric"
                  error={!!errors.phone_no}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  textColor={colors.text}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  theme={{ colors: { primary: colors.primary } }}
                />
              )}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  mode="outlined"
                  label="Contact Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  error={!!errors.email}
                  style={[styles.input, { backgroundColor: colors.card }]}
                  textColor={colors.text}
                  outlineColor={colors.border}
                  activeOutlineColor={colors.primary}
                  theme={{ colors: { primary: colors.primary } }}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

import { TouchableOpacity } from "react-native";

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16 },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoCard: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  fieldContainer: { marginBottom: 18 },
  input: { fontSize: 15 },
  errorText: { marginTop: 4, fontSize: 12, fontWeight: "700" },
});
