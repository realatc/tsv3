import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { threatAnalysisService } from '../services/threatAnalysisService';
import { useSentryMode } from '../context/SentryModeContext';

const SentryModeDemo: React.FC = () => {
  const { settings } = useSentryMode();

  const simulateThreat = async (level: 'Low' | 'Medium' | 'High' | 'Critical') => {
    if (!settings.isEnabled) {
      Alert.alert('Sentry Mode Disabled', 'Please enable Sentry Mode first to test threat simulation.');
      return;
    }

    if (!settings.trustedContact) {
      Alert.alert('No Trusted Contact', 'Please select a trusted contact first to test threat simulation.');
      return;
    }

    Alert.alert(
      `Simulate ${level} Threat`,
      `This will simulate a ${level} level threat and trigger Sentry Mode notification if enabled. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Simulate', 
          onPress: async () => {
            try {
              const result = await threatAnalysisService.simulateThreat(level);
              Alert.alert(
                'Threat Simulated',
                `A ${level} level threat has been simulated.\n\nThreat Type: ${result.threatType}\nDescription: ${result.description}\n\nCheck the console for notification details.`,
                [{ text: 'OK' }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to simulate threat. Please try again.');
            }
          }
        }
      ]
    );
  };

  if (!settings.isEnabled) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon name="flask-outline" size={20} color="#FFD700" />
        <Text style={styles.title}>Sentry Mode Demo</Text>
      </View>
      <Text style={styles.description}>
        Test how Sentry Mode responds to different threat levels:
      </Text>

      <View style={styles.threatButtons}>
        <TouchableOpacity 
          style={[styles.threatButton, styles.lowThreat]} 
          onPress={() => simulateThreat('Low')}
        >
          <Text style={styles.threatButtonText}>Low Threat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.threatButton, styles.mediumThreat]} 
          onPress={() => simulateThreat('Medium')}
        >
          <Text style={styles.threatButtonText}>Medium Threat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.threatButton, styles.highThreat]} 
          onPress={() => simulateThreat('High')}
        >
          <Text style={styles.threatButtonText}>High Threat</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.threatButton, styles.criticalThreat]} 
          onPress={() => simulateThreat('Critical')}
        >
          <Text style={styles.threatButtonText}>Critical Threat</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Current Threshold:</Text> {settings.threatLevel}
        </Text>
        <Text style={styles.infoText}>
          <Text style={styles.bold}>Contact:</Text> {settings.trustedContact?.name || 'Not Set'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    padding: 16,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  description: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 16,
  },
  threatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  threatButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  lowThreat: {
    backgroundColor: '#4CAF50',
  },
  mediumThreat: {
    backgroundColor: '#FF9800',
  },
  highThreat: {
    backgroundColor: '#F44336',
  },
  criticalThreat: {
    backgroundColor: '#9C27B0',
  },
  threatButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoBox: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12,
  },
  infoText: {
    color: '#B0B0B0',
    fontSize: 13,
    marginBottom: 4,
  },
  bold: {
    fontWeight: '600',
    color: '#fff',
  },
});

export default SentryModeDemo;

 