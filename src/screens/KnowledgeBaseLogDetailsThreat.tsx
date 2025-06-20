import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Markdown from 'react-native-markdown-display';

const logDetailsThreatMd = `# Log Details: Threat Tab

The **Threat** tab provides the most critical information about the detected threat. This is where you'll find the AI analysis, threat level assessment, and specific details about what makes this message dangerous.

## What You'll See

### Threat Level
**What it shows:** Overall risk assessment of the message, from Low to High.
**How it's calculated:** A scoring system (from 0 to 9) analyzes various threat indicators. A higher score results in a higher threat level.
- **High:** Score of 5 or more
- **Medium:** Score between 2 and 4
- **Low:** Score of 1 or less
**Why it matters:** This is your primary indicator of how seriously to take the threat. The score itself is shown in parentheses.

### Confidence
**What it shows:** How certain the app's scoring model is about the assessment, shown as a percentage.
**How it's calculated:** Based on the strength and number of detected threat indicators, derived from the threat score. A higher score means higher confidence.
**Why it matters:** A high confidence score means the threat assessment is more reliable.

### Categories
**What it shows:** The specific types of threats detected in the message.
**How it's identified:** The system automatically assigns categories like "Phishing" or "Scam" based on the specific indicators that were found.
**Why it matters:** Helps you understand the nature of the attack at a glance.

### Summary
**What it shows:** A dynamically generated sentence that explains exactly what was flagged in the message.
**How it's generated:** The system combines all the findings from its analysis into a concise, human-readable summary.
**Example:** "This message was flagged for urgent or threatening language, signs of impersonation or phishing, and a sender address impersonating PayPal."
**Why it matters:** This gives you a quick, clear overview of all the red flags.

### Score Breakdown
**What it shows:** A detailed list of every threat indicator found and the points assigned to each.
**How it's collected:** Each rule that is triggered during the analysis adds a specific number of points to the total threat score.
**Example:**
- NLP: urgent/suspicious/threat: +2
- Sender: impersonates PayPal: +2
**Why it matters:** This provides full transparency into how the threat score was calculated, showing you exactly what the system found suspicious.

## How Threat Detection Works

ThreatSense uses a rules-based scoring system that analyzes multiple layers of the message:

1.  **NLP Analysis:** Looks for suspicious language patterns, urgency, and signs of social engineering.
2.  **Behavioral Analysis:** Compares the message to known scam and phishing patterns.
3.  **Sender Analysis:** Examines the sender's details for signs of impersonation or suspicious domains.

Each time a rule is matched, it adds points to the total **Threat Score**. This score is then used to determine the **Threat Level** and **Confidence**.

## Understanding Threat Levels

### High Threat Level
**Characteristics:**
- A score of 5 or more.
- Multiple strong indicators were found.
- Often involves direct impersonation, known scam patterns, or urgent calls to action.
**Recommended Actions:**
- Do not interact with the message.
- Block the sender.
- Delete the message immediately.

### Medium Threat Level
**Characteristics:**
- A score between 2 and 4.
- Contains some suspicious elements but may not be an immediate danger.
- Might involve unofficial sender addresses or unusual language.
**Recommended Actions:**
- Exercise extreme caution.
- Independently verify the sender if you know them.
- Do not click any links or download attachments.

### Low Threat Level
**Characteristics:**
- A score of 1 or less.
- Only minor concerns were flagged.
- May be legitimate but is worth being aware of.
**Recommended Actions:**
- Be aware, but no immediate action is likely needed.
- Use normal caution when interacting.

---

*The Threat tab gives you the most comprehensive and transparent view of what makes a message dangerous and how to respond appropriately.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

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