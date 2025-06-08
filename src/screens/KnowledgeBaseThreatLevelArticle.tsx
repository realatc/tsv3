import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const CREATED_DATE = '2024-05-01';
const UPDATED_DATE = '2024-06-07';

const KnowledgeBaseThreatLevelArticle = () => (
  <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.articleMeta}>
          Created: {CREATED_DATE}  |  Updated: {UPDATED_DATE}
        </Text>
        <Text style={styles.title}>How Threat Levels Are Calculated</Text>
        <Text style={styles.text}>
          The app calculates threat levels for logs using a simple rule-based scoring system. Here's how it works:
        </Text>
        <Text style={styles.sectionTitle}>Inputs Used</Text>
        <Text style={styles.text}>• NLP Analysis: A string describing the content analysis of the message.</Text>
        <Text style={styles.text}>• Behavioral Analysis: A string describing the sender's behavior and context.</Text>
        <Text style={styles.text}>• Sender: The sender's email or phone number.</Text>
        <Text style={styles.sectionTitle}>Scoring Logic</Text>
        <Text style={styles.text}>For each log, the app checks for certain keywords in the NLP and behavioral analysis strings, as well as the sender's address. Points are added to a score based on the following rules:</Text>
        <Text style={styles.text}>NLP Analysis:</Text>
        <Text style={styles.text}>  • If it contains "urgent", "suspicious", or "threat" → +2 points</Text>
        <Text style={styles.text}>  • If it contains "impersonation", "phishing", or "scam" → +2 points</Text>
        <Text style={styles.text}>Behavioral Analysis:</Text>
        <Text style={styles.text}>  • If it contains "not in contacts" → +1 point</Text>
        <Text style={styles.text}>  • If it contains "matches scam" or "matches robocall" → +2 points</Text>
        <Text style={styles.text}>Sender:</Text>
        <Text style={styles.text}>  • If the sender ends with "@fakebank.com", or includes "irs" or "randomsms" → +2 points</Text>
        <Text style={styles.sectionTitle}>Threat Level & Percentage</Text>
        <Text style={styles.text}>• The maximum possible score is 9.</Text>
        <Text style={styles.text}>• The percentage is calculated as: percentage = round((score / 9) * 100)</Text>
        <Text style={styles.text}>• The threat level is assigned as:</Text>
        <Text style={styles.text}>    • High: score ≥ 4</Text>
        <Text style={styles.text}>    • Medium: score ≥ 2 and {'<'} 4</Text>
        <Text style={styles.text}>    • Low: score {'<'} 2</Text>
        <Text style={styles.sectionTitle}>Example</Text>
        <Text style={styles.text}>If a log's NLP analysis is "Urgent language, suspicious link, impersonation detected." and the behavioral analysis is "Sender not in contacts. Matches known phishing patterns." the score would be:</Text>
        <Text style={styles.text}>  • "urgent" → +2</Text>
        <Text style={styles.text}>  • "suspicious" → +2</Text>
        <Text style={styles.text}>  • "impersonation" → +2</Text>
        <Text style={styles.text}>  • "not in contacts" → +1</Text>
        <Text style={styles.text}>  • "matches" (if "matches scam" or "matches robocall") → +2</Text>
        <Text style={styles.text}>  Total: 9 (100%), so the threat level is High.</Text>
        <Text style={styles.sectionTitle}>Summary</Text>
        <Text style={styles.text}>
          The app uses keyword-based scoring from NLP and behavioral analysis strings, plus sender info, to assign a threat level and percentage to each log.
        </Text>
      </ScrollView>
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    padding: 18,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 18,
    marginBottom: 6,
  },
  text: {
    color: '#B0BEC5',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  articleMeta: {
    color: '#90CAF9',
    fontSize: 12,
    marginBottom: 8,
  },
});

export default KnowledgeBaseThreatLevelArticle; 