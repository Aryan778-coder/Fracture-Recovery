export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryMuted: string;
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceCard: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  textInverse: string;
  emergency: string;
  emergencyLight: string;
  warning: string;
  warningLight: string;
  success: string;
  successLight: string;
  info: string;
  infoLight: string;
  disabled: string;
  disabledText: string;
  overlay: string;
}

export const lightColors: ThemeColors = {
  primary: '#0D9488', // Teal-600: calming clinical authority
  primaryLight: '#2DD4BF',
  primaryDark: '#115E59',
  primaryMuted: '#E6FFFA',
  background: '#F8FAFC', // Slate-50: crisp, ultra-clean healthcare canvas
  surface: '#FFFFFF',
  surfaceVariant: '#F1F5F9',
  surfaceCard: '#FFFFFF',
  border: '#CBD5E1', // High contrast border for visual clarity
  borderSubtle: '#E2E8F0',
  textPrimary: '#0F172A', // Slate-900 (High contrast WCAG AAA)
  textSecondary: '#334155', // Slate-700
  textMuted: '#64748B',
  textInverse: '#FFFFFF',
  emergency: '#DC2626', // Red-600
  emergencyLight: '#FEE2E2',
  warning: '#D97706', // Amber-600
  warningLight: '#FEF3C7',
  success: '#059669', // Emerald-600
  successLight: '#D1FAE5',
  info: '#0284C7', // Sky-600
  infoLight: '#E0F2FE',
  disabled: '#E2E8F0',
  disabledText: '#94A3B8',
  overlay: 'rgba(15, 23, 42, 0.65)',
};

export const darkColors: ThemeColors = {
  primary: '#2DD4BF', // Teal-400 for dark mode radiance
  primaryLight: '#5EEAD4',
  primaryDark: '#0F766E',
  primaryMuted: '#134E4A',
  background: '#0B1320', // Deep medical slate navy
  surface: '#152238',
  surfaceVariant: '#1E2D4A',
  surfaceCard: '#182740',
  border: '#2A3F63',
  borderSubtle: '#1F314F',
  textPrimary: '#F8FAFC',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',
  textInverse: '#0B1320',
  emergency: '#EF4444',
  emergencyLight: '#451A1A',
  warning: '#F59E0B',
  warningLight: '#452A12',
  success: '#10B981',
  successLight: '#134334',
  info: '#38BDF8',
  infoLight: '#14364D',
  disabled: '#243247',
  disabledText: '#64748B',
  overlay: 'rgba(3, 7, 18, 0.85)',
};

export const typography = {
  // Enforcing accessibility guidelines: minimum 16sp body text
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    lineHeight: 30,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  body: {
    fontSize: 16, // STRICT MINIMUM FOR ACCESSIBILITY
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmallBold: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600' as const,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  button: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,
};

export const layout = {
  minTapTarget: 48, // 48dp Android Accessibility requirement
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 16,
    xl: 24,
    pill: 9999,
  },
  shadows: {
    light: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 3,
    },
    medium: {
      shadowColor: '#0F172A',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 14,
      elevation: 6,
    },
    prominent: {
      shadowColor: '#0D9488',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 18,
      elevation: 8,
    },
  },
};
