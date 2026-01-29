import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  onLendPress?: () => void;
  onBorrowPress?: () => void;
}

export default function LendBorrowButtons({ onLendPress, onBorrowPress }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#00C853' }]}
        onPress={onLendPress || (() => router.push('/(protected)/loans/add-loan'))}
      >
        <Text style={styles.text}>Add Loan</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        style={[styles.button, { backgroundColor: '#E53935' }]}
        onPress={onBorrowPress || (() => router.push('/borrow-form'))}
      >
        <Text style={styles.text}>Borrow</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
