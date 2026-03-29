import RecordList from "@/components/ui/RecordList";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const Tab = createMaterialTopTabNavigator();

type TabScreen = {
  name: string;
  title: string;
  content: React.ReactNode;
};

const tabs: TabScreen[] = [
  { name: "Given", title: "Given", content: <RecordList module="given" /> },
  { name: "Taken", title: "Taken", content: <RecordList module="taken" /> },
];

export default function Loan() {
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarScrollEnabled: false,
        tabBarLabelStyle: {
          fontWeight: "700",
          fontSize: 14,
          textTransform: "none",
        },
        tabBarStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarIndicatorStyle: {
          backgroundColor: colors.primary,
          height: 3,
          borderRadius: 3,
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
          {() => (
            <View
              style={[styles.container, { backgroundColor: colors.background }]}
            >
              {tab.content}
            </View>
          )}
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
  },
});
