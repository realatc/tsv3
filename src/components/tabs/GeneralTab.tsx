import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type GeneralTabNavigationProp = StackNavigationProp<RootStackParamList>;

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
};

type GeneralTabProps = {
  log: any;
};

export const GeneralTab = ({ log }: GeneralTabProps) => {
  const navigation = useNavigation<GeneralTabNavigationProp>();

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Details</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { 
            screen: 'Library',
            params: { 
              screen: 'KnowledgeBaseLogDetailsGeneral',
              params: { log }
            }
          })}
          style={styles.helpButton}
        >
          <Icon name="information-circle-outline" size={22} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Date</Text>
      <Text style={styles.value}>{formatDate(log.date)}</Text>
      <Text style={styles.label}>Sender:</Text>
      <Text style={styles.value}>{log.sender}</Text>
      <Text style={styles.label}>Category:</Text>
      <Text style={styles.value}>{log.category}</Text>
      <Text style={styles.sectionTitle}>Message Content</Text>
      <Text style={styles.value}>{log.message}</Text>
    </View>
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
  },
  value: {
    color: '#ECEFF1',
    fontSize: 16,
    marginBottom: 10,
  },
  helpButton: {
    padding: 4,
  },
}); 