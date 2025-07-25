import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BrowseStackParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { useApp } from '../context/AppContext';
import { useLogs } from '../context/LogContext';
import { addSampleLogs, addHighThreatLog, clearAllLogs, addPhishingEmail, addScamTexts, addGeorgiaMVCFraud, addSentryDemoLogs } from '../utils/dev/devUtils';
import { useTheme } from '../context/ThemeContext';

type BrowseScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Browse'>;

const BrowseScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<BrowseScreenNavigationProp>();
  const { settingsSheetRef } = useApp();
  const logContext = useLogs();

  const logViews = [
    { title: 'All Logs', filter: 'All', icon: 'archive-outline' },
    { title: 'High Threats', filter: 'High', icon: 'alert-circle-outline', color: theme.error },
    { title: 'Medium Threats', filter: 'Medium', icon: 'alert-outline', color: theme.warning },
    { title: 'Safe Messages', filter: 'Low', icon: 'shield-checkmark-outline', color: theme.success },
  ];
  
  const messageTypes = [
    { title: 'Text Messages', category: 'Text', icon: 'chatbubble-outline', color: theme.primary },
    { title: 'Email Messages', category: 'Mail', icon: 'mail-outline', color: theme.info },
    { title: 'Phone Calls', category: 'Phone Call', icon: 'call-outline', color: theme.primary },
  ];
  
  const showConfirmation = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const labItems = [
    { title: 'Add Sample Logs', icon: 'document-text-outline', color: theme.primary, action: () => { addSampleLogs(logContext); showConfirmation('Success', 'Sample logs added.'); } },
    { title: 'Add Scam Texts', icon: 'chatbubbles-outline', color: theme.warning, action: () => { addScamTexts(logContext); showConfirmation('Success', 'Scam texts added.'); } },
    { title: 'Add Phishing Email', icon: 'mail-unread-outline', color: theme.error, action: () => { addPhishingEmail(logContext); showConfirmation('Success', 'Phishing email added.'); } },
    { title: 'Add Georgia MVC Scam', icon: 'car-sport-outline', color: theme.warning, action: () => { addGeorgiaMVCFraud(logContext); showConfirmation('Success', 'Georgia MVC scam added.'); } },
    { title: 'Add High-Threat Log', icon: 'alert-circle-outline', color: theme.error, action: () => { addHighThreatLog(logContext); showConfirmation('Success', 'High-threat log added.'); } },
    { title: 'Sentry Demo', icon: 'shield-half-outline', color: theme.success, action: async () => { await addSentryDemoLogs(logContext); } },
    { title: 'Clear All Logs', icon: 'trash-outline', color: theme.textSecondary, action: () => {
        Alert.alert(
          'Confirm Clear',
          'Are you sure you want to delete all logs?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => {
                clearAllLogs(logContext);
                showConfirmation('Success', 'All logs have been cleared.');
              } 
            },
          ]
        );
      } 
    },
  ];

  const handleOpenSettings = () => {
    settingsSheetRef.current?.expand();
  };

  const renderLogViewCard = ({ item }: { item: typeof logViews[0] }) => (
    <TouchableOpacity 
      style={styles.logCard}
      onPress={() => navigation.navigate('LogHistory', { threatFilter: item.filter !== 'All' ? item.filter : undefined })}
    >
      <Icon name={item.icon} size={28} color={item.color || theme.text} />
      <Text style={styles.logCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );
  
  const renderLabCard = ({ item }: { item: typeof labItems[0] }) => (
    <TouchableOpacity
      style={styles.labCard}
      onPress={item.action}
    >
      <Icon name={item.icon} size={28} color={item.color || theme.text} />
      <Text style={styles.labCardTitle}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.pageTitle}>Browse</Text>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.profileButton}
            accessibilityLabel="Open Settings"
          >
            <Icon name="person-circle-outline" size={34} color={theme.text} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Log History</Text>
          <Text style={styles.sectionSubtitle}>Quick access to filtered log views.</Text>
          <FlatList
            horizontal
            data={logViews}
            renderItem={renderLogViewCard}
            keyExtractor={(item) => item.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            style={{ marginHorizontal: -20 }}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Message Types</Text>
          <Text style={styles.sectionSubtitle}>Quick access to different message types.</Text>
          <FlatList
            horizontal
            data={messageTypes}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.messageTypeCard}
                onPress={() => navigation.navigate('LogHistory', { categoryFilter: item.category })}
              >
                <Icon name={item.icon} size={28} color={item.color} />
                <Text style={styles.messageTypeCardTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            style={{ marginHorizontal: -20 }}
          />
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lab & Experimental</Text>
          <Text style={styles.sectionSubtitle}>Test new and upcoming features.</Text>
          <FlatList
            horizontal
            data={labItems}
            renderItem={renderLabCard}
            keyExtractor={(item) => item.title}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
            style={{ marginHorizontal: -20 }}
          />
        </View>
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
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.text,
  },
  profileButton: {
    padding: 5
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 4,
    paddingHorizontal: 20,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: theme.textSecondary,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  logCard: {
    width: 140,
    height: 120,
    backgroundColor: theme.surface,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  logCardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  kbContainer: {
    backgroundColor: theme.surface,
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  kbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  kbIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  kbItemTitle: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
  },
  messageTypeCard: {
    width: 140,
    height: 120,
    backgroundColor: theme.surface,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  messageTypeCardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: theme.error,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: theme.text,
  },
  recentActivityContainer: {
    backgroundColor: theme.surface,
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  recentActivityItem: {
    backgroundColor: theme.surfaceSecondary,
    marginBottom: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: theme.surfaceSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.text,
    marginBottom: 2,
  },
  activityCategory: {
    fontSize: 14,
    color: theme.textSecondary,
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dismissButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: theme.surfaceSecondary,
  },
  activityTime: {
    fontSize: 12,
    color: theme.textSecondary,
    marginLeft: 55,
  },
  labCard: {
    width: 140,
    height: 120,
    backgroundColor: theme.surface,
    borderRadius: 15,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: 15,
  },
  labCardTitle: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  labContainer: {
    backgroundColor: theme.surface,
    borderRadius: 15,
    marginHorizontal: 20,
    overflow: 'hidden',
  },
  labItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.border,
  },
  labIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  labItemTitle: {
    flex: 1,
    color: theme.text,
    fontSize: 16,
  },
});

export default BrowseScreen; 