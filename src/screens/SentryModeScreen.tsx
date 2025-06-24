import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, SafeAreaView, ActionSheetIOS, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useSentryMode } from '../context/SentryModeContext';
import ContactPicker from '../components/ContactPicker';
import ThreatLevelPicker from '../components/ThreatLevelPicker';
import { notificationService } from '../services/notificationService';
import { navigate, goBack } from '../services/navigationService';
import { useApp } from '../context/AppContext';

type SentryModeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SentryMode'>;

const SentryModeScreen = () => {
  const navigation = useNavigation<SentryModeScreenNavigationProp>();
  const { settings, updateSettings, isLoading } = useSentryMode();
  const { settingsSheetRef } = useApp();
  const threatButtonsRef = useRef(null);
  const contactInfoRef = useRef(null);
  const testNotificationRef = useRef(null);
  const enableCardRef = useRef(null);
  const trustedContactRef = useRef(null);
  const [showDemoInfo, setShowDemoInfo] = useState(false);

  const handleToggleSentryMode = (isEnabled: boolean) => {
    updateSettings({ isEnabled });
  };

  const handleThreatLevelChange = (threatLevel: 'Low' | 'Medium' | 'High' | 'Critical') => {
    updateSettings({ threatLevel });
  };

  const handleContactSelect = (contact: any) => {
    updateSettings({ trustedContact: contact });
  };

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Sentry Mode',
      'Are you sure you want to reset all Sentry Mode settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive', 
          onPress: () => {
            updateSettings({
              isEnabled: false,
              threatLevel: 'High',
              trustedContact: null
            });
          }
        }
      ]
    );
  };

  const handleTestNotification = async () => {
    if (!settings.isEnabled) {
      Alert.alert('Sentry Mode Disabled', 'Please enable Sentry Mode first to test notifications.');
      return;
    }

    if (!settings.trustedContact) {
      Alert.alert('No Trusted Contact', 'Please select a trusted contact first to test notifications.');
      return;
    }

    Alert.alert(
      'Test Notification',
      'This will send a test notification to your trusted contact. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Send Test', 
          onPress: async () => {
            try {
              await notificationService.testNotification(settings);
              Alert.alert(
                'Test Sent',
                'A test notification has been sent to your trusted contact. Check the console for details.',
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to send test notification. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleLearnMore = () => {
    // First, close the SentryMode screen (which is a modal)
    navigation.goBack();

    // Then, after a short delay to allow the modal to close, navigate to the knowledge base article.
    setTimeout(() => {
      navigate('Library', { screen: 'KnowledgeBaseSentryMode' });
      
      // Also explicitly close the settings sheet in case it's still open
      settingsSheetRef.current?.close();
    }, 50); 
  };

  const handlePreviewAlert = () => {
    const sampleMessage = `🚨 THREAT ALERT 🚨\n\nJohn Doe, your trusted contact has been notified of a HIGH level threat.\n\nThreat: Phishing Attempt\nDetails: A suspicious message was detected.\nTime: 2024-06-15 12:00 PM\nLocation: 123 Main St, Springfield\n\nPlease check on them immediately.\n\nReply with:\n- "OK" to acknowledge\n- "CALL" to call them\n- "TEXT" to send a message\n- "IGNORE" if this is a false alarm\n\nStay safe!`;
    Alert.alert('Preview: Contact Alert (SMS)', sampleMessage, [{ text: 'OK' }]);
  };

  const handleSimulateContactResponse = () => {
    const options = [
      'Acknowledge',
      'Call',
      'Text',
      'Ignore',
      'Cancel',
    ];
    const responseTypes = ['acknowledged', 'calling', 'texting', 'ignored'];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 4,
        },
        (buttonIndex) => {
          if (buttonIndex < 4) {
            notificationService.simulateContactResponse(settings, responseTypes[buttonIndex]);
          }
        }
      );
    } else {
      Alert.alert(
        'Simulate Contact Response',
        'Choose a response type:',
        [
          { text: 'Acknowledge', onPress: () => notificationService.simulateContactResponse(settings, 'acknowledged') },
          { text: 'Call', onPress: () => notificationService.simulateContactResponse(settings, 'calling') },
          { text: 'Text', onPress: () => notificationService.simulateContactResponse(settings, 'texting') },
          { text: 'Ignore', onPress: () => notificationService.simulateContactResponse(settings, 'ignored') },
          { text: 'Cancel', style: 'cancel' },
        ]
      );
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#18181A' }}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.headerTitle}>Sentry Mode</Text>
          <TouchableOpacity onPress={() => setShowDemoInfo(true)} style={styles.demoInfoIcon}>
            <Icon name="help-circle-outline" size={24} color="#A070F2" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerDescription}>
          When enabled, a trusted contact will be notified if a threat meets your selected criteria.
        </Text>

        {/* Main Toggle */}
        <View ref={enableCardRef} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Icon name="shield-checkmark-outline" size={24} color="#A070F2" />
              <View style={styles.textContainer}>
                <Text style={styles.rowTitle}>Enable Sentry Mode</Text>
                <Text style={styles.rowSubtitle}>
                  {settings.isEnabled ? 'Active - Monitoring for threats' : 'Inactive - No monitoring'}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.isEnabled}
              onValueChange={handleToggleSentryMode}
              trackColor={{ false: '#767577', true: '#A070F2' }}
              thumbColor={settings.isEnabled ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Documentation Link Card */}
        <TouchableOpacity 
          style={styles.docsCard}
          onPress={handleLearnMore}
          activeOpacity={0.8}
        >
          <View style={styles.docsHeader}>
            <Icon name="document-text-outline" size={20} color="#4A90E2" />
            <Text style={styles.docsTitle}>Learn More</Text>
            <Icon name="chevron-forward" size={20} color="#4A90E2" style={{ marginLeft: 'auto' }} />
          </View>
          <Text style={styles.docsText}>
            Read the complete Sentry Mode documentation including setup guides, 
            privacy information, and troubleshooting tips.
          </Text>
        </TouchableOpacity>

        {settings.isEnabled && (
          <>
            {/* Threat Level Buttons */}
            <View ref={threatButtonsRef} style={styles.threatLevelRow}>
              <ThreatLevelPicker
                selectedLevel={settings.threatLevel}
                onLevelSelect={handleThreatLevelChange}
              />
            </View>

            {/* Contact Info */}
            <View ref={contactInfoRef} style={styles.contactInfoRow}>
              <ContactPicker
                selectedContact={settings.trustedContact}
                onContactSelect={handleContactSelect}
              />
            </View>

            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Icon name="information-circle-outline" size={20} color="#A070F2" />
                <Text style={styles.statusTitle}>Current Configuration</Text>
              </View>
              <View style={styles.statusContent}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Threat Level:</Text>
                  <Text style={styles.statusValue}>{settings.threatLevel}</Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Contact:</Text>
                  <Text style={styles.statusValue}>
                    {settings.trustedContact ? settings.trustedContact.name : 'Not Set'}
                  </Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status:</Text>
                  <Text style={[styles.statusValue, { color: '#4CAF50' }]}>
                    Ready to monitor
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Icon name="bulb-outline" size={20} color="#FFD700" />
                <Text style={styles.infoTitle}>How it works</Text>
              </View>
              <Text style={styles.infoText}>
                When ThreatSense detects a threat at or above your selected level, 
                it will automatically send a notification to your trusted contact 
                with details about the threat and your location.
              </Text>
              <TouchableOpacity
                style={styles.demoLinkCentered}
                onPress={() => navigation.navigate('SentryModeGuidedDemo')}
                activeOpacity={0.7}
              >
                <Text style={styles.demoLinkCenteredText}>See Guided Demo</Text>
              </TouchableOpacity>
            </View>

            {/* Trusted Contact Card */}
            <View ref={trustedContactRef} style={styles.card}>
              {/* ... trusted contact content ... */}
            </View>

            {/* Test Notification Button */}
            <TouchableOpacity
              ref={testNotificationRef}
              style={styles.testButton}
              onPress={handleTestNotification}
            >
              <Text style={[styles.testButtonText, { color: '#fff' }]}>Test Notification</Text>
            </TouchableOpacity>

            {/* Preview Alert Button */}
            <TouchableOpacity style={[styles.testButton, { backgroundColor: '#A070F2', marginBottom: 10 }]} onPress={handlePreviewAlert}>
              <Icon name="eye-outline" size={20} color="#fff" />
              <Text style={[styles.testButtonText, { color: '#fff' }]}>Preview Alert</Text>
            </TouchableOpacity>

            {/* Simulate Contact Response Button */}
            <TouchableOpacity style={[styles.testButton, { backgroundColor: '#4A90E2', marginBottom: 10 }]} onPress={handleSimulateContactResponse}>
              <Icon name="chatbubbles-outline" size={20} color="#fff" />
              <Text style={[styles.testButtonText, { color: '#fff' }]}>Simulate Contact Response</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleResetSettings}>
          <Icon name="refresh-outline" size={20} color="#FF6B6B" />
          <Text style={styles.resetButtonText}>Reset to Defaults</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      {showDemoInfo && (
        <View style={styles.demoInfoModalOverlay}>
          <View style={styles.demoInfoModal}>
            <Text style={styles.demoInfoTitle}>Demo Mode Limitation</Text>
            <Text style={styles.demoInfoText}>
              In development/demo mode, notifications are simulated and not actually sent. In a live environment, your trusted contact will receive real SMS, email, and (if they have the app) push notifications with your alert details.
            </Text>
            <TouchableOpacity style={styles.demoInfoClose} onPress={() => setShowDemoInfo(false)}>
              <Text style={styles.demoInfoCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  rowTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: '#8A8A8E',
    fontSize: 14,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  statusContent: {
    paddingLeft: 28,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statusLabel: {
    color: '#8A8A8E',
    fontSize: 14,
  },
  statusValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 28,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  resetButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  testButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  docsCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  docsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  docsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  docsText: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 28,
  },
  threatLevelRow: {
    marginBottom: 15,
  },
  contactInfoRow: {
    marginBottom: 15,
  },
  demoLinkCentered: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: -6,
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  demoLinkCenteredText: {
    color: '#A070F2',
    fontWeight: '600',
    fontSize: 15,
  },
  demoInfoIcon: {
    marginLeft: 10,
    padding: 4,
  },
  demoInfoModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  demoInfoModal: {
    backgroundColor: '#23232A',
    borderRadius: 16,
    padding: 28,
    maxWidth: 340,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  demoInfoTitle: {
    color: '#A070F2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoInfoText: {
    color: '#fff',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
  },
  demoInfoClose: {
    backgroundColor: '#A070F2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  demoInfoCloseText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
});

export default SentryModeScreen; 