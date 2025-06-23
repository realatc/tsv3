import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const KnowledgeBaseLiveTextAnalyzer = () => {
  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'how-it-works', title: 'How It Works', level: 1 },
    { id: 'text-input', title: 'Text Input Processing', level: 2 },
    { id: 'ai-analysis', title: 'AI-Powered Analysis', level: 2 },
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
      content: 'The Live Text Analyzer is a powerful AI-powered tool that scans text content in real-time to identify potential security threats, scams, and malicious content. It provides instant threat assessments with actionable recommendations to help you stay safe online.'
    },
    'how-it-works': {
      title: 'How It Works',
      content: 'The analyzer processes text through multiple stages of analysis to provide comprehensive threat assessment.'
    },
    'text-input': {
      title: 'Text Input Processing',
      content: 'When you paste text into the analyzer, the system processes your input through advanced natural language processing, analyzes the content for suspicious patterns, keywords, and contextual clues, and uses multiple threat detection algorithms simultaneously.'
    },
    'ai-analysis': {
      title: 'AI-Powered Analysis',
      content: 'The analyzer uses Perplexity AI with the llama-3.1-sonar-small-128k-online model to evaluate text for phishing attempts, scams, and malicious content, identify social engineering tactics, detect suspicious URLs, and analyze language patterns associated with fraud.'
    },
    'threat-intelligence': {
      title: 'Threat Intelligence Integration',
      content: 'The system leverages real-time threat intelligence from Perplexity AI\'s Knowledge Base, cybersecurity databases, real-time web search, and pattern recognition models trained on millions of scam examples.'
    },
    'grading-system': {
      title: 'Threat Level Grading System',
      content: 'The analyzer uses a 5-tier threat assessment system: Critical (Red), High (Orange), Medium (Yellow), Low (Green), and None (White).'
    },
    'what-it-looks-for': {
      title: 'What the Analyzer Looks For',
      content: 'The analyzer examines text for various red flags and indicators of malicious content.'
    },
    'red-flags': {
      title: 'Red Flags & Indicators',
      content: 'Key indicators include urgency tactics, authority impersonation, sensitive data requests, suspicious URLs, unusual language, too-good-to-be-true offers, and pressure tactics.'
    },
    'technical-analysis': {
      title: 'Technical Analysis',
      content: 'Technical analysis includes URL analysis, pattern recognition, context analysis, temporal analysis, and cross-referencing against threat intelligence databases.'
    },
    'data-sources': {
      title: 'Data Sources & Privacy',
      content: 'Information about the data sources used and privacy considerations.'
    },
    'privacy': {
      title: 'Privacy & Data Handling',
      content: 'Your privacy is paramount. The Live Text Analyzer is designed with privacy-first principles.',
    },
    'limitations': {
      title: 'Limitations & Considerations',
      content: 'While powerful, the analyzer has limitations and should be used as part of a comprehensive security strategy.'
    },
    'best-practices': {
      title: 'Best Practices',
      content: 'Guidelines for using the analyzer effectively and maintaining good security practices.'
    },
    'conclusion': {
      title: 'Conclusion',
      content: 'The Live Text Analyzer is a valuable tool for identifying potential threats, but should be used alongside other security measures.'
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