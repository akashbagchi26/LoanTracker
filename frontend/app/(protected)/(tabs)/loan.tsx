import RecordList from '@/components/ui/RecordList';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

type TabScreen = {
  name: string;
  title: string;
  content: React.ReactNode;
};

const tabs: TabScreen[] = [
  { name: 'Given', title: 'Given', content: <RecordList module="given" /> },
  { name: 'Taken', title: 'Taken', content: <RecordList module="taken" /> },
];

export default function Loan() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 14,
          textAlign: 'center',
        },
        tabBarStyle: {
          justifyContent: 'space-between',
          backgroundColor: '#fff',
        },
        tabBarItemStyle: {
          flex: 1,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          options={{ title: tab.title }}
        >
          {() => <View style={styles.container}>{tab.content}</View>}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
});
