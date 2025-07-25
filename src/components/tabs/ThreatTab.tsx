import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { ThreatBadge } from '../ThreatBadge';
import { ThreatCategoryBadge } from '../ThreatCategoryBadge';
import { useTheme } from '../../context/ThemeContext';

type ThreatTabNavigationProp = StackNavigationProp<RootStackParamList>;

type ThreatTabProps = {
  threatInfo: any;
};

export const ThreatTab = ({ threatInfo }: ThreatTabProps) => {
  const navigation = useNavigation<ThreatTabNavigationProp>();
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 18,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 18,
    },
    helpButton: {
      padding: 4,
    },
    threatRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 10,
    },
    value: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 10,
    },
    confidenceContainer: {
      alignItems: 'flex-end',
    },
    confidenceText: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: 'bold',
    },
    categoryContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
  });

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
            <Icon name="information-circle-outline" size={22} color={theme.primary} />
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
    </>
  );
}; 