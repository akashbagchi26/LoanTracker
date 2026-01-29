import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const Tab = createMaterialTopTabNavigator();

type TabScreen = {
  name: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  tabs: TabScreen[];
};

export default function TopTabNavigation({ tabs }: Props) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: true,
        tabBarLabelStyle: {
          fontWeight: '700',
          textAlign: 'left',
          fontSize: 14,
          textTransform: 'none',
        },
        tabBarItemStyle: {
          width: 'auto',
          alignItems: 'flex-start',
        },
        tabBarStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          borderBottomWidth: 0.1,
          borderBottomColor: '#e0e0e0',
        },
        tabBarIndicatorStyle: {
          backgroundColor: '#000',
          height: 1,
          marginLeft: 10,
          width: 'auto',
        },
      }}
    >
      {tabs.map((tab) => {
        const ScreenComponent = () => (
          <View style={styles.tabScreen}>
            {typeof tab.content === 'string' ? (
              <Text style={styles.tabText}>{tab.content}</Text>
            ) : (
              tab.content
            )}
          </View>
        );

        return (
          <Tab.Screen
            key={tab.name}
            name={tab.name}
            component={ScreenComponent}
            options={{ title: tab.title }}
          />
        );
      })}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabScreen: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingTop: 10
  },
  tabText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
});

