import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useNavigation } from '@react-navigation/native';

const KnowledgeBaseSentryMode = () => {
  const navigation = useNavigation();

  const tableOfContents = [
    { id: 'overview', title: 'What is Sentry Mode?', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'threat-levels', title: 'Threat Level Thresholds', level: 2 },
    { id: 'setup', title: 'Setting Up Sentry Mode', level: 1 },
    { id: 'contact-alerts', title: 'Contact Alert System', level: 1 },
    { id: 'what-contacts-receive', title: 'What Contacts Receive', level: 2 },
    { id: 'contact-responses', title: 'Contact Response Options', level: 2 },
    { id: 'user-experience', title: 'What You Experience', level: 2 },
    { id: 'notification-content', title: 'What Gets Notified', level: 1 },
    { id: 'privacy', title: 'Privacy & Security', level: 1 },
    { id: 'testing', title: 'Testing Sentry Mode', level: 1 },
    { id: 'troubleshooting', title: 'Troubleshooting', level: 1 },
    { id: 'demo-vs-live', title: 'Demo Mode vs. Live Mode', level: 1 },
    { id: 'sample-alert', title: 'Sample Contact Alert', level: 2 },
    { id: 'after-alert', title: 'What Happens After an Alert?', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'What is Sentry Mode?',
      content: 'Sentry Mode is an advanced security feature that automatically notifies a trusted contact when ThreatSense detects threats above a specified level. This provides an additional layer of protection by ensuring someone you trust is aware of potential dangers and can respond appropriately.',
    },
    'how-it-works': {
      title: 'How It Works',
      content: 'When ThreatSense analyzes text and detects a threat, it compares the threat level against your configured threshold. If the threat meets or exceeds your threshold, Sentry Mode automatically sends notifications to your trusted contact through multiple channels (SMS, email, and push notifications) with detailed threat information.',
    },
    'threat-levels': {
      title: 'Threat Level Thresholds',
      content: 'You can configure Sentry Mode to trigger on different threat levels:\n• Low: Minor threats only\n• Medium: Moderate threats\n• High: Significant threats (default)\n• Critical: Severe threats only',
    },
    setup: {
      title: 'Setting Up Sentry Mode',
      content: '1. Navigate to Settings via the profile icon on the Home screen.\n2. Tap "Sentry Mode" in the Security section.\n3. Toggle "Enable Sentry Mode" to ON.\n4. Select your desired threat level threshold.\n5. Choose a trusted contact from your device contacts.\n6. Use the "Test Notification" button to ensure everything is working correctly.',
    },
    'contact-alerts': {
      title: 'Contact Alert System',
      content: 'Sentry Mode uses a comprehensive multi-channel alert system to ensure your trusted contact is immediately notified of potential threats.',
    },
    'what-contacts-receive': {
      title: 'What Contacts Receive',
      content: 'Your trusted contact receives:\n• SMS text message with threat details and response options\n• Email notification with comprehensive threat information\n• Push notification (if they have ThreatSense app)\n• Clear instructions on how to respond and help you',
    },
    'contact-responses': {
      title: 'Contact Response Options',
      content: 'Your contact can respond by:\n• Replying "OK" to acknowledge the alert\n• Replying "CALL" to call you immediately\n• Replying "TEXT" to send you a message\n• Replying "EMERGENCY" for urgent situations\n• No response within 5 minutes triggers follow-up suggestions',
    },
    'user-experience': {
      title: 'What You Experience',
      content: 'When Sentry Mode activates:\n• You receive a local notification confirming the alert was sent\n• Options to call or text your contact directly\n• Real-time updates when your contact responds\n• Different messages based on their response type\n• Guidance on next steps based on the situation',
    },
    'notification-content': {
      title: 'What Gets Notified',
      content: 'When a threat is detected, your trusted contact receives a notification containing:\n• Threat level and type\n• A brief description of the threat\n• The timestamp of when the threat was detected\n• Your location at the time of detection (if you have granted location permissions)\n• Clear response instructions and emergency procedures',
    },
    privacy: {
      title: 'Privacy & Security',
      content: "Sentry Mode is designed with your privacy as a priority. All contact information is stored securely and locally on your device. Notifications are only sent when you've explicitly enabled the feature and configured a trusted contact. Location data is only shared if you permit it, and all communications are encrypted.",
    },
    testing: {
      title: 'Testing Sentry Mode',
      content: 'You can test Sentry Mode at any time using the demo buttons in the Sentry Mode settings screen. This allows you to verify that notifications are being sent and received correctly without waiting for an actual threat to be detected. The test simulates the complete alert flow including contact responses.',
    },
    troubleshooting: {
      title: 'Troubleshooting',
      content: 'If notifications are not working, please check the following:\n• Ensure Sentry Mode is enabled in settings.\n• Verify that a trusted contact is selected.\n• Confirm that the detected threat level meets or exceeds your set threshold.\n• Check your device\'s notification permissions for ThreatSense.\n• Ensure your contact has a valid phone number and email address.',
    },
    'demo-vs-live': {
      title: 'Demo Mode vs. Live Mode',
      content: 'In development/demo mode, notifications are simulated and not actually sent. In a live environment, your trusted contact will receive real SMS, email, and (if they have the app) push notifications with your alert details. Use the "Preview Alert" button to see a sample of what your contact would receive.',
    },
    'sample-alert': {
      title: 'Sample Contact Alert',
      content: 'Here is an example of the SMS your trusted contact would receive in a real emergency:\n\n🚨 THREAT ALERT 🚨\n\nJohn Doe, your trusted contact has been notified of a HIGH level threat.\n\nThreat: Phishing Attempt\nDetails: A suspicious message was detected.\nTime: 2024-06-15 12:00 PM\nLocation: 123 Main St, Springfield\n\nPlease check on them immediately.\n\nReply with:\n- "OK" to acknowledge\n- "CALL" to call them\n- "TEXT" to send a message\n- "IGNORE" if this is a false alarm\n\nStay safe!',
    },
    'after-alert': {
      title: 'What Happens After an Alert?',
      content: 'After your trusted contact receives the alert, they can respond by acknowledging, calling, or texting you. If they have the app, they can respond directly in-app. You will see their response in the app, and can call or text them directly if needed. If no response is received, the app will prompt you to try contacting them or escalate to emergency services.',
    },
  };

  return (
    <>
      <KnowledgeBaseArticleTemplate
        pageTitle="Knowledge Base"
        articleTitle="Sentry Mode: Emergency Notifications"
        IconComponent={<Icon name="shield-checkmark-outline" size={40} color="#A070F2" />}
        tableOfContents={tableOfContents}
        articleContent={articleContent}
        themeColor="#A070F2"
        demoCard={
          <View style={styles.demoLinkWrapper}>
            <TouchableOpacity
              style={styles.demoLinkButton}
              onPress={() => navigation.navigate('SentryModeGuidedDemo')}
              activeOpacity={0.7}
            >
              <Icon name="play-circle-outline" size={18} color="#A070F2" style={{ marginRight: 6 }} />
              <Text style={styles.demoLinkButtonText}>View the Sentry Mode Guided Demo</Text>
            </TouchableOpacity>
            <Text style={styles.demoLinkHelpText}>
              See a step-by-step visual walkthrough of how Sentry Mode works.
            </Text>
          </View>
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  demoLinkWrapper: {
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 10,
  },
  demoLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 8,
  },
  demoLinkButtonText: {
    color: '#A070F2',
    fontWeight: '600',
    fontSize: 15,
  },
  demoLinkHelpText: {
    color: '#B0BEC5',
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
    marginHorizontal: 10,
  },
});

export default KnowledgeBaseSentryMode; 