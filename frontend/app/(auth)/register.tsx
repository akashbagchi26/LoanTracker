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
import { useRegister } from "@/hooks/api/useAuth";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

export default function RegisterScreen() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const { mutate: registerMutation, isPending } = useRegister();

  const onSubmit = async (data: any) => {
    registerMutation(data);
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
          <Text style={[styles.title, { color: colors.text }]}>
            Join the Future
          </Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Manage your finances with clarity and precision
          </Text>

          <View style={styles.form}>
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
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    placeholder="John Doe"
                    placeholderTextColor={colors.secondaryText}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name && (
                <Text style={[styles.fieldError, { color: colors.error }]}>
                  {errors.name.message}
                </Text>
              )}
            </View>

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
                    placeholder="john@example.com"
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
                Secure Password
              </Text>
              <Controller
                control={control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
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
                <Text style={styles.buttonText}>Create Workspace</Text>
              )}
            </TouchableOpacity>

            <Link href="/login" asChild>
              <TouchableOpacity style={styles.footerLink}>
                <Text
                  style={[styles.linkText, { color: colors.secondaryText }]}
                >
                  Already have an account?{" "}
                  <Text style={{ color: colors.primary, fontWeight: "700" }}>
                    Log In
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
  title: {
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 8,
    marginBottom: 40,
    textAlign: "center",
    fontWeight: "600",
    paddingHorizontal: 12,
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
  fieldError: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 6,
    marginLeft: 4,
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
    fontWeight: "800",
    fontSize: 16,
  },
  footerLink: {
    marginTop: 24,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
