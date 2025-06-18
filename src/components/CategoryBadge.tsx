import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const categoryColors: Record<string, string> = {
  Mail: '#4A90E2',
  Text: '#43A047',
  'Phone Call': '#FFB300',
  Default: '#B0BEC5',
};

const categoryIcons: Record<string, string> = {
  Mail: 'mail',
  Text: 'chatbubble',
  'Phone Call': 'call',
  Default: 'help-circle',
};

// Compact version for log history list
export const CategoryBadge = ({ category }: { category: string }) => {
  const color = categoryColors[category] || categoryColors.Default;
  const icon = categoryIcons[category] || categoryIcons.Default;
  
  return (
    <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color }]}> 
      <Icon name={icon} size={16} color={color} />
    </View>
  );
};

// Detailed version for log details screen
export const CategoryBadgeDetailed = ({ category }: { category: string }) => {
  const color = categoryColors[category] || categoryColors.Default;
  
  return (
    <View style={[styles.detailedBadge, { backgroundColor: color + '22', borderColor: color }]}> 
      <Text style={[styles.text, { color }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: 32,
    height: 32,
    borderWidth: 1.5,
    marginLeft: 6,
  },
  detailedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1.5,
    alignSelf: 'flex-start',
    marginLeft: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.5,
  },
});

export default CategoryBadge; 