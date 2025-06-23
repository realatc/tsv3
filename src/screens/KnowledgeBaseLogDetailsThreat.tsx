import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'threat-levels', title: 'Threat Levels', level: 1 },
  { id: 'high-threat', title: 'High Threat', level: 2 },
  { id: 'medium-threat', title: 'Medium Threat', level: 2 },
  { id: 'low-threat', title: 'Low Threat', level: 2 },
  { id: 'safe', title: 'Safe', level: 2 },
  { id: 'threat-categories', title: 'Threat Categories', level: 1 },
  { id: 'phishing', title: 'Phishing', level: 2 },
  { id: 'malware', title: 'Malware', level: 2 },
  { id: 'scam', title: 'Scam', level: 2 },
  { id: 'spam', title: 'Spam', level: 2 },
  { id: 'suspicious', title: 'Suspicious', level: 2 },
  { id: 'understanding-analysis', title: 'Understanding the Analysis', level: 1 },
  { id: 'ai-detection', title: 'AI Detection', level: 2 },
  { id: 'pattern-matching', title: 'Pattern Matching', level: 2 },
  { id: 'behavioral-analysis', title: 'Behavioral Analysis', level: 2 },
  { id: 'what-to-do', title: 'What to Do', level: 1 },
  { id: 'high-risk-actions', title: 'High Risk Actions', level: 2 },
  { id: 'medium-risk-actions', title: 'Medium Risk Actions', level: 2 },
  { id: 'low-risk-actions', title: 'Low Risk Actions', level: 2 },
  { id: 'tips', title: 'Tips', level: 1 },
];

const articleContent = {
  overview: {
    title: 'Overview',
    content: `This tab shows the threat analysis results for the message.`
  },
  'threat-levels': {
    title: 'Threat Levels',
    content: `ThreatSense categorizes threats into different levels based on risk assessment.`
  },
  'high-threat': {
    title: 'High Threat',
    content: `Immediate danger. Multiple red flags detected. Do not interact with the message or sender.`
  },
  'medium-threat': {
    title: 'Medium Threat',
    content: `Suspicious activity detected. Exercise caution and verify before proceeding.`
  },
  'low-threat': {
    title: 'Low Threat',
    content: `Minor concerns detected. Proceed with normal caution.`
  },
  safe: {
    title: 'Safe',
    content: `No threats detected. Message appears to be legitimate.`
  },
  'threat-categories': {
    title: 'Threat Categories',
    content: `ThreatSense identifies specific types of threats in messages.`
  },
  phishing: {
    title: 'Phishing',
    content: `Attempts to steal personal information by impersonating legitimate organizations.`
  },
  malware: {
    title: 'Malware',
    content: `Contains or links to malicious software designed to harm your device.`
  },
  scam: {
    title: 'Scam',
    content: `Fraudulent schemes designed to trick you into losing money or information.`
  },
  spam: {
    title: 'Spam',
    content: `Unwanted bulk messages, often commercial in nature.`
  },
  suspicious: {
    title: 'Suspicious',
    content: `Unusual or potentially dangerous content that doesn't fit other categories.`
  },
  'understanding-analysis': {
    title: 'Understanding the Analysis',
    content: `How ThreatSense determines threat levels and categories.`
  },
  'ai-detection': {
    title: 'AI Detection',
    content: `Advanced AI models analyze message content for suspicious patterns and language.`
  },
  'pattern-matching': {
    title: 'Pattern Matching',
    content: `Compares against known threat patterns and scam templates.`
  },
  'behavioral-analysis': {
    title: 'Behavioral Analysis',
    content: `Analyzes sender behavior and communication patterns for anomalies.`
  },
  'what-to-do': {
    title: 'What to Do',
    content: `Recommended actions based on the threat level detected.`
  },
  'high-risk-actions': {
    title: 'High Risk Actions',
    content: `Block sender, delete message, report threat, do not click any links or provide information.`
  },
  'medium-risk-actions': {
    title: 'Medium Risk Actions',
    content: `Verify sender independently, check links before clicking, be cautious with personal information.`
  },
  'low-risk-actions': {
    title: 'Low Risk Actions',
    content: `Proceed with normal caution, verify unusual requests, report if suspicious.`
  },
  tips: {
    title: 'Tips',
    content: `1. Always check threat level before interacting. 2. High threat means immediate danger. 3. Medium threat requires verification. 4. Low threat still needs caution. 5. Report threats to help others.`
  },
};

const KnowledgeBaseLogDetailsThreat = () => (
  <KnowledgeBaseArticleTemplate
    pageTitle="Knowledge Base"
    articleTitle="Log Details: Threat Tab"
    IconComponent={<Icon name="warning-outline" size={40} color="#FF5722" />}
    tableOfContents={tableOfContents}
    articleContent={articleContent}
    themeColor="#FF5722"
  />
);

export default KnowledgeBaseLogDetailsThreat; 