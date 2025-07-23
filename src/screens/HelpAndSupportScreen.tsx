import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type HelpAndSupportScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HelpAndSupport'>;

const HelpAndSupportScreen = () => {
  const navigation = useNavigation<HelpAndSupportScreenNavigationProp>();

  const helpSections = [
    {
      title: 'Getting Started',
      items: [
        {
          title: 'How to use EZ-Mode',
          description: 'Learn about the simplified interface for easier navigation',
          icon: 'flash',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'HomeScreen' } })
        },
        {
          title: 'Setting up Sentry Mode',
          description: 'Configure trusted contacts and threat alerts',
          icon: 'shield-checkmark',
          onPress: () => navigation.navigate('SentryMode')
        },
        {
          title: 'Understanding Threat Levels',
          description: 'Learn about Low, Medium, High, and Critical threats',
          icon: 'alert-circle',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Library', params: { screen: 'KnowledgeBaseThreatLevelArticle' } })
        }
      ]
    },
    {
      title: 'Features',
      items: [
        {
          title: 'Live Text Analyzer',
          description: 'Analyze any text for potential threats',
          icon: 'search',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Browse', params: { screen: 'ThreatAnalysis', params: {} } })
        },
        {
          title: 'Latest Scams',
          description: 'Stay updated on current threats and scams',
          icon: 'alert',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Home', params: { screen: 'LatestScams' } })
        },
        {
          title: 'Knowledge Base',
          description: 'Browse articles and guides about cybersecurity',
          icon: 'library',
          onPress: () => navigation.navigate('MainTabs', { screen: 'Library', params: { screen: 'KnowledgeBase' } })
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          title: 'Contact Support',
          description: 'Get help from our support team',
          icon: 'mail',
          onPress: () => Linking.openURL('mailto:support@threatsense.app')
        },
        {
          title: 'Report a Bug',
          description: 'Help us improve by reporting issues',
          icon: 'bug',
          onPress: () => navigation.navigate('BugReportForm')
        },
        {
          title: 'Privacy Policy',
          description: 'Learn about how we protect your data',
          icon: 'lock-closed',
          onPress: () => navigation.navigate('About')
        }
      ]
    }
  ];

  const renderHelpItem = (item: any) => (
    <TouchableOpacity key={item.title} style={styles.helpItem} onPress={item.onPress}>
      <View style={styles.helpItemIcon}>
        <Icon name={item.icon} size={24} color="#A070F2" />
      </View>
      <View style={styles.helpItemContent}>
        <Text style={styles.helpItemTitle}>{item.title}</Text>
        <Text style={styles.helpItemDescription}>{item.description}</Text>
      </View>
      <Icon name="chevron-forward" size={20} color="#666" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Icon name="help-circle" size={48} color="#A070F2" style={styles.welcomeIcon} />
          <Text style={styles.welcomeTitle}>How can we help you?</Text>
          <Text style={styles.welcomeSubtitle}>
            Find answers to common questions and learn how to use ThreatSense effectively.
          </Text>
        </View>

        {helpSections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map(renderHelpItem)}
            </View>
          </View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>Still need help?</Text>
          <Text style={styles.footerText}>
            Our support team is here to help you stay safe online.
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:support@threatsense.app')}
          >
            <Icon name="mail" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#18181C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  headerSpacer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeIcon: {
    marginBottom: 16,
  },
  welcomeTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#A070F2',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#23232A',
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  helpItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  helpItemContent: {
    flex: 1,
  },
  helpItemTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  helpItemDescription: {
    color: '#B0B0B0',
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  footerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  footerText: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A070F2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HelpAndSupportScreen; 