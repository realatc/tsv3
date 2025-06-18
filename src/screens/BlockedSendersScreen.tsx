import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLogs } from '../context/LogContext';

const BlockedSendersScreen = () => {
  const { settings } = useAccessibility();
  const { blockedSenders, unblockSender } = useLogs();

  const handleUnblock = (sender: string) => {
    Alert.alert(
      'Unblock Sender',
      `Are you sure you want to unblock ${sender}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Unblock',
          style: 'destructive',
          onPress: () => {
            unblockSender(sender);
            Alert.alert('Success', `${sender} has been unblocked.`);
          }
        }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Icon name="ban" size={32} color="#FFB300" />
            <AccessibleText variant="title" style={styles.title}>
              Blocked Senders
            </AccessibleText>
          </View>

          {blockedSenders.length === 0 ? (
            <View style={styles.emptyState}>
              <Icon name="shield-checkmark" size={48} color="#B0BEC5" />
              <AccessibleText variant="subtitle" style={styles.emptyTitle}>
                No Blocked Senders
              </AccessibleText>
              <AccessibleText variant="body" style={styles.emptyText}>
                When you block senders from the log details, they will appear here for management.
              </AccessibleText>
            </View>
          ) : (
            <View style={styles.blockedList}>
              {blockedSenders.map((blocked, index) => (
                <View 
                  key={index} 
                  style={[
                    styles.blockedCard, 
                    { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)' }
                  ]}
                >
                  <View style={styles.blockedHeader}>
                    <View style={styles.blockedInfo}>
                      <AccessibleText variant="subtitle" style={styles.blockedSender}>
                        {blocked.sender}
                      </AccessibleText>
                      <AccessibleText variant="caption" style={styles.blockedCategory}>
                        {blocked.category} • Blocked {formatDate(blocked.blockedAt)}
                      </AccessibleText>
                    </View>
                    <TouchableOpacity
                      style={styles.unblockButton}
                      onPress={() => handleUnblock(blocked.sender)}
                      accessible={true}
                      accessibilityLabel={`Unblock ${blocked.sender}`}
                      accessibilityHint="Tap to unblock this sender"
                    >
                      <Icon name="close-circle" size={24} color="#FF6B6B" />
                    </TouchableOpacity>
                  </View>
                  <AccessibleText variant="body" style={styles.blockedReason}>
                    Reason: {blocked.reason}
                  </AccessibleText>
                </View>
              ))}
            </View>
          )}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  blockedList: {
    gap: 12,
  },
  blockedCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  blockedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  blockedInfo: {
    flex: 1,
    marginRight: 12,
  },
  blockedSender: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  blockedCategory: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  unblockButton: {
    padding: 4,
  },
  blockedReason: {
    color: '#FFB300',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

export default BlockedSendersScreen; 