import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useTheme } from '../context/ThemeContext';

const KnowledgeBaseLogDetailsMetadata = () => {
  const { theme } = useTheme();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'message-metadata', title: 'Message Metadata', level: 1 },
    { id: 'sender-info', title: 'Sender Information', level: 2 },
    { id: 'timestamp', title: 'Timestamp', level: 2 },
    { id: 'message-id', title: 'Message ID', level: 2 },
    { id: 'technical-details', title: 'Technical Details', level: 1 },
    { id: 'headers', title: 'Headers', level: 2 },
    { id: 'routing', title: 'Routing Information', level: 2 },
    { id: 'security-headers', title: 'Security Headers', level: 2 },
    { id: 'understanding-metadata', title: 'Understanding Metadata', level: 1 },
    { id: 'what-it-shows', title: 'What It Shows', level: 2 },
    { id: 'how-collected', title: 'How It\'s Collected', level: 2 },
    { id: 'privacy', title: 'Privacy & Security', level: 1 },
    { id: 'data-handling', title: 'Data Handling', level: 2 },
    { id: 'encryption', title: 'Encryption', level: 2 },
    { id: 'tips', title: 'Tips', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: `This tab displays technical metadata about the message for advanced users and security analysis.`
    },
    'message-metadata': {
      title: 'Message Metadata',
      content: `Basic information about the message including sender details and timing.`
    },
    'sender-info': {
      title: 'Sender Information',
      content: `Email address, display name, and sender domain information.`
    },
    timestamp: {
      title: 'Timestamp',
      content: `When the message was sent, received, and processed by ThreatSense.`
    },
    'message-id': {
      title: 'Message ID',
      content: `Unique identifier for the message used for tracking and analysis.`
    },
    'technical-details': {
      title: 'Technical Details',
      content: `Advanced technical information about the message structure and routing.`
    },
    headers: {
      title: 'Headers',
      content: `Email headers containing routing information, authentication details, and technical metadata.`
    },
    routing: {
      title: 'Routing Information',
      content: `Path the message took through various servers and networks.`
    },
    'security-headers': {
      title: 'Security Headers',
      content: `Authentication and security information like SPF, DKIM, and DMARC results.`
    },
    'understanding-metadata': {
      title: 'Understanding Metadata',
      content: `How to interpret the metadata information displayed in this tab.`
    },
    'what-it-shows': {
      title: 'What It Shows',
      content: `Message origin, routing path, authentication status, and technical characteristics.`
    },
    'how-collected': {
      title: 'How It\'s Collected',
      content: `Automatically extracted from message headers and system logs during processing.`
    },
    privacy: {
      title: 'Privacy & Security',
      content: `How metadata is handled and protected within ThreatSense.`
    },
    'data-handling': {
      title: 'Data Handling',
      content: `Metadata is stored locally, encrypted, and used only for security analysis.`
    },
    encryption: {
      title: 'Encryption',
      content: `All metadata is encrypted at rest and in transit for your privacy.`
    },
    tips: {
      title: 'Tips',
      content: `1. Use metadata to verify message authenticity. 2. Check routing for suspicious paths. 3. Verify security headers. 4. Look for unusual timestamps. 5. Report suspicious metadata patterns.`
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Log Details: Metadata Tab"
      IconComponent={<Icon name="information-circle-outline" size={40} color={theme.primary} />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor={theme.primary}
    />
  );
};

export default KnowledgeBaseLogDetailsMetadata; 