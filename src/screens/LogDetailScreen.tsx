import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { calculateThreatLevel } from '../utils/threatLevel';
import { ThreatBadge } from '../components/ThreatBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import Icon from 'react-native-vector-icons/Ionicons';
import { useLogs } from '../context/LogContext';

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
};

const LogDetailScreen = () => {
  const route = useRoute();
  const { logs, addLog } = useLogs();
  // @ts-ignore
  const log = (route.params && route.params.log) ? route.params.log : mockLog;
  const [logState, setLogState] = useState(log);
  const [recalcKey, setRecalcKey] = useState(0);
  const threatResult = typeof logState.threat === 'object' && logState.threat.level && logState.threat.breakdown
    ? logState.threat
    : calculateThreatLevel(logState);
  const threatLevel = threatResult.level;
  const threatScore = threatResult.score;
  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // Show threat score breakdown
  const threatBreakdown = threatResult.breakdown || [];

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

  const handleBlock = () => {
    Alert.alert(
      'Block Sender',
      `Are you sure you want to block ${log.sender}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement blocking
            Alert.alert('Success', 'Sender has been blocked');
          }
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
    { label: 'Block', icon: 'ban', color: '#E53935', onPress: handleBlock },
    { label: 'Report', icon: 'flag', color: '#FFB300', onPress: handleReport },
    { label: 'Ignore', icon: 'checkmark-circle', color: '#43A047', onPress: handleIgnore },
    { label: 'Archive', icon: 'archive', color: '#7B1FA2', onPress: handleArchive },
    { label: 'Share', icon: 'share-social', color: '#00ACC1', onPress: handleShare },
    { label: 'Delete', icon: 'trash', color: '#E53935', onPress: handleDelete },
  ];

  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <Icon name="shield" size={32} color="#4A90E2" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Log Details</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="calendar" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{log.date}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ThreatBadge level={threatLevel} score={threatScore} />
                <TouchableOpacity onPress={() => setHelpModalVisible(true)} style={styles.helpIconButton}>
                  <Icon name="help-circle-outline" size={20} color="#B0BEC5" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.rowBetween}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="mail" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
                <Text style={styles.label}>Category:</Text>
                <CategoryBadge category={log.category} />
              </View>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="person" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Sender</Text>
            </View>
            <Text style={styles.value}>{log.sender}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="document-text" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Message</Text>
            </View>
            <Text style={styles.value}>{log.message}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="analytics" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>NLP Analysis</Text>
            </View>
            <Text style={styles.value}>{log.nlpAnalysis}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="pulse" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Behavioral Analysis</Text>
            </View>
            <Text style={styles.value}>{log.behavioralAnalysis}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="information-circle" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Metadata</Text>
            </View>
            <Text style={styles.value}>Device: {log.metadata.device}</Text>
            <Text style={styles.value}>Location: {log.metadata.location}</Text>
            <Text style={styles.value}>Received At: {log.metadata.receivedAt}</Text>
            <Text style={styles.value}>Message Length: {log.metadata.messageLength}</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="color-wand" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Threat Level Calculation</Text>
            </View>
            <Text style={styles.threatExplain}>
              The threat level is calculated based on NLP and behavioral analysis, sender, and message content. Higher scores are given for urgent, suspicious, or scam-like language, unknown senders, and known scam patterns.
            </Text>
          </View>

          {/* Threat Score Breakdown Card */}
          <View style={styles.card}>
            <View style={styles.sectionHeader}>
              <Icon name="list" size={18} color="#B0BEC5" style={{ marginRight: 6 }} />
              <Text style={styles.sectionTitle}>Threat Score Breakdown</Text>
            </View>
            <Text style={styles.value}>Total Points: {threatResult.score} / 9</Text>
            {threatBreakdown.length > 0 ? (
              threatBreakdown.map((item, idx) => (
                <Text key={idx} style={styles.value}>• {item.label}: +{item.points}</Text>
              ))
            ) : (
              <Text style={styles.value}>No threat points detected.</Text>
            )}
          </View>

          {/* Recalculate Threat Button */}
          <TouchableOpacity style={[styles.card, { backgroundColor: '#263159', marginBottom: 12 }]} onPress={handleRecalculateThreat}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="refresh" size={18} color="#4A90E2" style={{ marginRight: 8 }} />
              <Text style={[styles.sectionTitle, { color: '#4A90E2' }]}>Recalculate Threat Level</Text>
            </View>
          </TouchableOpacity>

          {/* Compact Actions Button */}
          <View style={styles.actionsButtonContainer}>
            <TouchableOpacity
              style={styles.actionsButton}
              onPress={() => setActionSheetVisible(true)}
            >
              <Icon name="ellipsis-horizontal" size={28} color="#4A90E2" />
              <Text style={styles.actionsButtonText}>Actions</Text>
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
                    style={styles.actionSheetButton}
                    onPress={() => {
                      setActionSheetVisible(false);
                      setTimeout(button.onPress, 200); // Delay to allow modal to close
                    }}
                  >
                    <Icon name={button.icon} size={22} color={button.color} style={{ marginRight: 14 }} />
                    <Text style={[styles.actionSheetButtonText, { color: button.color }]}>{button.label}</Text>
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
});

export default LogDetailScreen; 