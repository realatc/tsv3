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
import { ScamAlertCard } from '../components/ScamAlertCard';
import { getLatestScams, ScamAlert } from '../services/perplexity/perplexityService';
import { RootStackParamList } from '../types/navigation';

type LatestScamsNavigationProp = StackNavigationProp<RootStackParamList, 'LatestScams'>;

const LatestScamsScreen: React.FC = () => {
  const navigation = useNavigation<LatestScamsNavigationProp>();
  const [scams, setScams] = useState<ScamAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchScams = async (isRefreshing = false) => {
    try {
      setError(null);
      const latestScams = await getLatestScams();
      setScams(latestScams);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[LatestScamsScreen] Error fetching scams:', err);
      setError('Failed to load latest scams. Please try again.');
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

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>Latest Scams</Text>
        <Text style={styles.headerSubtitle}>Powered by Perplexity AI</Text>
        {lastUpdated && (
          <Text style={styles.lastUpdatedText}>
            Updated {formatLastUpdated(lastUpdated)}
          </Text>
        )}
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Icon name="refresh" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

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

  const getSeverityColor = (severity: ScamAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return '#FF4444';
      case 'high':
        return '#FF8800';
      case 'medium':
        return '#FFAA00';
      case 'low':
        return '#44AA44';
      default:
        return '#888888';
    }
  };

  const getCategoryIcon = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (categoryLower.includes('phishing')) return 'fish';
    if (categoryLower.includes('impersonation')) return 'account-question';
    if (categoryLower.includes('malware')) return 'virus';
    if (categoryLower.includes('scam')) return 'alert-circle';
    if (categoryLower.includes('social')) return 'account-group';
    return 'alert';
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
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

    if (scams.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Icon name="shield-checkmark" size={48} color="#44AA44" />
          <Text style={styles.emptyText}>No new threats detected</Text>
          <Text style={styles.emptySubtext}>Great news! No recent scams have been reported.</Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
        }
      >
        <View style={styles.infoContainer}>
          <Icon name="information-circle" size={20} color="#007AFF" />
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
        
        {scams.map((scam) => (
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
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E5E5E7',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  refreshButton: {
    padding: 8,
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
    backgroundColor: '#007AFF',
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
    padding: 16,
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#B0B0B0',
    marginLeft: 8,
    lineHeight: 20,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  footerText: {
    color: '#8A8A8E',
    fontSize: 12,
  },
  lastUpdatedText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  freshIndicator: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  liveIndicator: {
    color: '#34C759',
    fontWeight: 'bold',
  },
});

export default LatestScamsScreen; 