import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';

const HeaderTitle = () => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    logoContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 8,
    },
  });

  return (
    <View style={styles.logoContainer}>
      <Icon name="shield-outline" size={24} color={theme.primary} />
      <Text style={styles.headerTitle}>ThreatSense</Text>
    </View>
  );
};

export default HeaderTitle; 