import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const AboutScreen = () => (
  <LinearGradient colors={['#1a237e', '#000000']} style={{ flex: 1 }}>
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>About ThreatSense</Text>
        <Text style={styles.sectionTitle}>What is ThreatSense?</Text>
        <Text style={styles.text}>
          ThreatSense is a modern security platform designed to help you monitor, detect, and respond to digital threats across your communication channels. Whether it's suspicious emails, texts, or phone calls, ThreatSense provides real-time analysis and actionable insights to keep you safe.
        </Text>
        <Text style={styles.sectionTitle}>How does it work?</Text>
        <Text style={styles.text}>
          ThreatSense uses advanced algorithms and threat intelligence to scan your incoming messages and calls. It categorizes each event (Mail, Text, Phone Call) and assigns a threat level based on known patterns, sender reputation, and content analysis. You can review your log history, get notified of high-risk events, and learn how to protect yourself from evolving threats.
        </Text>
        <Text style={styles.sectionTitle}>Key Features</Text>
        <Text style={styles.text}>
          • Real-time threat detection for mail, text, and phone calls.{"\n"}
          • Easy-to-read log history with threat levels.{"\n"}
          • Secure, privacy-focused design—your data stays on your device.{"\n"}
          • Simple navigation and beautiful dark theme.
        </Text>
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.text}>
          We believe everyone deserves digital peace of mind. ThreatSense is built to empower you with the tools and knowledge to stay ahead of cyber threats in your daily life.
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
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  sectionTitle: {
    color: '#4A90E2',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 18,
    marginBottom: 8,
  },
  text: {
    color: '#B0BEC5',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
});

export default AboutScreen; 