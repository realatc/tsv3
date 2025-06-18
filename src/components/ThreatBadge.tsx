import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const threatColors = {
  High: '#FF6B6B', // Softer, more appealing red
  Medium: '#FFB300',
  Low: '#43A047',
};

const threatIcons = {
  High: 'warning',
  Medium: 'alert-circle',
  Low: 'shield-checkmark',
};

// Compact version for log history list
export const ThreatBadgeCompact = ({ level, score }: { level: 'High' | 'Medium' | 'Low', score?: number }) => (
  <View style={styles.container}>
    <View style={[styles.badge, { backgroundColor: threatColors[level] + '15', borderColor: threatColors[level] }]}> 
      <Icon name={threatIcons[level]} size={16} color={threatColors[level]} />
    </View>
    {score !== undefined && score > 0 && (
      <View style={[styles.scoreIndicator, { backgroundColor: threatColors[level] }]} />
    )}
  </View>
);

// Detailed version for log details screen
export const ThreatBadge = ({ level, score }: { level: 'High' | 'Medium' | 'Low', score?: number }) => (
  <View style={[styles.detailedBadge, { backgroundColor: threatColors[level] + '22', borderColor: threatColors[level] }]}> 
    <Icon name={threatIcons[level]} size={18} color={threatColors[level]} style={{ marginRight: 6 }} />
    <Text style={[styles.text, { color: threatColors[level] }]}>
      {level}{score !== undefined ? ` (${score}/9)` : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 32,
    height: 32,
    borderWidth: 1.5,
  },
  scoreIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#1a1a1a',
  },
  detailedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
}); 