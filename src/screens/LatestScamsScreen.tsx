import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { ScamAlertCard } from '../components/ScamAlertCard';
import { getLatestScams, ScamAlert } from '../services/perplexity/perplexityService';
import { HomeStackParamList } from '../types/navigation';
import { useApp } from '../context/AppContext';
import { getSeverityColor, getSeverityIcon } from '../utils/threatLevel';

type LatestScamsNavigationProp = StackNavigationProp<HomeStackParamList, 'LatestScams'>;

const LatestScamsScreen: React.FC = () => {
  const { settingsSheetRef } = useApp();
  const navigation = useNavigation<LatestScamsNavigationProp>();
  const [scams, setScams] = useState<ScamAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isUsingMockData, setIsUsingMockData] = useState(false);
  const [activeTab, setActiveTab] = useState<'personal' | 'all'>('personal');

  const fetchScams = async (isRefreshing = false) => {
    try {
      setError(null);
      const latestScams = await getLatestScams();
      
      // Check if we're using mock data by looking for mock IDs
      const hasMockData = latestScams.some(scam => scam.id.startsWith('mock-'));
      setIsUsingMockData(hasMockData);
      
      setScams(latestScams);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('[LatestScamsScreen] CRITICAL ERROR fetching scams:', err);
      
      // Provide specific error messages based on the error type
      if (err?.message?.includes('API key')) {
        setError('API Configuration Error: Perplexity API key is missing or invalid. Please check your configuration.');
      } else if (err?.message?.includes('network') || err?.message?.includes('fetch')) {
        setError('Network Error: Unable to connect to threat intelligence service. Please check your internet connection.');
      } else if (err?.message?.includes('rate limit') || err?.message?.includes('429')) {
        setError('Rate Limit Exceeded: Too many requests to threat intelligence service. Please try again later.');
      } else {
        setError(`API Error: ${err?.message || 'Unknown error'}. Please try again later.`);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchScams();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchScams(true);
  };

  const handleScamPress = (scam: ScamAlert) => {
    navigation.navigate('ScamDetail', { scam });
  };

  const formatLastUpdated = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const isDataFresh = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    return diffInMinutes < 5; // Consider data fresh if less than 5 minutes old
  };

  // Removed local severity function - now using standardized one from threatLevel.ts

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('phishing')) return 'fish';
    if (categoryLower.includes('impersonation')) return 'account-question';
    if (categoryLower.includes('malware')) return 'virus';
    if (categoryLower.includes('scam')) return 'alert-circle';
    if (categoryLower.includes('social')) return 'account-group';
    return 'alert';
  };

  const handleOpenSettings = () => {
    if (settingsSheetRef.current) {
      settingsSheetRef.current.snapToIndex(2);
    }
  };

  // Filter scams based on active tab
  const filteredScams = scams.filter(scam => {
    if (activeTab === 'personal') {
      return scam.audience === 'personal' || scam.audience === 'both';
    }
    return true; // Show all scams in 'all' tab
  });

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#A070F2" />
          <Text style={styles.loadingText}>Loading latest threats...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="alert-circle" size={48} color="#FF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchScams()}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (filteredScams.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="shield-checkmark" size={48} color="#44AA44" />
          <Text style={styles.emptyText}>
            {activeTab === 'personal' ? 'No personal threats detected' : 'No threats detected'}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'personal' 
              ? 'Great news! No recent personal threats have been reported.' 
              : 'Great news! No recent threats have been reported.'
            }
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A070F2" />
        }
      >
        <View style={styles.infoContainer}>
          <Icon name="information-circle" size={20} color="#A070F2" />
          <Text style={styles.infoText}>
            These alerts are updated regularly to keep you informed about the latest digital threats.
            {lastUpdated && (
              <Text style={styles.freshIndicator}>
                {' '}Data is fresh as of {lastUpdated.toLocaleTimeString()}.
                {isDataFresh(lastUpdated) && (
                  <Text style={styles.liveIndicator}> ● Live</Text>
                )}
              </Text>
            )}
          </Text>
        </View>
        
        {filteredScams.map((scam) => (
          <ScamAlertCard
            key={scam.id}
            scam={scam}
            onPress={() => handleScamPress(scam)}
          />
        ))}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
          </Text>
        </View>
      </ScrollView>
    );
  };

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Icon name="flame" size={28} color="#A070F2" />
            <Text style={styles.headerTitle}>Latest Scams</Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.profileButton}
            accessibilityLabel="Open Settings"
          >
            <Icon name="person-circle-outline" size={34} color="#fff" style={styles.profileImage} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Powered by Perplexity AI</Text>
        <Text style={styles.dataSourceIndicator}>
          🔗 Live Threat Intelligence
        </Text>
        {lastUpdated && (
          <Text style={styles.lastUpdatedText}>
            Updated {formatLastUpdated(lastUpdated)}
          </Text>
        )}
        
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'personal' && styles.activeTab]}
            onPress={() => setActiveTab('personal')}
          >
            <Icon 
              name="person" 
              size={16} 
              color={activeTab === 'personal' ? '#A070F2' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'personal' && styles.activeTabText]}>
              Personal Threats
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'all' && styles.activeTab]}
            onPress={() => setActiveTab('all')}
          >
            <Icon 
              name="globe" 
              size={16} 
              color={activeTab === 'all' ? '#A070F2' : '#666'} 
            />
            <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>
              All Threats
            </Text>
          </TouchableOpacity>
        </View>
        
        {renderContent()}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
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
  headerSubtitle: {
    fontSize: 16,
    color: '#aaa',
    marginLeft: 15,
    marginBottom: 4,
  },
  lastUpdatedText: {
    fontSize: 13,
    color: '#A070F2',
    marginLeft: 15,
    marginBottom: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#B0B0B0',
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#FF4444',
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: '#A070F2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    color: '#E5E5E7',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
    marginTop: 20,
  },
  footerText: {
    color: '#8A8A8E',
    fontSize: 12,
  },
  freshIndicator: {
    fontSize: 12,
    color: '#888',
  },
  liveIndicator: {
    color: '#34C759',
    fontWeight: 'bold',
  },
  mockDataIndicator: {
    fontSize: 12,
    color: '#FFAA00',
    marginLeft: 15,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  dataSourceIndicator: {
    fontSize: 12,
    color: '#34C759',
    marginLeft: 15,
    marginBottom: 4,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#A070F2',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#fff',
  },
});

export default LatestScamsScreen; 