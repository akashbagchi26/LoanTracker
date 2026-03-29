import React from "react";
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/api/useAuth";
import { useRouter } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

type FormData = {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
};

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      oldPassword: user?.oldPassword || "",
      newPassword: user?.newPassword || "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Updated Profile:", data);
    Alert.alert(
      "Profile Updated",
      "Your profile has been successfully updated.",
    );
    router.back();
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.infoBox,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Personal Details
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            Full Name
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Name"
                placeholderTextColor={colors.secondaryText}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.name && (
            <Text style={[styles.errorText, { color: colors.error }]}>
              {errors.name.message}
            </Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            Email
          </Text>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid format",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>

      <View
        style={[
          styles.infoBox,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            marginTop: 20,
          },
        ]}
      >
        <Text style={[styles.sectionLabel, { color: colors.secondaryText }]}>
          Security
        </Text>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            Old Password
          </Text>
          <Controller
            control={control}
            name="oldPassword"
            rules={{ required: "Old Password is required" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="••••••••••"
                placeholderTextColor={colors.secondaryText}
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.secondaryText }]}>
            New Password
          </Text>
          <Controller
            control={control}
            name="newPassword"
            rules={{ minLength: { value: 6, message: "Min 6 characters" } }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                placeholder="••••••••••"
                placeholderTextColor={colors.secondaryText}
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={handleSubmit(onSubmit)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="checkmark-circle"
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  infoBox: {
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
    marginLeft: 4,
  },
  input: {
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    fontWeight: "600",
  },
  errorText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    marginLeft: 4,
  },
  button: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});
