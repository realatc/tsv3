import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Modal, Linking, Alert, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ThreatBadge } from '../components/ThreatBadge';
import { CategoryBadge } from '../components/CategoryBadge';
import Icon from 'react-native-vector-icons/Ionicons';
import { calculateThreatLevel } from '../utils/threatLevel';
import { checkUrlSafety } from '../services/threatReader/safeBrowsing';
import { getRelatedSearchResults } from '../services/threatReader/relatedSearch';
import BottomSheet from '@gorhom/bottom-sheet';
import { GeneralTab } from '../components/tabs/GeneralTab';
import { SecurityTab } from '../components/tabs/SecurityTab';
import { MetadataTab } from '../components/tabs/MetadataTab';
import { ThreatTab } from '../components/tabs/ThreatTab';

// Simple URL extraction utility
function extractUrls(text: string): string[] {
  if (!text) return [];
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];
  // Remove trailing punctuation from each URL
  return matches.map(url => url.replace(/[.,!?;:]+$/, ''));
}

// Mock data for demonstration
const mockLog = {
  id: '1',
  date: '2024-12-15',
  category: 'Mail',
  sender: 'security@paypal-support.com',
  message: 'URGENT: Your PayPal account has been suspended due to suspicious activity. To restore access immediately, please verify your identity by clicking this secure link: https://paypal-verify-account.com/secure/login. If you do not verify within 24 hours, your account will be permanently disabled.',
  nlpAnalysis: 'High risk phishing attempt. Contains urgent language, impersonates PayPal, requests immediate action, and includes suspicious verification link.',
  behavioralAnalysis: 'Sender domain does not match official PayPal domain. Similar to known phishing patterns. Account verification requests via email are unusual for PayPal.',
  metadata: {
    device: 'iPhone 15',
    location: 'Austin, TX',
    receivedAt: '2024-12-15T14:30:00Z',
    messageLength: 245,
    senderHistory: 1,
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

  // Threat calculation
  const threatInfo = calculateThreatLevel({
    nlpAnalysis: log.nlpAnalysis || '',
    behavioralAnalysis: log.behavioralAnalysis || '',
    sender: log.sender || '',
  });

  // URL safety check state
  const [urlSafety, setUrlSafety] = useState<{ [url: string]: string }>({});
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [showUrlWarning, setShowUrlWarning] = useState(false);
  const [showUrlHelp, setShowUrlHelp] = useState(false);

  // Related search state
  const [relatedSearchResults, setRelatedSearchResults] = useState<any[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  const [relatedError, setRelatedError] = useState<string | null>(null);

  // Bottom sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleSheetChange = useCallback((index: number) => {}, []);

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

  useEffect(() => {
    console.log('[LogDetailScreen] Fetching related search for:', log.message);
    setLoadingRelated(true);
    setRelatedError(null);
    getRelatedSearchResults(log.message)
      .then(results => setRelatedSearchResults(results))
      .catch(() => setRelatedError('Failed to fetch related searches.'))
      .finally(() => setLoadingRelated(false));
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
    switch (activeTab) {
      case 'general':
        return <GeneralTab log={log} />;
      case 'security':
        return <SecurityTab log={log} urls={urls} urlSafety={urlSafety} />;
      case 'metadata':
        return <MetadataTab log={log} urls={urls} />;
      case 'threat':
        return <ThreatTab threatInfo={threatInfo} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <ScrollView style={{ padding: 16 }}>
          {/* Top Card */}
          <View style={styles.card}>
            <View style={styles.topCardRowCentered}>
              <View style={styles.topCardLeft}>
                <CategoryBadge category={log.category} />
              </View>
              <View style={styles.topCardCenter}>
                <View style={styles.badgeWithHelpContainer}>
                  <ThreatBadge level={threatInfo.level || 'Low'} score={threatInfo.score} />
                  <TouchableOpacity
                    style={styles.helpIconInsideBadge}
                    onPress={() => Alert.alert('Threat Level Info', 'Threat level is calculated based on NLP and behavioral analysis, sender, and message content. Higher scores are given for urgent, suspicious, or scam-like language, unknown senders, and known scam patterns.')}
                    hitSlop={8}
                  >
                    <Icon name="help-circle-outline" size={18} color="#4A90E2" />
                  </TouchableOpacity>
                </View>
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
                activeOpacity={0.85}
              >
                <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                  {tab.label}
                </Text>
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
        {/* Bottom Sheet for Related Search - moved outside ScrollView */}
        <BottomSheet
          ref={bottomSheetRef}
          index={0}
          snapPoints={useMemo(() => ['8%', '45%'], [])}
          onChange={handleSheetChange}
          backgroundStyle={{ backgroundColor: 'rgba(30,30,30,0.98)' }}
          handleIndicatorStyle={{ backgroundColor: '#4A90E2' }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 0 }}>
            <Text style={{ color: '#4A90E2', fontWeight: 'bold', fontSize: 16, marginBottom: 20 }}>Related Content</Text>
            {loadingRelated ? (
              <Text style={styles.value}>Loading...</Text>
            ) : relatedError ? (
              <Text style={styles.value}>{relatedError}</Text>
            ) : relatedSearchResults.length === 0 ? (
              <Text style={styles.value}>No related searches found.</Text>
            ) : (
              relatedSearchResults.map((item, idx) => (
                <TouchableOpacity key={idx} onPress={() => Linking.openURL(item.url)}>
                  <Text style={[styles.value, { color: '#4A90E2', textDecorationLine: 'underline', fontWeight: 'bold' }]}>{item.title}</Text>
                  <Text style={styles.value}>{item.snippet}</Text>
                </TouchableOpacity>
              ))
            )}
            {/* Spacer to add bottom space */}
            <View style={{ height: 100 }} />
          </View>
        </BottomSheet>
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
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: 'rgba(74, 144, 226, 0.18)',
    borderRadius: 20,
  },
  tabText: {
    color: '#B0BEC5',
    fontSize: 15,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: 'bold',
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
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginTop: 2,
    marginBottom: 2,
  },
  statusBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  helpIconButton: {
    marginLeft: 6,
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
  helpText: {
    color: '#B0BEC5',
    fontSize: 13,
    marginBottom: 10,
  },
  helpTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  helpIcon: {
    marginRight: 4,
  },
  helpLink: {
    color: '#4A90E2',
    textDecorationLine: 'underline',
  },
  badgeWithHelpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  helpIconInsideBadge: {
    marginLeft: 8,
    alignSelf: 'center',
  },
  headerScore: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  headerScoreLabel: {
    color: '#B0BEC5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  headerScoreValue: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export { LogDetailScreen }; 