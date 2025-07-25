import React from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAccessibility } from '../context/AccessibilityContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import { useTheme } from '../context/ThemeContext';

type AccessibilitySettingsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'AccessibilitySettings'
>;

type Props = {
  navigation: AccessibilitySettingsScreenNavigationProp;
};

const AccessibilitySettingsScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const { settings, updateSetting } = useAccessibility();

  const SettingItem = ({ 
    title,
    icon,
    value,
    onValueChange
  }: {
    title: string;
    icon: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Icon name={icon} size={22} color={theme.primary} style={styles.settingIcon} />
        <Text style={styles.settingTitle}>{title}</Text>
      </View>
      {typeof value === 'boolean' && onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: theme.border, true: theme.primaryLight }}
          thumbColor={value ? theme.primary : theme.surface}
          ios_backgroundColor={theme.surfaceSecondary}
        />
      )}
    </View>
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 15 }}>
          <Text style={{ color: theme.primary, fontSize: 17, fontWeight: '600' }}>Done</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme.primary]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Visual Accessibility Section */}
        <Text style={styles.sectionTitle}>Visual</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            title="High Contrast Mode"
            icon="contrast-outline"
            value={settings.highContrastMode}
            onValueChange={(value) => updateSetting('highContrastMode', value)}
          />
          <SettingItem
            title="Large Text Mode"
            icon="text-outline"
            value={settings.largeTextMode}
            onValueChange={(value) => updateSetting('largeTextMode', value)}
          />
          <SettingItem
            title="Color Blind Friendly"
            icon="color-palette-outline"
            value={settings.colorBlindFriendly}
            onValueChange={(value) => updateSetting('colorBlindFriendly', value)}
          />
          <SettingItem
            title="Reduced Motion"
            icon="flash-off-outline"
            value={settings.reducedMotion}
            onValueChange={(value) => updateSetting('reducedMotion', value)}
          />
        </View>
        
        {/* Audio Accessibility Section */}
        <Text style={styles.sectionTitle}>Audio & Haptics</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            title="Audio Alerts"
            icon="volume-high-outline"
            value={settings.audioAlerts}
            onValueChange={(value) => updateSetting('audioAlerts', value)}
          />
           <SettingItem
            title="Voice Descriptions"
            icon="mic-outline"
            value={settings.voiceDescriptions}
            onValueChange={(value) => updateSetting('voiceDescriptions', value)}
          />
          <SettingItem
            title="Haptic Feedback"
            icon="keypad-outline"
            value={settings.hapticFeedback}
            onValueChange={(value) => updateSetting('hapticFeedback', value)}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.background,
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    color: theme.textSecondary,
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginLeft: 12,
    marginBottom: 8,
    marginTop: 20,
  },
  settingsGroup: {
    backgroundColor: theme.surface,
    borderRadius: 10,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  settingTitle: {
    color: theme.text,
    fontSize: 17,
  },
});

export default AccessibilitySettingsScreen; 