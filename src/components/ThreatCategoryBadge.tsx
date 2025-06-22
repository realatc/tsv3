import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tooltip from 'react-native-walkthrough-tooltip';
import { threatCategoryDetails } from '../utils/threatCategories';

type ThreatCategoryBadgeProps = {
  category: string;
};

export const ThreatCategoryBadge = ({ category }: ThreatCategoryBadgeProps) => {
  const details = threatCategoryDetails[category] || threatCategoryDetails.Default;

  return (
    <Tooltip
      content={<Text style={{ color: '#fff' }}>{category}</Text>}
      placement="top"
      backgroundColor="rgba(30,30,30,0.9)"
      contentStyle={{ borderRadius: 8 }}
      arrowStyle={{ borderTopColor: 'rgba(30,30,30,0.9)' }}
      displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
    >
      <View style={[styles.badge, { backgroundColor: details.color + '20', borderColor: details.color }]}>
        <Icon name={details.icon} size={22} color={details.color} />
      </View>
    </Tooltip>
  );
};

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