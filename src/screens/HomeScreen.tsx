import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Modal, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility, getAccessibleSpacing, getAccessiblePadding, getAccessibleBorderRadius } from '../context/AccessibilityContext';
import { useLogs } from '../context/LogContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_ACTIVITY_KEY = '@threatsense/recent_activity_meta';

const HomeScreen = () => {
  const { settings } = useAccessibility();
  const { logs, getBlockedSendersCount } = useLogs();
  const navigation = useNavigation();
  const [securityScoreHelpVisible, setSecurityScoreHelpVisible] = useState(false);
  const [recentModalVisible, setRecentModalVisible] = useState(false);
  const [recentMeta, setRecentMeta] = useState<{ [logId: string]: { read: boolean; dismissed: boolean } }>({});

  // Load read/dismissed state from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_ACTIVITY_KEY);
        if (stored) setRecentMeta(JSON.parse(stored));
      } catch {}
    })();
  }, []);

  // Save read/dismissed state to AsyncStorage
  useEffect(() => {
    AsyncStorage.setItem(RECENT_ACTIVITY_KEY, JSON.stringify(recentMeta));
  }, [recentMeta]);

  // Get accessible spacing values
  const spacing = getAccessibleSpacing(settings);
  const padding = getAccessiblePadding(settings);
  const borderRadius = getAccessibleBorderRadius(settings);

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

  const CARD_MIN_WIDTH = 110;
  const CARD_MAX_WIDTH = 150;

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, onPress?: () => void, showHelp?: boolean, helpContent?: string) => (
    <TouchableOpacity 
      style={[
        styles.statCard, 
        { 
          backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
          padding: padding,
          borderRadius: borderRadius,
          marginBottom: spacing,
          width: '48%',
          alignItems: 'center',
          justifyContent: 'center',
        }
      ]}
      onPress={onPress}
      disabled={!onPress}
      accessible={true}
      accessibilityLabel={`${title}: ${value}`}
      accessibilityHint={onPress ? "Tap to view details" : undefined}
    >
      <View style={[styles.statHeader, { justifyContent: 'center' }]}> 
        <Icon name={icon} size={settings.largeTextMode ? 28 : 24} color={color} />
      </View>
      <View style={[styles.statTitleContainer, { justifyContent: 'center' }]}> 
        <AccessibleText 
          variant="caption" 
          style={[styles.statTitle, { textAlign: 'center' }]} 
          numberOfLines={1} 
          ellipsizeMode="tail"
        >
          {title}
        </AccessibleText>
        {showHelp && (
          <TouchableOpacity
            onPress={() => setSecurityScoreHelpVisible(true)}
            accessible={true}
            accessibilityLabel={`Help for ${title}`}
            accessibilityHint="Tap to learn more about this metric"
          >
            <Icon name="help-circle-outline" size={settings.largeTextMode ? 20 : 16} color="#B0BEC5" style={styles.helpIcon} />
          </TouchableOpacity>
        )}
      </View>
      <AccessibleText variant="title" style={[styles.statValue, { color, textAlign: 'center' }]}>{value}</AccessibleText>
    </TouchableOpacity>
  );

  const renderQuickAction = (title: string, icon: string, onPress: () => void) => (
    <TouchableOpacity 
      style={[
        styles.quickAction, 
        { 
          backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
          padding: padding,
          borderRadius: borderRadius,
        }
      ]}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={`Quick action: ${title}`}
      accessibilityHint={`Tap to ${title.toLowerCase()}`}
    >
      <Icon name={icon} size={settings.largeTextMode ? 32 : 28} color="#4A90E2" />
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

  // Get recent activity from logs (up to 5, not dismissed)
  const getRecentActivity = () => {
    const recentLogs = logs.filter(log => !recentMeta[log.id]?.dismissed).slice(0, 5);
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
        category: log.category,
        log,
        id: log.id,
        read: !!recentMeta[log.id]?.read,
      };
    });
  };
  const recentActivity = getRecentActivity();
  const hasUnreadHighThreat = recentActivity.some(a => a.title === 'High threat detected' && !a.read);

  // Mark as read
  const markAsRead = (id: string) => {
    setRecentMeta(prev => ({ ...prev, [id]: { ...prev[id], read: true } }));
  };

  // Dismiss event
  const dismissEvent = (id: string) => {
    setRecentMeta(prev => ({ ...prev, [id]: { ...prev[id], dismissed: true } }));
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Icon name="shield-checkmark" size={40} color="#4A90E2" />
            </View>
            <AccessibleText variant="title" style={styles.welcomeText}>
              ThreatSense
            </AccessibleText>
            <TouchableOpacity
              style={styles.headerRight}
              onPress={() => setRecentModalVisible(true)}
              accessible={true}
              accessibilityLabel="Show recent activity"
              accessibilityHint="Tap to view recent activity"
            >
              <Icon name="notifications-outline" size={28} color="#4A90E2" />
              {hasUnreadHighThreat && (
                <View style={styles.badgeDot} />
              )}
            </TouchableOpacity>
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
              {renderStatCard('Score', `${stats.securityScore}%`, 'trending-up', '#4A90E2', undefined, true, 'The Security Score represents the percentage of safe messages in your communications. It is calculated as: (Safe Messages ÷ Total Messages) × 100. Higher scores indicate better overall security.')}
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

          {/* Recent Activity Modal */}
          <Modal
            visible={recentModalVisible}
            animationType="fade"
            transparent
            onRequestClose={() => setRecentModalVisible(false)}
          >
            <View style={styles.recentModalOverlay}>
              <View style={styles.recentModalContent}>
                <AccessibleText variant="subtitle" style={styles.recentModalTitle}>Recent Activity</AccessibleText>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <TouchableOpacity
                      key={activity.id}
                      style={[styles.recentModalItem, activity.read && { opacity: 0.5 }]}
                      onPress={() => {
                        markAsRead(activity.id);
                        setRecentModalVisible(false);
                        (navigation as any).navigate('LogDetail', { log: activity.log });
                      }}
                      activeOpacity={0.7}
                      accessible={true}
                      accessibilityLabel={`View details for ${activity.title}`}
                      accessibilityHint="Tap to view log details"
                    >
                      <Icon name={activity.icon} size={20} color={activity.color} />
                      <View style={styles.recentModalContentText}>
                        <AccessibleText variant="body" style={styles.recentModalItemTitle}>
                          {activity.title}
                        </AccessibleText>
                        <AccessibleText variant="caption" style={styles.recentModalItemTime}>
                          {activity.time} • {activity.category}
                        </AccessibleText>
                      </View>
                      {/* Dismiss button */}
                      <TouchableOpacity
                        style={styles.recentModalDismiss}
                        onPress={e => {
                          e.stopPropagation();
                          dismissEvent(activity.id);
                        }}
                        accessible={true}
                        accessibilityLabel={`Dismiss ${activity.title}`}
                        accessibilityHint="Remove from recent activity"
                      >
                        <Icon name="close-circle" size={20} color="#B0BEC5" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                ) : (
                  <View style={styles.recentModalItem}>
                    <Icon name="information-circle" size={20} color="#B0BEC5" />
                    <View style={styles.recentModalContentText}>
                      <AccessibleText variant="body" style={styles.recentModalItemTitle}>
                        No recent activity
                      </AccessibleText>
                      <AccessibleText variant="caption" style={styles.recentModalItemTime}>
                        Start scanning messages to see activity
                      </AccessibleText>
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={styles.recentModalClose}
                  onPress={() => setRecentModalVisible(false)}
                  accessible={true}
                  accessibilityLabel="Close recent activity"
                >
                  <AccessibleText variant="button" style={styles.recentModalCloseText}>Close</AccessibleText>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
      {/* Fixed Terms of Service Footer */}
      <View style={styles.tosFooter} pointerEvents="box-none">
        <Text style={styles.tosText}>
          By using this app, you agree to our totally serious Terms of Service: Don't hack the planet, don't feed the trolls, and always use strong passwords. ThreatSense is not responsible for any sudden urges to become a cybersecurity superhero. 🦸‍♂️
        </Text>
      </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerLeft: {
    marginRight: 10,
  },
  headerRight: {
    marginLeft: 'auto',
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
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
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
    marginTop: 24,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickAction: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    color: '#4A90E2',
    marginTop: 8,
    textAlign: 'center',
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
  badgeDot: {
    backgroundColor: '#FF6B6B',
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 4,
    right: 4,
  },
  recentModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentModalContent: {
    backgroundColor: '#1a1a1a',
    padding: 24,
    borderRadius: 16,
    width: '85%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  recentModalTitle: {
    color: '#4A90E2',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  recentModalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentModalContentText: {
    marginLeft: 12,
    flex: 1,
  },
  recentModalItemTitle: {
    color: '#FFFFFF',
    marginBottom: 2,
  },
  recentModalItemTime: {
    color: '#B0BEC5',
  },
  recentModalClose: {
    backgroundColor: '#4A90E2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 16,
    alignSelf: 'center',
  },
  recentModalCloseText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentModalDismiss: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  tosFooter: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 35, 126, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 18,
    alignItems: 'center',
    zIndex: 10,
  },
  tosText: {
    color: '#B0BEC5',
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default HomeScreen; 