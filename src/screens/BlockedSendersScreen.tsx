import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';

const BlockedSendersScreen = () => {
  return (
    <View style={styles.container}>
      <AccessibleText style={styles.title}>Blocked Senders</AccessibleText>
      <AccessibleText style={styles.subtitle}>
        This screen will display a list of all blocked senders.
      </AccessibleText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
  },
});

export default BlockedSendersScreen; 