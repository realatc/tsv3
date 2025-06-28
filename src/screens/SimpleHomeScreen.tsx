import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { HomeStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { useLogs, LogEntry } from '../context/LogContext';

const SimpleHomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<HomeStackParamList>>();
  const { ezModeEnabled, settingsSheetRef } = useApp();
  const { logs } = useLogs();

  // Get the 3 most recent logs
  const recentLogs = logs.slice(0, 3);

  const renderLogItem = ({ item }: { item: LogEntry }) => (
    <TouchableOpacity
      style={styles.logCard}
      onPress={() => (navigation as any).navigate('LogDetail', { log: item })}
      activeOpacity={0.8}
    >
      <View style={styles.logIconWrap}>
        <Icon
          name={item.category === 'Mail' ? 'mail-outline' : item.category === 'Text' ? 'chatbubble-outline' : 'call-outline'}
          size={20}
          color="#A070F2"
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.logSender} numberOfLines={1}>{item.sender}</Text>
        <Text style={styles.logMessage} numberOfLines={1}>{item.message}</Text>
        <View style={styles.logMetaRow}>
          <Text style={styles.logType}>{item.category}</Text>
          <Text style={styles.logDate}>{new Date(item.date).toLocaleString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            <Icon name="shield-checkmark" size={28} color="#A070F2" style={{ marginRight: 8 }} />
            <Text style={styles.appTitle}>ThreatSense</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => settingsSheetRef.current && settingsSheetRef.current.snapToIndex(2)}
              style={styles.profileIconBtn}
              accessibilityLabel="Open Settings"
            >
              <Icon name="person-circle-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
          {/* EZ-Mode Indicator below title, left-aligned */}
          <View style={styles.ezModeIndicatorRowLeft}>
            <View style={styles.ezModePillSmallNeutral}>
              <Icon name="flash" size={12} color="#43A047" style={{ marginRight: 3 }} />
              <Text style={styles.ezModePillTextSmall}>EZ-Mode Enabled</Text>
            </View>
          </View>
        </View>
        {/* Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation as any).navigate('SentryMode')}>
            <Icon name="shield-checkmark" size={22} color="#A070F2" style={{ marginBottom: 4 }} />
            <Text style={styles.actionText}>Sentry Mode</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation as any).navigate('LatestScams')}>
            <Icon name="alert-circle" size={22} color="#A070F2" style={{ marginBottom: 4 }} />
            <Text style={styles.actionText}>Latest Scams</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => (navigation as any).navigate('HelpAndSupport')}>
            <Icon name="help-circle" size={22} color="#A070F2" style={{ marginBottom: 4 }} />
            <Text style={styles.actionText}>Help</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => {/* TODO: Call Trusted Contact */}}>
            <Icon name="call" size={22} color="#A070F2" style={{ marginBottom: 4 }} />
            <Text style={styles.actionText}>Contact</Text>
          </TouchableOpacity>
        </View>
        {/* Recent Events */}
        <Text style={styles.subtitle}>Recent Events</Text>
        <FlatList
          data={recentLogs}
          renderItem={renderLogItem}
          keyExtractor={item => item.id}
          style={{ width: '100%' }}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={<Text style={styles.emptyText}>No recent events.</Text>}
        />
        <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate({ name: 'LogHistory', params: {} })}>
          <Text style={styles.seeAllText}>{`See All (${logs.length})`}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#18181C',
  },
  container: {
    flex: 1,
    backgroundColor: '#18181C',
    alignItems: 'center',
    padding: 24,
  },
  topBar: {
    width: '100%',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  appTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginRight: 8,
  },
  profileIconBtn: {
    marginLeft: 8,
  },
  ezModeIndicatorRowLeft: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 2,
    marginBottom: 10,
    width: '100%',
    marginLeft: 36, // aligns with shield+title
  },
  ezModePillSmallNeutral: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'center',
    height: 18,
  },
  ezModePillTextSmall: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#23232A', // dark card color
    borderRadius: 10,
    alignItems: 'center',
    paddingVertical: 10,
    marginHorizontal: 6,
  },
  actionText: {
    color: '#A070F2',
    fontSize: 13,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#A070F2',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    width: '100%',
  },
  logIconWrap: {
    marginRight: 14,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 5,
  },
  logSender: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logMessage: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 2,
  },
  logMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  logType: {
    color: '#8A8A8E',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  logDate: {
    color: '#8A8A8E',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 0,
    textAlign: 'right',
  },
  emptyText: {
    color: '#B0BEC5',
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 16,
  },
  seeAllBtn: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  seeAllText: {
    color: '#A070F2',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default SimpleHomeScreen; 