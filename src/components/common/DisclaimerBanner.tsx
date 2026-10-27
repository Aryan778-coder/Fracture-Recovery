import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

export type DisclaimerVariant = 'disclaimer' | 'approval' | 'warning' | 'emergency';

interface DisclaimerBannerProps {
  variant?: DisclaimerVariant;
  text?: string;
  title?: string;
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({
  variant = 'approval',
  text,
  title,
  compact = false,
}) => {
  const { colors, typography, layout } = useTheme();

  const getConfig = () => {
    switch (variant) {
      case 'approval':
        return {
          bg: colors.primaryMuted,
          border: colors.primary,
          iconColor: colors.primary,
          iconName: 'shield-checkmark-outline' as const,
          defaultTitle: 'Clinical Protocol Notice',
          defaultText: 'Perform only after your doctor or physiotherapist approves. Never force movement past acute pain.',
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          border: colors.warning,
          iconColor: colors.warning,
          iconName: 'alert-circle-outline' as const,
          defaultTitle: 'Stop Immediately If:',
          defaultText: 'Sharp pain, joint locking, or pins-and-needles numbness occur. Rest immediately.',
        };
      case 'emergency':
        return {
          bg: colors.emergencyLight,
          border: colors.emergency,
          iconColor: colors.emergency,
          iconName: 'warning-outline' as const,
          defaultTitle: 'Urgent Red-Flag Warning',
          defaultText: 'Severe swelling, cold pale skin, or unbearable pain requires immediate medical emergency evaluation.',
        };
      case 'disclaimer':
      default:
        return {
          bg: colors.surfaceVariant,
          border: colors.border,
          iconColor: colors.info,
          iconName: 'information-circle-outline' as const,
          defaultTitle: 'Medical Disclaimer',
          defaultText: 'This app is for educational recovery guidance only. It does not replace your physician or physiotherapist.',
        };
    }
  };

  const config = getConfig();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: config.bg,
          borderColor: config.border,
          borderRadius: layout.borderRadius.md,
          padding: compact ? 12 : 16,
        },
      ]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={`${title || config.defaultTitle}: ${text || config.defaultText}`}
    >
      <View style={styles.headerRow}>
        <Ionicons
          name={config.iconName}
          size={compact ? 20 : 24}
          color={config.iconColor}
          style={styles.icon}
        />
        <Text
          style={[
            typography.bodyBold,
            {
              color: config.iconColor,
              flex: 1,
              fontSize: compact ? 15 : 16,
            },
          ]}
        >
          {title || config.defaultTitle}
        </Text>
      </View>

      <Text
        style={[
          typography.body,
          {
            color: colors.textPrimary,
            fontSize: compact ? 14 : 16,
            marginTop: 4,
          },
        ]}
      >
        {text || config.defaultText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderLeftWidth: 4,
    borderWidth: 1,
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  icon: {
    marginRight: 8,
  },
});
