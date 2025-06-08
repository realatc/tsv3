import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useRoute } from '@react-navigation/native';

// Mock data for demonstration
const mockLog = {
  id: '1',
  date: '2024-06-01',
  category: 'Mail',
  threat: 'Low',
  sender: 'scammer@example.com',
  message: 'You have won a prize! Click here to claim.',
  nlpAnalysis: 'Likely phishing. Contains urgent language and suspicious link.',
  behavioralAnalysis: 'Sender is not in contacts. Similar pattern to previous scams.',
  metadata: {
    device: 'iPhone 15',
    location: 'Austin, TX',
    receivedAt: '2024-06-01T10:15:00Z',
    messageLength: 45,
  },
};

const LogDetailScreen = () => {
  const route = useRoute();
  // @ts-ignore
  const log = (route.params && route.params.log) ? route.params.log : mockLog;

  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Log Details</Text>
          <View style={styles.section}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{log.date}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Category:</Text>
            <Text style={styles.value}>{log.category}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Threat Level:</Text>
            <Text style={styles.value}>{log.threat}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Sender:</Text>
            <Text style={styles.value}>{log.sender}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Message:</Text>
            <Text style={styles.value}>{log.message}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>NLP Analysis:</Text>
            <Text style={styles.value}>{log.nlpAnalysis}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Behavioral Analysis:</Text>
            <Text style={styles.value}>{log.behavioralAnalysis}</Text>
          </View>
          <View style={styles.section}>
            <Text style={styles.label}>Metadata:</Text>
            <Text style={styles.value}>Device: {log.metadata.device}</Text>
            <Text style={styles.value}>Location: {log.metadata.location}</Text>
            <Text style={styles.value}>Received At: {log.metadata.receivedAt}</Text>
            <Text style={styles.value}>Message Length: {log.metadata.messageLength}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 16,
  },
  label: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  value: {
    color: '#B0BEC5',
    fontSize: 16,
    marginBottom: 2,
  },
});

export default LogDetailScreen; 