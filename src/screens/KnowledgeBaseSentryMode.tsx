import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const KnowledgeBaseSentryMode = () => {
  const tableOfContents = [
    { id: 'overview', title: 'What is Sentry Mode?', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'threat-levels', title: 'Threat Level Thresholds', level: 2 },
    { id: 'setup', title: 'Setting Up Sentry Mode', level: 1 },
    { id: 'notification-content', title: 'What Gets Notified', level: 1 },
    { id: 'privacy', title: 'Privacy & Security', level: 1 },
    { id: 'testing', title: 'Testing Sentry Mode', level: 1 },
    { id: 'troubleshooting', title: 'Troubleshooting', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'What is Sentry Mode?',
      content: 'Sentry Mode is an advanced security feature that automatically notifies a trusted contact when ThreatSense detects threats above a specified level. This provides an additional layer of protection by ensuring someone you trust is aware of potential dangers.',
    },
    'how-it-works': {
      title: 'How It Works',
      content: 'When ThreatSense analyzes text and detects a threat, it compares the threat level against your configured threshold. If the threat meets or exceeds your threshold, Sentry Mode automatically sends a notification to your trusted contact with details about the threat.',
    },
    'threat-levels': {
      title: 'Threat Level Thresholds',
      content: 'You can configure Sentry Mode to trigger on different threat levels:\n• Low: Minor threats only\n• Medium: Moderate threats\n• High: Significant threats (default)\n• Critical: Severe threats only',
    },
    setup: {
      title: 'Setting Up Sentry Mode',
      content: '1. Navigate to Settings via the profile icon on the Home screen.\n2. Tap "Sentry Mode" in the Security section.\n3. Toggle "Enable Sentry Mode" to ON.\n4. Select your desired threat level threshold.\n5. Choose a trusted contact from your address book.\n6. Use the "Test Notification" button to ensure everything is working correctly.',
    },
    'notification-content': {
      title: 'What Gets Notified',
      content: 'When a threat is detected, your trusted contact receives a notification containing:\n• Threat level and type\n• A brief description of the threat\n• The timestamp of when the threat was detected\n• Your location at the time of detection (if you have granted location permissions).',
    },
    privacy: {
      title: 'Privacy & Security',
      content: "Sentry Mode is designed with your privacy as a priority. All contact information is stored securely and locally on your device. Notifications are only sent when you've explicitly enabled the feature and configured a trusted contact. Location data is only shared if you permit it.",
    },
    testing: {
      title: 'Testing Sentry Mode',
      content: 'You can test Sentry Mode at any time using the demo buttons in the Sentry Mode settings screen. This allows you to verify that notifications are being sent and received correctly without waiting for an actual threat to be detected.',
    },
    troubleshooting: {
      title: 'Troubleshooting',
      content: 'If notifications are not working, please check the following:\n• Ensure Sentry Mode is enabled in settings.\n• Verify that a trusted contact is selected.\n• Confirm that the detected threat level meets or exceeds your set threshold.\n• Check your device\'s notification permissions for ThreatSense.',
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Sentry Mode: Emergency Notifications"
      IconComponent={<Icon name="shield-checkmark-outline" size={40} color="#A070F2" />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor="#A070F2"
    />
  );
};

export default KnowledgeBaseSentryMode; 