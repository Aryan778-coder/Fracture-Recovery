import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      accessible={false}
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.disabled,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
};

export const ExerciseCardSkeleton: React.FC = () => {
  const { colors, layout } = useTheme();
  return (
    <View
      style={[
        styles.cardSkeleton,
        {
          backgroundColor: colors.surfaceCard,
          borderColor: colors.borderSubtle,
          borderRadius: layout.borderRadius.lg,
        },
      ]}
    >
      <Skeleton width="100%" height={160} borderRadius={layout.borderRadius.md} />
      <View style={{ marginTop: 12 }}>
        <Skeleton width="75%" height={22} style={{ marginBottom: 8 }} />
        <Skeleton width="45%" height={16} style={{ marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Skeleton width={80} height={28} borderRadius={14} />
          <Skeleton width={80} height={28} borderRadius={14} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSkeleton: {
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
  },
});
