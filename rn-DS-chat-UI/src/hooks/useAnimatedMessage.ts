import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

interface AnimatedMessageValues {
  opacity: Animated.Value;
  translateY: Animated.Value;
}

export function useAnimatedMessage(enabled: boolean): AnimatedMessageValues {
  const opacity = useRef(new Animated.Value(enabled ? 0 : 1)).current;
  const translateY = useRef(new Animated.Value(enabled ? 20 : 0)).current;

  useEffect(() => {
    if (!enabled) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        tension: 80,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, [enabled, opacity, translateY]);

  return { opacity, translateY };
}
