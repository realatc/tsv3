import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility } from '../context/AccessibilityContext';
import { useLogs } from '../context/LogContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const { settings } = useAccessibility();
  const { logs, getBlockedSendersCount } = useLogs();
  const navigation = useNavigation();
  const [securityScoreHelpVisible, setSecurityScoreHelpVisible] = useState(false);

  // Calculate real statistics from logs
  const calculateStats = () => {
    const totalLogs = logs.length;
    const highThreatLogs = logs.filter(log => {
      if (typeof log.threat === 'object' && log.threat.level) {
        return log.threat.level === 'High';
      }
      return log.threat === 'High';
    }).length;
    
    const safeLogs = logs.filter(log => {
      if (typeof log.threat === 'object' && log.threat.level) {
        return log.threat.level === 'Low';
      }
      return log.threat === 'Low' || !log.threat;
    }).length;
    
    const blockedSenders = getBlockedSendersCount();
    
    const securityScore = totalLogs > 0 ? Math.round(((totalLogs - highThreatLogs) / totalLogs) * 100) : 100;
    
    return {
      threatsDetected: highThreatLogs,
      safeMessages: safeLogs,
      blockedSenders,
      securityScore
    };
  };

  const stats = calculateStats();

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, onPress?: () => void, showHelp?: boolean, helpContent?: string) => (
    <View style={[styles.statCard, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)' }]}>
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <View style={styles.statTitleContainer}>
          <AccessibleText variant="caption" style={styles.statTitle}>{title}</AccessibleText>
          {showHelp && (
            <TouchableOpacity
              onPress={() => setSecurityScoreHelpVisible(true)}
              accessible={true}
              accessibilityLabel={`Help for ${title}`}
              accessibilityHint="Tap to learn more about this metric"
            >
              <Icon name="help-circle-outline" size={16} color="#B0BEC5" style={styles.helpIcon} />
            </TouchableOpacity>
          )}
        </View>
      </View>
      <TouchableOpacity 
        onPress={onPress}
        disabled={!onPress}
        accessible={true}
        accessibilityLabel={`${title}: ${value}`}
        accessibilityHint={onPress ? "Tap to view details" : undefined}
      >
        <AccessibleText variant="title" style={[styles.statValue, { color }]}>{value}</AccessibleText>
      </TouchableOpacity>
    </View>
  );

  const renderQuickAction = (title: string, icon: string, onPress: () => void) => (
    <TouchableOpacity 
      style={[styles.quickAction, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)' }]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Quick action: ${title}`}
      accessibilityHint={`Tap to ${title.toLowerCase()}`}
    >
      <Icon name={icon} size={28} color="#4A90E2" />
      <AccessibleText variant="button" style={styles.quickActionText}>{title}</AccessibleText>
    </TouchableOpacity>
  );

  const handleViewThreats = () => {
    // Navigate to logs with high threat filter
    (navigation as any).navigate('LogHistory', { threatFilter: 'High' });
  };

  const handleViewSafeMessages = () => {
    // Navigate to logs with low threat filter
    (navigation as any).navigate('LogHistory', { threatFilter: 'Low' });
  };

  const handleScanMessages = () => {
    // Navigate to threat demo or scan functionality
    (navigation as any).navigate('ThreatDemo');
  };

  const handleViewLogs = () => {
    (navigation as any).navigate('LogHistory');
  };

  const handleOpenSettings = () => {
    (navigation as any).navigate('Settings');
  };

  const handleOpenHelp = () => {
    (navigation as any).navigate('KnowledgeBase');
  };

  const handleViewBlockedSenders = () => {
    // Navigate to blocked senders management screen
    (navigation as any).navigate('BlockedSenders');
  };

  // Get recent activity from logs
  const getRecentActivity = () => {
    const recentLogs = logs.slice(0, 2); // Get 2 most recent logs
    return recentLogs.map(log => {
      const threatLevel = typeof log.threat === 'object' && log.threat.level ? log.threat.level : 'Low';
      const isHighThreat = threatLevel === 'High';
      const icon = isHighThreat ? 'mail' : 'chatbubble';
      const color = isHighThreat ? '#FF6B6B' : '#43A047';
      const title = isHighThreat ? 'High threat detected' : 'Safe message received';
      
      return {
        icon,
        color,
        title,
        time: log.date,
        category: log.category
      };
    });
  };

  const recentActivity = getRecentActivity();

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Icon name="shield-checkmark" size={40} color="#4A90E2" />
            <AccessibleText variant="title" style={styles.welcomeText}>
              ThreatSense
            </AccessibleText>
          </View>

          {/* Stats Overview */}
          <View style={styles.statsSection}>
            <AccessibleText variant="subtitle" style={styles.sectionTitle}>
              Security Overview
            </AccessibleText>
            <View style={styles.statsGrid}>
              {renderStatCard('Threats Detected', stats.threatsDetected, 'warning', '#FF6B6B', handleViewThreats)}
              {renderStatCard('Safe Messages', stats.safeMessages, 'shield-checkmark', '#43A047', handleViewSafeMessages)}
              {renderStatCard('Blocked Senders', stats.blockedSenders, 'ban', '#FFB300', handleViewBlockedSenders)}
              {renderStatCard('Security Score', `${stats.securityScore}%`, 'trending-up', '#4A90E2', undefined, true, 'The Security Score represents the percentage of safe messages in your communications. It is calculated as: (Safe Messages ÷ Total Messages) × 100. Higher scores indicate better overall security.')}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <AccessibleText variant="subtitle" style={styles.sectionTitle}>
              Quick Actions
            </AccessibleText>
            <View style={styles.quickActionsGrid}>
              {renderQuickAction('Scan Messages', 'search', handleScanMessages)}
              {renderQuickAction('View Logs', 'list', handleViewLogs)}
              {renderQuickAction('Settings', 'settings', handleOpenSettings)}
              {renderQuickAction('Help', 'help-circle', handleOpenHelp)}
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.recentSection}>
            <AccessibleText variant="subtitle" style={styles.sectionTitle}>
              Recent Activity
            </AccessibleText>
            <View style={[styles.recentCard, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)' }]}>
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <View key={index} style={styles.recentItem}>
                    <Icon name={activity.icon} size={20} color={activity.color} />
                    <View style={styles.recentContent}>
                      <AccessibleText variant="body" style={styles.recentTitle}>
                        {activity.title}
                      </AccessibleText>
                      <AccessibleText variant="caption" style={styles.recentTime}>
                        {activity.time} • {activity.category}
                      </AccessibleText>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.recentItem}>
                  <Icon name="information-circle" size={20} color="#B0BEC5" />
                  <View style={styles.recentContent}>
                    <AccessibleText variant="body" style={styles.recentTitle}>
                      No recent activity
                    </AccessibleText>
                    <AccessibleText variant="caption" style={styles.recentTime}>
                      Start scanning messages to see activity
                    </AccessibleText>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Security Score Help Modal */}
          <Modal
            visible={securityScoreHelpVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setSecurityScoreHelpVisible(false)}
          >
            <View style={styles.helpModalOverlay}>
              <View style={styles.helpModalContent}>
                <AccessibleText variant="subtitle" style={styles.helpModalTitle}>Security Score</AccessibleText>
                <AccessibleText variant="body" style={styles.helpModalText}>
                  The Security Score represents the percentage of safe messages in your communications.
                </AccessibleText>
                <AccessibleText variant="body" style={styles.helpModalText}>
                  <AccessibleText variant="body" style={styles.helpModalBold}>Formula:</AccessibleText> (Safe Messages ÷ Total Messages) × 100
                </AccessibleText>
                <AccessibleText variant="body" style={styles.helpModalText}>
                  <AccessibleText variant="body" style={styles.helpModalBold}>Safe Messages:</AccessibleText> Low threat, Medium threat, or no threat detected
                </AccessibleText>
                <AccessibleText variant="body" style={styles.helpModalText}>
                  <AccessibleText variant="body" style={styles.helpModalBold}>High Threat:</AccessibleText> Messages with 4+ threat points
                </AccessibleText>
                <AccessibleText variant="body" style={styles.helpModalText}>
                  <AccessibleText variant="body" style={styles.helpModalBold}>Higher scores</AccessibleText> indicate better overall security.
                </AccessibleText>
                <TouchableOpacity 
                  style={styles.helpModalButton} 
                  onPress={() => setSecurityScoreHelpVisible(false)}
                  accessible={true}
                  accessibilityLabel="Close help modal"
                >
                  <AccessibleText variant="button" style={styles.helpModalButtonText}>Got it</AccessibleText>
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
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    color: '#FFFFFF',
    marginTop: 15,
    marginBottom: 5,
  },
  subtitleText: {
    color: '#B0BEC5',
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#4A90E2',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statTitle: {
    color: '#B0BEC5',
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 4,
  },
  quickActionsSection: {
    marginBottom: 30,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '48%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionText: {
    color: '#4A90E2',
    marginTop: 8,
    textAlign: 'center',
  },
  recentSection: {
    marginBottom: 20,
  },
  recentCard: {
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentContent: {
    marginLeft: 12,
    flex: 1,
  },
  recentTitle: {
    color: '#FFFFFF',
    marginBottom: 2,
  },
  recentTime: {
    color: '#B0BEC5',
  },
  helpIcon: {
    marginLeft: 4,
  },
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  helpModalTitle: {
    color: '#4A90E2',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  helpModalText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  helpModalBold: {
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  helpModalButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  helpModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen; 