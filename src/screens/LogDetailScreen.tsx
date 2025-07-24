import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { calculateThreatLevel, getSeverityColor, getSeverityIcon } from '../utils/threatLevel';
import { checkUrlSafety } from '../services/threatReader/safeBrowsing';
import { getRelatedSearchResults } from '../services/threatReader/relatedSearch';
import BottomSheet from '@gorhom/bottom-sheet';
import { LogEntry, useLogs } from '../context/LogContext';
import { getAuditLogEntries, AuditLogEntry } from '../utils/auditLog';

type ThreatInfo = {
  level: 'High' | 'Medium' | 'Low' | '';
  score: number;
  percentage: number;
  breakdown: { label: string; points: number }[];
  categories: string[];
  summary: string;
};

// Tab Components
const DetailsTab = ({ log, relatedContent, loadingRelated, handleLinkPress }: { log: LogEntry, relatedContent: any[], loadingRelated: boolean, handleLinkPress: (url: string) => void }) => {
  const formattedDate = new Date(log.date).toLocaleString();

  return (
    <View>
      <View style={styles.tabContentContainer}>
        <Text style={styles.messageText}>{log.message}</Text>
      </View>

      <View style={[styles.tabContentContainer, { marginTop: 16 }]}>
        <Text style={styles.relatedContentTitle}>Details</Text>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataKey}>Sender</Text>
          <Text style={styles.metadataValue}>{log.sender}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataKey}>Category</Text>
          <Text style={styles.metadataValue}>{log.category}</Text>
        </View>
        <View style={styles.metadataRow}>
          <Text style={styles.metadataKey}>Date</Text>
          <Text style={styles.metadataValue}>{formattedDate}</Text>
        </View>
      </View>

      <View style={[styles.tabContentContainer, { marginTop: 16 }]}>
        <Text style={styles.relatedContentTitle}>Related Content</Text>
        {loadingRelated ? (
          <Text style={{ color: '#fff' }}>Loading...</Text>
        ) : relatedContent.length === 0 ? (
          <Text style={{ color: '#fff' }}>No related content available.</Text>
        ) : (
          relatedContent
            .filter((item: any) => item.url && item.title) // Only show items with both url and title
            .map((item: any, index: number) => (
              <TouchableOpacity key={index} onPress={() => handleLinkPress(item.url)}>
                <Text style={styles.relatedContentLink}>{item.title}</Text>
              </TouchableOpacity>
            ))
        )}
      </View>
    </View>
  );
};

const AnalysisTab = ({ log, urls, urlSafety, handleUrlPress }: { log: LogEntry, urls: string[], urlSafety: { [key: string]: string }, handleUrlPress: (url: string) => void }) => (
  <View style={styles.tabContentContainer}>
    <View style={styles.analysisSection}>
      <Text style={styles.analysisTitle}>NLP Analysis</Text>
      <Text style={styles.analysisContent}>{log.nlpAnalysis}</Text>
    </View>
    <View style={styles.analysisSection}>
      <Text style={styles.analysisTitle}>Behavioral Analysis</Text>
      <Text style={styles.analysisContent}>{log.behavioralAnalysis}</Text>
    </View>
    {urls.length > 0 && (
      <View style={styles.analysisSection}>
        <Text style={styles.analysisTitle}>URL Safety Check</Text>
        {urls.map((url: string, index: number) => (
          <View key={index} style={styles.urlCheckContainer}>
            <TouchableOpacity onPress={() => handleUrlPress(url)}>
              <Text style={styles.urlText} numberOfLines={1}>{url}</Text>
            </TouchableOpacity>
            <Text style={[styles.urlStatus, { color: getStatusColor(urlSafety[url]) }]}>
              {urlSafety[url] || 'checking...'}
            </Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

const MetadataTab = ({ log }: { log: LogEntry }) => (
  <View style={styles.tabContentContainer}>
    <View style={styles.metadataRow}>
      <Text style={styles.metadataKey}>Device</Text>
      <Text style={styles.metadataValue}>{log.metadata.device}</Text>
    </View>
    <View style={styles.metadataRow}>
      <Text style={styles.metadataKey}>Location</Text>
      <Text style={styles.metadataValue}>{log.metadata.location}</Text>
    </View>
    <View style={styles.metadataRow}>
      <Text style={styles.metadataKey}>Received At</Text>
      <Text style={styles.metadataValue}>{new Date(log.metadata.receivedAt).toLocaleString()}</Text>
    </View>
    <View style={styles.metadataRow}>
      <Text style={styles.metadataKey}>Message Length</Text>
      <Text style={styles.metadataValue}>{log.metadata.messageLength} characters</Text>
    </View>
  </View>
);

const ThreatTab = ({ threatInfo }: { threatInfo: ThreatInfo }) => (
  <View style={styles.tabContentContainer}>
    <View style={styles.threatBreakdownSection}>
      <Text style={styles.threatBreakdownTitle}>Threat Breakdown</Text>
      {threatInfo.breakdown.map((item, index) => (
        <View key={index} style={styles.threatBreakdownRow}>
          <Text style={styles.threatBreakdownItem}>- {item.label}</Text>
          <Text style={styles.threatBreakdownPoints}>(+{item.points})</Text>
        </View>
      ))}
    </View>
  </View>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case 'safe': return '#06D6A0';
    case 'malware':
    case 'phishing': return '#FF6B6B';
    default: return '#aaa';
  }
}

// Main Component
const LogDetailScreen = () => {
  const route = useRoute<RouteProp<any>>();
  const navigation = useNavigation();
  const { log } = route.params as { log: LogEntry };
  const { blockSender, deleteLog } = useLogs();
  
  const [activeTab, setActiveTab] = useState('Details');
  const [threatInfo, setThreatInfo] = useState<ThreatInfo>({ level: '', score: 0, breakdown: [], percentage: 0, categories: [], summary: '' });
  const [urls, setUrls] = useState<string[]>([]);
  const [urlSafety, setUrlSafety] = useState<{ [url: string]: string }>({});
  const [relatedContent, setRelatedContent] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['40%'], []);
  
  // Determine the threat level to display
  let displayThreatLevel = 'Low';
  if (log.forceThreatLevel) {
    displayThreatLevel = log.forceThreatLevel;
  } else if (typeof log.threat === 'object' && log.threat.level) {
    displayThreatLevel = log.threat.level;
  } else if (typeof log.threat === 'string') {
    displayThreatLevel = log.threat;
  }

  // Threat Calculation
  useEffect(() => {
    const info = calculateThreatLevel(log);
    setThreatInfo(info);
  }, [log]);

  // URL Extraction
  useEffect(() => {
    const extractedUrls = extractUrls(log.message);
    setUrls(extractedUrls);
  }, [log.message]);

  // URL Safety Check
  useEffect(() => {
    if (urls.length === 0) return;
    const safetyMap: { [url: string]: string } = {};
    urls.forEach(url => {
      safetyMap[url] = 'loading';
      checkUrlSafety(url).then(result => {
        safetyMap[url] = result.status; // Extract the status string from the result object
        setUrlSafety({...safetyMap});
      }).catch(error => {
        console.error(`[LogDetailScreen] Error checking URL ${url}:`, error);
        safetyMap[url] = 'error';
        setUrlSafety({...safetyMap});
      });
    });
  }, [urls]);

  // Related Content
  useEffect(() => {
    setLoadingRelated(true);
    getRelatedSearchResults(log.message)
      .then((results: any) => {
        const contentArray = Array.isArray(results) ? results : [];
        console.log('[LogDetailScreen] Related content loaded:', contentArray.length, 'items');
        setRelatedContent(contentArray);
      })
      .catch((error) => {
        console.error('[LogDetailScreen] Error loading related content:', error);
        setRelatedContent([]); // Set empty array on error
      })
      .finally(() => {
        console.log('[LogDetailScreen] Related content loading finished');
        setLoadingRelated(false);
      });
  }, [log.message]);

  useEffect(() => {
    console.log('[LogDetailScreen] Loading audit logs for log.id:', log.id);
    getAuditLogEntries(log.id).then(entries => {
      console.log('[LogDetailScreen] Retrieved audit log entries:', entries);
      setAuditLog(entries);
    }).catch(error => {
      console.error('[LogDetailScreen] Error loading audit logs:', error);
    });
  }, [log.id]);

  const handleUrlPress = (url: string) => {
    const status = urlSafety[url];
    if (status === 'safe') {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    } else if (status === 'malware' || status === 'phishing' || status === 'unknown') {
      Alert.alert('Warning', 'This URL is not safe. Are you sure you want to proceed?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Proceed', onPress: () => Linking.openURL(url.startsWith('http') ? url : `https://${url}`) },
      ]);
    } else {
      Linking.openURL(url.startsWith('http') ? url : `https://www.google.com/search?q=${encodeURIComponent(url)}`);
    }
  };

  const handleLinkPress = (url: string) => {
    if (!url) {
      Alert.alert('Error', 'No URL available for this link.');
      return;
    }
    Linking.openURL(url).catch(err => Alert.alert('Error', 'Could not open the link.'));
  };

  const showHelpAlert = () => {
    Alert.alert(
      "How is the score calculated?",
      "The threat score is based on a combination of factors:\n\n" +
      "• NLP analysis for urgent or suspicious language.\n" +
      "• Behavioral analysis for unusual sender patterns.\n" +
      "• Sender reputation and known scam indicators.\n\n" +
      "Scores:\n" +
      "Low: 0-1\n" +
      "Medium: 2-4\n" +
      "High: 5+",
      [{ text: "OK" }]
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Details':
        return <DetailsTab log={log} relatedContent={relatedContent} loadingRelated={loadingRelated} handleLinkPress={handleLinkPress} />;
      case 'Analysis':
        return <AnalysisTab log={log} urls={urls} urlSafety={urlSafety} handleUrlPress={handleUrlPress} />;
      case 'Metadata':
        return <MetadataTab log={log} />;
      case 'Threat':
        return <ThreatTab threatInfo={threatInfo} />;
      default:
        return null;
    }
  };

  const TABS = ['Details', 'Analysis', 'Metadata', 'Threat'];

  const refreshAuditLog = () => {
    console.log('[LogDetailScreen] Refreshing audit logs for log.id:', log.id);
    getAuditLogEntries(log.id).then(entries => {
      console.log('[LogDetailScreen] Refreshed audit log entries:', entries);
      setAuditLog(entries);
    }).catch(error => {
      console.error('[LogDetailScreen] Error refreshing audit logs:', error);
    });
  };

  // Sort audit log entries by timestamp descending
  const sortedAuditLog = [...auditLog].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{log.category} from {log.sender}</Text>
        <Menu>
          <MenuTrigger>
            <Icon name="ellipsis-vertical" size={24} color="#fff" />
          </MenuTrigger>
          <MenuOptions customStyles={menuOptionsStyles}>
            <MenuOption onSelect={() => Alert.alert('Add to Contacts', 'This feature is not yet implemented.')}>
              <Text style={styles.menuOptionText}>Add to Contacts</Text>
            </MenuOption>
            <MenuOption onSelect={() => {
              blockSender(log.sender, 'Manually blocked', log.category);
              Alert.alert('Sender Blocked', `${log.sender} has been blocked.`);
              navigation.goBack();
            }}>
              <Text style={styles.menuOptionText}>Block Sender</Text>
            </MenuOption>
            <MenuOption onSelect={() => Alert.alert('Report Phishing', 'This feature is not yet implemented.')}>
              <Text style={styles.menuOptionText}>Report as Phishing</Text>
            </MenuOption>
            <MenuOption onSelect={() => {
              deleteLog(log.id);
              Alert.alert('Log Deleted', 'The log has been deleted.');
              navigation.goBack();
            }}>
              <Text style={styles.menuOptionText}>Delete Log</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Threat Level */}
        <View style={styles.threatSection}>
            <View style={{flex: 1}}>
                <Text style={[styles.threatLevelTitle, { color: getSeverityColor(displayThreatLevel) }]}>{displayThreatLevel} Threat</Text>
                <Text style={styles.threatScore}>Score: {threatInfo.score}/9</Text>
            </View>
            <TouchableOpacity onPress={showHelpAlert}>
              <Icon name="help-circle-outline" size={24} color="#aaa" />
            </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.85}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Tab Content */}
        {renderTabContent()}

        <View style={styles.auditLogSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={styles.auditLogTitle}>Audit Log</Text>
            <TouchableOpacity onPress={refreshAuditLog} style={styles.auditLogRefreshBtn}>
              <Icon name="refresh" size={18} color="#A070F2" />
            </TouchableOpacity>
          </View>
          {sortedAuditLog.length === 0 ? (
            <Text style={styles.auditLogEmpty}>No audit log entries yet.</Text>
          ) : (
            sortedAuditLog.map(entry => (
              <View key={entry.id} style={styles.auditLogEntry}>
                <Text style={styles.auditLogTimestamp}>{new Date(entry.timestamp).toLocaleString()}</Text>
                <Text style={styles.auditLogAction}>{entry.action} <Text style={styles.auditLogActor}>({entry.actor})</Text></Text>
                {entry.details ? <Text style={styles.auditLogDetails}>{entry.details}</Text> : null}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const extractUrls = (text: string): string[] => {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
};

const menuOptionsStyles = {
  optionsContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 5,
  },
  optionText: {
    color: '#fff',
    fontSize: 16,
  },
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  headerTitle: { flex:1, marginHorizontal: 16, fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 100 },
  threatSection: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12, marginBottom: 16 },
  threatLevelTitle: { fontSize: 20, fontWeight: 'bold' },
  threatScore: { fontSize: 14, color: '#aaa' },
  tabBar: { flexDirection: 'row', marginBottom: 16, backgroundColor: '#1C1C1E', borderRadius: 12, padding: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 8 },
  activeTab: { backgroundColor: '#4A90E2' },
  tabText: { textAlign: 'center', color: '#aaa', fontWeight: '600' },
  activeTabText: { color: '#fff' },
  tabContentContainer: { backgroundColor: '#1C1C1E', padding: 16, borderRadius: 12 },
  messageText: { fontSize: 16, color: '#fff', lineHeight: 24 },
  analysisSection: { marginBottom: 16 },
  analysisTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  analysisContent: { fontSize: 14, color: '#aaa' },
  urlCheckContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  urlText: { color: '#4A90E2', textDecorationLine: 'underline' },
  urlStatus: { fontWeight: 'bold' },
  metadataRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#2C2C2E' },
  metadataKey: { color: '#B0B0B0', fontSize: 16 },
  metadataValue: { color: '#FFFFFF', fontSize: 16 },
  threatBreakdownSection: { padding: 16 },
  threatBreakdownTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  threatBreakdownRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 4 },
  threatBreakdownItem: { color: '#E0E0E0', fontSize: 16 },
  threatBreakdownPoints: { color: '#FF6B6B', fontSize: 16, fontWeight: 'bold' },
  relatedContentTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 12 },
  relatedContentLink: { 
    color: '#4A90E2', 
    fontSize: 16, 
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  menuOptionText: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
  },
  auditLogSection: {
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: '#222',
    borderRadius: 12,
  },
  auditLogTitle: {
    color: '#A070F2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
  },
  auditLogEmpty: {
    color: '#B0BEC5',
    fontSize: 15,
    fontStyle: 'italic',
  },
  auditLogEntry: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 6,
  },
  auditLogTimestamp: {
    color: '#B0BEC5',
    fontSize: 13,
    marginBottom: 2,
  },
  auditLogAction: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  auditLogActor: {
    color: '#A070F2',
    fontWeight: '400',
    fontSize: 14,
  },
  auditLogDetails: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 2,
  },
  auditLogRefreshBtn: {
    marginLeft: 8,
    padding: 4,
  },
});

export default LogDetailScreen;
