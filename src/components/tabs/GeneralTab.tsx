import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';

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
    helpButton: {
      padding: 4,
    },
  });

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
          <Icon name="information-circle-outline" size={22} color={theme.primary} />
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