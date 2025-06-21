import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Tooltip from 'react-native-walkthrough-tooltip';

const threatCategoryDetails: Record<string, { icon: string; color: string }> = {
  Urgent: { icon: 'clock-alert-outline', color: '#FFA726' },
  Impersonation: { icon: 'account-question-outline', color: '#EF5350' },
  Phishing: { icon: 'fish', color: '#42A5F5' },
  Scam: { icon: 'alert-circle-outline', color: '#AB47BC' },
  Unsolicited: { icon: 'email-alert-outline', color: '#FF7043' },
  Unofficial: { icon: 'domain-off', color: '#78909C' },
  Suspicious: { icon: 'help-circle-outline', color: '#BDBDBD' },
  // Add more as needed
  Default: { icon: 'help-circle-outline', color: '#9E9E9E' },
};

type ThreatCategoryBadgeProps = {
  category: string;
};

export const ThreatCategoryBadge = ({ category }: ThreatCategoryBadgeProps) => {
  const { icon, color } = threatCategoryDetails[category] || threatCategoryDetails.Default;

  return (
    <Tooltip
      content={<Text style={{ color: '#fff' }}>{category}</Text>}
      placement="top"
      backgroundColor="rgba(30,30,30,0.9)"
      contentStyle={{ borderRadius: 8 }}
      arrowStyle={{ borderTopColor: 'rgba(30,30,30,0.9)' }}
      displayInsets={{ top: 24, bottom: 24, left: 24, right: 24 }}
    >
      <View style={[styles.badge, { backgroundColor: color + '20', borderColor: color }]}>
        <Icon name={icon} size={22} color={color} />
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