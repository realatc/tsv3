import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, SafeAreaView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ScamAlert } from '../services/perplexity/perplexityService';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { getSeverityColor, getSeverityIcon } from '../utils/threatLevel';
import { useTheme } from '../context/ThemeContext';

type ScamDetailScreenRouteProp = RouteProp<RootStackParamList, 'ScamDetail'>;

interface Props {
  route: ScamDetailScreenRouteProp;
}

const ScamDetailScreen: React.FC<Props> = ({ route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
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
    <LinearGradient colors={[theme.background, theme.surface]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Custom Header */}
        <View style={styles.headerRow}>
          <View style={styles.logoContainer}>
            <Icon name="shield-checkmark" size={28} color={theme.primary} />
            <Text style={styles.headerTitle}>Scam Details</Text>
          </View>
        </View>
        
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>{scam.title}</Text>
            
            <View style={styles.metadataContainer}>
              <View style={[styles.badge, { backgroundColor: severityColor }]}>
                <Icon name={severityIcon} size={12} color={theme.text} style={{ marginRight: 4 }} />
                <Text style={styles.badgeText}>{scam.severity.toUpperCase()}</Text>
              </View>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={[styles.badgeText, styles.categoryBadgeText]}>{scam.category.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.description}>{scam.description}</Text>

            {/* Discovery Date */}
            <View style={styles.dateContainer}>
              <Icon name="time-outline" size={16} color={theme.primary} />
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
                    <Icon name="link" size={16} color={theme.primary} />
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

            {scam.advice && (
              <View style={styles.adviceContainer}>
                <View style={styles.adviceHeader}>
                  <Icon name="lightbulb-outline" size={20} color={theme.primary} />
                  <Text style={styles.adviceTitle}>Actionable Advice</Text>
                </View>
                <Text style={styles.adviceText}>{scam.advice}</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 24,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
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
    backgroundColor: theme.surfaceSecondary,
    borderWidth: 1,
    borderColor: theme.border,
  },
  categoryBadgeText: {
    color: theme.textSecondary,
  },
  description: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: theme.surfaceSecondary,
    borderRadius: 8,
  },
  dateLabel: {
    fontSize: 14,
    color: theme.textSecondary,
    marginLeft: 8,
  },
  dateValue: {
    fontSize: 14,
    color: theme.primary,
    fontWeight: '600',
  },
  sourcesContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 20,
  },
  sourcesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
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
    color: theme.primary,
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  sourceDate: {
    fontSize: 12,
    color: theme.textSecondary,
    marginTop: 2,
    fontStyle: 'italic',
  },
  noSourcesText: {
    fontSize: 14,
    color: theme.textSecondary,
    fontStyle: 'italic',
  },
  adviceContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.border,
    paddingTop: 20,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginLeft: 8,
  },
  adviceText: {
    fontSize: 15,
    color: theme.primary,
    lineHeight: 22,
    fontStyle: 'italic',
    backgroundColor: theme.background,
    padding: 16,
    borderRadius: 8,
  },
});

export default ScamDetailScreen; 