import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const steps = [
  {
    title: 'Enable Sentry Mode',
    icon: 'shield-checkmark-outline',
    iconColor: '#A070F2',
    caption: 'Turn on Sentry Mode in your settings to activate monitoring.'
  },
  {
    title: 'Threat Detected & Analyzed',
    icon: 'analytics-outline',
    iconColor: '#FF9800',
    caption: 'ThreatSense monitors your messages and uses AI to detect and analyze threats.'
  },
  {
    title: 'Trusted Contact Alerted',
    icon: 'notifications-outline',
    iconColor: '#F44336',
    caption: 'If a serious threat is found, your trusted contact is instantly notified and can respond.'
  },
  {
    title: "You're Not Alone",
    icon: 'checkmark-circle-outline',
    iconColor: '#4CAF50',
    caption: 'You get confirmation that help is on the way, or the situation is resolved.'
  },
];

const SentryModeGuidedDemo = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Icon name="shield-checkmark-outline" size={36} color="#A070F2" style={styles.icon} />
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#18181A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#18181A',
  },
  icon: {
    marginRight: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  introText: {
    color: '#B0BEC5',
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
    backgroundColor: '#23232A',
    borderRadius: 16,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A070F2',
    marginBottom: 14,
    textAlign: 'center',
  },
  iconWrapper: {
    backgroundColor: '#18181A',
    borderRadius: 32,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#333',
  },
  caption: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 2,
    textAlign: 'center',
  },
  footer: {
    fontSize: 15,
    color: '#B0BEC5',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default SentryModeGuidedDemo; 