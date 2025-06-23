import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'tabs', title: 'Tabs Overview', level: 1 },
  { id: 'general-tab', title: 'General Tab', level: 2 },
  { id: 'security-tab', title: 'Security Tab', level: 2 },
  { id: 'metadata-tab', title: 'Metadata Tab', level: 2 },
  { id: 'threat-tab', title: 'Threat Tab', level: 2 },
  { id: 'analysis', title: 'How the Analysis Works', level: 1 },
  { id: 'multi-layer', title: 'Multi-Layer Detection', level: 2 },
  { id: 'real-vs-historical', title: 'Real-Time vs. Historical Data', level: 2 },
  { id: 'how-to-use', title: 'How to Use the Log Details Screen', level: 1 },
  { id: 'step-general', title: 'Step 1: General Tab', level: 2 },
  { id: 'step-security', title: 'Step 2: Security Tab', level: 2 },
  { id: 'step-metadata', title: 'Step 3: Metadata Tab', level: 2 },
  { id: 'step-threat', title: 'Step 4: Threat Tab', level: 2 },
  { id: 'decisions', title: 'Making Informed Decisions', level: 1 },
  { id: 'high-risk', title: 'High-Risk Threats', level: 2 },
  { id: 'medium-risk', title: 'Medium-Risk Threats', level: 2 },
  { id: 'low-risk', title: 'Low-Risk Threats', level: 2 },
  { id: 'false-positives', title: 'Understanding False Positives', level: 1 },
  { id: 'privacy', title: 'Privacy and Security', level: 1 },
  { id: 'data-collection', title: 'Data Collection', level: 2 },
  { id: 'tips', title: 'Tips for Effective Use', level: 1 },
  { id: 'pattern-recognition', title: 'Pattern Recognition', level: 2 },
  { id: 'continuous-learning', title: 'Continuous Learning', level: 2 },
  { id: 'help', title: 'Getting Help', level: 1 },
  { id: 'when-to-seek', title: 'When to Seek Additional Help', level: 2 },
  { id: 'resources', title: 'Available Resources', level: 2 },
];

const articleContent = {
  overview: {
    title: 'Overview',
    content: `The Log Details Screen is your comprehensive threat analysis dashboard. When ThreatSense detects a potential threat, this screen provides you with complete information about what was detected, how it was analyzed, and what you should do about it.`
  },
  tabs: {
    title: 'Tabs Overview',
    content: `The Log Details Screen is organized into four main tabs, each providing different perspectives on the threat.`
  },
  'general-tab': {
    title: 'General Tab',
    content: `Essential facts about the threat: date, sender information, message content, and category.`
  },
  'security-tab': {
    title: 'Security Tab',
    content: `AI and security system analysis: NLP analysis, behavioral analysis, and URL safety checks.`
  },
  'metadata-tab': {
    title: 'Metadata Tab',
    content: `Technical details: device info, location, timing, and detection methods.`
  },
  'threat-tab': {
    title: 'Threat Tab',
    content: `Overall threat evaluation and scoring: threat level, risk score, and detailed breakdown.`
  },
  analysis: {
    title: 'How the Analysis Works',
    content: `ThreatSense uses multiple analysis methods to evaluate threats.`
  },
  'multi-layer': {
    title: 'Multi-Layer Detection',
    content: `1. Content Analysis (NLP): AI-powered text analysis, identifies suspicious language patterns, detects impersonation attempts, flags emotional manipulation tactics.\n2. Behavioral Analysis: Compares sender against your contact history, analyzes communication patterns, matches against known threat templates, evaluates timing and context.\n3. Technical Analysis: URL safety checks via Google Safe Browsing, domain reputation analysis, attachment and link analysis, network and device context.\n4. Risk Scoring: Combines all analysis results, assigns numerical risk scores, provides actionable recommendations, tracks threat patterns over time.`
  },
  'real-vs-historical': {
    title: 'Real-Time vs. Historical Data',
    content: `The screen shows both current and historical information.\nReal-Time Analysis: Current URL extraction and safety checks, live threat assessment, up-to-date sender information, current message analysis.\nHistorical Data: Original detection metadata, stored analysis results, historical sender patterns, detection method records.`
  },
  'how-to-use': {
    title: 'How to Use the Log Details Screen',
    content: `Step-by-step guide to using the Log Details Screen effectively.`
  },
  'step-general': {
    title: 'Step 1: General Tab',
    content: `Begin by understanding the basic facts: when, who, what type, and what was said.`
  },
  'step-security': {
    title: 'Step 2: Security Tab',
    content: `Review the technical analysis: why flagged, what patterns, dangerous links, sophistication.`
  },
  'step-metadata': {
    title: 'Step 3: Metadata Tab',
    content: `Understand the context: where, what device, how detected, detection methods.`
  },
  'step-threat': {
    title: 'Step 4: Threat Tab',
    content: `Make your decision: overall risk level, score calculation, next steps, response.`
  },
  decisions: {
    title: 'Making Informed Decisions',
    content: `How to interpret risk levels and take appropriate action.`
  },
  'high-risk': {
    title: 'High-Risk Threats',
    content: `Multiple red flags, clear scam indicators, dangerous content. Actions: block sender, do not click links, do not provide info, report, delete, warn others.`
  },
  'medium-risk': {
    title: 'Medium-Risk Threats',
    content: `Some suspicious elements, unknown sender, mixed signals. Actions: verify sender, be cautious, don't provide info, monitor, consider blocking.`
  },
  'low-risk': {
    title: 'Low-Risk Threats',
    content: `Minimal indicators, known sender, clean analysis. Actions: exercise caution, verify requests, report if wrong, monitor for changes.`
  },
  'false-positives': {
    title: 'Understanding False Positives',
    content: `False positives occur when legitimate messages are incorrectly flagged as threats. How to handle: check breakdown, verify independently, consider context, trust instincts, report if needed.`
  },
  privacy: {
    title: 'Privacy and Security',
    content: `Local processing, minimal sharing, your control, transparency.`
  },
  'data-collection': {
    title: 'Data Collection',
    content: `Only necessary information is collected: message content, sender info, device context, timing.`
  },
  tips: {
    title: 'Tips for Effective Use',
    content: `Regular review, check new threats, review patterns, update security, report issues.`
  },
  'pattern-recognition': {
    title: 'Pattern Recognition',
    content: `Note common tactics, identify vulnerable times, track sender patterns, monitor threat evolution.`
  },
  'continuous-learning': {
    title: 'Continuous Learning',
    content: `Stay informed, learn from each threat, share knowledge, contribute feedback.`
  },
  help: {
    title: 'Getting Help',
    content: `When to seek additional help and available resources.`
  },
  'when-to-seek': {
    title: 'When to Seek Additional Help',
    content: `Complex threats, repeated attacks, sophisticated scams, financial threats.`
  },
  resources: {
    title: 'Available Resources',
    content: `Knowledge Base, community reports, security updates, support team.`
  },
};

const KnowledgeBaseLogDetailsOverview = () => (
  <KnowledgeBaseArticleTemplate
    pageTitle="Knowledge Base"
    articleTitle="Log Details: Overview"
    IconComponent={<Icon name="document-text-outline" size={40} color="#4CAF50" />}
    tableOfContents={tableOfContents}
    articleContent={articleContent}
    themeColor="#4CAF50"
  />
);

export default KnowledgeBaseLogDetailsOverview; 