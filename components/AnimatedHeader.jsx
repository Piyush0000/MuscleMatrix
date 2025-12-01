import { StyleSheet, Text } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';

const AnimatedHeader = ({ scrollOffset }) => {
  const headerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollOffset.value,
      [0, 100],
      [1, 0.8],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollOffset.value,
      [0, 100],
      [0, -20],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ scale }, { translateY }],
    };
  });

  return (
    <Animated.View style={[styles.header, headerStyle]}>
      <Text style={styles.title}>Muscle Matrix</Text>
      <Text style={styles.subtitle}>Your Personal Fitness Guide</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
});

export default AnimatedHeader;