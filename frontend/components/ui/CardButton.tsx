import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import React from "react";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { ColorKey } from './ColorLayout';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export function CardButton({
  title,
  subtitle,
  onPress,
  color,
  iconName,
  disabled = false,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  color: keyof typeof ColorKey;
  iconName: React.ComponentProps<typeof FontAwesome5>['name'];
  disabled?: boolean;
}) {
  return (
    <Pressable onPress={onPress} disabled={disabled}>
      <Card
        style={[
          styles.card,
          { borderLeftColor: ColorKey[color] },
          disabled && styles.disabled,
        ]}
      >
        <View style={styles.content}>
          <View style={styles.row}>
            <View style={[styles.iconWrapper, { backgroundColor: `${ColorKey[color]}22` }]}>
              <FontAwesome5 name={iconName} color={ColorKey[color]} size={18} solid />
            </View>
            <Text style={styles.title}>{title}</Text>
          </View>
          {subtitle && <Text style={styles.amount}>{subtitle}</Text>}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    marginBottom: 12,
    borderRadius: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    backgroundColor: '#fff',
    borderLeftWidth: 3,
  },
  disabled: {
    opacity: 0.4,
  },
  content: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  iconWrapper: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
  },
  amount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
});
