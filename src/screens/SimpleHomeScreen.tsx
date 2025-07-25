import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, TextInput, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { useLogs, LogEntry } from '../context/LogContext';
import { useTheme } from '../context/ThemeContext';

const SimpleHomeScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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

  const handleLogDetail = (log: LogEntry) => {
    // Navigate directly to LogDetail using root navigation
    navigation.navigate('LogDetail', { log });
  };

  const handleLogHistory = () => {
    // Navigate directly to LogHistory using root navigation
    navigation.navigate('LogHistory', {});
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
      onPress={() => handleLogDetail(item)}
      activeOpacity={0.8}
    >
      <View style={styles.logIconWrap}>
        <Icon
          name={item.category === 'Mail' ? 'mail-outline' : item.category === 'Text' ? 'chatbubble-outline' : 'call-outline'}
          size={20}
          color={theme.primary}
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
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <View style={styles.titleRow}>
            <Icon name="shield-checkmark" size={28} color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={styles.appTitle}>ThreatSense</Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={() => settingsSheetRef.current && settingsSheetRef.current.snapToIndex(2)}
              style={styles.profileIconBtn}
              accessibilityLabel="Open Settings"
            >
              <Icon name="person-circle-outline" size={32} color={theme.text} />
            </TouchableOpacity>
          </View>
          {/* EZ-Mode Indicator below title, left-aligned */}
          <View style={styles.ezModeIndicatorRowLeft}>
            <View style={styles.ezModePillSmallNeutral}>
              <Icon name="flash" size={12} color={theme.success} style={{ marginRight: 3 }} />
              <Text style={styles.ezModePillTextSmall}>EZ-Mode Enabled</Text>
            </View>
          </View>
        </View>

        {/* Live Text Analyzer Search Bar */}
        <View style={styles.searchSection}>
          <Text style={styles.searchTitle}>Live Text Analyzer</Text>
          <Text style={styles.searchSubtitle}>Check URLs, emails, messages, or any suspicious text</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Enter a URL, paste an email, message, or any text you want to check for threats..."
              placeholderTextColor={theme.textSecondary}
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
              <Icon name="shield-checkmark" size={20} color={theme.text} />
              <Text style={styles.analyzeButtonText}>Analyze</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.searchHint}>
            Examples: https://example.com, suspicious emails, text messages, social media posts
          </Text>
        </View>

        {/* Recent Events */}
        <Text style={styles.subtitle}>Recent Events</Text>
        <View style={styles.recentEventsContainer}>
          <FlatList
            data={recentLogs}
            renderItem={renderLogItem}
            keyExtractor={item => item.id}
            style={{ width: '100%' }}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<Text style={styles.emptyText}>No recent events.</Text>}
            showsVerticalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity
          style={styles.seeAllBtn}
          onPress={handleLogHistory}
        >
          <Text style={styles.seeAllText}>{`See All (${logs.length})`}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  contentContainer: {
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
    color: theme.text,
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
    backgroundColor: theme.surface,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: 'center',
    height: 18,
  },
  ezModePillTextSmall: {
    color: theme.text,
    fontSize: 11,
    fontWeight: '600',
  },
  searchSection: {
    width: '100%',
    marginBottom: 20,
  },
  searchTitle: {
    color: theme.primary,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  searchSubtitle: {
    color: theme.textSecondary,
    fontSize: 14,
    marginBottom: 12,
  },
  searchContainer: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  searchInput: {
    color: theme.text,
    fontSize: 16,
    minHeight: 80,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  analyzeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  analyzeButtonDisabled: {
    backgroundColor: theme.surfaceSecondary,
  },
  analyzeButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  actionBtn: {
    flex: 0.45,
    backgroundColor: theme.surface,
    borderRadius: 12,
    alignItems: 'center',
    paddingVertical: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.border,
    minHeight: 80, // Ensure consistent height
  },
  actionText: {
    color: theme.primary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: theme.primary,
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
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '100%',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: theme.border,
  },
  logIconWrap: {
    marginRight: 14,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    padding: 5,
  },
  logSender: {
    color: theme.text,
    fontSize: 15,
    fontWeight: 'bold',
  },
  logMessage: {
    color: theme.textSecondary,
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
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  logDate: {
    color: theme.textSecondary,
    fontSize: 12,
    fontWeight: '400',
    marginTop: 0,
    textAlign: 'right',
  },
  emptyText: {
    color: theme.textSecondary,
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
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  seeAllText: {
    color: theme.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  searchHint: {
    color: theme.textSecondary,
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  recentEventsContainer: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
});

export default SimpleHomeScreen; 