import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

interface AnimatedMessageValues {
  opacity: Animated.Value;
  translateY: Animated.Value;
  scale: Animated.Value;
  translateX: Animated.Value;
}

/**
 * Enhanced message animation hook.
 *
 * Produces a polished entrance combining:
 * - Fade in (opacity 0 → 1)
 * - Slide up from below (translateY)
 * - Subtle horizontal slide from the sender's side (translateX)
 * - Scale pop (slightly overshoots then settles via spring)
 *
 * @param enabled  Whether animations are turned on.
 * @param isCurrentUser  true → message slides in from the right; false → from the left.
 */
export function useAnimatedMessage(
  enabled: boolean,
  isCurrentUser: boolean = false,
): AnimatedMessageValues {
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(enabled ? 30 : 0)).current;
  const scale = useRef(new Animated.Value(enabled ? 0.85 : 1)).current;
  const translateX = useRef(
    new Animated.Value(enabled ? (isCurrentUser ? 40 : -40) : 0),
  ).current;

  useEffect(() => {
    if (!enabled) return;

    // Stagger: fade + slide start immediately, scale follows slightly after
    Animated.parallel([
      // 1. Fade in – quick ease-out
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),

      // 2. Slide up – spring for a natural bounce
      Animated.spring(translateY, {
        toValue: 0,
        tension: 65,
        friction: 9,
        useNativeDriver: true,
      }),

      // 3. Horizontal slide from the sender's side
      Animated.spring(translateX, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),

      // 4. Scale pop – overshoots slightly, then settles
      Animated.spring(scale, {
        toValue: 1,
        tension: 70,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabled, opacity, translateY, translateX, scale]);

  return { opacity, translateY, scale, translateX };
}
