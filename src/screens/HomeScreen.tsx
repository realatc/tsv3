import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Alert, Modal, Text, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { AccessibleText } from '../components/AccessibleText';
import { useAccessibility, getAccessibleSpacing, getAccessiblePadding, getAccessibleBorderRadius } from '../context/AccessibilityContext';
import { useLogs } from '../context/LogContext';
import { useApp } from '../context/AppContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HomeStackParamList } from '../types/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RECENT_ACTIVITY_KEY = '@threatsense/recent_activity_meta';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

const HomeScreen = () => {
  const { settings } = useAccessibility();
  const { logs, getBlockedSendersCount } = useLogs();
  const { settingsSheetRef } = useApp();
  const navigation = useNavigation<HomeScreenNavigationProp>();
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

  const renderStatCard = (title: string, value: string | number, icon: string, color: string, onPress?: () => void) => (
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
      </View>
      <AccessibleText variant="title" style={[styles.statValue, { color, textAlign: 'center' }]}>{value}</AccessibleText>
    </TouchableOpacity>
  );

  const handleViewThreats = () => {
    navigation.navigate('LatestScams');
  };

  const handleViewLatestScams = () => {
    navigation.navigate('LatestScams');
  };

  const handleViewSafeMessages = () => {
    // This screen is not in the new nav structure yet.
    Alert.alert("Navigation update needed", "This screen will be implemented in a future step.");
  };

  const handleOpenSettings = () => {
    if (settingsSheetRef.current) {
      settingsSheetRef.current.snapToIndex(2);
    }
  };

  const handleViewBlockedSenders = () => {
    // This screen is not in the new nav structure yet.
    Alert.alert("Navigation update needed", "This screen will be implemented in a future step.");
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
            <View style={styles.logoContainer}>
              <Icon name="shield-outline" size={28} color="#A070F2" />
              <Text style={styles.headerTitle}>ThreatSense</Text>
            </View>
            <TouchableOpacity
              onPress={handleOpenSettings}
              style={styles.profileButton}
              accessibilityLabel="Open Settings"
            >
              <Icon name="person-circle-outline" size={34} color="#fff" style={styles.profileImage} />
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
              {renderStatCard('Latest Scams', 'View', 'flame', '#A070F2', handleViewLatestScams)}
            </View>
          </View>

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <View style={styles.recentActivitySection}>
              <View style={styles.sectionHeader}>
                <AccessibleText variant="subtitle" style={styles.sectionTitle}>
                  Recent Activity
                </AccessibleText>
                {hasUnreadHighThreat && (
                  <View style={styles.unreadBadge}>
                    <AccessibleText variant="caption" style={styles.unreadText}>!</AccessibleText>
                  </View>
                )}
              </View>
              <View style={styles.recentActivityList}>
                {recentActivity.map((activity, index) => (
                  <TouchableOpacity
                    key={activity.id}
                    style={[
                      styles.recentActivityItem,
                      { 
                        backgroundColor: settings.highContrastMode ? '#FFFFFF' : 'rgba(255,255,255,0.08)',
                        padding: padding,
                        borderRadius: borderRadius,
                        marginBottom: spacing,
                      }
                    ]}
                    onPress={() => {
                      markAsRead(activity.id);
                      navigation.navigate('LogDetail', { logId: activity.log.id });
                    }}
                    accessible={true}
                    accessibilityLabel={`${activity.title} from ${activity.category}`}
                    accessibilityHint="Tap to view details"
                  >
                    <View style={styles.activityHeader}>
                      <View style={styles.activityIconContainer}>
                        <Icon name={activity.icon} size={20} color={activity.color} />
                      </View>
                      <View style={styles.activityInfo}>
                        <AccessibleText variant="body" style={styles.activityTitle}>
                          {activity.title}
                        </AccessibleText>
                        <AccessibleText variant="caption" style={styles.activityCategory}>
                          {activity.category}
                        </AccessibleText>
                      </View>
                      <View style={styles.activityActions}>
                        <TouchableOpacity
                          onPress={() => dismissEvent(activity.id)}
                          style={styles.dismissButton}
                          accessible={true}
                          accessibilityLabel="Dismiss this activity"
                          accessibilityHint="Tap to remove this item from recent activity"
                        >
                          <Icon name="close" size={16} color="#666" />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <AccessibleText variant="caption" style={styles.activityTime}>
                      {new Date(activity.time).toLocaleDateString()}
                    </AccessibleText>
                  </TouchableOpacity>
                ))}
              </View>
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
    padding: 20,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 34,
    height: 34,
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    minWidth: 110,
    maxWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statHeader: {
    marginBottom: 8,
  },
  statTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statTitle: {
    color: '#B0B0B0',
    fontSize: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  recentActivitySection: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  unreadBadge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recentActivityList: {
    // Styles for the activity list
  },
  recentActivityItem: {
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  activityIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  activityCategory: {
    color: '#B0B0B0',
    fontSize: 12,
  },
  activityActions: {
    flexDirection: 'row',
  },
  dismissButton: {
    padding: 5,
  },
  activityTime: {
    color: '#666',
    fontSize: 11,
    marginLeft: 40,
  },
});

export default HomeScreen; 