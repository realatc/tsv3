import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useTheme } from '../context/ThemeContext';

const KnowledgeBaseThreatLevelArticle = () => {
  const { theme } = useTheme();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'categories', title: 'Threat Level Categories', level: 1 },
    { id: 'low-risk', title: 'Low Risk', level: 2 },
    { id: 'medium-risk', title: 'Medium Risk', level: 2 },
    { id: 'high-risk', title: 'High Risk', level: 2 },
    { id: 'analysis-factors', title: 'Analysis Factors', level: 1 },
    { id: 'sender-analysis', title: 'Sender Analysis', level: 2 },
    { id: 'content-analysis', title: 'Content Analysis', level: 2 },
    { id: 'link-analysis', title: 'Link Analysis', level: 2 },
    { id: 'behavioral-analysis', title: 'Behavioral Analysis', level: 2 },
    { id: 'real-time-updates', title: 'Real-Time Updates', level: 1 },
    { id: 'privacy-protection', title: 'Privacy Protection', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: `ThreatSense uses a sophisticated algorithm to determine the risk level of incoming messages and communications. Here's how our threat assessment works:`
    },
    categories: {
      title: 'Threat Level Categories',
      content: 'Threat levels are divided into three main categories: Low, Medium, and High. Each category is based on specific risk factors.'
    },
    'low-risk': {
      title: 'Low Risk',
      content: `🟢 Low Risk\n- Messages from known, trusted contacts\n- No suspicious patterns detected\n- Safe content and links\n- Normal communication patterns`
    },
    'medium-risk': {
      title: 'Medium Risk',
      content: `🟡 Medium Risk\n- Messages from unknown senders\n- Contains links to external websites\n- Requests for personal information\n- Unusual timing or frequency`
    },
    'high-risk': {
      title: 'High Risk',
      content: `🟠 High Risk\n- Suspicious link patterns\n- Requests for financial information\n- Urgent or threatening language\n- Impersonation attempts detected\n- Confirmed phishing attempts\n- Malicious links or attachments\n- Financial scam indicators\n- Immediate action required`
    },
    'analysis-factors': {
      title: 'Analysis Factors',
      content: 'Our system evaluates multiple factors to determine the threat level.'
    },
    'sender-analysis': {
      title: 'Sender Analysis',
      content: `- Known vs unknown sender\n- Sender reputation score\n- Previous interaction history\n- Domain authenticity`
    },
    'content-analysis': {
      title: 'Content Analysis',
      content: `- Keyword detection\n- Language patterns\n- Urgency indicators\n- Request types`
    },
    'link-analysis': {
      title: 'Link Analysis',
      content: `- URL safety checks\n- Domain reputation\n- Redirect patterns\n- SSL certificate validation`
    },
    'behavioral-analysis': {
      title: 'Behavioral Analysis',
      content: `- Message timing\n- Frequency patterns\n- Response urgency\n- Social engineering indicators`
    },
    'real-time-updates': {
      title: 'Real-Time Updates',
      content: `Threat levels are updated in real-time as new information becomes available. Our system continuously learns from:\n- User feedback\n- New threat patterns\n- Security research\n- Community reports`
    },
    'privacy-protection': {
      title: 'Privacy Protection',
      content: `All analysis is performed locally on your device when possible, ensuring your privacy is protected while maintaining security.`
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="How Threat Levels Are Calculated"
      IconComponent={<Icon name="analytics-outline" size={40} color={theme.primary} />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor={theme.primary}
    />
  );
};

export default KnowledgeBaseThreatLevelArticle; 