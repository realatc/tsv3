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
import { useTheme } from '../context/ThemeContext';

type LatestScamsNavigationProp = StackNavigationProp<HomeStackParamList, 'LatestScams'>;

const LatestScamsScreen: React.FC = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>Loading latest threats...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="alert-circle" size={48} color={theme.error} />
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
          <Icon name="shield-checkmark" size={48} color={theme.success} />
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
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />
        }
      >
        <View style={styles.infoContainer}>
          <Icon name="information-circle" size={20} color={theme.primary} />
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
    <LinearGradient colors={[theme.background, theme.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Icon name="flame" size={28} color={theme.primary} />
            <Text style={styles.headerTitle}>Latest Scams</Text>
          </View>
          <TouchableOpacity
            onPress={handleOpenSettings}
            style={styles.profileButton}
            accessibilityLabel="Open Settings"
          >
            <Icon name="person-circle-outline" size={34} color={theme.text} style={styles.profileImage} />
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
              color={activeTab === 'personal' ? theme.primary : theme.textSecondary} 
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
              color={activeTab === 'all' ? theme.primary : theme.textSecondary} 
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

const createStyles = (theme: any) => StyleSheet.create({
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
    color: theme.text,
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
    color: theme.textSecondary,
    marginLeft: 15,
    marginBottom: 4,
  },
  lastUpdatedText: {
    fontSize: 13,
    color: theme.primary,
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
    color: theme.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.error,
    marginTop: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: theme.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: theme.text,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 18,
    color: theme.text,
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: theme.textSecondary,
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
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: theme.border,
    marginTop: 20,
  },
  footerText: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  freshIndicator: {
    fontSize: 12,
    color: theme.textSecondary,
  },
  liveIndicator: {
    color: theme.success,
    fontWeight: 'bold',
  },
  mockDataIndicator: {
    fontSize: 12,
    color: theme.warning,
    marginLeft: 15,
    marginBottom: 4,
    fontStyle: 'italic',
  },
  dataSourceIndicator: {
    fontSize: 12,
    color: theme.success,
    marginLeft: 15,
    marginBottom: 4,
    fontWeight: '600',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: theme.surface,
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
    backgroundColor: theme.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.textSecondary,
    marginLeft: 6,
  },
  activeTabText: {
    color: theme.text,
  },
});

export default LatestScamsScreen; 