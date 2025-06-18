import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Linking, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThreatBadge } from '../components/ThreatBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import Icon from 'react-native-vector-icons/Ionicons';
import { calculateThreatLevel } from '../utils/threatLevel';
import { checkUrlSafety } from '../services/threatReader/safeBrowsing';

// Simple URL extraction utility
function extractUrls(text: string): string[] {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

// Mock data for demonstration
const mockLog = {
  id: '1',
  date: '2024-06-01',
  category: 'Mail',
  sender: 'scammer@example.com',
  message: 'You have won a prize! Click here to claim. https://phishingsite.com',
  nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.',
  behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.',
  metadata: {
    device: 'iPhone 15',
    location: 'Austin, TX',
    receivedAt: '2024-06-01T10:15:00Z',
    messageLength: 45,
    senderHistory: 3,
    senderFlagged: true,
    attachments: 'None',
    links: 1,
    network: 'Wi-Fi',
    appVersion: '1.2.3',
    threatDetection: 'NLP, Safe Browsing',
    geolocation: 'Austin, TX, USA',
  },
};

const tabs = [
  { id: 'general', label: 'Details' },
  { id: 'security', label: 'Analysis' },
  { id: 'metadata', label: 'Metadata' },
  { id: 'threat', label: 'Threat' }
];

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

type LogDetailScreenProps = {
  actionSheetVisible: boolean;
  setActionSheetVisible: (visible: boolean) => void;
};

const LogDetailScreen = ({ actionSheetVisible, setActionSheetVisible }: LogDetailScreenProps) => {
  const route = useRoute();
  const navigation = useNavigation();
  
  // @ts-ignore
  const log = (route.params && route.params.log) ? route.params.log : mockLog;
  const [activeTab, setActiveTab] = useState('general');
  const urls = extractUrls(log.message);

  // Threat calculation (use log.threat if present, else calculate)
  let threatInfo: any = log.threat;
  if (!threatInfo || typeof threatInfo !== 'object' || !threatInfo.level) {
    threatInfo = calculateThreatLevel({
      nlpAnalysis: log.nlpAnalysis || '',
      behavioralAnalysis: log.behavioralAnalysis || '',
      sender: log.sender || '',
    });
  }

  // URL safety check state
  const [urlSafety, setUrlSafety] = useState<{ [url: string]: string }>({});
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [showUrlWarning, setShowUrlWarning] = useState(false);

  // Debug logging
  console.log('LogDetailScreen mounted:', {
    routeName: route.name,
    params: route.params,
    canGoBack: navigation.canGoBack()
  });

  useEffect(() => {
    if (urls.length === 0) return;
    urls.forEach(url => {
      setUrlSafety(prev => ({ ...prev, [url]: 'loading' }));
      checkUrlSafety(url).then(status => {
        setUrlSafety(prev => ({ ...prev, [url]: status }));
      });
    });
    // eslint-disable-next-line
  }, [log.message]);

  const handleUrlPress = (url: string) => {
    const status = urlSafety[url];
    if (status === 'safe') {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    } else if (status === 'malware' || status === 'phishing' || status === 'unknown') {
      setPendingUrl(url);
      setShowUrlWarning(true);
    } else {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  // Action sheet actions
  const actionButtons = [
    { label: 'Add Contact', icon: 'person-add', color: '#4A90E2', onPress: () => Alert.alert('Add Contact', 'Contact added!') },
    { label: 'Block Sender', icon: 'ban', color: '#FF6B6B', onPress: () => Alert.alert('Block Sender', 'Sender blocked!') },
    { label: 'Report Threat', icon: 'flag', color: '#FFB300', onPress: () => Alert.alert('Report Threat', 'Threat reported!') },
    { label: 'Ignore', icon: 'eye-off', color: '#B0BEC5', onPress: () => Alert.alert('Ignore', 'Threat ignored!') },
    { label: 'Archive', icon: 'archive', color: '#43A047', onPress: () => Alert.alert('Archive', 'Log archived!') },
    { label: 'Share', icon: 'share', color: '#9C27B0', onPress: () => Alert.alert('Share', 'Share functionality!') },
    { label: 'Delete', icon: 'trash', color: '#FF6B6B', onPress: () => Alert.alert('Delete', 'Log deleted!') },
  ];

  const renderTabContent = () => {
    if (activeTab === 'general') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Date</Text>
          <Text style={styles.value}>{formatDate(log.date)}</Text>
          <Text style={styles.sectionTitle}>Sender Information</Text>
          <Text style={styles.label}>Sender:</Text>
          <Text style={styles.value}>{log.sender}</Text>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{log.category}</Text>
          <Text style={styles.sectionTitle}>Message Content</Text>
          <Text style={styles.value}>{log.message}</Text>
        </View>
      );
    } else if (activeTab === 'security') {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>NLP Analysis</Text>
          <Text style={styles.value}>{log.nlpAnalysis}</Text>
          <Text style={styles.sectionTitle}>Behavioral Analysis</Text>
          <Text style={styles.value}>{log.behavioralAnalysis}</Text>
          <Text style={styles.sectionTitle}>URL Safety Check</Text>
          {urls.length > 0 ? (
            urls.map((url, idx) => (
              <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <TouchableOpacity onPress={() => handleUrlPress(url)}>
                  <Text style={styles.urlText}>{url}</Text>
                </TouchableOpacity>
                {urlSafety[url] === 'loading' && <Text style={styles.statusLoading}>Checking...</Text>}
                {urlSafety[url] === 'safe' && <Text style={styles.statusSafe}>Safe</Text>}
                {urlSafety[url] === 'malware' && <Text style={styles.statusDanger}>Malware</Text>}
                {urlSafety[url] === 'phishing' && <Text style={styles.statusWarning}>Phishing</Text>}
                {urlSafety[url] === 'uncommon' && <Text style={styles.statusWarning}>Uncommon</Text>}
                {urlSafety[url] === 'unknown' && <Text style={styles.statusUnknown}>Unknown</Text>}
              </View>
            ))
          ) : (
            <Text style={styles.value}>No URLs found in message.</Text>
          )}
          {/* Warning Modal for unsafe links */}
          <Modal
            visible={showUrlWarning}
            animationType="fade"
            transparent
            onRequestClose={() => setShowUrlWarning(false)}
          >
            <View style={styles.helpModalOverlay}>
              <View style={styles.helpModalContent}>
                <Text style={styles.helpModalTitle}>Warning: Unsafe Link</Text>
                <Text style={styles.helpModalText}>
                  This link may be dangerous (malware, phishing, or unknown). Are you sure you want to open it?
                </Text>
                <Text style={styles.helpModalText}>{pendingUrl}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
                  <TouchableOpacity
                    style={[styles.helpModalButton, { backgroundColor: '#FF6B6B', marginRight: 12 }]}
                    onPress={() => setShowUrlWarning(false)}
                  >
                    <Text style={styles.helpModalButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.helpModalButton}
                    onPress={() => {
                      if (pendingUrl) Linking.openURL(pendingUrl.startsWith('http') ? pendingUrl : `https://${pendingUrl}`);
                      setShowUrlWarning(false);
                    }}
                  >
                    <Text style={styles.helpModalButtonText}>Proceed</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      );
    } else if (activeTab === 'metadata') {
      const m = log.metadata || {};
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Message Metadata</Text>
          <Text style={styles.label}>Device:</Text>
          <Text style={styles.value}>{m.device || 'Unknown'}</Text>
          <Text style={styles.label}>Location:</Text>
          <Text style={styles.value}>{m.location || 'Unknown'}</Text>
          <Text style={styles.label}>Received At:</Text>
          <Text style={styles.value}>{m.receivedAt || 'Unknown'}</Text>
          <Text style={styles.label}>Message Length:</Text>
          <Text style={styles.value}>{m.messageLength ? m.messageLength + ' characters' : 'Unknown'}</Text>
          <Text style={styles.label}>Sender History:</Text>
          <Text style={styles.value}>{typeof m.senderHistory === 'number' ? m.senderHistory + ' previous messages' : 'Unknown'}</Text>
          <Text style={styles.label}>Sender Flagged:</Text>
          <Text style={styles.value}>{m.senderFlagged === true ? 'Yes' : m.senderFlagged === false ? 'No' : 'Unknown'}</Text>
          <Text style={styles.label}>Attachments:</Text>
          <Text style={styles.value}>{m.attachments || 'N/A'}</Text>
          <Text style={styles.label}>Links:</Text>
          <Text style={styles.value}>{typeof m.links === 'number' ? m.links : 'N/A'}</Text>
          <Text style={styles.label}>Network:</Text>
          <Text style={styles.value}>{m.network || 'Unknown'}</Text>
          <Text style={styles.label}>App Version:</Text>
          <Text style={styles.value}>{m.appVersion || 'Unknown'}</Text>
          <Text style={styles.label}>Threat Detection:</Text>
          <Text style={styles.value}>{m.threatDetection || 'Unknown'}</Text>
          <Text style={styles.label}>Geolocation:</Text>
          <Text style={styles.value}>{m.geolocation || 'Unknown'}</Text>
        </View>
      );
    } else if (activeTab === 'threat') {
      const threatLevel = threatInfo.level || 'Unknown';
      const threatScore = threatInfo.score ?? 'Unknown';
      const threatBreakdown = threatInfo.breakdown || [];
      return (
        <View style={styles.tabContent}>
          <Text style={styles.sectionTitle}>Threat Assessment</Text>
          <Text style={styles.label}>Threat Level:</Text>
          <Text style={styles.value}>{threatLevel}</Text>
          <Text style={styles.label}>Threat Score:</Text>
          <Text style={styles.value}>{threatScore}</Text>
          <Text style={styles.sectionTitle}>Threat Score Breakdown</Text>
          {threatBreakdown.length > 0 ? (
            threatBreakdown.map((item: any, idx: number) => (
              <Text key={idx} style={styles.value}>• {item.label}: +{item.points}</Text>
            ))
          ) : (
            <Text style={styles.value}>No threat points detected.</Text>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.tabContent}>
          <Text style={styles.value}>Coming soon...</Text>
        </View>
      );
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#2d2d2d']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView style={{ padding: 18 }}>
          {/* Top Card */}
          <View style={styles.card}>
            <View style={styles.topCardRowCentered}>
              <View style={styles.topCardLeft}>
                <CategoryBadge category={log.category} />
              </View>
              <View style={styles.topCardCenter}>
                <ThreatBadge level={threatInfo.level || 'Low'} score={threatInfo.score} />
                <TouchableOpacity style={styles.helpIconButton} onPress={() => Alert.alert('Threat Level Info', 'Threat level is calculated based on NLP and behavioral analysis, sender, and message content. Higher scores are given for urgent, suspicious, or scam-like language, unknown senders, and known scam patterns.') }>
                  <Icon name="help-circle-outline" size={20} color="#B0BEC5" />
                </TouchableOpacity>
              </View>
              <View style={styles.topCardRight} />
            </View>
          </View>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.id}
                style={[styles.tab, activeTab === tab.id && styles.activeTab]}
                onPress={() => setActiveTab(tab.id)}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {/* Tab Content */}
          {renderTabContent()}
          {/* Action Sheet Modal */}
          <Modal
            visible={actionSheetVisible}
            animationType="slide"
            transparent
            onRequestClose={() => setActionSheetVisible(false)}
          >
            <TouchableOpacity
              style={styles.actionSheetOverlay}
              activeOpacity={1}
              onPressOut={() => setActionSheetVisible(false)}
            >
              <View style={styles.actionSheetContainer}>
                <Text style={styles.actionSheetTitle}>Select Action</Text>
                {actionButtons.map((button) => (
                  <TouchableOpacity
                    key={button.label}
                    style={styles.actionSheetButton}
                    onPress={() => {
                      setActionSheetVisible(false);
                      setTimeout(button.onPress, 200);
                    }}
                  >
                    <Icon name={button.icon} size={22} color={button.color} style={{ marginRight: 14 }} />
                    <Text style={[styles.actionSheetButtonText, { color: button.color }]}>{button.label}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.actionSheetCancel}
                  onPress={() => setActionSheetVisible(false)}
                >
                  <Text style={styles.actionSheetCancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  topCardRowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topCardLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  topCardCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  topCardRight: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  tab: {
    flex: 1,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
    alignItems: 'center',
  },
  activeTab: {
    borderBottomColor: '#4A90E2',
  },
  tabText: {
    color: '#B0BEC5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#4A90E2',
  },
  tabContent: {
    paddingTop: 8,
  },
  sectionTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 4,
  },
  label: {
    color: '#B0BEC5',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 6,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 15,
    marginBottom: 2,
  },
  urlText: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
    marginBottom: 4,
    marginRight: 8,
  },
  statusLoading: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  statusSafe: {
    color: '#43A047',
    fontSize: 13,
  },
  statusDanger: {
    color: '#FF6B6B',
    fontSize: 13,
  },
  statusWarning: {
    color: '#FFB300',
    fontSize: 13,
  },
  statusUnknown: {
    color: '#B0BEC5',
    fontSize: 13,
  },
  helpIconButton: {
    marginLeft: 8,
    padding: 4,
  },
  helpModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpModalContent: {
    backgroundColor: '#23294d',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  helpModalTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  helpModalText: {
    color: '#B0BEC5',
    fontSize: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  helpModalButton: {
    marginTop: 10,
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  helpModalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetContainer: {
    backgroundColor: '#23294d',
    borderRadius: 16,
    padding: 24,
    minWidth: 260,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  actionSheetTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 12,
    textAlign: 'center',
  },
  actionSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
  },
  actionSheetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  actionSheetCancel: {
    marginTop: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  actionSheetCancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export { LogDetailScreen }; 