import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { ThreatCategoryBadge } from '../ThreatCategoryBadge';
import { ThreatBadge } from '../ThreatBadge';

type ThreatTabNavigationProp = StackNavigationProp<RootStackParamList>;

type ThreatTabProps = {
  threatInfo: any;
};

export const ThreatTab = ({ threatInfo }: ThreatTabProps) => {
  const navigation = useNavigation<ThreatTabNavigationProp>();

  return (
    <>
      <View style={styles.card}>
        <View style={styles.titleContainer}>
          <Text style={styles.sectionTitle}>Threat Assessment</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('MainTabs', { 
              screen: 'Library',
              params: { 
                screen: 'KnowledgeBaseLogDetailsThreat',
                params: { log: threatInfo }
              }
            })}
            style={styles.helpButton}
          >
            <Icon name="information-circle-outline" size={22} color="#4A90E2" />
          </TouchableOpacity>
        </View>
        <View style={styles.threatRow}>
          <View>
            <Text style={styles.label}>Threat Level</Text>
            <ThreatBadge level={threatInfo.level} score={threatInfo.score} />
          </View>
          <View style={styles.confidenceContainer}>
            <Text style={styles.label}>Confidence</Text>
            <Text style={styles.confidenceText}>{threatInfo.confidence || 0}%</Text>
          </View>
        </View>
        <Text style={styles.label}>Categories</Text>
        <View style={styles.categoryContainer}>
          {(threatInfo.categories || []).map((cat: string, idx: number) => (
            <ThreatCategoryBadge key={idx} category={cat} />
          ))}
        </View>
        <Text style={styles.label}>Summary</Text>
        <Text style={styles.value}>{threatInfo.summary}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Score Breakdown</Text>
        <View style={styles.breakdownContainer}>
          {(threatInfo.breakdown || []).map((item: any, idx: number) => (
            <View key={idx} style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>• {item.label}</Text>
              <Text style={styles.breakdownPoints}>+{item.points}</Text>
            </View>
          ))}
          {(!threatInfo.breakdown || threatInfo.breakdown.length === 0) && (
            <Text style={styles.value}>No specific threat points detected.</Text>
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 18,
    marginVertical: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  label: {
    color: '#B0BEC5',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 4,
  },
  value: {
    color: '#ECEFF1',
    fontSize: 16,
    marginBottom: 10,
  },
  helpButton: {
    padding: 4,
  },
  threatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  confidenceContainer: {
    alignItems: 'flex-end',
  },
  confidenceText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  breakdownContainer: {
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
    padding: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  breakdownLabel: {
    color: '#ECEFF1',
    fontSize: 15,
  },
  breakdownPoints: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 15,
  },
}); 