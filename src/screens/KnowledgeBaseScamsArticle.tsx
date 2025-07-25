import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import KnowledgeBaseArticleTemplate from '../components/KnowledgeBaseArticleTemplate';
import { useTheme } from '../context/ThemeContext';

const KnowledgeBaseScamsArticle = () => {
  const { theme } = useTheme();

  const tableOfContents = [
    { id: 'overview', title: 'Overview', level: 1 },
    { id: 'phishing', title: 'Phishing Emails', level: 1 },
    { id: 'tech-support', title: 'Tech Support Scams', level: 1 },
    { id: 'lottery', title: 'Lottery & Prize Scams', level: 1 },
    { id: 'romance', title: 'Romance Scams', level: 1 },
    { id: 'shopping', title: 'Fake Shopping Sites', level: 1 },
    { id: 'impersonation', title: 'Impersonation Scams', level: 1 },
    { id: 'url-analysis', title: 'URL Safety Analysis', level: 1 },
    { id: 'tips', title: 'Tips & Final Advice', level: 1 },
  ];

  const articleContent = {
    overview: {
      title: 'Overview',
      content: `Staying safe online means knowing what to watch out for! Here are some of the most common digital scams and how to identify them using technical analysis:`
    },
    phishing: {
      title: 'Phishing Emails',
      content: `- Fake emails that look like they're from your bank, a delivery service, or even your boss.\n- They ask you to click a link or provide personal info.\n- **Technical Signs:** Suspicious URLs, invalid SSL certificates, newly registered domains\n- **Tip:** Never click suspicious links or provide sensitive info via email. Use the Live Text Analyzer to check URLs.`
    },
    'tech-support': {
      title: 'Tech Support Scams',
      content: `- A pop-up or call claims your computer is infected and you must pay for help.\n- **Technical Signs:** Fake security alerts, suspicious download links, invalid certificates\n- **Tip:** Real tech companies will never cold-call you for payment or remote access.`
    },
    lottery: {
      title: 'Lottery & Prize Scams',
      content: `- "Congratulations! You've won a prize!" (that you never entered for)\n- They ask for a fee or your bank details to claim it.\n- **Technical Signs:** Suspicious payment sites, fake lottery domains, SSL issues\n- **Tip:** If it sounds too good to be true, it probably is.`
    },
    romance: {
      title: 'Romance Scams',
      content: `- Someone you meet online quickly professes love and asks for money.\n- **Technical Signs:** Fake profiles, suspicious payment requests, unusual communication patterns\n- **Tip:** Be cautious with online relationships and never send money to someone you haven't met in person.`
    },
    shopping: {
      title: 'Fake Shopping Sites',
      content: `- Websites offering deals that are too good to be true, but never deliver the goods.\n- **Technical Signs:** Newly registered domains, invalid SSL certificates, suspicious payment methods\n- **Tip:** Check for reviews, secure payment options, and be wary of new or unknown sites. Use URL analysis to verify site safety.`
    },
    impersonation: {
      title: 'Impersonation Scams',
      content: `- Scammers pretend to be someone you know (boss, family, friend) and ask for urgent help or money.\n- **Technical Signs:** Unusual communication patterns, suspicious payment requests, fake social media profiles\n- **Tip:** Always verify requests for money or sensitive info, even if they seem to come from someone you trust.`
    },
    'url-analysis': {
      title: 'URL Safety Analysis',
      content: `**How to Spot Suspicious URLs:**\n\n- **Domain Analysis:** Check if the domain is newly registered or contains suspicious keywords\n- **SSL Certificates:** Valid sites should have proper SSL certificates\n- **DNS Resolution:** Legitimate sites resolve to valid IP addresses\n- **Pattern Recognition:** Watch for misspelled domains (g00gle.com vs google.com)\n- **Use the Live Text Analyzer:** It automatically checks URLs for these technical indicators\n\n**Red Flags:**\n- Domains with "malware," "virus," "hack," or similar keywords\n- Newly registered domains (less than 30 days old)\n- Invalid or expired SSL certificates\n- Suspicious TLDs or unusual domain structures`
    },
    tips: {
      title: 'Tips & Final Advice',
      content: `Stay alert, trust your instincts, and when in doubt, double-check before you click or share! Use the Live Text Analyzer to verify suspicious URLs and messages. Remember: legitimate companies will never pressure you for immediate action or sensitive information.`
    },
  };

  return (
    <KnowledgeBaseArticleTemplate
      pageTitle="Knowledge Base"
      articleTitle="Common Digital Scams"
      IconComponent={<Icon name="alert-circle-outline" size={40} color={theme.error} />}
      tableOfContents={tableOfContents}
      articleContent={articleContent}
      themeColor={theme.error}
    />
  );
};

export default KnowledgeBaseScamsArticle; 