import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const KnowledgeBaseLiveTextAnalyzer = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'text-input', title: 'Text Input Processing', level: 2 },
    { id: 'ai-analysis', title: 'AI-Powered Analysis', level: 2 },
    { id: 'url-analysis', title: 'Enhanced URL Analysis', level: 2 },
    { id: 'threat-intelligence', title: 'Threat Intelligence Integration', level: 2 },
    { id: 'grading-system', title: 'Threat Level Grading System', level: 1 },
    { id: 'what-it-looks-for', title: 'What the Analyzer Looks For', level: 1 },
    { id: 'red-flags', title: 'Red Flags & Indicators', level: 2 },
    { id: 'technical-analysis', title: 'Technical Analysis', level: 2 },
    { id: 'data-sources', title: 'Data Sources & Privacy', level: 1 },
    { id: 'privacy', title: 'Privacy & Data Handling', level: 2 },
    { id: 'limitations', title: 'Limitations & Considerations', level: 1 },
    { id: 'best-practices', title: 'Best Practices', level: 1 },
    { id: 'conclusion', title: 'Conclusion', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: 'The Live Text Analyzer is a comprehensive AI-powered tool that scans text content in real-time to identify potential security threats, scams, and malicious content. It provides detailed threat assessments with actionable recommendations, including advanced URL analysis and technical security checks.'
    },
    'how-it-works': {
      title: 'How It Works',
      content: 'The analyzer processes text through multiple stages of analysis: text processing, AI-powered content analysis, enhanced URL safety checking, and threat intelligence integration to provide comprehensive security assessment.'
    },
    'text-input': {
      title: 'Text Input Processing',
      content: 'When you paste text into the analyzer, the system processes your input through advanced natural language processing, extracts URLs for detailed analysis, analyzes content for suspicious patterns and contextual clues, and uses multiple threat detection algorithms simultaneously.'
    },
    'ai-analysis': {
      title: 'AI-Powered Analysis',
      content: 'The analyzer uses Perplexity AI with comprehensive cybersecurity guidelines to evaluate text for phishing attempts, scams, and malicious content. It identifies social engineering tactics, analyzes language patterns associated with fraud, considers sender credibility, and provides detailed technical analysis with specific threat indicators.'
    },
    'url-analysis': {
      title: 'Enhanced URL Analysis',
      content: 'The system performs comprehensive URL safety checks including DNS resolution, SSL certificate validation, domain reputation analysis, Google Safe Browsing API integration, and suspicious pattern detection. Each URL receives detailed analysis with confidence levels and specific recommendations.'
    },
    'threat-intelligence': {
      title: 'Threat Intelligence Integration',
      content: 'The system leverages real-time threat intelligence from Perplexity AI\'s Knowledge Base, Google Safe Browsing API, cybersecurity databases, real-time web search, and pattern recognition models trained on millions of scam examples. It also includes domain reputation checking and technical security indicators.'
    },
    'grading-system': {
      title: 'Threat Level Grading System',
      content: 'The analyzer uses a 5-tier threat assessment system: Critical (Red), High (Orange), Medium (Yellow), Low (Green), and None (White). Each assessment includes confidence levels and detailed explanations of the analysis results.'
    },
    'what-it-looks-for': {
      title: 'What the Analyzer Looks For',
      content: 'The analyzer examines text for various red flags, technical indicators, and patterns of malicious content, including comprehensive URL analysis and domain reputation assessment.'
    },
    'red-flags': {
      title: 'Red Flags & Indicators',
      content: 'Key indicators include urgency tactics, authority impersonation, sensitive data requests, suspicious URLs, unusual language, too-good-to-be-true offers, pressure tactics, suspicious domain names, SSL certificate issues, and newly registered domains.'
    },
    'technical-analysis': {
      title: 'Technical Analysis',
      content: 'Technical analysis includes DNS resolution, SSL certificate validation, domain reputation checking, IP address analysis, URL pattern recognition, context analysis, temporal analysis, and cross-referencing against multiple threat intelligence databases including Google Safe Browsing.'
    },
    'data-sources': {
      title: 'Data Sources & Privacy',
      content: 'Information about the comprehensive data sources used, including Google Safe Browsing API, DNS services, SSL certificate validation, domain reputation databases, and privacy considerations.'
    },
    'privacy': {
      title: 'Privacy & Data Handling',
      content: 'Your privacy is paramount. The Live Text Analyzer is designed with privacy-first principles. All analysis is performed securely with encrypted API connections, and no personal data is stored or logged.',
    },
    'limitations': {
      title: 'Limitations & Considerations',
      content: 'While powerful, the analyzer has limitations and should be used as part of a comprehensive security strategy. It cannot guarantee 100% accuracy and may not detect all sophisticated threats immediately.'
    },
    'best-practices': {
      title: 'Best Practices',
      content: 'Guidelines for using the analyzer effectively, interpreting results, and maintaining good security practices. Always verify critical information through trusted sources and use the analyzer as part of a broader security approach.'
    },
    'conclusion': {
      title: 'Conclusion',
      content: 'The Live Text Analyzer is a valuable tool for identifying potential threats with enhanced technical analysis capabilities. It provides detailed insights into URL safety, domain reputation, and content analysis, but should be used alongside other security measures and your own judgment.'
    }
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Live Text Analyzer: How It Works"
      IconComponent={<Icon name="scan-outline" size={40} color="#00BCD4" />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor="#00BCD4"
    />
  );
};

export default KnowledgeBaseLiveTextAnalyzer; 