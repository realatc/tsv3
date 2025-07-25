import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useTheme } from '../context/ThemeContext';

const KnowledgeBaseLogDetailsSecurity = () => {
  const { theme } = useTheme();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'nlp-analysis', title: 'NLP Analysis', level: 1 },
    { id: 'behavioral-analysis', title: 'Behavioral Analysis', level: 1 },
    { id: 'url-safety', title: 'URL Safety Check', level: 1 },
    { id: 'how-analysis-works', title: 'How This Analysis Works', level: 1 },
    { id: 'ai-detection', title: 'AI-Powered Detection', level: 2 },
    { id: 'real-time-db', title: 'Real-Time Database Checks', level: 2 },
    { id: 'pattern-recognition', title: 'Behavioral Pattern Recognition', level: 2 },
    { id: 'understanding-results', title: 'Understanding the Results', level: 1 },
    { id: 'high-risk', title: 'High-Risk Indicators', level: 2 },
    { id: 'false-positives', title: 'False Positives', level: 2 },
    { id: 'what-to-do', title: 'What to Do Based on Analysis', level: 1 },
    { id: 'high-risk-messages', title: 'High-Risk Messages', level: 2 },
    { id: 'medium-risk-messages', title: 'Medium-Risk Messages', level: 2 },
    { id: 'low-risk-messages', title: 'Low-Risk Messages', level: 2 },
    { id: 'tips', title: 'Tips for Using This Tab', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: `This tab provides a detailed breakdown of the security analysis.`
    },
    'nlp-analysis': {
      title: 'NLP Analysis',
      content: `AI-powered Natural Language Processing analyzes the text for suspicious patterns: urgent language, authority impersonation, pressure tactics, suspicious requests, emotional manipulation.`
    },
    'behavioral-analysis': {
      title: 'Behavioral Analysis',
      content: `Compares the sender and message against known threat patterns and your contact history: sender reputation, domain analysis, pattern matching, timing analysis.`
    },
    'url-safety': {
      title: 'URL Safety Check',
      content: `Real-time analysis of any links found in the message. Each URL is checked against Google Safe Browsing API's database of known malicious sites. Safety levels: Safe, Uncommon, Phishing, Malware, Unknown.`
    },
    'how-analysis-works': {
      title: 'How This Analysis Works',
      content: `ThreatSense uses advanced AI models trained on millions of scam examples to recognize suspicious language, identify impersonation, detect manipulation, and flag unusual requests.`
    },
    'ai-detection': {
      title: 'AI-Powered Detection',
      content: `Recognizes suspicious language patterns, identifies impersonation attempts, detects emotional manipulation, flags unusual requests.`
    },
    'real-time-db': {
      title: 'Real-Time Database Checks',
      content: `Every URL is checked against Google's Safe Browsing, phishing site databases, malware networks, and suspicious domain registrations.`
    },
    'pattern-recognition': {
      title: 'Behavioral Pattern Recognition',
      content: `Learns from your contact history, known scam patterns, community reports, and security research.`
    },
    'understanding-results': {
      title: 'Understanding the Results',
      content: `High-risk indicators: multiple red flags, pattern matches, unusual behavior, suspicious timing. False positives: legitimate messages flagged due to urgent language, new senders, new websites, or similar language to scams.`
    },
    'high-risk': {
      title: 'High-Risk Indicators',
      content: `Multiple red flags, pattern matches, unusual behavior, suspicious timing.`
    },
    'false-positives': {
      title: 'False Positives',
      content: `Legitimate messages may be flagged as suspicious for various reasons.`
    },
    'what-to-do': {
      title: 'What to Do Based on Analysis',
      content: `Guidance for high, medium, and low-risk messages.`
    },
    'high-risk-messages': {
      title: 'High-Risk Messages',
      content: `Don't click links, don't provide info, block sender, report, delete.`
    },
    'medium-risk-messages': {
      title: 'Medium-Risk Messages',
      content: `Verify sender, check links, be cautious, monitor for similar threats.`
    },
    'low-risk-messages': {
      title: 'Low-Risk Messages',
      content: `Still be cautious, verify unusual requests, report if suspicious.`
    },
    tips: {
      title: 'Tips for Using This Tab',
      content: `1. Read both analyses. 2. Check URL safety. 3. Look for patterns. 4. Trust your instincts. 5. Report threats.`
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Log Details: Security Tab"
      IconComponent={<Icon name="shield-checkmark-outline" size={40} color={theme.warning} />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor={theme.warning}
    />
  );
};

export default KnowledgeBaseLogDetailsSecurity; 