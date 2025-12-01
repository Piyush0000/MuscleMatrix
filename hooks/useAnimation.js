import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export const useAnimation = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotate = useSharedValue('0deg');

  const animatePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8, { duration: 200 });
  };

  const animatePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 200 });
  };

  const animateSlideIn = (direction = 'up', delay = 0) => {
    'worklet';
    switch (direction) {
      case 'up':
        translateY.value = 50;
        translateY.value = withSpring(0, { damping: 10, stiffness: 100, delay });
        break;
      case 'down':
        translateY.value = -50;
        translateY.value = withSpring(0, { damping: 10, stiffness: 100, delay });
        break;
      case 'left':
        translateX.value = 50;
        translateX.value = withSpring(0, { damping: 10, stiffness: 100, delay });
        break;
      case 'right':
        translateX.value = -50;
        translateX.value = withSpring(0, { damping: 10, stiffness: 100, delay });
        break;
    }
  };

  const animateFadeIn = (delay = 0) => {
    'worklet';
    opacity.value = 0;
    opacity.value = withTiming(1, { duration: 500, delay });
  };

  const animateRotation = (degrees = 360, duration = 1000) => {
    'worklet';
    rotate.value = '0deg';
    rotate.value = withTiming(`${degrees}deg`, { duration });
  };

  return {
    scale,
    opacity,
    translateX,
    translateY,
    rotate,
    animatePressIn,
    animatePressOut,
    animateSlideIn,
    animateFadeIn,
    animateRotation,
  };
};