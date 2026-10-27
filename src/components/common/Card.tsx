import React from 'react';
import {
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
  variant?: 'elevated' | 'outlined' | 'flat';
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'elevated',
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { colors, layout } = useTheme();

  const getBorderColor = () => {
    switch (variant) {
      case 'outlined':
        return colors.border;
      case 'flat':
        return colors.borderSubtle;
      case 'elevated':
      default:
        return colors.borderSubtle;
    }
  };

  const getElevation = () => {
    if (variant === 'elevated') {
      return Platform.OS === 'android' ? 3 : undefined;
    }
    return 0;
  };

  const content = (
    <View
      style={[
        styles.baseCard,
        {
          backgroundColor: variant === 'flat' ? colors.surfaceVariant : colors.surfaceCard,
          borderColor: getBorderColor(),
          borderWidth: 1,
          borderRadius: layout.borderRadius.lg,
          elevation: getElevation(),
        },
        variant === 'elevated' && layout.shadows.light,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        android_ripple={{
          color: colors.primaryMuted,
          borderless: false,
        }}
        style={({ pressed }) => [
          styles.pressableContainer,
          { opacity: pressed && Platform.OS !== 'android' ? 0.92 : 1 },
        ]}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  pressableContainer: {
    marginVertical: 6,
  },
  baseCard: {
    padding: 18,
    marginVertical: 6,
    overflow: 'hidden',
  },
});
