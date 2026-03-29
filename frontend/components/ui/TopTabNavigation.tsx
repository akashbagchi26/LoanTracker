import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

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
  const theme = useColorScheme();
  const colors = Colors[theme];

  return (
    <Tab.Navigator
      screenOptions={{
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
      }}
    >
      {tabs.map((tab) => {
        const ScreenComponent = () => (
          <View
            style={[styles.tabScreen, { backgroundColor: colors.background }]}
          >
            {tab.content}
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
    paddingTop: 10,
  },
  tabText: {
    fontSize: 16,
    textAlign: "center",
  },
});
