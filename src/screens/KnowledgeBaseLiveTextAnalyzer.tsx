import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

type KnowledgeBaseLiveTextAnalyzerNavigationProp = StackNavigationProp<
  RootStackParamList,
  'KnowledgeBaseLiveTextAnalyzer'
>;

const KnowledgeBaseLiveTextAnalyzer = () => {
  const navigation = useNavigation<KnowledgeBaseLiveTextAnalyzerNavigationProp>();

  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Live Text Analyzer</Text>
          <View style={styles.placeholder} />
        </View>
        
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.titleSection}>
              <View style={styles.iconContainer}>
                <Icon name="scan-outline" size={32} color="#00BCD4" />
              </View>
              <Text style={styles.title}>Live Text Analyzer: How It Works</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Text style={styles.bodyText}>
                The Live Text Analyzer is a powerful AI-powered tool that scans text content in real-time to identify potential security threats, scams, and malicious content. It provides instant threat assessments with actionable recommendations to help you stay safe online.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How It Works</Text>
              
              <Text style={styles.subsectionTitle}>1. Text Input Processing</Text>
              <Text style={styles.bodyText}>
                When you paste text into the analyzer:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• The system processes your input through advanced natural language processing</Text>
                <Text style={styles.bulletPoint}>• It analyzes the content for suspicious patterns, keywords, and contextual clues</Text>
                <Text style={styles.bulletPoint}>• Multiple threat detection algorithms work simultaneously to assess risk</Text>
              </View>

              <Text style={styles.subsectionTitle}>2. AI-Powered Analysis</Text>
              <Text style={styles.bodyText}>
                The analyzer uses <Text style={styles.highlight}>Perplexity AI</Text> with the <Text style={styles.code}>llama-3.1-sonar-small-128k-online</Text> model to:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• Evaluate text for phishing attempts, scams, and malicious content</Text>
                <Text style={styles.bulletPoint}>• Identify social engineering tactics and urgency indicators</Text>
                <Text style={styles.bulletPoint}>• Detect suspicious URLs, phone numbers, and contact information</Text>
                <Text style={styles.bulletPoint}>• Analyze language patterns associated with fraud and deception</Text>
              </View>

              <Text style={styles.subsectionTitle}>3. Threat Intelligence Integration</Text>
              <Text style={styles.bodyText}>
                The system leverages real-time threat intelligence from:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Perplexity AI's Knowledge Base</Text>: Access to current threat data and scam patterns</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Cybersecurity Databases</Text>: Information about known malicious entities</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Real-time Web Search</Text>: Latest information about emerging threats</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pattern Recognition</Text>: AI models trained on millions of scam examples</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Threat Level Grading System</Text>
              <Text style={styles.bodyText}>
                The analyzer uses a 5-tier threat assessment system:
              </Text>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#F44336' }]}>
                  <Icon name="warning" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#F44336' }]}>CRITICAL (Red)</Text>
                  <Text style={styles.threatDescription}>Immediate action required</Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletPoint}>• Confirmed phishing attempts</Text>
                    <Text style={styles.bulletPoint}>• Known scam patterns</Text>
                    <Text style={styles.bulletPoint}>• Requests for sensitive information</Text>
                    <Text style={styles.bulletPoint}>• Suspicious payment requests</Text>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#FF9800' }]}>
                  <Icon name="alert" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#FF9800' }]}>HIGH (Orange)</Text>
                  <Text style={styles.threatDescription}>High risk - proceed with extreme caution</Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletPoint}>• Strong indicators of malicious intent</Text>
                    <Text style={styles.bulletPoint}>• Urgency tactics and pressure techniques</Text>
                    <Text style={styles.bulletPoint}>• Suspicious URLs or attachments</Text>
                    <Text style={styles.bulletPoint}>• Offers that seem too good to be true</Text>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#FFC107' }]}>
                  <Icon name="help-circle" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#FFC107' }]}>MEDIUM (Yellow)</Text>
                  <Text style={styles.threatDescription}>Moderate risk - exercise caution</Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletPoint}>• Some suspicious elements present</Text>
                    <Text style={styles.bulletPoint}>• Unusual language or formatting</Text>
                    <Text style={styles.bulletPoint}>• Requests for personal information</Text>
                    <Text style={styles.bulletPoint}>• Links to unfamiliar websites</Text>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#4CAF50' }]}>
                  <Icon name="checkmark-circle" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#4CAF50' }]}>LOW (Green)</Text>
                  <Text style={styles.threatDescription}>Minimal risk - standard precautions</Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletPoint}>• No obvious threats detected</Text>
                    <Text style={styles.bulletPoint}>• Standard communication patterns</Text>
                    <Text style={styles.bulletPoint}>• Familiar senders and contexts</Text>
                    <Text style={styles.bulletPoint}>• No suspicious requests or links</Text>
                  </View>
                </View>
              </View>

              <View style={styles.threatLevel}>
                <View style={[styles.threatIcon, { backgroundColor: '#9E9E9E' }]}>
                  <Icon name="shield-checkmark" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.threatContent}>
                  <Text style={[styles.threatTitle, { color: '#9E9E9E' }]}>NONE (White)</Text>
                  <Text style={styles.threatDescription}>No threats detected</Text>
                  <View style={styles.bulletList}>
                    <Text style={styles.bulletPoint}>• Clean, legitimate content</Text>
                    <Text style={styles.bulletPoint}>• Normal communication patterns</Text>
                    <Text style={styles.bulletPoint}>• No suspicious elements identified</Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What the Analyzer Looks For</Text>
              
              <Text style={styles.subsectionTitle}>Red Flags & Indicators</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Urgency Tactics</Text>: "Act now," "Limited time," "Immediate action required"</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Authority Impersonation</Text>: Claims to be from banks, government agencies, tech support</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Sensitive Data Requests</Text>: Passwords, credit card numbers, Social Security numbers</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Suspicious URLs</Text>: Slightly misspelled domains, unusual TLDs, redirect chains</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Unusual Language</Text>: Grammatical errors, inconsistent formatting, foreign language mixed in</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Too-Good-to-Be-True Offers</Text>: Free money, prizes, unexpected refunds</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pressure Tactics</Text>: Threats, deadlines, emotional manipulation</Text>
              </View>

              <Text style={styles.subsectionTitle}>Technical Analysis</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>URL Analysis</Text>: Checks against known malicious domains and phishing databases</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pattern Recognition</Text>: Identifies common scam templates and social engineering techniques</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Context Analysis</Text>: Evaluates the relationship between sender and recipient</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Temporal Analysis</Text>: Considers timing and frequency of communications</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Cross-Reference</Text>: Compares against known threat intelligence databases</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Data Sources & Intelligence</Text>
              
              <Text style={styles.subsectionTitle}>Real-Time Threat Intelligence</Text>
              <Text style={styles.bodyText}>
                The analyzer connects to multiple data sources:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Perplexity AI Knowledge Base</Text>: Current threat information and scam patterns</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Google Safe Browsing API</Text>: Real-time URL safety checking</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Cybersecurity Feeds</Text>: Latest threat intelligence from security researchers</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Community Reports</Text>: User-submitted scam reports and patterns</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>AI Training Data</Text>: Millions of examples of legitimate vs. malicious content</Text>
              </View>

              <Text style={styles.subsectionTitle}>Continuous Learning</Text>
              <Text style={styles.bodyText}>
                The system continuously improves through:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Machine Learning</Text>: Adapts to new threat patterns and techniques</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>User Feedback</Text>: Learns from user reports and corrections</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Threat Evolution</Text>: Updates to counter new scam tactics</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Pattern Recognition</Text>: Identifies emerging threat trends</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Privacy & Security</Text>
              
              <Text style={styles.subsectionTitle}>Data Protection</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>No Data Storage</Text>: Your text is not stored or saved after analysis</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Secure Processing</Text>: All analysis happens through encrypted API connections</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Privacy First</Text>: No personal information is collected or shared</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Local Processing</Text>: Sensitive content is processed securely without logging</Text>
              </View>

              <Text style={styles.subsectionTitle}>API Security</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Encrypted Communication</Text>: All API calls use HTTPS encryption</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Secure Authentication</Text>: API keys are protected and rotated regularly</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Rate Limiting</Text>: Prevents abuse and ensures fair usage</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Error Handling</Text>: Graceful fallbacks if services are unavailable</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Technical Specifications</Text>
              
              <Text style={styles.subsectionTitle}>AI Model Details</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Model</Text>: llama-3.1-sonar-small-128k-online</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Temperature</Text>: 0.0 (for consistent results)</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Max Tokens</Text>: 1000</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Response Time</Text>: Typically 2-5 seconds</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Accuracy</Text>: Continuously improving through machine learning</Text>
              </View>

              <Text style={styles.subsectionTitle}>System Requirements</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Internet Connection</Text>: Required for real-time analysis</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>API Access</Text>: Perplexity AI integration for threat intelligence</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Processing Power</Text>: Minimal - runs on mobile devices efficiently</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Limitations & Considerations</Text>
              
              <Text style={styles.subsectionTitle}>What the Analyzer Cannot Do</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>100% Guarantee</Text>: No system can catch every possible threat</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Context Awareness</Text>: May not understand complex personal relationships</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Evolving Threats</Text>: New scam techniques may not be immediately detected</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Language Limitations</Text>: Works best with English content</Text>
              </View>

              <Text style={styles.subsectionTitle}>False Positives/Negatives</Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>False Positives</Text>: Legitimate content may be flagged as suspicious</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>False Negatives</Text>: Some sophisticated threats may not be detected</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Context Dependence</Text>: Results depend on the quality of input text</Text>
                <Text style={styles.bulletPoint}>• <Text style={styles.highlight}>Timing</Text>: New threats may not be immediately recognized</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                The Live Text Analyzer is designed to be your first line of defense against online threats. While it provides valuable insights, always use your judgment and verify information through trusted sources when dealing with sensitive matters.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#00BCD422',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subsectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  bodyText: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginLeft: 8,
    marginBottom: 12,
  },
  bulletPoint: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  highlight: {
    color: '#00BCD4',
    fontWeight: '600',
  },
  code: {
    color: '#FF9800',
    fontFamily: 'monospace',
    backgroundColor: '#333',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  threatLevel: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#333',
  },
  threatIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  threatContent: {
    flex: 1,
  },
  threatTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  threatDescription: {
    color: '#B0B0B0',
    fontSize: 14,
    marginBottom: 8,
  },
  footer: {
    marginTop: 32,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00BCD4',
  },
  footerText: {
    color: '#E0E0E0',
    fontSize: 14,
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default KnowledgeBaseLiveTextAnalyzer; 