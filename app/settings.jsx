import AnimatedHeader from '@/components/AnimatedHeader';
import Colors from '@/constants/Colors';
import Typography from '@/constants/Typography';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedScrollHandler,
    useSharedValue
} from 'react-native-reanimated';

export default function Settings() {
  const router = useRouter();
  const scrollOffset = useSharedValue(0);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    autoPlayGifs: true,
    showAnimationControls: true,
    enableHapticFeedback: true
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
    },
  });

  // Load settings from storage
  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        // In a real app, you would load settings from AsyncStorage
        // For now, we'll use default settings
        setSettings({
          notifications: true,
          darkMode: false,
          autoPlayGifs: true,
          showAnimationControls: true,
          enableHapticFeedback: true
        });
      } catch (err) {
        console.error('Error loading settings:', err);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const toggleSetting = (settingKey) => {
    const updatedSettings = {
      ...settings,
      [settingKey]: !settings[settingKey]
    };
    setSettings(updatedSettings);
    // In a real app, you would save to AsyncStorage here
  };

  const SettingItem = ({ title, description, value, onToggle }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={value ? Colors.surface : Colors.textTertiary}
        onValueChange={onToggle}
        value={value}
      />
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedHeader scrollOffset={scrollOffset} />

      <Animated.View 
        entering={FadeInUp.duration(600).delay(200)}
        style={styles.header}
      >
        <Text style={styles.title}>Settings</Text>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Notifications"
              description="Receive notifications about new exercises and updates"
              value={settings.notifications}
              onToggle={() => toggleSetting('notifications')}
            />
            <SettingItem
              title="Dark Mode"
              description="Enable dark theme for better viewing in low light"
              value={settings.darkMode}
              onToggle={() => toggleSetting('darkMode')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Exercise Display</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Auto-play GIFs"
              description="Automatically play exercise demonstration GIFs"
              value={settings.autoPlayGifs}
              onToggle={() => toggleSetting('autoPlayGifs')}
            />
            <SettingItem
              title="Show Animation Controls"
              description="Display play/pause controls for exercise GIFs"
              value={settings.showAnimationControls}
              onToggle={() => toggleSetting('showAnimationControls')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accessibility</Text>
          <View style={styles.sectionContent}>
            <SettingItem
              title="Haptic Feedback"
              description="Enable vibration feedback for interactions"
              value={settings.enableHapticFeedback}
              onToggle={() => toggleSetting('enableHapticFeedback')}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.sectionContent}>
            <TouchableOpacity 
              style={styles.aboutItem}
              onPress={() => router.push('/about')}
            >
              <Text style={styles.aboutText}>About MuscleMatrix</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={styles.aboutText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.aboutItem}>
              <Text style={styles.aboutText}>Terms of Service</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundLight,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  title: {
    ...Typography.heading3,
    color: Colors.textPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    ...Typography.heading5,
    color: Colors.textPrimary,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 15,
  },
  settingTitle: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
    marginBottom: 5,
  },
  settingDescription: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  aboutItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  aboutText: {
    ...Typography.bodyLarge,
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    ...Typography.bodyLarge,
    color: Colors.textSecondary,
    marginTop: 15,
  },
});