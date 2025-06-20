import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const logDetailsSecurityMd = `
The **Security** tab provides detailed technical analysis of the message's safety. This is where you'll find information about URL safety, sender reputation, and specific security concerns that were detected.

## What You'll See

### URL Analysis
**What it shows:** Safety assessment of any links found in the message
**How it's checked:** Google Safe Browsing API and local analysis
**Results:**
- **Safe** - Link appears legitimate and secure
- **Malware** - Link contains harmful software
- **Phishing** - Link designed to steal information
- **Uncommon** - Suspicious but not clearly dangerous
- **Unknown** - Unable to determine safety

**Why it matters:** Links are often the most dangerous part of threats, leading to malicious websites

### Sender Analysis
**What it shows:** Assessment of the sender's trustworthiness and reputation
**How it's evaluated:** Based on sender history, domain reputation, and patterns
**Factors considered:**
- **Domain age** - How long the sending domain has existed
- **Reputation score** - Known history of the sender
- **Sending patterns** - How often and when they contact you
- **Community reports** - Reports from other users

**Why it matters:** Known malicious senders are more likely to be threats

### Content Security
**What it shows:** Analysis of the message content for security concerns
**How it's analyzed:** AI examines language patterns, urgency, and suspicious elements
**Common red flags:**
- **Urgency** - "Act now" or "Limited time" language
- **Authority** - Impersonating trusted organizations
- **Requests** - Asking for personal information
- **Threats** - Consequences for not acting
- **Rewards** - Promises of money or prizes

**Why it matters:** Understanding manipulation tactics helps you avoid falling for them

### Attachment Analysis
**What it shows:** Safety assessment of any file attachments
**How it's checked:** File type analysis and security scanning
**Concerns:**
- **Executable files** - Programs that could harm your device
- **Suspicious formats** - Unusual file types
- **Large files** - Potentially harmful downloads
- **Unknown sources** - Files from untrusted senders

**Why it matters:** Attachments can contain malware or other harmful content

## Understanding Security Results

### Safe Indicators
**Green flags that suggest security:**
- **Known domains** - Legitimate business websites
- **HTTPS links** - Secure, encrypted connections
- **Verified senders** - People you know and trust
- **Expected content** - Normal communication patterns

### Warning Signs
**Red flags that suggest security risks:**
- **Unknown domains** - Websites you don't recognize
- **HTTP links** - Unencrypted, potentially unsafe connections
- **Suspicious URLs** - Misspelled or fake domain names
- **Unexpected attachments** - Files you weren't expecting

### Risk Levels
**How to interpret security assessments:**
- **Low risk** - Minor concerns, proceed with caution
- **Medium risk** - Some suspicious elements, be careful
- **High risk** - Multiple security concerns, avoid interaction
- **Critical risk** - Clear security threats, do not engage

## How Security Analysis Works

### Multi-Layer Protection
ThreatSense uses multiple security methods:

1. **URL Safety Checking**
   - Google Safe Browsing database
   - Domain reputation analysis
   - Suspicious URL pattern detection
   - Real-time threat intelligence

2. **Sender Reputation**
   - Historical threat reports
   - Domain age and legitimacy
   - Sending behavior patterns
   - Community feedback

3. **Content Analysis**
   - AI-powered text analysis
   - Social engineering detection
   - Impersonation pattern recognition
   - Threat language identification

4. **Technical Analysis**
   - File attachment scanning
   - Network security checks
   - Encryption verification
   - Malware pattern detection

### Real-Time Updates
Security information is updated continuously:
- **New threats** are added to databases
- **Domain reputations** are updated
- **Pattern recognition** improves over time
- **Community reports** enhance protection

## Common Security Threats

### Phishing Attempts
**What they look like:**
- **Fake login pages** - Impersonating legitimate services
- **Account verification** - Asking for personal information
- **Security alerts** - False warnings about your accounts
- **Prize notifications** - Promises of rewards or money

**How to spot them:**
- Check the URL carefully
- Look for spelling errors
- Verify the sender independently
- Don't click suspicious links

### Malware Distribution
**What they contain:**
- **Harmful attachments** - Files that can damage your device
- **Infected links** - Websites that download malware
- **Fake software** - Programs that seem helpful but are harmful
- **System updates** - False security patches

**How to protect yourself:**
- Don't download unexpected files
- Use antivirus software
- Keep your system updated
- Be cautious with unknown sources

### Social Engineering
**How they work:**
- **Authority figures** - Impersonating trusted people
- **Urgency tactics** - Creating pressure to act quickly
- **Emotional manipulation** - Playing on your feelings
- **Information gathering** - Collecting data for later attacks

**How to resist:**
- Verify requests independently
- Don't rush into decisions
- Trust your instincts
- Ask questions

## Best Security Practices

### Link Safety
- **Hover before clicking** - Check where links actually go
- **Look for HTTPS** - Secure connections are safer
- **Check domain names** - Watch for misspellings
- **Use bookmarks** - Access important sites directly

### Sender Verification
- **Check contact details** - Verify sender information
- **Use known channels** - Contact through trusted methods
- **Ask questions** - Confirm unusual requests
- **Trust your contacts** - But verify unexpected messages

### Content Awareness
- **Read carefully** - Look for suspicious language
- **Check grammar** - Poor writing can indicate scams
- **Verify claims** - Don't trust unbelievable offers
- **Report threats** - Help protect others

### System Security
- **Keep software updated** - Install security patches
- **Use antivirus software** - Protect against malware
- **Backup important data** - Protect against data loss
- **Use strong passwords** - Secure your accounts

## Privacy and Data Protection

### Your Information
- **Message content** - What you've received
- **Sender details** - Who contacted you
- **Security analysis** - What was detected
- **Threat reports** - What you've reported

### How Data is Protected
- **Local processing** - Most analysis happens on your device
- **Encrypted transmission** - Secure data transfer
- **Minimal collection** - Only essential information
- **Your control** - You decide what to share

### Community Protection
- **Anonymous reporting** - Share threats without personal info
- **Collective intelligence** - Benefit from community knowledge
- **Pattern recognition** - Learn from others' experiences
- **Continuous improvement** - System gets better over time

---

*The Security tab provides the technical analysis you need to understand the safety of any message and protect yourself from digital threats.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsSecurity = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Security Tab"
      subtitle="Technical security analysis and safety checks"
      content={logDetailsSecurityMd}
      createdDate={CREATED_DATE}
      updatedDate={UPDATED_DATE}
    />
  );
};

export default KnowledgeBaseLogDetailsSecurity; 