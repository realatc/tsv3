import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import GitHubService from '../services/githubService';

type BugReportFormNavigationProp = StackNavigationProp<RootStackParamList, 'BugReportForm'>;

const BugReportFormScreen = () => {
  const navigation = useNavigation<BugReportFormNavigationProp>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: '',
    expected: '',
    actual: '',
    additional: '',
  });

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      Alert.alert('Required Fields', 'Please fill in the title and description.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the issue body
      const issueBody = `## Bug Description
${formData.description}

## What you expected to happen
${formData.expected || 'Not specified'}

## What actually happened
${formData.actual || 'Not specified'}

## Steps to Reproduce
${formData.steps || 'Not specified'}

## Additional Information
${formData.additional || 'None'}

## Device Information
- Device: iOS
- App Version: 1.0.0
- Date: ${new Date().toLocaleDateString()}

---
*This issue was created from the ThreatSense mobile app*`;

      // Try to create GitHub issue directly
      if (GitHubService.isTokenConfigured()) {
        try {
          const issue = {
            title: `Bug Report: ${formData.title}`,
            body: issueBody,
            labels: ['bug', 'mobile-app', 'user-reported']
          };

          const result = await GitHubService.createIssue(issue);
          
          Alert.alert(
            'Bug Report Created!',
            `Your bug report has been successfully created on GitHub!\n\nIssue #${result.number}: ${result.title}\n\nYou can view it at: ${result.html_url}`,
            [
              {
                text: 'View Issue',
                onPress: () => {
                  const { Linking } = require('react-native');
                  Linking.openURL(result.html_url);
                }
              },
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              }
            ]
          );
          return;
        } catch (githubError) {
          console.error('GitHub API failed, falling back to email:', githubError);
          // Fall back to email method
        }
      }

      // Fallback: Use email method
      const subject = encodeURIComponent(`Bug Report: ${formData.title}`);
      const body = encodeURIComponent(issueBody);
      const mailtoUrl = `mailto:bugs@threatsense.app?subject=${subject}&body=${body}`;

      // Try to open email app
      const { Linking } = require('react-native');
      
      try {
        await Linking.openURL(mailtoUrl);
        
        Alert.alert(
          'Bug Report Ready!',
          'Your bug report has been prepared and your email app should open. If it doesn\'t, please email us at bugs@threatsense.app',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } catch (emailError) {
        console.error('Email app not available:', emailError);
        
        // Fallback: Show the formatted bug report and let user copy it
        Alert.alert(
          'Email App Not Available',
          'Your bug report is ready. Please copy the details below and email us at bugs@threatsense.app',
          [
            {
              text: 'Copy Bug Report',
              onPress: async () => {
                // Copy the formatted bug report to clipboard
                const formattedReport = `Bug Report for ThreatSense

Title: ${formData.title}

Description: ${formData.description}

Expected Behavior: ${formData.expected || 'Not specified'}

Actual Behavior: ${formData.actual || 'Not specified'}

Steps to Reproduce: ${formData.steps || 'Not specified'}

Additional Information: ${formData.additional || 'None'}

Device: iOS
App Version: 1.0.0
Date: ${new Date().toLocaleDateString()}

---
Please email this report to: bugs@threatsense.app`;

                try {
                  await Clipboard.setString(formattedReport);
                  Alert.alert(
                    'Bug Report Copied!',
                    'Your bug report has been copied to your clipboard. Please paste it into an email and send to bugs@threatsense.app',
                    [
                      { text: 'OK', onPress: () => navigation.goBack() }
                    ]
                  );
                } catch (clipboardError) {
                  console.error('Clipboard error:', clipboardError);
                  Alert.alert(
                    'Copy Failed',
                    'Please manually copy the bug report details and email to bugs@threatsense.app',
                    [
                      { text: 'OK', onPress: () => navigation.goBack() }
                    ]
                  );
                }
              }
            },
            {
              text: 'Cancel',
              style: 'cancel'
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      Alert.alert(
        'Submission Error',
        'There was an error submitting your bug report. Please try again or email us directly at bugs@threatsense.app'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report a Bug</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.iconContainer}>
            <Icon name="bug" size={48} color="#A070F2" />
          </View>
          
          <Text style={styles.title}>Help Us Improve ThreatSense</Text>
          <Text style={styles.subtitle}>
            Please provide as much detail as possible to help us fix this issue quickly.
          </Text>

          <View style={styles.section}>
            <Text style={styles.label}>Bug Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Brief description of the bug"
              placeholderTextColor="#666"
              value={formData.title}
              onChangeText={(text) => updateFormData('title', text)}
              maxLength={100}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Bug Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what happened in detail"
              placeholderTextColor="#666"
              value={formData.description}
              onChangeText={(text) => updateFormData('description', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>What did you expect to happen?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what you expected to see or happen"
              placeholderTextColor="#666"
              value={formData.expected}
              onChangeText={(text) => updateFormData('expected', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>What actually happened?</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe what actually happened instead"
              placeholderTextColor="#666"
              value={formData.actual}
              onChangeText={(text) => updateFormData('actual', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Steps to Reproduce</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="1. First step&#10;2. Second step&#10;3. Third step"
              placeholderTextColor="#666"
              value={formData.steps}
              onChangeText={(text) => updateFormData('steps', text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Additional Information</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any other details that might help us understand the issue"
              placeholderTextColor="#666"
              value={formData.additional}
              onChangeText={(text) => updateFormData('additional', text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Submit Bug Report</Text>
              </>
            )}
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            * Required fields. Your bug report will be sent to our development team for review.
          </Text>
          
          {!GitHubService.isTokenConfigured() && (
            <View style={styles.tokenWarning}>
              <Icon name="warning" size={16} color="#FFD700" />
              <Text style={styles.tokenWarningText}>
                GitHub integration not configured. Reports will be sent via email.
              </Text>
            </View>
          )}
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
  form: {
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#B0B0B0',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#23232A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#A070F2',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  disclaimer: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  tokenWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2A2A2A',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  tokenWarningText: {
    color: '#FFD700',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
});

export default BugReportFormScreen; 