import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Markdown from 'react-native-markdown-display';

const logDetailsThreatMd = `# Log Details: Threat Tab

The **Threat** tab provides the most critical information about the detected threat. This is where you'll find the AI analysis, threat level assessment, and specific details about what makes this message dangerous.

## What You'll See

### Threat Level
**What it shows:** Overall risk assessment of the message
**How it's calculated:** AI analysis combined with multiple detection methods
**Values:** 
- **High** - Immediate danger, requires immediate action
- **Medium** - Suspicious but not immediately dangerous
- **Low** - Minor concerns, worth monitoring
- **Safe** - No threats detected

**Why it matters:** This is your primary indicator of how seriously to take the threat

### AI Analysis
**What it shows:** Detailed explanation of why the message was flagged
**How it's generated:** Advanced natural language processing analyzes the message content
**Example:** "This message contains urgent language, requests for personal information, and suspicious links typical of phishing attempts."
**Why it matters:** Helps you understand the specific red flags that triggered the detection

### Threat Categories
**What it shows:** Specific types of threats detected
**How it's identified:** Pattern matching and AI classification
**Common categories:**
- **Phishing** - Attempts to steal personal information
- **Malware** - Harmful software or links
- **Scam** - Fraudulent schemes or requests
- **Social Engineering** - Psychological manipulation
- **Spam** - Unwanted commercial messages

**Why it matters:** Different threat types require different responses

### URL Analysis
**What it shows:** Safety assessment of links in the message
**How it's checked:** Google Safe Browsing API and local analysis
**Results:**
- **Safe** - Link appears legitimate
- **Malware** - Link contains harmful software
- **Phishing** - Link designed to steal information
- **Uncommon** - Suspicious but not clearly dangerous
- **Unknown** - Unable to determine safety

**Why it matters:** Links are often the most dangerous part of threats

### Sender Analysis
**What it shows:** Assessment of the sender's trustworthiness
**How it's evaluated:** Based on sender history, domain reputation, and patterns
**Factors considered:**
- Previous threat reports
- Domain age and reputation
- Sending patterns
- Community reports

**Why it matters:** Known malicious senders are more likely to be threats

### Content Analysis
**What it shows:** Detailed breakdown of suspicious elements in the message
**How it's analyzed:** AI examines language patterns, urgency, requests, and context
**Common red flags:**
- **Urgency** - "Act now" or "Limited time"
- **Authority** - Impersonating trusted organizations
- **Requests** - Asking for personal information
- **Threats** - Consequences for not acting
- **Rewards** - Promises of money or prizes

**Why it matters:** Understanding the manipulation tactics helps you avoid falling for them

### Confidence Score
**What it shows:** How certain the AI is about the threat assessment
**How it's calculated:** Based on the strength and number of detected indicators
**Range:** 0-100%
**Interpretation:**
- **90-100%** - Very high confidence
- **70-89%** - High confidence
- **50-69%** - Moderate confidence
- **30-49%** - Low confidence
- **0-29%** - Very low confidence

**Why it matters:** Higher confidence means the threat is more likely to be real

## How Threat Detection Works

### Multi-Layer Analysis
ThreatSense uses multiple detection methods:

1. **Natural Language Processing (NLP)**
   - Analyzes message content for suspicious patterns
   - Detects emotional manipulation tactics
   - Identifies requests for sensitive information

2. **URL Safety Checking**
   - Checks links against Google Safe Browsing database
   - Analyzes domain reputation and age
   - Detects suspicious URL patterns

3. **Sender Reputation**
   - Evaluates sender history and patterns
   - Checks against known threat databases
   - Analyzes domain trustworthiness

4. **Pattern Recognition**
   - Identifies common scam and phishing patterns
   - Detects social engineering techniques
   - Recognizes malware distribution methods

### AI Learning
The system continuously improves by:
- **Learning from new threats** - Adapts to emerging attack patterns
- **User feedback** - Incorporates your threat reports
- **Community data** - Shares threat information (anonymously)
- **Pattern updates** - Regular updates to detection algorithms

## Understanding Threat Levels

### High Threat Level
**Characteristics:**
- Multiple strong indicators
- Known malicious patterns
- Dangerous links or attachments
- High confidence score

**Recommended Actions:**
- Do not interact with the message
- Block the sender
- Report to authorities if appropriate
- Check your accounts for compromise

### Medium Threat Level
**Characteristics:**
- Some suspicious elements
- Moderate confidence
- Mixed indicators

**Recommended Actions:**
- Exercise caution
- Verify sender identity
- Don't click links
- Monitor for similar threats

### Low Threat Level
**Characteristics:**
- Minor concerns
- Low confidence
- Few indicators

**Recommended Actions:**
- Be aware but not alarmed
- Use normal caution
- Report if suspicious

### Safe
**Characteristics:**
- No threats detected
- Legitimate sender
- Safe content

**Recommended Actions:**
- Normal interaction
- No special precautions needed

## Common Threat Patterns

### Phishing Attempts
**Signs:**
- Urgent requests for action
- Impersonation of trusted organizations
- Requests for personal information
- Suspicious links

**Examples:**
- "Your account has been suspended"
- "Verify your identity immediately"
- "Click here to claim your prize"

### Malware Distribution
**Signs:**
- Unexpected attachments
- Suspicious download links
- Requests to install software
- Promises of free software

**Examples:**
- "Free antivirus software"
- "Important document attached"
- "Update your system now"

### Social Engineering
**Signs:**
- Emotional manipulation
- Authority figures
- Time pressure
- Promises of rewards

**Examples:**
- "Your family needs help"
- "CEO requesting urgent transfer"
- "Limited time offer"

## How to Use This Information

### Immediate Actions
1. **Check the threat level** - Determine urgency
2. **Read the AI analysis** - Understand the specific concerns
3. **Review URL analysis** - Check if links are dangerous
4. **Consider sender analysis** - Evaluate sender trustworthiness

### Long-term Security
1. **Learn from patterns** - Notice common threat types
2. **Improve awareness** - Understand manipulation tactics
3. **Share knowledge** - Help others recognize threats
4. **Stay updated** - Keep app updated for latest protections

### Reporting Threats
1. **Use the report feature** - Help improve detection
2. **Provide context** - Include any additional information
3. **Follow up** - Check if similar threats appear
4. **Share with authorities** - Report serious threats

## Privacy and Accuracy

### Data Protection
- **Local analysis** - Most processing happens on your device
- **Minimal sharing** - Only essential data is shared for threat detection
- **Anonymized reporting** - Threat reports don't include personal information
- **Your control** - You decide what to report

### Accuracy
- **Continuous improvement** - AI learns from new threats
- **Multiple sources** - Combines various detection methods
- **Community input** - Benefits from collective threat knowledge
- **Regular updates** - Detection patterns are updated frequently

### False Positives
- **Rare but possible** - Legitimate messages may be flagged
- **Review carefully** - Always use your judgment
- **Report errors** - Help improve accuracy
- **Context matters** - Consider the full situation

## Tips for Threat Assessment

1. **Don't panic** - Take time to understand the threat
2. **Read the analysis** - AI provides detailed explanations
3. **Check multiple indicators** - Don't rely on just one factor
4. **Consider context** - Legitimate urgency vs. manipulation
5. **Trust your instincts** - If something feels wrong, it probably is
6. **When in doubt** - Err on the side of caution

---

*The Threat tab gives you the most comprehensive view of what makes a message dangerous and how to respond appropriately.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = '2024-12-15';

const KnowledgeBaseLogDetailsThreat = () => {
  return (
    <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>Log Details: Threat Tab</Text>
            <Text style={styles.subtitle}>AI analysis and threat assessment</Text>
            <View style={styles.metaInfo}>
              <Text style={styles.metaText}>Created: {CREATED_DATE}</Text>
              <Text style={styles.metaText}>Updated: {UPDATED_DATE}</Text>
            </View>
          </View>
          <View style={styles.content}>
            <Markdown style={markdownStyles}>
              {logDetailsThreatMd}
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
    color: '#9C27B0',
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
    color: '#9C27B0',
    fontSize: 24,
    fontWeight: 'bold' as const,
    marginTop: 20,
    marginBottom: 10,
  },
  heading2: {
    color: '#9C27B0',
    fontSize: 20,
    fontWeight: 'bold' as const,
    marginTop: 18,
    marginBottom: 8,
  },
  heading3: {
    color: '#9C27B0',
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
    borderLeftColor: '#9C27B0',
    paddingLeft: 12,
    marginVertical: 8,
    fontStyle: 'italic' as const,
  },
};

export default KnowledgeBaseLogDetailsThreat; 