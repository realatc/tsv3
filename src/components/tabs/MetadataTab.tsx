import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';

type MetadataTabNavigationProp = StackNavigationProp<RootStackParamList>;

type MetadataTabProps = {
  log: any;
  urls: string[];
};

export const MetadataTab = ({ log, urls }: MetadataTabProps) => {
  const navigation = useNavigation<MetadataTabNavigationProp>();
  const { theme } = useTheme();
  const metadata = log.metadata || {};

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
    grid: {
      marginBottom: 16,
    },
    metadataRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    metadataLabel: {
      color: theme.textSecondary,
      fontSize: 14,
      fontWeight: '500',
    },
    metadataValue: {
      color: theme.text,
      fontSize: 14,
      textAlign: 'right',
      flex: 1,
      marginLeft: 8,
    },
    urlText: {
      color: theme.primary,
      fontSize: 14,
      marginBottom: 4,
      textDecorationLine: 'underline',
    },
  });

  const MetadataRow = ({ label, value }: { label: string; value: string }) => (
    <View style={styles.metadataRow}>
      <Text style={styles.metadataLabel}>{label}</Text>
      <Text style={styles.metadataValue}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Message Metadata</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { 
            screen: 'Library',
            params: { 
              screen: 'KnowledgeBaseLogDetailsMetadata',
              params: { log }
            }
          })}
          style={styles.helpButton}
        >
          <Icon name="information-circle-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <View style={styles.grid}>
        <MetadataRow label="Device" value={metadata.device} />
        <MetadataRow label="Location" value={metadata.location} />
        <MetadataRow label="Received At" value={metadata.receivedAt} />
        <MetadataRow label="Message Length" value={`${metadata.messageLength} chars`} />
        <MetadataRow label="Sender History" value={`${metadata.senderHistory} previous`} />
        <MetadataRow label="Sender Flagged" value={metadata.senderFlagged ? 'Yes' : 'No'} />
        <MetadataRow label="Attachments" value={metadata.attachments} />
        <MetadataRow label="Links" value={metadata.links} />
        <MetadataRow label="Network" value={metadata.network} />
        <MetadataRow label="App Version" value={metadata.appVersion} />
        <MetadataRow label="Threat Detection" value={metadata.threatDetection} />
        <MetadataRow label="Geolocation" value={metadata.geolocation} />
      </View>
      {urls.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>URLs Found</Text>
          {urls.map((url, idx) => (
            <Text key={idx} style={styles.urlText} selectable>
              {url}
            </Text>
          ))}
        </>
      )}
    </View>
  );
}; 