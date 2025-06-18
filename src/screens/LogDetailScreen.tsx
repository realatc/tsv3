import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal, Platform, Linking } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { calculateThreatLevel } from '../utils/threatLevel';
import { ThreatBadge } from '../components/ThreatBadge';
import { CategoryBadgeDetailed } from '../components/CategoryBadge';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility } from '../context/AccessibilityContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLogs } from '../context/LogContext';
import Contacts from 'react-native-contacts';

// Mock data for demonstration
const mockLog = {
  id: '1',
  date: '2024-06-01',
  category: 'Mail',
  sender: 'scammer@example.com',
  message: 'You have won a prize! Click here to claim.',
  nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.',
  behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.',
  metadata: {
    device: 'iPhone 15',
    location: 'Austin, TX',
    receivedAt: '2024-06-01T10:15:00Z',
    messageLength: 45,
  },
  threat: '',
};

// Add this type for our action buttons
type ActionButton = {
  label: string;
  icon: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
};

const addOrOpenContact = async (sender: string, category: string) => {
  let contact;
  if (category === 'Mail') {
    contact = { emailAddresses: [{ label: 'work', email: sender }], givenName: sender };
  } else {
    contact = { phoneNumbers: [{ label: 'mobile', number: sender }], givenName: sender };
  }
  try {
    // Check if contact exists
    const existing = await Contacts.getContactsMatchingString(sender);
    let contactObj;
    if (existing && existing.length > 0) {
      contactObj = existing[0];
    } else {
      contactObj = await Contacts.addContact(contact);
    }
    // Open contact in system app
    if (Platform.OS === 'ios') {
      Contacts.openExistingContact(contactObj);
    } else {
      Contacts.openContactForm(contactObj);
    }
  } catch (e) {
    Alert.alert('Error', 'Could not add or open contact. Please check permissions.');
  }
};

const LogDetailScreen = () => {
  const route = useRoute();
  const { logs, addLog, blockSender, isSenderBlocked } = useLogs();
  const { settings } = useAccessibility();
  const navigation = useNavigation();
  // @ts-ignore
  const log = (route.params && route.params.log) ? route.params.log : mockLog;
  const [logState, setLogState] = useState(log);
  const [recalcKey, setRecalcKey] = useState(0);
  const threatResult = typeof logState.threat === 'object' && logState.threat.level && logState.threat.breakdown
    ? logState.threat
    : calculateThreatLevel(logState);
  const threatLevel = threatResult.level;
  const threatScore = threatResult.score || 0;
  const threatPercentage = threatResult.percentage;
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedBlockReason, setSelectedBlockReason] = useState('');

  // Show threat score breakdown
  const threatBreakdown = threatResult.breakdown || [];

  const blockReasons = [
    'Spam or unwanted messages',
    'Phishing attempt',
    'Scam or fraud',
    'Harassment',
    'Suspicious behavior',
    'Other'
  ];

  const handleAddContact = () => {
    Alert.alert(
      'Add Contact',
      `Would you like to add ${log.sender} to your contacts?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add',
          onPress: () => {
            // TODO: Implement contact addition
            Alert.alert('Success', 'Contact added successfully');
          }
        }
      ]
    );
  };

  const handleBlock = async () => {
    if (isSenderBlocked(log.sender)) {
      Alert.alert('Already Blocked', `${log.sender} is already blocked.`);
      return;
    }
    // Add to contacts and open system contact app
    await addOrOpenContact(log.sender, log.category);
    // Show platform-specific instructions
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Block Sender',
        'To block this sender, scroll down in the contact and tap "Block this Caller".'
      );
    } else {
      Alert.alert(
        'Block Sender',
        'To block this sender, tap the menu in the contact and select "Block numbers" (if available).'
      );
    }
    setBlockModalVisible(true);
  };

  const confirmBlock = () => {
    if (!selectedBlockReason) {
      Alert.alert('Error', 'Please select a reason for blocking.');
      return;
    }

    blockSender(log.sender, selectedBlockReason, log.category);
    setBlockModalVisible(false);
    setSelectedBlockReason('');
    
    Alert.alert(
      'Sender Blocked',
      `${log.sender} has been blocked successfully.`,
      [
        { 
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report Threat',
      'Would you like to report this threat?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Report',
          onPress: () => {
            // TODO: Implement reporting
            Alert.alert('Success', 'Threat has been reported');
          }
        }
      ]
    );
  };

  const handleIgnore = () => {
    Alert.alert(
      'Ignore Log',
      'Mark this log as reviewed and ignore?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Ignore',
          onPress: () => {
            // TODO: Implement ignore status
            Alert.alert('Success', 'Log marked as ignored');
          }
        }
      ]
    );
  };

  const handleArchive = () => {
    Alert.alert(
      'Archive Log',
      'Move this log to archives?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive',
          onPress: () => {
            // TODO: Implement archiving
            Alert.alert('Success', 'Log has been archived');
          }
        }
      ]
    );
  };

  const handleShare = () => {
    // TODO: Implement sharing functionality
    Alert.alert('Share', 'Sharing functionality coming soon');
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Log',
      'Are you sure you want to delete this log?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement deletion
            Alert.alert('Success', 'Log has been deleted');
          }
        }
      ]
    );
  };

  const handleRecalculateThreat = () => {
    const newThreat = calculateThreatLevel(logState);
    setLogState({ ...logState, threat: newThreat });
    setRecalcKey(prev => prev + 1); // force rerender if needed
  };

  const actionButtons: ActionButton[] = [
    { label: 'Add Contact', icon: 'person-add', color: '#4A90E2', onPress: handleAddContact },
    { 
      label: isSenderBlocked(log.sender) ? 'Already Blocked' : 'Block', 
      icon: isSenderBlocked(log.sender) ? 'ban' : 'ban', 
      color: isSenderBlocked(log.sender) ? '#B0BEC5' : '#FF6B6B', 
      onPress: handleBlock,
      disabled: isSenderBlocked(log.sender)
    },
    { label: 'Report', icon: 'flag', color: '#FFB300', onPress: handleReport },
    { label: 'Ignore', icon: 'checkmark-circle', color: '#43A047', onPress: handleIgnore },
    { label: 'Archive', icon: 'archive', color: '#7B1FA2', onPress: handleArchive },
    { label: 'Share', icon: 'share-social', color: '#00ACC1', onPress: handleShare },
    { label: 'Delete', icon: 'trash', color: '#FF6B6B', onPress: handleDelete },
  ];

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <Icon name="shield" size={32} color="#4A90E2" style={{ marginRight: 10 }} />
            <AccessibleText variant="title" style={styles.title}>Log Details</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
                <AccessibleText variant="body" style={styles.label}>Date:</AccessibleText>
                <AccessibleText variant="body" style={styles.value}>{log.date}</AccessibleText>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThreatBadge level={threatLevel} score={threatScore} />
                <TouchableOpacity 
                  onPress={() => setHelpModalVisible(true)} 
                  style={styles.helpIconButton}
                  accessible={true}
                  accessibilityLabel="Help with threat level scoring"
                  accessibilityHint="Tap to learn how threat levels are calculated"
                >
                  <Icon name="help-circle-outline" size={20} color="#B0BEC5" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="mail" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
                <AccessibleText variant="body" style={styles.label}>Category:</AccessibleText>
                <CategoryBadgeDetailed category={log.category} />
              </View>
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="person" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Sender</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>{log.sender}</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="document-text" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Message</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>{log.message}</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="analytics" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>NLP Analysis</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>{log.nlpAnalysis}</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="pulse" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Behavioral Analysis</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>{log.behavioralAnalysis}</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="information-circle" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Metadata</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>Device: {log.metadata.device}</AccessibleText>
            <AccessibleText variant="body" style={styles.value}>Location: {log.metadata.location}</AccessibleText>
            <AccessibleText variant="body" style={styles.value}>Received At: {log.metadata.receivedAt}</AccessibleText>
            <AccessibleText variant="body" style={styles.value}>Message Length: {log.metadata.messageLength}</AccessibleText>
          </View>

          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="color-wand" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Threat Level Calculation</AccessibleText>
            </View>
            <AccessibleText variant="caption" style={styles.threatExplain}>
              The threat level is calculated based on NLP and behavioral analysis, sender, and message content. Higher scores are given for urgent, suspicious, or scam-like language, unknown senders, and known scam patterns.
            </AccessibleText>
          </View>

          {/* Threat Score Breakdown Card */}
          <View style={[styles.card, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.06)' }]}>
            <View style={styles.sectionHeader}>
              <Icon name="list" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <AccessibleText variant="subtitle" style={styles.sectionTitle}>Threat Score Breakdown</AccessibleText>
            </View>
            <AccessibleText variant="body" style={styles.value}>Total Points: {threatScore} / 9 ({threatPercentage}%)</AccessibleText>
            {threatBreakdown.length > 0 ? (
              threatBreakdown.map((item: any, idx: number) => (
                <AccessibleText key={idx} variant="body" style={styles.value}>• {item.label}: +{item.points}</AccessibleText>
              ))
            ) : (
              <AccessibleText variant="body" style={styles.value}>No threat points detected.</AccessibleText>
            )}
          </View>

          {/* Recalculate Threat Button */}
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: '#263159', marginBottom: 12 }]} 
            onPress={handleRecalculateThreat}
            accessible={true}
            accessibilityLabel="Recalculate threat level"
            accessibilityHint="Tap to recalculate the threat level for this log entry"
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="refresh" size={18} color="#4A90E2" style={{ marginRight: 8 }} />
              <AccessibleText variant="subtitle" style={[styles.sectionTitle, { color: '#4A90E2' }]}>Recalculate Threat Level</AccessibleText>
            </View>
          </TouchableOpacity>

          {/* Compact Actions Button */}
          <View style={styles.actionsButtonContainer}>
            <TouchableOpacity
              style={styles.actionsButton}
              onPress={() => setActionSheetVisible(true)}
              accessible={true}
              accessibilityLabel="Actions menu"
              accessibilityHint="Tap to open actions menu for this log entry"
            >
              <Icon name="ellipsis-horizontal" size={28} color="#4A90E2" />
              <AccessibleText variant="button" style={styles.actionsButtonText}>Actions</AccessibleText>
            </TouchableOpacity>
          </View>

          {/* Action Sheet Modal */}
          <Modal
            visible={actionSheetVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setActionSheetVisible(false)}
          >
            <TouchableOpacity
              style={styles.actionSheetOverlay}
              activeOpacity={1}
              onPressOut={() => setActionSheetVisible(false)}
            >
              <View style={styles.actionSheetContainer}>
                <Text style={styles.actionSheetTitle}>Select Action</Text>
                {actionButtons.map((button) => (
                  <TouchableOpacity
                    key={button.label}
                    style={[
                      styles.actionSheetButton,
                      button.disabled && styles.actionSheetButtonDisabled
                    ]}
                    onPress={() => {
                      if (button.disabled) return;
                      setActionSheetVisible(false);
                      setTimeout(button.onPress, 200); // Delay to allow modal to close
                    }}
                    disabled={button.disabled}
                  >
                    <Icon 
                      name={button.icon} 
                      size={22} 
                      color={button.disabled ? '#666666' : button.color} 
                      style={{ marginRight: 14 }} 
                    />
                    <Text style={[
                      styles.actionSheetButtonText, 
                      { color: button.disabled ? '#666666' : button.color }
                    ]}>
                      {button.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.actionSheetCancel}
                  onPress={() => setActionSheetVisible(false)}
                >
                  <Text style={styles.actionSheetCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>

          {/* Help Modal for Threat Level */}
          <Modal
            visible={helpModalVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setHelpModalVisible(false)}
          >
            <View style={styles.helpModalOverlay}>
              <View style={styles.helpModalContent}>
                <Text style={styles.helpModalTitle}>Threat Level Scoring</Text>
                <Text style={styles.helpModalText}>• High: 4 - 9 points</Text>
                <Text style={styles.helpModalText}>• Medium: 2 - 3 points</Text>
                <Text style={styles.helpModalText}>• Low: 0 - 1 point</Text>
                <Text style={styles.helpModalText}>The threat score is calculated based on message content and sender behavior. Higher scores indicate greater risk. The maximum possible score is 9.</Text>
                <TouchableOpacity style={styles.helpModalButton} onPress={() => setHelpModalVisible(false)}>
                  <Text style={styles.helpModalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Block Modal */}
          <Modal
            visible={blockModalVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setBlockModalVisible(false)}
          >
            <View style={styles.blockModalOverlay}>
              <View style={styles.blockModalContent}>
                <Text style={styles.blockModalTitle}>Block Sender</Text>
                <Text style={styles.blockModalText}>Please select a reason for blocking:</Text>
                {blockReasons.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    style={styles.blockModalReasonButton}
                    onPress={() => setSelectedBlockReason(reason)}
                  >
                    <Text style={styles.blockModalReasonText}>{reason}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.blockModalConfirmButton}
                  onPress={confirmBlock}
                >
                  <Text style={styles.blockModalConfirmText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    flex: 1,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#B0BEC5',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  threatExplain: {
    color: '#B0BEC5',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 2,
  },
  actionsButtonContainer: {
    alignItems: 'center',
    marginVertical: 18,
  },
  actionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 144, 226, 0.12)',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  actionsButtonText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  actionSheetContainer: {
    backgroundColor: '#23294d',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 18,
    paddingBottom: 32,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  actionSheetTitle: {
    color: '#4A90E2',
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  actionSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  actionSheetButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  actionSheetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionSheetCancel: {
    marginTop: 18,
    alignItems: 'center',
  },
  actionSheetCancelText: {
    color: '#B0BEC5',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpIconButton: {
    marginLeft: 4,
    padding: 2,
  },
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    backgroundColor: '#23294d',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  helpModalTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  helpModalText: {
    color: '#B0BEC5',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  helpModalButton: {
    marginTop: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  helpModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  blockModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blockModalContent: {
    backgroundColor: '#23294d',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  blockModalTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  blockModalText: {
    color: '#B0BEC5',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  blockModalReasonButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  blockModalReasonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  blockModalConfirmButton: {
    marginTop: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  blockModalConfirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default LogDetailScreen; 