# OssaCare — Fracture Recovery & Physiotherapy Companion

An Android-first mobile application built with **React Native**, **Expo**, and **TypeScript**, designed to guide users safely through stage-wise physiotherapy exercise tutorials after bone fractures.

---

## ⚠️ Important Medical Disclaimer
This application is designed **strictly for patient education and rehabilitation compliance tracking**. It does **NOT** diagnose injuries, formulate medical prognoses, or replace licensed orthopedic or physical therapy care. All physiotherapy routines must receive individualized authorization from the patient's orthopedic doctor or physical therapist.

---

## 📱 Tech Stack & Architecture

- **Framework**: React Native (Expo SDK 52, Managed Workflow)
- **Language**: TypeScript (Strict typing enabled)
- **Navigation**: React Navigation 7 (Native Stack + Bottom Tabs)
- **Styling**: Strongly-typed **StyleSheet API** with dynamic ThemeProvider (Light & Dark themes)
- **Local Persistence**: AsyncStorage (`@react-native-async-storage/async-storage`)
- **Video Player**: `expo-av`
- **Vector Graphics & Progress**: `react-native-svg`
- **Icons**: `@expo/vector-icons` (Ionicons)

---

## 📂 Project Structure

```
c:\Users\IdeaPad\Desktop\Fracture Recovery/
├── App.tsx                    # Root provider wrapper (Theme, Recovery, SafeArea)
├── index.ts                   # Expo entrypoint
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── app.json                   # Expo application metadata & Android package configuration
└── src/
    ├── constants/
    │   ├── theme.ts           # Design tokens: Light/Dark palettes, Typography (min 16sp), Spacing, Layout (min 48dp)
    │   └── redFlags.ts        # Emergency symptoms (compartment syndrome, vascular compromise, nerve impingement)
    ├── context/
    │   ├── ThemeContext.tsx    # Light/Dark mode state management & persistence
    │   └── RecoveryContext.tsx # User profile, injury timeline, daily checklist, stage calculation, pain logging
    ├── data/
    │   └── mockData.ts        # 4 clinical recovery stages & sample exercises marked [PLACEHOLDER – requires physio review]
    ├── types/
    │   ├── navigation.ts      # RootStackParamList & MainTabParamList
    │   └── recovery.ts        # UserProfile, Stage, Exercise, PainLog, BodyPart, FractureType interfaces
    ├── components/
    │   ├── common/
    │   │   ├── Button.tsx         # Accessible touch target (min 48dp), Android ripple, variants & loading states
    │   │   ├── Card.tsx           # Elevated clinical surface card with Android elevation & border tokens
    │   │   ├── ProgressRing.tsx   # SVG animated circle progress indicator with accessible progressbar semantics
    │   │   ├── DisclaimerBanner.tsx # Multi-variant clinical alert banner (Approval, Warning, Emergency, Disclaimer)
    │   │   ├── PainSlider.tsx     # 0-10 stepped pain logger with automatic 7+ severe pain alert trigger
    │   │   ├── Skeleton.tsx       # Shimmer placeholder skeleton for exercise cards and loading states
    │   │   └── EmergencyModal.tsx # Universal urgent red-flags modal with direct 911/EMS dialer
    │   └── exercise/
    │       ├── ExerciseCard.tsx   # Card with video thumbnail, locked stage overlay, and completion badge
    │       └── RestTimer.tsx      # Interactive rest timer for physiotherapy sets with play/pause/reset
    ├── navigation/
    │   ├── RootNavigator.tsx  # Native stack with onboarding gate and transition animations
    │   └── TabNavigator.tsx   # 5-tab Android bottom bar (Dashboard, Timeline, Library, Progress, Profile)
    └── screens/
        ├── OnboardingScreen.tsx       # Multi-step onboarding: Disclaimer agreement, Body Part, Fracture Type, Surgery toggle
        ├── HomeScreen.tsx             # Dashboard: Healing stage banner, Days since injury, Progress ring, Today's checklist
        ├── ExerciseLibraryScreen.tsx  # Filterable library by body part and stage, locked stage protection, search
        ├── ExerciseDetailScreen.tsx   # Video player, step instructions, common mistakes, "Stop if you feel" alerts, rest timer
        ├── RecoveryPlanScreen.tsx     # 4-stage biological healing timeline with permitted and prohibited activities
        ├── ProgressTrackerScreen.tsx  # Weekly adherence calendar, streak, and 7-day pain trend chart
        ├── EmergencyScreen.tsx        # Dedicated emergency and red-flag symptoms screen with dialer
        └── ProfileScreen.tsx          # Settings, injury details review, dark mode toggle, export to doctor, and data reset
```

---

## 🔒 Safety & Compliance Guardrails

1. **Mandatory Disclaimer Gate**:
   - First launch requires the patient to explicitly check and acknowledge that the app does not provide medical diagnosis.
2. **Clinical Approval Banner**:
   - Every exercise tutorial displays: *"Perform only after your doctor or physiotherapist approves. Never force movement past acute pain."*
3. **Biological Stage-Lock Protection**:
   - Patients can **never** view or start exercises beyond their current biological recovery stage. Locked cards display a lock badge and the remaining days required before bone union permits progression.
4. **Pain Escalation Trigger**:
   - Logging pain at **7/10 or higher** triggers an immediate high-priority alert prompting the user to stop all rehabilitation, elevate the limb, and contact their orthopedic specialist.
5. **Red Flags Always Reachable**:
   - Available via the dedicated header action across every screen, listing emergency indicators such as suspected compartment syndrome, dusky nailbeds, sudden deformity, or severe neurovascular compromise.
6. **Placeholder Data Markings**:
   - All exercise instructions are explicitly tagged `[PLACEHOLDER – requires physio review]`.

---

## 🚀 How to Run Locally

1. Install project dependencies:
   ```bash
   npm install
   ```
2. Start the Expo development server:
   ```bash
   npx expo start
   ```
3. Run on Android:
   - Press `a` in the terminal to launch on a connected Android device or Android Studio emulator.
   - Or scan the QR code using the **Expo Go** application on your physical Android device.
