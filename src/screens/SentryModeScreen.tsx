import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView, SafeAreaView, ActionSheetIOS, Platform, FlatList, Modal } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useSentryMode } from '../context/SentryModeContext';
import ContactPicker from '../components/ContactPicker';
import ThreatLevelPicker from '../components/ThreatLevelPicker';
import { notificationService, SentryModeAlert } from '../services/notificationService';
import { navigate, goBack } from '../services/navigationService';
import { useApp } from '../context/AppContext';
import { getSeverityColor } from '../utils/threatLevel';
import { useTheme } from '../context/ThemeContext';

type SentryModeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SentryMode'>;

const getStatusColor = (status: SentryModeAlert['status'], theme: any) => {
  switch (status) {
    case 'acknowledged': return theme.success;
    case 'contacted': return theme.primary;
    case 'emergency': return theme.error;
    case 'no_response': return theme.warning;
    default: return theme.textSecondary;
  }
};

const getStatusText = (status: SentryModeAlert['status']) => {
  switch (status) {
    case 'sent': return 'Alert Sent';
    case 'acknowledged': return 'Acknowledged';
    case 'contacted': return 'Contacted';
    case 'emergency': return 'Emergency';
    case 'no_response': return 'No Response';
    default: return 'Unknown';
  }
};

const SentryModeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<SentryModeScreenNavigationProp>();
  const { settings, updateSettings, isLoading } = useSentryMode();
  const { settingsSheetRef, contactResponseModal, setContactResponseModal } = useApp();
  const threatButtonsRef = useRef(null);
  const contactInfoRef = useRef(null);
  const testNotificationRef = useRef(null);
  const enableCardRef = useRef(null);
  const trustedContactRef = useRef(null);
  const [showDemoInfo, setShowDemoInfo] = useState(false);
  const [notificationHistory, setNotificationHistory] = useState<SentryModeAlert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertModalContent, setAlertModalContent] = useState<any>(null);

  useEffect(() => {
    loadNotificationHistory();
  }, []);

  const loadNotificationHistory = async () => {
    try {
      const history = await notificationService.getNotificationHistory();
      setNotificationHistory(history);
    } catch (error) {
      console.error('Error loading notification history:', error);
    }
  };

  const handleToggleSentryMode = (isEnabled: boolean) => {
    updateSettings({ isEnabled });
  };

  const handleThreatLevelChange = (threatLevel: 'Low' | 'Medium' | 'High') => {
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

  const handleSimulateResponse = () => {
    if (!settings.isEnabled) {
      Alert.alert('Sentry Mode Disabled', 'Please enable Sentry Mode first to simulate responses.');
      return;
    }

    if (!settings.trustedContact) {
      Alert.alert('No Trusted Contact', 'Please select a trusted contact first to simulate responses.');
      return;
    }

    Alert.alert(
      'Simulate Contact Response',
      'Choose how your trusted contact responds to the alert:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Acknowledged (OK)', 
          onPress: () => notificationService.simulateContactResponse(settings, 'acknowledged')
        },
        { 
          text: 'Contacted (Calling)', 
          onPress: () => notificationService.simulateContactResponse(settings, 'contacted')
        },
        { 
          text: 'Emergency', 
          onPress: () => notificationService.simulateContactResponse(settings, 'emergency')
        },
        { 
          text: 'No Response', 
          onPress: () => notificationService.simulateContactResponse(settings, 'no_response')
        }
      ]
    );
  };

  // Replace the Alert.alert for high threat detected with a custom modal
  const triggerHighThreatAlert = (details: any) => {
    setAlertModalContent(details);
    setShowAlertModal(true);
  };

  // Example usage: triggerHighThreatAlert({ ... })
  // You should call this instead of Alert.alert when a high threat is detected

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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 24, paddingTop: 32, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={styles.headerTitle}>Sentry Mode</Text>
          <TouchableOpacity onPress={() => setShowDemoInfo(true)} style={styles.demoInfoIcon}>
            <Icon name="help-circle-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerDescription}>
          When enabled, a trusted contact will be notified if a threat meets your selected criteria.
        </Text>

        {/* Main Toggle */}
        <View ref={enableCardRef} style={styles.card}>
          <View style={styles.row}>
            <View style={styles.leftSection}>
              <Icon name="shield-checkmark-outline" size={24} color={theme.primary} />
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
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={settings.isEnabled ? theme.text : theme.surface}
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
            <Icon name="document-text-outline" size={20} color={theme.primary} />
            <Text style={styles.docsTitle}>Learn More</Text>
            <Icon name="chevron-forward" size={20} color={theme.primary} style={{ marginLeft: 'auto' }} />
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
                <Icon name="information-circle-outline" size={20} color={theme.primary} />
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
                  <Text style={[styles.statusValue, { color: theme.success }]}>
                    Ready to monitor
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Icon name="bulb-outline" size={20} color={theme.primary} />
                <Text style={styles.infoTitle}>How It Works</Text>
              </View>
              <Text style={styles.infoText}>
                When ThreatSense detects a threat at or above your selected level, 
                it will automatically send notifications to your trusted contact through 
                SMS, email, and push notifications (if they have the app).
              </Text>
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
              activeOpacity={0.8}
            >
              <Icon name="notifications-outline" size={20} color={theme.success} />
              <Text style={styles.testButtonText}>Test Notification</Text>
            </TouchableOpacity>

            {/* Preview Alert Button */}
            <TouchableOpacity 
              style={styles.testButton}
              onPress={handlePreviewAlert}
              activeOpacity={0.8}
            >
              <Icon name="eye-outline" size={20} color={theme.primary} />
              <Text style={[styles.testButtonText, { color: theme.primary }]}>Preview Alert</Text>
            </TouchableOpacity>

            {/* Simulate Contact Response Button */}
            <TouchableOpacity style={[styles.testButton, { backgroundColor: theme.warning, marginBottom: 10 }]} onPress={handleSimulateResponse}>
              <Icon name="chatbubble-outline" size={20} color={theme.text} />
              <Text style={[styles.testButtonText, { color: theme.text }]}>Simulate Contact Response</Text>
            </TouchableOpacity>

            {/* Notification History */}
            {notificationHistory.length > 0 && (
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <Icon name="time-outline" size={20} color={theme.primary} />
                  <Text style={styles.historyTitle}>Recent Alerts</Text>
                  <TouchableOpacity onPress={loadNotificationHistory} style={styles.refreshButton}>
                    <Icon name="refresh" size={18} color={theme.primary} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={notificationHistory.slice(0, 5)} // Show last 5 alerts
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.historyItem}>
                      <View style={styles.historyItemHeader}>
                                                 <View style={[styles.threatLevelBadge, { backgroundColor: getSeverityColor(item.threatLevel) }]}>
                          <Text style={styles.threatLevelText}>{item.threatLevel}</Text>
                        </View>
                        <Text style={styles.historyTime}>
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </Text>
                      </View>
                      <Text style={styles.historyDescription}>{item.description}</Text>
                      {item.sender && (
                        <Text style={styles.historySender}>From: {item.sender}</Text>
                      )}
                      <View style={styles.statusRow}>
                        <Text style={styles.statusLabel}>Status:</Text>
                        <Text style={[styles.statusValue, { color: getStatusColor(item.status, theme) }]}>
                          {getStatusText(item.status)}
                        </Text>
                      </View>
                      {item.responseTime && (
                        <Text style={styles.responseTime}>
                          Response: {new Date(item.responseTime).toLocaleTimeString()}
                        </Text>
                      )}
                    </View>
                  )}
                  scrollEnabled={false}
                />
              </View>
            )}
          </>
        )}

        {/* Reset Button */}
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleResetSettings}
          activeOpacity={0.8}
        >
          <Icon name="refresh-outline" size={20} color={theme.error} />
          <Text style={styles.resetButtonText}>Reset Settings</Text>
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
      {/* Contact Response Modal */}
      <Modal
        visible={!!contactResponseModal}
        transparent
        animationType="fade"
        onRequestClose={() => setContactResponseModal(null)}
      >
        <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 28, minWidth: 270, maxWidth: 340, alignItems: 'center' }}>
            <Icon name="chatbubble-ellipses-outline" size={40} color={theme.primary} style={{ marginBottom: 12 }} />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Contact Response</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{contactResponseModal?.message}</Text>
            {contactResponseModal?.threatType && (
              <Text style={{ color: theme.warning, fontSize: 15, marginBottom: 8 }}>Threat Type: {contactResponseModal.threatType}</Text>
            )}
            {contactResponseModal?.timestamp && (
              <Text style={{ color: theme.textSecondary, fontSize: 13, marginBottom: 8 }}>Received: {new Date(contactResponseModal.timestamp).toLocaleTimeString()}</Text>
            )}
            <TouchableOpacity style={{ backgroundColor: theme.primary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 10 }} onPress={() => setContactResponseModal(null)}>
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Sentry Mode Alert Modal */}
      <Modal
        visible={showAlertModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlertModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: theme.overlay, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: theme.surface, borderRadius: 16, padding: 28, minWidth: 270, maxWidth: 340, alignItems: 'center' }}>
            <Icon name="shield-checkmark-outline" size={40} color={theme.primary} style={{ marginBottom: 12 }} />
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>Sentry Mode: High Threat Detected</Text>
            <Text style={{ color: theme.warning, fontSize: 15, marginBottom: 8, textAlign: 'center' }}>SENTRY MODE ALERT TRIGGERED</Text>
            <Text style={{ color: theme.textSecondary, fontSize: 16, marginBottom: 16, textAlign: 'center' }}>{alertModalContent?.message}</Text>
            {alertModalContent?.details && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>THREAT DETAILS:</Text>
                <Text style={{ color: theme.text, fontSize: 14 }}>• Level: {alertModalContent.details.level}</Text>
                <Text style={{ color: theme.text, fontSize: 14 }}>• Type: {alertModalContent.details.type}</Text>
                <Text style={{ color: theme.text, fontSize: 14 }}>• Description: {alertModalContent.details.description}</Text>
                <Text style={{ color: theme.text, fontSize: 14 }}>• Time: {alertModalContent.details.time}</Text>
                <Text style={{ color: theme.text, fontSize: 14 }}>• Location: {alertModalContent.details.location}</Text>
              </View>
            )}
            {alertModalContent?.notification && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>NOTIFICATION SENT:</Text>
                {alertModalContent.notification.map((n: string, i: number) => (
                  <Text key={i} style={{ color: theme.text, fontSize: 14 }}>• {n}</Text>
                ))}
              </View>
            )}
            {alertModalContent?.responses && (
              <View style={{ marginBottom: 12 }}>
                <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>EXPECTED RESPONSES:</Text>
                {alertModalContent.responses.map((r: string, i: number) => (
                  <Text key={i} style={{ color: theme.text, fontSize: 14 }}>• {r}</Text>
                ))}
              </View>
            )}
            <Text style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16, textAlign: 'center' }}>{alertModalContent?.footer}</Text>
            <TouchableOpacity style={{ backgroundColor: theme.primary, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 10, marginBottom: 6 }} onPress={() => setShowAlertModal(false)}>
              <Text style={{ color: theme.text, fontWeight: 'bold', fontSize: 16 }}>OK</Text>
            </TouchableOpacity>
            {alertModalContent?.onCall && (
              <TouchableOpacity style={{ backgroundColor: theme.surface, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 6, borderWidth: 1, borderColor: theme.primary }} onPress={alertModalContent.onCall}>
                <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16 }}>Call Contact</Text>
              </TouchableOpacity>
            )}
            {alertModalContent?.onText && (
              <TouchableOpacity style={{ backgroundColor: theme.surface, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 28, marginTop: 6, borderWidth: 1, borderColor: theme.primary }} onPress={alertModalContent.onText}>
                <Text style={{ color: theme.primary, fontWeight: 'bold', fontSize: 16 }}>Text Contact</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    color: theme.text,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 22,
  },
  card: {
    backgroundColor: theme.surface,
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
    color: theme.text,
    fontSize: 17,
    fontWeight: '500',
  },
  rowSubtitle: {
    color: theme.textSecondary,
    fontSize: 14,
    marginTop: 2,
  },
  statusCard: {
    backgroundColor: theme.surface,
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
    color: theme.text,
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
    color: theme.textSecondary,
    fontSize: 14,
  },
  statusValue: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: theme.surface,
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
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoText: {
    color: theme.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    paddingLeft: 28,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 16,
    marginTop: 20,
  },
  resetButtonText: {
    color: theme.error,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  testButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  testButtonText: {
    color: theme.success,
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 40,
  },
  docsCard: {
    backgroundColor: theme.surface,
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
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  docsText: {
    color: theme.textSecondary,
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
    color: theme.primary,
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
    backgroundColor: theme.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  demoInfoModal: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 28,
    maxWidth: 340,
    width: '85%',
    alignItems: 'center',
    shadowColor: theme.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  demoInfoTitle: {
    color: theme.primary,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  demoInfoText: {
    color: theme.text,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 18,
  },
  demoInfoClose: {
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
  },
  demoInfoCloseText: {
    color: theme.text,
    fontWeight: '600',
    fontSize: 15,
  },
  historySection: {
    backgroundColor: theme.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  historyTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  refreshButton: {
    marginLeft: 'auto',
  },
  historyItem: {
    marginBottom: 12,
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  threatLevelBadge: {
    padding: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  threatLevelText: {
    color: theme.text,
    fontSize: 14,
    fontWeight: '500',
  },
  historyTime: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  historyDescription: {
    color: theme.text,
    fontSize: 14,
  },
  historySender: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  responseTime: {
    color: theme.textSecondary,
    fontSize: 14,
  },
});

export default SentryModeScreen; 