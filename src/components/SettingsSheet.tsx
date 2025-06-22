import React, { forwardRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';
import { useAccessibility } from '../context/AccessibilityContext';
import { navigate } from '../services/navigationService';
import { RootStackParamList } from '../types/navigation';

type SettingsSheetProps = {};

type Ref = BottomSheet;

const SettingsSheet = forwardRef<Ref, SettingsSheetProps>((props, ref) => {
  const { resetToDefaults } = useAccessibility();

  const handleResetSettings = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all accessibility settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: resetToDefaults }
      ]
    );
  };

  const handleNavigation = (routeName: keyof RootStackParamList) => {
    navigate(routeName, undefined);
    if (ref && 'current' in ref && ref.current) {
        ref.current.close();
    }
  };

  return (
    <BottomSheet
      ref={ref}
      index={0}
      snapPoints={['40%', '75%', '95%']}
      enablePanDownToClose={true}
      backgroundStyle={{ backgroundColor: '#1E1E1E' }}
      handleIndicatorStyle={{ backgroundColor: '#666' }}
      detached={true}
      bottomInset={-400}
    >
        <View style={styles.sheetContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Accessibility Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Accessibility</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={[styles.settingItem, {borderBottomWidth: 0}]} onPress={() => handleNavigation('AccessibilitySettings')}>
                  <View style={styles.settingLeft}>
                    <Icon name="accessibility" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Accessibility</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
              </View>
            </View>

            {/* App Settings Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Settings</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={styles.settingItem} onPress={() => handleNavigation('HelpAndSupport')}>
                  <View style={styles.settingLeft}>
                    <Icon name="help-circle-outline" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Help & Support</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, {borderBottomWidth: 0}]} onPress={handleResetSettings}>
                  <View style={styles.settingLeft}>
                    <Icon name="refresh" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Reset to Defaults</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
              </View>
            </View>

            {/* About Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <View style={styles.settingsGroup}>
                <View style={[styles.settingItem, {borderBottomWidth: 0}]}>
                  <View style={styles.settingLeft}>
                    <Icon name="information-circle" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Version</Text>
                  </View>
                  <Text style={styles.settingValue}>1.0.0</Text>
                </View>
              </View>
            </View>

            {/* Legal & Support Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Legal & Support</Text>
              <View style={styles.settingsGroup}>
                <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert(
                  'Terms of Service',
                  "By using ThreatSense, you agree to the following terms:\\n\\n1. You will not use this app for any nefarious purposes, like trying to frame your annoying neighbor, Kevin.\\n\\n2. You acknowledge that our AI, while brilliant, might occasionally mistake a cat photo for a phishing attempt. No AI is purr-fect.\\n\\n3. You will not hold us liable if the app advises you that a message from a Nigerian prince is, in fact, a scam. We're just the messengers.\\n\\n4. You agree to use your newfound threat-spotting powers for good, not for becoming the most paranoid person at the family BBQ.\\n\\n5. If you successfully prevent a scam, you are morally obligated to do a small celebratory dance. We don't make the rules. (We do.)"
                )}>
                  <View style={styles.settingLeft}>
                    <Icon name="document-text-outline" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Terms of Service</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert('Privacy Policy', 'Coming soon!')}>
                  <View style={styles.settingLeft}>
                    <Icon name="shield-checkmark-outline" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Privacy Policy</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.settingItem, { borderBottomWidth: 0 }]} onPress={() => Alert.alert('Contact Us', 'For support, please email support@threatsense.app')}>
                  <View style={styles.settingLeft}>
                    <Icon name="mail-outline" size={20} color="#A070F2" />
                    <Text style={styles.settingText}>Contact Us</Text>
                  </View>
                  <Icon name="chevron-forward" size={20} color="#555" />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
    sheetContainer: {
      flex: 1,
      backgroundColor: '#1E1E1E',
    },
    header: {
      paddingVertical: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#333',
      alignItems: 'center',
    },
    headerTitle: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    content: {
      paddingHorizontal: 16,
    },
    section: {
      marginTop: 24,
    },
    sectionTitle: {
      color: '#8A8A8E',
      fontSize: 13,
      fontWeight: '600',
      textTransform: 'uppercase',
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    settingsGroup: {
      backgroundColor: '#2C2C2E',
      borderRadius: 10,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: '#3A3A3C',
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
    settingText: {
      color: '#fff',
      fontSize: 17,
      marginLeft: 12,
    },
    settingValue: {
      color: '#8A8A8E',
      fontSize: 17,
    },
  });
  
export default SettingsSheet; 