import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  accessibilityLabel: string;
  accessibilityHint?: string;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  accessibilityLabel,
  accessibilityHint,
  fullWidth = false,
}) => {
  const { colors, typography, layout } = useTheme();

  const getBackgroundColor = (pressed: boolean) => {
    if (disabled) return colors.disabled;
    switch (variant) {
      case 'primary':
        return pressed ? colors.primaryDark : colors.primary;
      case 'secondary':
        return pressed ? colors.primaryMuted : colors.surfaceVariant;
      case 'danger':
        return pressed ? '#B91C1C' : colors.emergency;
      case 'outline':
      case 'ghost':
        return pressed ? colors.primaryMuted : 'transparent';
      default:
        return colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return colors.disabledText;
    switch (variant) {
      case 'primary':
        return colors.textInverse;
      case 'secondary':
        return colors.textPrimary;
      case 'danger':
        return '#FFFFFF';
      case 'outline':
        return colors.primary;
      case 'ghost':
        return colors.textPrimary;
      default:
        return colors.textInverse;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm':
        return 48; // Android minimum touch target
      case 'lg':
        return 56;
      case 'md':
      default:
        return 50;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      android_ripple={{
        color: variant === 'primary' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(13, 148, 136, 0.15)',
        borderless: false,
      }}
      style={({ pressed }) => [
        styles.baseButton,
        {
          minHeight: layout.minTapTarget,
          height: getHeight(),
          backgroundColor: getBackgroundColor(pressed),
          borderColor:
            variant === 'outline'
              ? disabled
                ? colors.disabled
                : colors.primary
              : 'transparent',
          borderWidth: variant === 'outline' ? 2 : 0,
          borderRadius: layout.borderRadius.md,
          width: fullWidth ? '100%' : undefined,
          opacity: disabled ? 0.6 : 1,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
          accessibilityLabel="Loading action"
        />
      ) : (
        <View style={styles.contentContainer}>
          {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
          <Text
            style={[
              typography.button,
              {
                color: getTextColor(),
                fontSize: size === 'lg' ? 18 : 16,
              },
            ]}
          >
            {title}
          </Text>
          {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginVertical: 4,
    ...Platform.select({
      android: {
        elevation: 1,
      },
    }),
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});
