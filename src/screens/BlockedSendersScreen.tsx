import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AccessibleText } from '../components/AccessibleText';
import { useTheme } from '../context/ThemeContext';

const BlockedSendersScreen = () => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <AccessibleText style={styles.title}>Blocked Senders</AccessibleText>
      <AccessibleText style={styles.subtitle}>
        This screen will display a list of all blocked senders.
      </AccessibleText>
    </View>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: theme.textSecondary,
    textAlign: 'center',
  },
});

export default BlockedSendersScreen; 