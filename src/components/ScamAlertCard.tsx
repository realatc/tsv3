import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ScamAlert } from '../services/perplexity/perplexityService';

interface ScamAlertCardProps {
  scam: ScamAlert;
  onPress?: () => void;
}

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

const getSeverityIcon = (severity: ScamAlert['severity']) => {
  switch (severity) {
    case 'critical':
      return 'alert-octagon';
    case 'high':
      return 'alert-circle';
    case 'medium':
      return 'alert';
    case 'low':
      return 'information';
    default:
      return 'help-circle';
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

export const ScamAlertCard: React.FC<ScamAlertCardProps> = ({ scam, onPress }) => {
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
          <Icon name={categoryIcon} size={20} color="#E5E5E7" style={styles.categoryIcon} />
          <Text style={styles.title} numberOfLines={2}>
            {scam.title}
          </Text>
        </View>
        <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
          <Icon name={severityIcon} size={16} color="#fff" />
          <Text style={styles.severityText}>{scam.severity.toUpperCase()}</Text>
        </View>
      </View>
      
      <Text style={styles.description} numberOfLines={3}>
        {scam.description}
      </Text>
      
      <View style={styles.footer}>
        <Text style={styles.date}>{formatDate(scam.date)}</Text>
        {scam.sources && scam.sources.length > 0 && (
          <View style={styles.sourcesContainer}>
            <Icon name="link" size={14} color="#888" />
            <Text style={styles.sourcesText}>{scam.sources.length} source{scam.sources.length !== 1 ? 's' : ''}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#444',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  categoryIcon: {
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#E5E5E7',
    lineHeight: 20,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 60,
    justifyContent: 'center',
  },
  severityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: '#B0B0B0',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  sourcesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sourcesText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
}); 