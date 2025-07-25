import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useTheme } from '../context/ThemeContext';

const KnowledgeBaseLogDetailsGeneral = () => {
  const { theme } = useTheme();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'date', title: 'Date', level: 1 },
    { id: 'sender-info', title: 'Sender Information', level: 1 },
    { id: 'category', title: 'Category', level: 2 },
    { id: 'message-content', title: 'Message Content', level: 1 },
    { id: 'how-it-helps', title: 'How This Information Helps You', level: 1 },
    { id: 'quick-assessment', title: 'Quick Assessment', level: 2 },
    { id: 'pattern-recognition', title: 'Pattern Recognition', level: 2 },
    { id: 'action-planning', title: 'Action Planning', level: 2 },
    { id: 'tips', title: 'Tips for Using This Tab', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: `This tab provides a summary of the log entry's content and context.`
    },
    date: {
      title: 'Date',
      content: `Shows when the threat was detected and logged. Helps you understand when the threat occurred and track patterns over time.`
    },
    'sender-info': {
      title: 'Sender Information',
      content: `Shows the email address, phone number, or contact that sent the suspicious message. Helps identify the source of the threat and can be used for blocking future communications.`
    },
    category: {
      title: 'Category',
      content: `Shows the type of communication that was analyzed (Mail, Text, Phone Call, Social Media). Different threat types are more common in different communication channels.`
    },
    'message-content': {
      title: 'Message Content',
      content: `Shows the complete text of the suspicious message. What to look for: urgent language, requests for personal info, suspicious links, threats, unusual grammar. Helps you understand the threat and provides context for the security analysis.`
    },
    'how-it-helps': {
      title: 'How This Information Helps You',
      content: `Explains how the General tab gives you the essential facts at a glance and helps you identify patterns and plan actions.`
    },
    'quick-assessment': {
      title: 'Quick Assessment',
      content: `Gives you the essential facts: when, who, what type, and what was said.`
    },
    'pattern-recognition': {
      title: 'Pattern Recognition',
      content: `By reviewing multiple logs, you can identify repeated threats, similar scams, peak times, and targeted channels.`
    },
    'action-planning': {
      title: 'Action Planning',
      content: `Helps you decide whether to block the sender, report the threat, take additional security measures, or warn others.`
    },
    tips: {
      title: 'Tips for Using This Tab',
      content: `1. Check the sender carefully. 2. Note the timing. 3. Review the full message. 4. Use the category to tailor your response.`
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Log Details: General Tab"
      IconComponent={<Icon name="information-circle-outline" size={40} color={theme.primary} />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor={theme.primary}
    />
  );
};

export default KnowledgeBaseLogDetailsGeneral; 