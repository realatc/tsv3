import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const threatColors = {
  High: '#E53935',
  Medium: '#FFB300',
  Low: '#43A047',
};

const threatIcons = {
  High: 'warning',
  Medium: 'alert-circle',
  Low: 'shield-checkmark',
};

export const ThreatBadge = ({ level, percentage }: { level: 'High' | 'Medium' | 'Low', percentage?: number }) => (
  <View style={[styles.badge, { backgroundColor: threatColors[level] + '22', borderColor: threatColors[level] }]}> 
    <Icon name={threatIcons[level]} size={18} color={threatColors[level]} style={{ marginRight: 6 }} />
    <Text style={[styles.text, { color: threatColors[level] }]}>
      {level}{percentage !== undefined ? ` (${percentage}%)` : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  badge: {
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