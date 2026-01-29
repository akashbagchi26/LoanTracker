import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

type LentItem = {
  id: string;
  source: string;
  amount: number;
  type?: string;
};

type LoanChain = {
  id: number;
  name: string;
  lent: LentItem[];
};

const loanChains: LoanChain[] = [
  {
    id: 1,
    name: 'Ram Kumar',
    lent: [
      { id: 'HDFC-RAM-001', source: 'HDFC Credit Card', amount: 500, type: 'credit' },
      { id: 'AXIS-RAM-002', source: 'AXIS Credit Card', amount: 100, type: 'credit' },
      { id: 'SBI-RAM-003', source: 'SBI Loan', amount: 3000, type: 'loan' },
    ],
  },
  {
    id: 2,
    name: 'Sham Sharma',
    lent: [
      { id: 'ICICI-SHAM-001', source: 'ICICI Credit Card', amount: 5000, type: 'credit' },
      { id: 'HDFC-SHAM-002', source: 'HDFC Credit Card', amount: 7000, type: 'credit' },
    ],
  },
  {
    id: 3,
    name: 'Sita Devi',
    lent: [],
  },
  {
    id: 4,
    name: 'Gita Singh',
    lent: [
      { id: 'PNB-GITA-001', source: 'PNB Home Loan', amount: 150000, type: 'loan' },
    ],
  },
  {
    id: 5,
    name: 'Arjun Verma',
    lent: [
      { id: 'KOTAK-ARJUN-001', source: 'Kotak Credit Card', amount: 2500, type: 'credit' },
      { id: 'BAJAJ-ARJUN-002', source: 'Bajaj Finserv Loan', amount: 50000, type: 'loan' },
    ],
  },
  {
    id: 6,
    name: 'Priya Mehta',
    lent: [
      { id: 'AMEX-PRIYA-001', source: 'American Express Card', amount: 12000, type: 'credit' },
    ],
  },
  {
    id: 7,
    name: 'Rohan Joshi',
    lent: [
      { id: 'SBI-ROHAN-001', source: 'SBI Credit Card', amount: 800, type: 'credit' },
      { id: 'HDFC-ROHAN-002', source: 'HDFC Personal Loan', amount: 75000, type: 'loan' },
      { id: 'AXIS-ROHAN-003', source: 'AXIS Credit Card', amount: 3200, type: 'credit' },
    ],
  },
  {
    id: 8,
    name: 'Kavita Patel',
    lent: [],
  },
  {
    id: 9,
    name: 'Vikram Reddy',
    lent: [
      { id: 'ICICI-VIKRAM-001', source: 'ICICI Car Loan', amount: 350000, type: 'loan' },
    ],
  },
  {
    id: 10,
    name: 'Anjali Gupta',
    lent: [
      { id: 'CITI-ANJALI-001', source: 'CITI Credit Card', amount: 9500, type: 'credit' },
    ],
  },
  {
    id: 11,
    name: 'Suresh Iyer',
    lent: [
      { id: 'HDFC-SURESH-001', source: 'HDFC Credit Card', amount: 4500, type: 'credit' },
      { id: 'SBI-SURESH-002', source: 'SBI Credit Card', amount: 1500, type: 'credit' },
    ]
  }
];

export default function LoanChainList() {
  const renderLentItem = ({ item }: { item: LentItem }) => (
    <View style={styles.lentItem}>
      <Text style={styles.source}>{item.source}</Text>
      <View style={styles.amountContainer}>
        <Text style={styles.amount}>₹{item.amount}</Text>
        <View
          style={[
            styles.badge,
            item.type === 'credit' ? styles.creditBadge : styles.loanBadge,
          ]}
        >
          <Text style={styles.badgeText}>{item.type}</Text>
        </View>
      </View>
    </View>
  );

  const calculateTotal = (lent: LentItem[]) =>
    lent.reduce((total, item) => total + item.amount, 0);

  const renderGroup = ({ item }: { item: LoanChain }) => (
    item.lent && item.lent.length > 0 ? (
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.totalAmount}>Total: ₹{calculateTotal(item.lent)}</Text>
        </View>
        <FlatList
          data={item.lent}
          keyExtractor={(item) => item.id}
          renderItem={renderLentItem}
          scrollEnabled={false}
        />
      </View>
    ) : null
  );
  return (
    <View style={styles.container}>
      <FlatList
        data={loanChains}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderGroup}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 5,
    marginTop: 2
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1e88e5',
  },
  lentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'center',
  },
  source: {
    fontSize: 16,
    color: '#444',
    flex: 1,
    flexWrap: 'wrap',
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    fontSize: 16,
    color: '#333',
    marginRight: 4,
  },
  badge: {
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 4,
  },
  creditBadge: {
    backgroundColor: '#e0f2ff',
  },
  loanBadge: {
    backgroundColor: '#ffe0e0',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#555',
    textTransform: 'capitalize',
  },
});
