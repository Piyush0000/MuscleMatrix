import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    Extrapolate,
    FadeInUp,
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const AnimatedTabBar = () => {
  const router = useRouter();
  const activeTab = useSharedValue(0); // 0 = Home, 1 = Exercises, 2 = Favorites, 3 = Workout, 4 = Statistics, 5 = Settings, 6 = Profile

  const handleTabPress = (tabIndex) => {
    activeTab.value = withSpring(tabIndex);
    
    // Navigate based on tab
    switch(tabIndex) {
      case 0:
        router.push('/');
        break;
      case 1:
        // For now, we'll stay on the same screen
        break;
      case 2:
        router.push('/favorites');
        break;
      case 3:
        router.push('/workout');
        break;
      case 4:
        router.push('/statistics');
        break;
      case 5:
        router.push('/settings');
        break;
      case 6:
        router.push('/profile');
        break;
    }
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      activeTab.value,
      [0, 1, 2, 3, 4, 5, 6],
      [8, 65, 122, 179, 236, 293, 350],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const tabStyle = (tabIndex) => {
    return useAnimatedStyle(() => {
      const scale = interpolate(
        activeTab.value,
        [tabIndex - 1, tabIndex, tabIndex + 1],
        [1, 1.1, 1],
        Extrapolate.CLAMP
      );

      const color = activeTab.value === tabIndex ? Colors.primary : Colors.textSecondary;

      return {
        transform: [{ scale }],
        color,
      };
    });
  };

  const getIconName = (tabIndex) => {
    switch(tabIndex) {
      case 0: return 'home';
      case 1: return 'fitness';
      case 2: return 'star';
      case 3: return 'barbell';
      case 4: return 'stats-chart';
      case 5: return 'settings';
      case 6: return 'person';
      default: return 'home';
    }
  };

  const getTabLabel = (tabIndex) => {
    switch(tabIndex) {
      case 0: return 'Home';
      case 1: return 'Exercises';
      case 2: return 'Favorites';
      case 3: return 'Workout';
      case 4: return 'Statistics';
      case 5: return 'Settings';
      case 6: return 'Profile';
      default: return 'Home';
    }
  };

  return (
    <Animated.View 
      entering={FadeInUp.duration(500).delay(1000)}
      style={styles.container}
    >
      <View style={styles.tabBar}>
        <Animated.View style={[styles.indicator, indicatorStyle]} />
        
        {[0, 1, 2, 3, 4, 5, 6].map((tabIndex) => (
          <TouchableOpacity 
            key={tabIndex}
            style={styles.tab}
            onPress={() => handleTabPress(tabIndex)}
          >
            <Animated.View style={tabStyle(tabIndex)}>
              <Ionicons 
                name={`${getIconName(tabIndex)}${activeTab.value === tabIndex ? '' : '-outline'}`} 
                size={24} 
              />
              <Text style={[styles.tabText, activeTab.value === tabIndex && styles.activeTabText]}>
                {getTabLabel(tabIndex)}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.surface,
    paddingBottom: 10,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    ...Typography.labelSmall,
    marginTop: 4,
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
});

export default AnimatedTabBar;