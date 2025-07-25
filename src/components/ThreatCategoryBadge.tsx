import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { threatCategoryDetails } from '../utils/threatCategories';
import { useTheme } from '../context/ThemeContext';

type ThreatCategoryBadgeProps = {
  category: string;
};

export const ThreatCategoryBadge = ({ category }: ThreatCategoryBadgeProps) => {
  const { theme } = useTheme();
  const details = threatCategoryDetails[category] || threatCategoryDetails.Default;

  const styles = StyleSheet.create({
    badge: {
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 25,
      width: 42,
      height: 42,
      borderWidth: 1,
      marginRight: 10,
      marginBottom: 10,
    },
  });

  return (
    <Tooltip
      content={<Text style={{ color: theme.text }}>{category}</Text>}
      placement="top"
      backgroundColor={theme.surface}
      contentStyle={{ borderRadius: 8, borderWidth: 1, borderColor: theme.border }}
      arrowStyle={{ borderTopColor: theme.surface }}
      displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
    >
      <View style={[styles.badge, { backgroundColor: details.color + '20', borderColor: details.color }]}>
        <Icon name={details.icon} size={22} color={details.color} />
      </View>
    </Tooltip>
  );
}; 