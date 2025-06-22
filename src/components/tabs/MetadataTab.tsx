import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

type MetadataTabNavigationProp = StackNavigationProp<RootStackParamList>;

type MetadataTabProps = {
  log: any;
  urls: string[];
};

const MetadataRow = ({ label, value }: { label: string; value: any }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value?.toString() || 'N/A'}</Text>
  </View>
);

export const MetadataTab = ({ log, urls }: MetadataTabProps) => {
  const navigation = useNavigation<MetadataTabNavigationProp>();
  const metadata = log.metadata || {};

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
          <Icon name="information-circle-outline" size={22} color="#4A90E2" />
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
    marginTop: 12,
  },
  helpButton: {
    padding: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  row: {
    width: '48%',
    marginBottom: 12,
  },
  label: {
    color: '#B0BEC5',
    fontSize: 14,
  },
  value: {
    color: '#ECEFF1',
    fontSize: 16,
  },
  urlText: {
    color: '#4A90E2',
    fontSize: 14,
    marginTop: 4,
  },
}); 