import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { useLogs, LogEntry } from '../context/LogContext';

const SimpleHomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { ezModeEnabled, settingsSheetRef } = useApp();
  const { logs } = useLogs();
  const [searchText, setSearchText] = useState('');

  // Get the 3 most recent logs
  const recentLogs = logs.slice(0, 3);

  const handleLiveTextAnalysis = () => {
    if (searchText.trim()) {
      navigation.navigate('MainTabs', { screen: 'Browse', params: { screen: 'ThreatAnalysis', params: { initialText: searchText } } });
    } else {
      navigation.navigate('MainTabs', { screen: 'Browse', params: { screen: 'ThreatAnalysis', params: {} } });
    }
  };

  const handleLatestScams = () => {
    navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'LatestScams' } });
  };

  const handleHelpSupport = () => {
    navigation.navigate('HelpAndSupport');
  };

  const handleContact = () => {
    // Navigate to settings to configure trusted contact
    if (settingsSheetRef.current) {
      settingsSheetRef.current.snapToIndex(2); // Open settings sheet
    }
  };

  const renderLogItem = ({ item }: { item: LogEntry }) => (
    <TouchableOpacity
      style={styles.logCard}
      onPress={() => navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'LogDetail', params: { log: item } } })}
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

        {/* Live Text Analyzer Search Bar */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Live Text Analyzer</Text>
          <Text style={styles.searchSubtitle}>Analyze any text for potential threats</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Paste suspicious text here..."
              placeholderTextColor="#666"
              value={searchText}
              onChangeText={setSearchText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            <TouchableOpacity 
              style={[styles.analyzeButton, !searchText.trim() && styles.analyzeButtonDisabled]}
              onPress={handleLiveTextAnalysis}
              disabled={!searchText.trim()}
            >
              <Icon name="shield-checkmark" size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons - Now 3 instead of 4 for better symmetry */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLatestScams} activeOpacity={0.7}>
            <Icon name="alert-circle" size={24} color="#A070F2" style={{ marginBottom: 6 }} />
            <Text style={styles.actionText}>Latest Scams</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleHelpSupport} activeOpacity={0.7}>
            <Icon name="help-circle" size={24} color="#A070F2" style={{ marginBottom: 6 }} />
            <Text style={styles.actionText}>Help & Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleContact} activeOpacity={0.7}>
            <Icon name="person-add" size={24} color="#A070F2" style={{ marginBottom: 6 }} />
            <Text style={styles.actionText}>Setup Contact</Text>
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
        <TouchableOpacity 
          style={styles.seeAllBtn} 
          onPress={() => navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'LogHistory', params: {} } })}
        >
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
    padding: 20,
  },
  topBar: {
    width: '100%',
    marginBottom: 16,
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
  searchSection: {
    width: '100%',
    marginBottom: 20,
  },
  searchTitle: {
    color: '#A070F2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  searchSubtitle: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 12,
  },
  searchContainer: {
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  searchInput: {
    color: '#fff',
    fontSize: 16,
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A070F2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#444',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
    marginTop: 12,
    paddingHorizontal: 4,
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#23232A',
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    minHeight: 80, // Ensure consistent height
  },
  actionText: {
    color: '#A070F2',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: '#A070F2',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'left',
    alignSelf: 'flex-start',
    marginTop: 16,
    marginLeft: 4,
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#2C2C2E',
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
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  seeAllText: {
    color: '#A070F2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SimpleHomeScreen; 