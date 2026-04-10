# Tech References — Documentation Links

> This file is the canonical reference map for AI agents (Claude Code, Codex, Gemini) building this project. Before implementing any feature, look up the relevant section here and follow the linked official docs. Do NOT rely on training-data assumptions about these APIs — Reanimated 3 and Skia have breaking API differences from v2/older versions.

---

## Stack Overview

| Tech | Version | Purpose |
|---|---|---|
| React Native | 0.74+ (via Expo SDK 51+) | Core mobile framework |
| Expo | SDK 51 | Toolchain, managed workflow |
| React Native Reanimated | 3.x | All animations — UI thread |
| expo-haptics | Latest | Haptic feedback on press |
| @shopify/react-native-skia | Latest | Bonus confetti canvas |
| TypeScript | 5.x | Type safety throughout |

---

## 1. React Native Reanimated 3

> ⚠️ This project uses **Reanimated 3**, not v2. The API surface is different — especially `useAnimatedStyle`, shared value syntax, and worklet behavior. Do not use v2 patterns.

### Core Docs
- **Getting Started / Installation**: https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
- **Babel Plugin Setup** (REQUIRED — must be last Babel plugin): https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/#step-2-add-reanimated-babel-plugin
- **Worklets explainer** (why UI-thread animations work): https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/worklets/

### Shared Values
- `useSharedValue`: https://docs.swmansion.com/react-native-reanimated/docs/core/useSharedValue/
- `useDerivedValue`: https://docs.swmansion.com/react-native-reanimated/docs/core/useDerivedValue/

### Animated Styles & Props
- `useAnimatedStyle`: https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedStyle/
- `useAnimatedProps`: https://docs.swmansion.com/react-native-reanimated/docs/core/useAnimatedProps/
- `createAnimatedComponent`: https://docs.swmansion.com/react-native-reanimated/docs/core/createAnimatedComponent/

### Animation Functions
- `withTiming` (duration + easing): https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/
- `withSpring` (physics-based): https://docs.swmansion.com/react-native-reanimated/docs/animations/withSpring/
- `withSequence` (chain animations): https://docs.swmansion.com/react-native-reanimated/docs/animations/withSequence/
- `withRepeat` (looping): https://docs.swmansion.com/react-native-reanimated/docs/animations/withRepeat/
- `withDelay` (stagger): https://docs.swmansion.com/react-native-reanimated/docs/animations/withDelay/

### Thread Bridging
- `runOnJS` (call JS from UI thread — for callbacks, haptics): https://docs.swmansion.com/react-native-reanimated/docs/threading/runOnJS/
- `runOnUI` (run worklet on UI thread): https://docs.swmansion.com/react-native-reanimated/docs/threading/runOnUI/

### Easing
- `Easing` reference (imported from `react-native-reanimated`): https://docs.swmansion.com/react-native-reanimated/docs/animations/withTiming/#easing

### Gesture Handler (if needed for press)
- Gesture Handler docs: https://docs.swmansion.com/react-native-gesture-handler/docs/
- Note: For simple press feedback, `Pressable` + `onPressIn`/`onPressOut` with Reanimated shared values is sufficient and avoids adding a dependency.

---

## 2. Expo

### Project Setup
- **Create Expo App**: https://docs.expo.dev/get-started/create-a-project/
- **Expo SDK 51 release notes**: https://expo.dev/changelog/sdk-51

### Configuration
- **app.json / app.config.js**: https://docs.expo.dev/workflow/configuration/
- **babel.config.js setup**: https://docs.expo.dev/guides/using-babel/

### Running & Building
- **Run on device**: https://docs.expo.dev/get-started/set-up-your-environment/
- **Expo Go vs Dev Build**: https://docs.expo.dev/develop/development-builds/introduction/
  - ⚠️ `@shopify/react-native-skia` requires a **Dev Build** — does NOT work in Expo Go

### expo-haptics
- **API Reference**: https://docs.expo.dev/versions/latest/sdk/haptics/
- Usage: `import * as Haptics from 'expo-haptics'`
- Key method: `Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)`
- Android note: Haptics may be no-op on some Android devices without vibration motors — handle gracefully

---

## 3. @shopify/react-native-skia (Bonus Only)

> ⚠️ Only implement if core requirements (Phases 1–5) are complete. Requires Dev Build — does NOT run in Expo Go.

### Installation & Setup
- **Getting Started**: https://shopify.github.io/react-native-skia/docs/getting-started/installation/
- **Expo Installation**: https://shopify.github.io/react-native-skia/docs/getting-started/expo/

### Core Canvas API
- **Canvas component**: https://shopify.github.io/react-native-skia/docs/canvas/canvas/
- **Drawing primitives (Rect, Circle, Path)**: https://shopify.github.io/react-native-skia/docs/shapes/basic-shapes/

### Animations in Skia
- **Skia + Reanimated integration**: https://shopify.github.io/react-native-skia/docs/animations/animations/
- `useSharedValueEffect` — bridge Reanimated shared values into Skia: https://shopify.github.io/react-native-skia/docs/animations/animations/#reanimated

### Confetti Approach
For the confetti burst, the recommended pattern is:
1. Store particle state (positions, velocities, opacities) as arrays in JS
2. Use Reanimated's `useSharedValue` for a global `progress` (0→1)
3. Use `useDerivedValue` to compute each particle's position from `progress + velocity`
4. Pass computed values into Skia canvas via `useSharedValueEffect`
- Reference tutorial: https://shopify.github.io/react-native-skia/docs/animations/animations/#clock-based-animations

---

## 4. React Native Core APIs Used

### Animated Text (score counter)
- `createAnimatedComponent(Text)` from Reanimated — do NOT use RN's built-in `Animated.Text`
- Reanimated `AnimatedText` via `useAnimatedProps` on `text` prop

### Pressable (share button)
- Docs: https://reactnative.dev/docs/pressable
- Use `onPressIn` / `onPressOut` to trigger Reanimated scale animations

### StyleSheet
- Docs: https://reactnative.dev/docs/stylesheet
- Always use `StyleSheet.create({})` for static styles — only use inline for animated style overrides

### View, Text, ScrollView
- https://reactnative.dev/docs/view
- https://reactnative.dev/docs/text
- https://reactnative.dev/docs/scrollview

---

## 5. TypeScript in React Native

- **TypeScript setup with Expo**: https://docs.expo.dev/guides/typescript/
- React Native TypeScript types: `@types/react-native` (auto-included with Expo TS template)
- Reanimated types are bundled with the package — no separate `@types` needed

---

## 6. Key Constraints Reference

From the assignment brief:

```
✅ Use Reanimated 3: useSharedValue, useAnimatedStyle, withSpring, withTiming, withSequence, withRepeat
✅ No third-party animation libraries (no Lottie, no Skia unless bonus)
✅ Must work on Android (iOS too if on Mac)
✅ No setState inside animation callbacks — keep animations on UI thread
```

### How to enforce UI-thread safety:
```ts
// ✅ CORRECT — stays on UI thread
someSharedValue.value = withSpring(1);

// ✅ CORRECT — use runOnJS to cross to JS thread
runOnJS(setStateFunction)(value);

// ❌ WRONG — setState inside worklet (will crash or cause issues)
someSharedValue.value = withTiming(1, {}, () => {
  setState(true); // NO — this runs on UI thread, setState is JS-only
});

// ✅ CORRECT version of above
someSharedValue.value = withTiming(1, {}, (finished) => {
  'worklet';
  if (finished) runOnJS(setState)(true);
});
```

---

## 7. Useful Community Resources

- Reanimated examples repo (official): https://github.com/software-mansion/react-native-reanimated/tree/main/apps/common-app
- William Candillon's "Can it be done in RN?" YouTube: https://www.youtube.com/@wcandillon — great source for Skia patterns
- Expo Discord: https://chat.expo.dev — fast help for build issues
- React Native community Discord: https://www.reactiflux.com/

---

## 8. Common Gotchas

| Issue | Cause | Fix |
|---|---|---|
| Animations not running on UI thread | Forgot `'worklet'` directive or using JS-only API inside worklet | Add `'worklet';` at top of function, use `runOnJS` for JS calls |
| `withRepeat` stops after first cycle | `numberOfReps` is `1` | Set to `-1` for infinite: `withRepeat(anim, -1, true)` |
| Badge scale doesn't overshoot | `withSpring` damping too high | Lower `damping` to 8–10, increase `stiffness` to 200+ |
| Android spring feels different | Physics engine differences | Test and adjust `damping`/`stiffness` per platform using `Platform.OS` |
| Skia doesn't work in Expo Go | Skia requires native module linking | Use `npx expo run:android` with a dev build |
| Text `useAnimatedProps` not updating | Forgot `createAnimatedComponent(Text)` | Wrap: `const AnimatedText = Animated.createAnimatedComponent(Text)` |
| Shimmer visible gap/jump on loop | `withRepeat` has abrupt reset | Start shimmer at `translateX: -buttonWidth`, end at `+buttonWidth`, use `withTiming` linear |