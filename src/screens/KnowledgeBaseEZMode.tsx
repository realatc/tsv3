import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';

type KnowledgeBaseEZModeNavigationProp = StackNavigationProp<RootStackParamList, 'KnowledgeBaseEZMode'>;

const KnowledgeBaseEZMode = () => {
  const navigation = useNavigation<KnowledgeBaseEZModeNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EZ-Mode Guide</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.articleContainer}>
          <View style={styles.titleSection}>
            <Icon name="flash" size={48} color="#A070F2" style={styles.titleIcon} />
            <Text style={styles.title}>How to Use EZ-Mode</Text>
            <Text style={styles.subtitle}>Simplified interface for easier navigation</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What is EZ-Mode?</Text>
            <Text style={styles.bodyText}>
              EZ-Mode is a simplified interface designed to make ThreatSense easier to use. 
              It provides a streamlined experience with fewer options and clearer navigation.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Features</Text>
            
            <View style={styles.featureItem}>
              <Icon name="search" size={24} color="#A070F2" style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Live Text Analyzer</Text>
                <Text style={styles.featureDescription}>
                  Type or paste any text in the search bar to instantly analyze it for potential threats.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Icon name="time" size={24} color="#A070F2" style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Recent Activity</Text>
                <Text style={styles.featureDescription}>
                  View your 3 most recent threat analyses at a glance.
                </Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <Icon name="person-circle" size={24} color="#A070F2" style={styles.featureIcon} />
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Quick Settings</Text>
                <Text style={styles.featureDescription}>
                  Access settings and trusted contacts through the profile icon.
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How to Enable/Disable</Text>
            <Text style={styles.bodyText}>
              1. Tap the profile icon in the top right{'\n'}
              2. Select "Settings"{'\n'}
              3. Toggle "EZ-Mode" on or off{'\n'}
              4. The app will automatically switch between interfaces
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>When to Use EZ-Mode</Text>
            <Text style={styles.bodyText}>
              • If you're new to ThreatSense{'\n'}
              • When you want a simpler, less cluttered interface{'\n'}
              • For quick threat analysis without advanced features{'\n'}
              • When helping others who prefer simplicity
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Getting Help</Text>
            <Text style={styles.bodyText}>
              If you need assistance with EZ-Mode or want to switch back to the full interface, 
              you can always access the full settings through the profile icon.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#2A2A2A',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  articleContainer: {
    padding: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#ccc',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  featureIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: '#ccc',
  },
});

export default KnowledgeBaseEZMode; 