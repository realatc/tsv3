import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
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

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, onPress?: () => void) => (
    <TouchableOpacity 
      style={[styles.statCard, { backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)' }]}
      onPress={onPress}
      disabled={!onPress}
      accessible={true}
      accessibilityLabel={`${title}: ${value}`}
      accessibilityHint={onPress ? "Tap to view details" : undefined}
    >
      <View style={styles.statHeader}>
        <Icon name={icon} size={24} color={color} />
        <AccessibleText variant="caption" style={styles.statTitle}>{title}</AccessibleText>
      </View>
      <AccessibleText variant="title" style={[styles.statValue, { color }]}>{value}</AccessibleText>
    </TouchableOpacity>
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
    (navigation as any).navigate('LogHistory');
  };

  const handleViewSafeMessages = () => {
    // Navigate to logs with low threat filter
    (navigation as any).navigate('LogHistory');
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
              {renderStatCard('Security Score', `${stats.securityScore}%`, 'trending-up', '#4A90E2')}
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
  statTitle: {
    color: '#B0BEC5',
    marginLeft: 8,
  },
  statValue: {
    fontWeight: 'bold',
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
});

export default HomeScreen; 