import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `# Log Details: Security Tab

The **Security** tab (also called "Analysis") provides the technical analysis of the threat. This tab shows how ThreatSense's AI and security systems evaluated the message for potential risks.

## What You'll See

### NLP Analysis
**What it shows:** Artificial Intelligence analysis of the message content
**How it's collected:** AI-powered Natural Language Processing analyzes the text for suspicious patterns
**What it looks for:**
- **Urgent language:** "Act now," "Immediate action required," "24 hours to respond"
- **Authority impersonation:** Claims to be from banks, government agencies, tech support
- **Pressure tactics:** Threats of account suspension, legal action, or missed opportunities
- **Suspicious requests:** Asking for passwords, personal information, or money
- **Emotional manipulation:** Creating fear, excitement, or urgency

**Example analysis:** *"High risk phishing attempt. Contains urgent language, impersonates PayPal, requests immediate action, and includes suspicious verification link."*

### Behavioral Analysis
**What it shows:** Analysis of sender behavior and communication patterns
**How it's collected:** Compares the sender and message against known threat patterns and your contact history
**What it analyzes:**
- **Sender reputation:** Is this sender in your contacts? Have they contacted you before?
- **Domain analysis:** Does the email domain match the claimed organization?
- **Pattern matching:** Does this match known scam patterns?
- **Timing analysis:** Is this communication unusual for the time or context?

**Example analysis:** *"Sender domain does not match official PayPal domain. Similar to known phishing patterns. Account verification requests via email are unusual for PayPal."*

### URL Safety Check
**What it shows:** Real-time analysis of any links found in the message
**How it's collected:** Each URL is checked against Google Safe Browsing API's database of known malicious sites
**Safety levels:**
- 🟢 **Safe:** URL is not flagged as dangerous
- 🟡 **Uncommon:** URL is not widely known but not necessarily dangerous
- 🟠 **Phishing:** URL is designed to steal personal information
- 🔴 **Malware:** URL contains or distributes malicious software
- ⚫ **Unknown:** URL couldn't be verified (proceed with caution)

**What happens when you click a link:**
- **Safe links:** Open normally
- **Unsafe links:** Show a warning before opening
- **Unknown links:** Show a warning with option to proceed or cancel

## How This Analysis Works

### AI-Powered Detection
ThreatSense uses advanced AI models trained on millions of scam examples to:
- Recognize suspicious language patterns
- Identify impersonation attempts
- Detect emotional manipulation tactics
- Flag unusual requests

### Real-Time Database Checks
Every URL is instantly checked against:
- Google's Safe Browsing database (updated continuously)
- Known phishing site databases
- Malware distribution networks
- Suspicious domain registrations

### Behavioral Pattern Recognition
The system learns from:
- Your personal contact history
- Known scam patterns
- Community threat reports
- Security research databases

## Understanding the Results

### High-Risk Indicators
- **Multiple red flags:** When several analysis methods flag the same threat
- **Pattern matches:** When the message matches known scam templates
- **Unusual behavior:** When the sender acts differently than expected
- **Suspicious timing:** When the communication happens at unusual times

### False Positives
Sometimes legitimate messages may be flagged as suspicious because they:
- Contain urgent language for legitimate reasons
- Come from new or unknown senders
- Include links to new websites
- Use similar language to scams

### What to Do Based on Analysis

#### High-Risk Messages
- **Don't click any links**
- **Don't provide personal information**
- **Block the sender**
- **Report the threat**
- **Delete the message**

#### Medium-Risk Messages
- **Verify the sender independently**
- **Check links before clicking**
- **Be cautious with personal information**
- **Monitor for similar threats**

#### Low-Risk Messages
- **Still be cautious**
- **Verify unusual requests**
- **Report if suspicious**

## Tips for Using This Tab

1. **Read both analyses** - NLP and behavioral analysis together provide the full picture
2. **Check URL safety** - Always verify links before clicking
3. **Look for patterns** - Multiple red flags indicate higher risk
4. **Trust your instincts** - If something feels wrong, it probably is
5. **Report threats** - Help protect others by reporting suspicious activity

---

*ThreatSense continuously updates its threat detection capabilities to protect you from the latest scams and attacks.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsSecurity = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Security Tab"
      subtitle="AI-powered security analysis and safety checks"
      content={content}
    />
  );
};

export default KnowledgeBaseLogDetailsSecurity; 