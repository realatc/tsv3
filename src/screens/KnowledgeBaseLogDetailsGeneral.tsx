import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Markdown from 'react-native-markdown-display';

const logDetailsGeneralMd = `# Log Details: General Tab

The **General** tab (also called "Details") provides the foundational information about a security log entry. This tab shows the basic facts about when, who, and what was involved in the potential threat.

## What You'll See

### Date
**What it shows:** When the threat was detected and logged
**How it's collected:** Automatically captured when the threat is first detected
**Format:** Human-readable date (e.g., "Dec 15, 2024")
**Why it matters:** Helps you understand when the threat occurred and track patterns over time

### Sender Information

#### Sender
**What it shows:** The email address, phone number, or contact that sent the suspicious message
**How it's collected:** Extracted directly from the message headers or contact information
**Examples:** 
- \`security@paypal-support.com\` (email)
- \`+1-555-123-4567\` (phone number)
- \`Unknown Caller\` (unknown number)
**Why it matters:** Helps identify the source of the threat and can be used for blocking future communications

#### Category
**What it shows:** The type of communication that was analyzed
**How it's collected:** Automatically determined based on the message source and format
**Categories:**
- **Mail:** Email messages, newsletters, promotional emails
- **Text:** SMS messages, iMessage, WhatsApp, other messaging apps
- **Phone Call:** Incoming calls, voicemails, call logs
- **Social Media:** Messages from social platforms
**Why it matters:** Different threat types are more common in different communication channels

### Message Content
**What it shows:** The complete text of the suspicious message
**How it's collected:** Full message content as received
**What to look for:**
- Urgent language ("act now", "immediate action required")
- Requests for personal information
- Suspicious links or attachments
- Threats or pressure tactics
- Unusual grammar or spelling errors
**Why it matters:** The actual content helps you understand the threat and provides context for the security analysis

## How This Information Helps You

### Quick Assessment
The General tab gives you the essential facts at a glance:
- **When** did this happen?
- **Who** sent it?
- **What** type of communication?
- **What** did they say?

### Pattern Recognition
By reviewing multiple logs, you can identify:
- Repeated threats from the same sender
- Similar scams targeting you over time
- Peak times when threats occur
- Which communication channels are most targeted

### Action Planning
This information helps you decide:
- Whether to block the sender
- If you need to report the threat
- What additional security measures to take
- Whether to warn others about similar threats

## Tips for Using This Tab

1. **Check the sender carefully** - Scammers often use addresses that look legitimate at first glance
2. **Note the timing** - Many scams happen during specific times (tax season, holidays)
3. **Review the full message** - Context matters for understanding the threat
4. **Use the category** - Different types of threats require different responses

---

*This information is automatically collected and analyzed by ThreatSense to help protect you from digital threats.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = '2024-12-15';

const KnowledgeBaseLogDetailsGeneral = () => {
  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Details: General Tab</Text>
            <Text style={styles.subtitle}>Essential facts about threats</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>Created: {CREATED_DATE}</Text>
              <Text style={styles.metaText}>Updated: {UPDATED_DATE}</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Markdown style={markdownStyles}>
              {logDetailsGeneralMd}
            </Markdown>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    color: '#2196F3',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#B0BEC5',
    fontSize: 16,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    color: '#90CAF9',
    fontSize: 12,
  },
  content: {
    padding: 20,
  },
});

const markdownStyles = {
  body: {
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 24,
  },
  heading1: {
    color: '#2196F3',
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  heading2: {
    color: '#2196F3',
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginTop: 18,
    marginBottom: 8,
  },
  heading3: {
    color: '#2196F3',
    fontSize: 18,
    fontWeight: 'bold' as const,
    marginTop: 16,
    marginBottom: 6,
  },
  paragraph: {
    marginBottom: 12,
  },
  strong: {
    color: '#4A90E2',
    fontWeight: 'bold' as const,
  },
  em: {
    fontStyle: 'italic' as const,
    color: '#B0BEC5',
  },
  list_item: {
    marginBottom: 6,
  },
  bullet_list: {
    marginBottom: 12,
  },
  ordered_list: {
    marginBottom: 12,
  },
  code_block: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
  },
  code_inline: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 4,
    borderRadius: 4,
  },
  blockquote: {
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    paddingLeft: 12,
    marginVertical: 8,
    fontStyle: 'italic',
  },
};

export default KnowledgeBaseLogDetailsGeneral; 