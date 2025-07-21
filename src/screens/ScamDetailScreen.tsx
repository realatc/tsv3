import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ScamAlert } from '../services/perplexity/perplexityService';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getSeverityColor, getSeverityIcon } from '../utils/threatLevel';

type ScamDetailScreenRouteProp = RouteProp<RootStackParamList, 'ScamDetail'>;

interface Props {
  route: ScamDetailScreenRouteProp;
}

const ScamDetailScreen: React.FC<Props> = ({ route }) => {
  const { scam } = route.params;
  
  // Debug: Log the scam data to see what we're getting
  console.log('[ScamDetailScreen] Scam data:', {
    id: scam.id,
    title: scam.title,
    discoveredDate: scam.discoveredDate,
    sourceDates: scam.sourceDates,
    sources: scam.sources
  });

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return dateString;
    }
  };

  const formatDateDetailed = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  const severityColor = getSeverityColor(scam.severity);
  const severityIcon = getSeverityIcon(scam.severity);

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Icon name="shield-checkmark" size={28} color="#A070F2" />
            <Text style={styles.headerTitle}>Scam Details</Text>
          </View>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>{scam.title}</Text>
            
            <View style={styles.metadataContainer}>
              <View style={[styles.badge, { backgroundColor: severityColor }]}>
                <Icon name={severityIcon} size={12} color="#fff" style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>{scam.severity.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={[styles.badgeText, styles.categoryBadgeText]}>{scam.category.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.description}>{scam.description}</Text>

            {/* Discovery Date */}
            <View style={styles.dateContainer}>
              <Icon name="time-outline" size={16} color="#A070F2" />
              <Text style={styles.dateLabel}>Vulnerability Discovered: </Text>
              <Text style={styles.dateValue}>
                {scam.discoveredDate ? formatDateDetailed(scam.discoveredDate) : 'Not available'}
              </Text>
            </View>

            {scam.sources && scam.sources.length > 0 && (
              <View style={styles.sourcesContainer}>
                <Text style={styles.sourcesTitle}>Sources</Text>
                {scam.sources.map((source, index) => (
                  <TouchableOpacity key={index} style={styles.sourceLink} onPress={() => openLink(source)}>
                    <Icon name="link" size={16} color="#A070F2" />
                    <View style={styles.sourceContent}>
                      <Text style={styles.sourceText} numberOfLines={1}>{source}</Text>
                      <Text style={styles.sourceDate}>
                        Published: {scam.sourceDates && scam.sourceDates[index] 
                          ? formatDateDetailed(scam.sourceDates[index]) 
                          : 'Date not available'}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {(!scam.sources || scam.sources.length === 0) && (
              <View style={styles.sourcesContainer}>
                <Text style={styles.sourcesTitle}>Sources</Text>
                <Text style={styles.noSourcesText}>No external sources available for this alert.</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#23232A',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E5E5E7',
    marginBottom: 15,
  },
  metadataContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
  },
  badge: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#2C2C2E',
    borderWidth: 1,
    borderColor: '#3C3C3E',
  },
  categoryBadgeText: {
    color: '#B0BEC5',
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 24,
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: '#B0BEC5',
    marginLeft: 8,
  },
  dateValue: {
    fontSize: 14,
    color: '#A070F2',
    fontWeight: '600',
  },
  sourcesContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  sourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E5E5E7',
    marginBottom: 10,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  sourceContent: {
    flex: 1,
    marginLeft: 10,
  },
  sourceText: {
    fontSize: 15,
    color: '#A070F2',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  sourceDate: {
    fontSize: 12,
    color: '#8A8A8E',
    marginTop: 2,
    fontStyle: 'italic',
  },
  noSourcesText: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default ScamDetailScreen; 