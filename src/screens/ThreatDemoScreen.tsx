import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useLogs } from '../context/LogContext';

const testOptions = [
  { label: 'Simulate Phishing Email', value: 'phishing_email' },
  { label: 'Simulate Scam Text', value: 'scam_text' },
  { label: 'Simulate Robocall', value: 'robocall' },
];

const demoLogs = {
  phishing_email: {
    date: new Date().toISOString().slice(0, 10),
    category: 'Mail',
    threat: 'High',
    sender: 'phisher@fakebank.com',
    message: 'Your account is compromised. Click here to reset your password.',
    nlpAnalysis: 'Urgent language, suspicious link, impersonation detected.',
    behavioralAnalysis: 'Sender not in contacts. Matches known phishing patterns.',
    metadata: {
      device: 'iPhone 15',
      location: 'Austin, TX',
      receivedAt: new Date().toISOString(),
      messageLength: 68,
    },
  },
  scam_text: {
    date: new Date().toISOString().slice(0, 10),
    category: 'Text',
    threat: 'Medium',
    sender: 'unknown@randomsms.com',
    message: 'You have a package waiting. Reply with your info to claim.',
    nlpAnalysis: 'Request for personal info, urgency detected.',
    behavioralAnalysis: 'Sender not in contacts. Similar to previous scam texts.',
    metadata: {
      device: 'iPhone 15',
      location: 'Austin, TX',
      receivedAt: new Date().toISOString(),
      messageLength: 62,
    },
  },
  robocall: {
    date: new Date().toISOString().slice(0, 10),
    category: 'Phone Call',
    threat: 'Low',
    sender: '+18005551234',
    message: 'This is an automated call regarding your car warranty.',
    nlpAnalysis: 'Automated message detected. Common robocall content.',
    behavioralAnalysis: 'Number not in contacts. Matches robocall patterns.',
    metadata: {
      device: 'iPhone 15',
      location: 'Austin, TX',
      receivedAt: new Date().toISOString(),
      messageLength: 54,
    },
  },
};

const ThreatDemoScreen = () => {
  const navigation = useNavigation();
  const { addLog } = useLogs();

  const runSimulation = (type: keyof typeof demoLogs) => {
    const newLog = {
      ...demoLogs[type],
      id: Date.now().toString() + '_' + type,
      simulated: true,
    };
    // @ts-ignore
    delete newLog.threat;
    addLog(newLog);
    Alert.alert('Simulation Complete', `A ${testOptions.find(o => o.value === type)?.label} has been added to your logs.`, [
      {
        text: 'View Log History',
        onPress: () => (navigation as any).navigate('LogHistory'),
      },
      { text: 'OK' },
    ]);
  };

  return (
    <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.title}>Test</Text>
          <Text style={styles.text}>
            Select a test scenario to simulate a threat event:
          </Text>
          <View style={styles.optionsContainer}>
            {testOptions.map(option => (
              <TouchableOpacity
                key={option.value}
                style={styles.optionButton}
                onPress={() => runSimulation(option.value as keyof typeof demoLogs)}
              >
                <Text style={styles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 24,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  text: {
    color: '#B0BEC5',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 24,
  },
  optionsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  optionButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 16,
    width: '90%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  optionText: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ThreatDemoScreen; 