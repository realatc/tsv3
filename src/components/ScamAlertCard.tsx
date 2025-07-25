import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScamAlert } from '../services/perplexity/perplexityService';
import { getSeverityColor, getSeverityIcon } from '../utils/threatLevel';
import { useTheme } from '../context/ThemeContext';

interface ScamAlertCardProps {
  scam: ScamAlert;
  onPress?: () => void;
}

// Removed local severity functions - now using standardized ones from threatLevel.ts

const getCategoryIcon = (category: string) => {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes('phishing')) return 'fish';
  if (categoryLower.includes('impersonation')) return 'account-question';
  if (categoryLower.includes('malware')) return 'virus';
  if (categoryLower.includes('scam')) return 'alert-circle';
  if (categoryLower.includes('social')) return 'account-group';
  return 'alert';
};

export const ScamAlertCard: React.FC<ScamAlertCardProps> = ({ scam, onPress }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const severityColor = getSeverityColor(scam.severity);
  const severityIcon = getSeverityIcon(scam.severity);
  const categoryIcon = getCategoryIcon(scam.category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Icon name={categoryIcon} size={20} color={theme.text} style={styles.categoryIcon} />
          <Text style={styles.title} numberOfLines={2}>
            {scam.title}
          </Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Icon name={severityIcon} size={16} color={theme.text} />
          <Text style={styles.severityText}>{scam.severity.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={3}>
        {scam.description}
      </Text>
      
      {scam.advice && (
        <View style={styles.adviceContainer}>
          <Icon name="lightbulb-outline" size={16} color={theme.primary} style={styles.adviceIcon} />
          <Text style={styles.adviceText} numberOfLines={2}>
            {scam.advice}
          </Text>
        </View>
      )}
      
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(scam.date)}</Text>
        {scam.sources && scam.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Icon name="link" size={14} color={theme.textSecondary} />
            <Text style={styles.sourcesText}>{scam.sources.length} source{scam.sources.length !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIcon: {
    marginRight: 10,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: theme.text,
    lineHeight: 22,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    minWidth: 70,
    justifyContent: 'center',
  },
  severityText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: theme.text,
    marginLeft: 4,
  },
  description: {
    fontSize: 15,
    color: theme.textSecondary,
    lineHeight: 22,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: theme.textSecondary,
  },
  sourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourcesText: {
    fontSize: 13,
    color: theme.textSecondary,
    marginLeft: 6,
  },
  adviceContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: theme.surfaceSecondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  adviceIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  adviceText: {
    flex: 1,
    fontSize: 14,
    color: theme.primary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
}); 