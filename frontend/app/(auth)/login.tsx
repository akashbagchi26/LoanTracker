import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Link } from "expo-router";
import { useLogin } from "@/hooks/api/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginMutation, isPending, error } = useLogin();

  const onSubmit = (data: any) => {
    loginMutation(data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={[
            styles.container,
            { backgroundColor: colors.background },
          ]}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}
          >
            <Ionicons name="wallet" size={48} color={colors.primary} />
          </View>

          <Text style={[styles.title, { color: colors.text }]}>
            Loan Tracker
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Precision in every transaction
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.secondaryText }]}>
                Email Address
              </Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: "Email is required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Enter a valid email address",
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="name@example.com"
                    placeholderTextColor={colors.secondaryText}
                    onChangeText={onChange}
                    value={value}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              />
              {errors.email && (
                <Text style={[styles.fieldError, { color: colors.error }]}>
                  {errors.email.message}
                </Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.secondaryText }]}>
                Password
              </Text>
              <Controller
                control={control}
                name="password"
                rules={{ required: "Password is required" }}
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="••••••••"
                    placeholderTextColor={colors.secondaryText}
                    secureTextEntry
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.password && (
                <Text style={[styles.fieldError, { color: colors.error }]}>
                  {errors.password.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={handleSubmit(onSubmit)}
              disabled={isPending}
            >
              {isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.buttonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {error && (
              <View
                style={[
                  styles.serverErrorBox,
                  {
                    backgroundColor: colors.error + "15",
                    borderColor: colors.error,
                  },
                ]}
              >
                <Text style={[styles.serverError, { color: colors.error }]}>
                  {(error as any)?.data?.error ||
                    "Login failed. Please try again."}
                </Text>
              </View>
            )}

            <Link href="/register" asChild>
              <TouchableOpacity style={styles.footerLink}>
                <Text
                  style={[styles.linkText, { color: colors.secondaryText }]}
                >
                  New to Loan Tracker?{" "}
                  <Text style={{ color: colors.primary, fontWeight: "700" }}>
                    Create Account
                  </Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 32,
    justifyContent: "center",
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 40,
    fontWeight: "600",
  },
  form: {
    width: "100%",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    padding: 16,
    borderRadius: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
  footerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
  fieldError: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  serverErrorBox: {
    padding: 12,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
  },
  serverError: {
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
});
