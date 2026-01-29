import React from 'react';
import { Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '@/hooks/api/useAuth';
import { useRouter } from 'expo-router';

type FormData = {
  name: string;
  email: string;
  oldPassword: string;
  newPassword: string;
};

export default function EditProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      oldPassword: user?.oldPassword || '',
      newPassword: user?.newPassword || '',
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Updated Profile:", data);
    Alert.alert("Profile Updated", "Your profile has been successfully updated.");
    router.back();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Name Field */}
      <Controller
        control={control}
        name="name"
        rules={{ required: 'Name is required' }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.name && styles.errorInput]}
              placeholder="Name"
              value={value}
              onChangeText={onChange}
            />
            {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
          </>
        )}
      />

      {/* Email Field */}
      <Controller
        control={control}
        name="email"
        rules={{
          required: 'Email is required',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format',
          },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.email && styles.errorInput]}
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
          </>
        )}
      />

      {/* Enter Old Password Field */}
      <Controller
        control={control}
        name="oldPassword"
        rules={{
          required: 'Old Password is required',
          minLength: { value: 10, message: 'Must be your old password' },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.oldPassword && styles.errorInput]}
              placeholder="Enter Old Password"
              value={value}
              onChangeText={onChange}
            />
            {errors.oldPassword && <Text style={styles.errorText}>{errors.oldPassword.message}</Text>}
          </>
        )}
      />

      {/* Enter New Password Field */}
      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: 'New Password is required',
          minLength: { value: 10, message: 'Must be a new password' },
        }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={[styles.input, errors.newPassword && styles.errorInput]}
              placeholder="Enter New Password"
              value={value}
              onChangeText={onChange}
            />
            {errors.newPassword && <Text style={styles.errorText}>{errors.newPassword.message}</Text>}
          </>
        )}
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#222',
  },
  input: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: '#E53935',
  },
  errorText: {
    color: '#E53935',
    marginBottom: 8,
    fontSize: 13,
  },
  button: {
    backgroundColor: '#00C853',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
