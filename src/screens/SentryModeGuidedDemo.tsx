import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const SentryModeGuidedDemo = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const steps = [
    {
      title: 'Enable Sentry Mode',
      icon: 'shield-checkmark-outline',
      iconColor: theme.primary,
      caption: 'Turn on Sentry Mode in your settings to activate monitoring.'
    },
    {
      title: 'Threat Detected & Analyzed',
      icon: 'analytics-outline',
      iconColor: theme.warning,
      caption: 'ThreatSense monitors your messages and uses AI to detect and analyze threats.'
    },
    {
      title: 'Trusted Contact Alerted',
      icon: 'notifications-outline',
      iconColor: theme.error,
      caption: 'If a serious threat is found, your trusted contact is instantly notified and can respond.'
    },
    {
      title: "You're Not Alone",
      icon: 'checkmark-circle-outline',
      iconColor: theme.success,
      caption: 'You get confirmation that help is on the way, or the situation is resolved.'
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Icon name="shield-checkmark-outline" size={36} color={theme.primary} style={styles.icon} />
          <Text style={styles.title}>Sentry Mode Guided Demo</Text>
        </View>
        <Text style={styles.introText}>
          See how Sentry Mode keeps you safe in four simple steps.
        </Text>
        {steps.map((step, idx) => (
          <View key={idx} style={styles.stepContainer}>
            <Text style={styles.stepTitle}>{`Step ${idx + 1}: ${step.title}`}</Text>
            <View style={styles.iconWrapper}>
              <Icon name={step.icon} size={54} color={step.iconColor} />
            </View>
            <Text style={styles.caption}>{step.caption}</Text>
          </View>
        ))}
        <Text style={styles.footer}>Try out Sentry Mode in your app settings for a live demo!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: theme.background,
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
  },
  introText: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 18,
    marginHorizontal: 18,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  stepContainer: {
    marginBottom: 32,
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 22,
    shadowColor: theme.shadow,
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.primary,
    marginBottom: 14,
    textAlign: 'center',
  },
  iconWrapper: {
    backgroundColor: theme.background,
    borderRadius: 32,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: theme.border,
  },
  caption: {
    fontSize: 16,
    color: theme.text,
    marginBottom: 2,
    textAlign: 'center',
  },
  footer: {
    fontSize: 15,
    color: theme.textSecondary,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SentryModeGuidedDemo; 