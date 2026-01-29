import RecordList from '@/components/ui/RecordList';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CloseLoans() {

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal: 5 }}>
        <Text style={styles.header}>Close Loans</Text>
        <Text >View All</Text>
      </View>
      <RecordList module={"close_loan"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
});
