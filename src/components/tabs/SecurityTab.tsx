import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, Modal, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';

type SecurityTabNavigationProp = StackNavigationProp<RootStackParamList>;

type SecurityTabProps = {
  log: any;
  urls: string[];
  urlSafety: { [url: string]: string };
};

export const SecurityTab = ({ log, urls, urlSafety }: SecurityTabProps) => {
  const navigation = useNavigation<SecurityTabNavigationProp>();
  const { theme } = useTheme();
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [showUrlWarning, setShowUrlWarning] = useState(false);
  const [showUrlHelp, setShowUrlHelp] = useState(false);

  const handleUrlPress = (url: string) => {
    const status = urlSafety[url];
    if (status === 'safe') {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    } else if (status === 'malware' || status === 'phishing' || status === 'uncommon' || status === 'unknown') {
      setPendingUrl(url);
      setShowUrlWarning(true);
    } else {
      Linking.openURL(url.startsWith('http') ? url : `https://${url}`);
    }
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 18,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    sectionTitle: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 18,
    },
    label: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: 10,
    },
    value: {
      color: theme.text,
      fontSize: 16,
      marginBottom: 10,
    },
    helpButton: {
      padding: 4,
    },
    helpIconButton: {
      marginLeft: 8,
    },
    urlText: {
      color: theme.primary,
      textDecorationLine: 'underline',
      fontSize: 16,
    },
    statusBadge: {
      borderRadius: 12,
      paddingVertical: 4,
      paddingHorizontal: 10,
      marginLeft: 10,
    },
    statusBadgeText: {
      color: theme.text,
      fontWeight: 'bold',
      fontSize: 12,
    },
    helpModalOverlay: {
      flex: 1,
      backgroundColor: theme.overlay,
      justifyContent: 'center',
      alignItems: 'center',
    },
    helpModalContent: {
      backgroundColor: theme.surface,
      borderRadius: 12,
      padding: 22,
      width: '85%',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    helpModalTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 12,
    },
    helpModalText: {
      color: theme.text,
      fontSize: 16,
      textAlign: 'center',
      marginBottom: 8,
    },
    helpModalButton: {
      backgroundColor: theme.primary,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    helpModalButtonText: {
      color: theme.text,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.card}>
      <View style={styles.titleContainer}>
        <Text style={styles.sectionTitle}>Analysis</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('MainTabs', { 
            screen: 'Library',
            params: { 
              screen: 'KnowledgeBaseLogDetailsSecurity',
              params: { log }
            }
          })}
          style={styles.helpButton}
        >
          <Icon name="information-circle-outline" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>NLP Analysis</Text>
      <Text style={styles.value}>{log.nlpAnalysis}</Text>
      <Text style={styles.label}>Behavioral Analysis</Text>
      <Text style={styles.value}>{log.behavioralAnalysis}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
        <Text style={styles.label}>URL Safety Check</Text>
        <Pressable onPress={() => setShowUrlHelp(true)} style={styles.helpIconButton} hitSlop={8}>
          <Icon name="help-circle-outline" size={18} color={theme.primary} />
        </Pressable>
      </View>
      {urls.length > 0 ? (
        urls.map((url, idx) => (
          <View key={idx} style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => handleUrlPress(url)} style={{ flex: 1 }}>
              <Text style={styles.urlText}>{url}</Text>
            </TouchableOpacity>
            {urlSafety[url] && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      urlSafety[url] === 'loading' ? theme.textSecondary
                      : urlSafety[url] === 'safe' ? theme.success
                      : urlSafety[url] === 'malware' ? theme.error
                      : urlSafety[url] === 'phishing' ? theme.warning
                      : urlSafety[url] === 'uncommon' ? theme.warning
                      : theme.textTertiary,
                  },
                ]}
              >
                <Text style={styles.statusBadgeText}>
                  {urlSafety[url].charAt(0).toUpperCase() + urlSafety[url].slice(1)}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.value}>No URLs found in message.</Text>
      )}

      {/* Warning Modals */}
      <Modal visible={showUrlWarning} animationType="fade" transparent onRequestClose={() => setShowUrlWarning(false)}>
        <View style={styles.helpModalOverlay}>
          <View style={styles.helpModalContent}>
            <Text style={styles.helpModalTitle}>Warning: Unsafe Link</Text>
            <Text style={styles.helpModalText}>This link may be dangerous. Are you sure you want to open it?</Text>
            <Text style={styles.helpModalText}>{pendingUrl}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 18 }}>
              <TouchableOpacity style={[styles.helpModalButton, { backgroundColor: theme.error, marginRight: 12 }]} onPress={() => setShowUrlWarning(false)}>
                <Text style={styles.helpModalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.helpModalButton} onPress={() => {
                if (pendingUrl) Linking.openURL(pendingUrl.startsWith('http') ? pendingUrl : `https://${pendingUrl}`);
                setShowUrlWarning(false);
              }}>
                <Text style={styles.helpModalButtonText}>Proceed</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={showUrlHelp} animationType="fade" transparent onRequestClose={() => setShowUrlHelp(false)}>
        <View style={styles.helpModalOverlay}>
          <View style={styles.helpModalContent}>
            <Text style={styles.helpModalTitle}>URL Safety Check</Text>
            <Text style={styles.helpModalText}>
              URLs are checked against Google's Safe Browsing service to detect malware, phishing, and other threats.
            </Text>
            <TouchableOpacity style={styles.helpModalButton} onPress={() => setShowUrlHelp(false)}>
              <Text style={styles.helpModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}; 