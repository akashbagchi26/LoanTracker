import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 40) / 2;

export function CardButton({
  title,
  subtitle,
  onPress,
  color = "primary",
  iconName,
  disabled = false,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  color?: "primary" | "success" | "warning" | "error";
  iconName: React.ComponentProps<typeof FontAwesome5>["name"];
  disabled?: boolean;
}) {
  const theme = useColorScheme();
  const themeColors = Colors[theme];
  const accentColor = themeColors[color] || themeColors.primary;

  return (
    <View style={styles.cardContainer}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: themeColors.card,
            borderColor: themeColors.border,
            borderLeftColor: accentColor,
            opacity: disabled ? 0.5 : pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: `${accentColor}15` },
              ]}
            >
              <FontAwesome5
                name={iconName}
                color={accentColor}
                size={14}
                solid
              />
            </View>
            <Text
              numberOfLines={1}
              style={[styles.title, { color: themeColors.secondaryText }]}
            >
              {title}
            </Text>
          </View>
          {subtitle && (
            <Text
              numberOfLines={1}
              style={[styles.amount, { color: themeColors.text }]}
            >
              {subtitle}
            </Text>
          )}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  amount: {
    fontSize: 20,
    fontWeight: "800",
    marginTop: 2,
  },
});
