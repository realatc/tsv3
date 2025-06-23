import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';

const tableOfContents = [
  { id: 'overview', title: 'Overview', level: 1 },
  { id: 'phishing', title: 'Phishing Emails', level: 1 },
  { id: 'tech-support', title: 'Tech Support Scams', level: 1 },
  { id: 'lottery', title: 'Lottery & Prize Scams', level: 1 },
  { id: 'romance', title: 'Romance Scams', level: 1 },
  { id: 'shopping', title: 'Fake Shopping Sites', level: 1 },
  { id: 'impersonation', title: 'Impersonation Scams', level: 1 },
  { id: 'tips', title: 'Tips & Final Advice', level: 1 },
];

const articleContent = {
  overview: {
    title: 'Overview',
    content: `Staying safe online means knowing what to watch out for! Here are some of the most common digital scams:`
  },
  phishing: {
    title: 'Phishing Emails',
    content: `- Fake emails that look like they're from your bank, a delivery service, or even your boss.\n- They ask you to click a link or provide personal info.\n- **Tip:** Never click suspicious links or provide sensitive info via email.`
  },
  'tech-support': {
    title: 'Tech Support Scams',
    content: `- A pop-up or call claims your computer is infected and you must pay for help.\n- **Tip:** Real tech companies will never cold-call you for payment or remote access.`
  },
  lottery: {
    title: 'Lottery & Prize Scams',
    content: `- "Congratulations! You've won a prize!" (that you never entered for)\n- They ask for a fee or your bank details to claim it.\n- **Tip:** If it sounds too good to be true, it probably is.`
  },
  romance: {
    title: 'Romance Scams',
    content: `- Someone you meet online quickly professes love and asks for money.\n- **Tip:** Be cautious with online relationships and never send money to someone you haven't met in person.`
  },
  shopping: {
    title: 'Fake Shopping Sites',
    content: `- Websites offering deals that are too good to be true, but never deliver the goods.\n- **Tip:** Check for reviews, secure payment options, and be wary of new or unknown sites.`
  },
  impersonation: {
    title: 'Impersonation Scams',
    content: `- Scammers pretend to be someone you know (boss, family, friend) and ask for urgent help or money.\n- **Tip:** Always verify requests for money or sensitive info, even if they seem to come from someone you trust.`
  },
  tips: {
    title: 'Tips & Final Advice',
    content: `Stay alert, trust your instincts, and when in doubt, double-check before you click or share!`
  },
};

const KnowledgeBaseScamsArticle = () => (
  <KnowledgeBaseArticleTemplate
    pageTitle="Knowledge Base"
    articleTitle="Common Digital Scams"
    IconComponent={<Icon name="alert-circle-outline" size={40} color="#FF6B6B" />}
    tableOfContents={tableOfContents}
    articleContent={articleContent}
    themeColor="#FF6B6B"
  />
);

export default KnowledgeBaseScamsArticle; 