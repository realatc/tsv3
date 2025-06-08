import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const categoryColors: Record<string, string> = {
  Mail: '#4A90E2',
  Text: '#43A047',
  'Phone Call': '#FFB300',
  Default: '#B0BEC5',
};

export const CategoryBadge = ({ category }: { category: string }) => {
  const color = categoryColors[category] || categoryColors.Default;
  return (
    <View style={[styles.badge, { backgroundColor: color + '22', borderColor: color }]}> 
      <Text style={[styles.text, { color }]}>{category}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
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