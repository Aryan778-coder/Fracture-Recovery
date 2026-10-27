import React from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';

interface PainSliderProps {
  value: number; // 0 to 10
  onChange: (level: number) => void;
}

export const PainSlider: React.FC<PainSliderProps> = ({
  value,
  onChange,
}) => {
  const { colors, typography, layout } = useTheme();

  const getPainColor = (lvl: number) => {
    if (lvl <= 3) return colors.success;
    if (lvl <= 6) return colors.warning;
    return colors.emergency;
  };

  const getPainDescription = (lvl: number) => {
    if (lvl === 0) return 'No Pain – completely comfortable.';
    if (lvl <= 3) return 'Mild Ache – manageable, acceptable during gentle movement.';
    if (lvl <= 6) return 'Moderate Pain – uncomfortable, avoid pushing further.';
    return 'Severe Pain – STOP EXERCISE IMMEDIATELY and elevate limb!';
  };

  const isSevere = value >= 7;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[typography.h3, { color: colors.textPrimary }]}>
          Pain Level Assessment
        </Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: getPainColor(value) + '22', borderColor: getPainColor(value) },
          ]}
        >
          <Text
            style={[
              typography.bodyBold,
              { color: getPainColor(value), fontSize: 18 },
            ]}
          >
            {value} / 10
          </Text>
        </View>
      </View>

      <Text
        style={[
          typography.body,
          {
            color: isSevere ? colors.emergency : colors.textSecondary,
            fontWeight: isSevere ? '600' : '400',
            marginVertical: 8,
          },
        ]}
      >
        {getPainDescription(value)}
      </Text>

      {/* High pain safety callout */}
      {isSevere && (
        <View
          style={[
            styles.severeWarningBox,
            { backgroundColor: colors.emergencyLight, borderColor: colors.emergency },
          ]}
          accessible={true}
          accessibilityRole="alert"
        >
          <Ionicons name="warning" size={24} color={colors.emergency} style={{ marginRight: 8 }} />
          <Text
            style={[
              typography.bodySmallBold,
              { color: colors.emergency, flex: 1 },
            ]}
          >
            CRITICAL: Pain of 7 or higher is a red flag. Discontinue all physiotherapy movements right now and rest.
          </Text>
        </View>
      )}

      {/* Discrete accessible buttons for numbers 0 to 10 (each min 48dp) */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scaleContainer}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
          const isSelected = value === num;
          const numColor = getPainColor(num);

          return (
            <Pressable
              key={num}
              onPress={() => onChange(num)}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Pain rating ${num} out of 10`}
              accessibilityState={{ selected: isSelected }}
              android_ripple={{ color: colors.primaryMuted, borderless: false }}
              style={[
                styles.levelButton,
                {
                  backgroundColor: isSelected ? numColor : colors.surfaceCard,
                  borderColor: isSelected ? numColor : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  typography.button,
                  {
                    color: isSelected ? '#FFFFFF' : colors.textPrimary,
                    fontSize: 18,
                  },
                ]}
              >
                {num}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Quick +/- adjustment controls for injured users */}
      <View style={styles.quickAdjustRow}>
        <Pressable
          onPress={() => onChange(Math.max(0, value - 1))}
          disabled={value === 0}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Decrease pain level"
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderSubtle,
              opacity: value === 0 ? 0.4 : 1,
            },
          ]}
        >
          <Ionicons name="remove" size={24} color={colors.textPrimary} />
          <Text style={[typography.bodyBold, { color: colors.textPrimary, marginLeft: 4 }]}>
            Lower Pain
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onChange(Math.min(10, value + 1))}
          disabled={value === 10}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Increase pain level"
          style={[
            styles.stepperButton,
            {
              backgroundColor: colors.surfaceVariant,
              borderColor: colors.borderSubtle,
              opacity: value === 10 ? 0.4 : 1,
            },
          ]}
        >
          <Ionicons name="add" size={24} color={colors.textPrimary} />
          <Text style={[typography.bodyBold, { color: colors.textPrimary, marginLeft: 4 }]}>
            Higher Pain
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  severeWarningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  scaleContainer: {
    paddingVertical: 12,
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      android: {
        elevation: 2,
      },
    }),
  },
  quickAdjustRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 12,
  },
  stepperButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
