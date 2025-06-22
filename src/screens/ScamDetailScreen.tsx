import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { ScamAlert } from '../services/perplexity/perplexityService';
import Icon from 'react-native-vector-icons/Feather';
import CustomHeader from '../components/CustomHeader';

type ScamDetailScreenRouteProp = RouteProp<RootStackParamList, 'ScamDetail'>;

interface Props {
  route: ScamDetailScreenRouteProp;
}

const ScamDetailScreen: React.FC<Props> = ({ route }) => {
  const { scam } = route.params;

  const openLink = (url: string) => {
    Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
  };

  const getSeverityStyle = (severity: ScamAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return { backgroundColor: '#990000', color: '#fff' };
      case 'high':
        return { backgroundColor: '#D9534F', color: '#fff' };
      case 'medium':
        return { backgroundColor: '#F0AD4E', color: '#fff' };
      case 'low':
        return { backgroundColor: '#5CB85C', color: '#fff' };
      default:
        return { backgroundColor: '#777', color: '#fff' };
    }
  };
  
  const severityStyle = getSeverityStyle(scam.severity);

  return (
    <View style={styles.container}>
      <CustomHeader title="Scam Details" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.title}>{scam.title}</Text>
          
          <View style={styles.metadataContainer}>
            <View style={[styles.badge, severityStyle]}>
              <Text style={styles.badgeText}>{scam.severity.toUpperCase()}</Text>
            </View>
            <View style={[styles.badge, styles.categoryBadge]}>
              <Text style={[styles.badgeText, styles.categoryBadgeText]}>{scam.category.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.description}>{scam.description}</Text>

          {scam.sources && scam.sources.length > 0 && (
            <View style={styles.sourcesContainer}>
              <Text style={styles.sourcesTitle}>Sources</Text>
              {scam.sources.map((source, index) => (
                <TouchableOpacity key={index} style={styles.sourceLink} onPress={() => openLink(source)}>
                  <Icon name="link" size={16} color="#4E9AFE" />
                  <Text style={styles.sourceText} numberOfLines={1}>{source}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
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
  },
  badge: {
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryBadge: {
    backgroundColor: '#333'
  },
  categoryBadgeText: {
    color: '#fff'
  },
  description: {
    fontSize: 16,
    color: '#B0B0B0',
    lineHeight: 24,
    marginBottom: 25,
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
    alignItems: 'center',
    paddingVertical: 8,
  },
  sourceText: {
    fontSize: 16,
    color: '#4E9AFE',
    marginLeft: 10,
    textDecorationLine: 'underline',
  },
});

export default ScamDetailScreen; 