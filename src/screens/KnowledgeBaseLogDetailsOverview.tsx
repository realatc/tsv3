import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `# Understanding the Log Details Screen

The **Log Details Screen** is your comprehensive threat analysis dashboard. When ThreatSense detects a potential threat, this screen provides you with complete information about what was detected, how it was analyzed, and what you should do about it.

## Overview of the Tabs

The Log Details Screen is organized into four main tabs, each providing different perspectives on the threat:

### 🔍 **General Tab** - The Basics
**Purpose:** Essential facts about the threat
**What you'll find:** Date, sender information, message content, and category
**Best for:** Quick understanding of what happened and who was involved

### 🛡️ **Security Tab** - Technical Analysis  
**Purpose:** AI and security system analysis
**What you'll find:** NLP analysis, behavioral analysis, and URL safety checks
**Best for:** Understanding why the message was flagged as suspicious

### 📊 **Metadata Tab** - Technical Details
**Purpose:** Context and detection information
**What you'll find:** Device info, location, timing, and detection methods
**Best for:** Understanding the technical context of the threat

### ⚠️ **Threat Tab** - Risk Assessment
**Purpose:** Overall threat evaluation and scoring
**What you'll find:** Threat level, risk score, and detailed breakdown
**Best for:** Making informed decisions about how to respond

## How the Analysis Works

### Multi-Layer Detection
ThreatSense uses multiple analysis methods to evaluate threats:

1. **Content Analysis (NLP)**
   - AI-powered text analysis
   - Identifies suspicious language patterns
   - Detects impersonation attempts
   - Flags emotional manipulation tactics

2. **Behavioral Analysis**
   - Compares sender against your contact history
   - Analyzes communication patterns
   - Matches against known threat templates
   - Evaluates timing and context

3. **Technical Analysis**
   - URL safety checks via Google Safe Browsing
   - Domain reputation analysis
   - Attachment and link analysis
   - Network and device context

4. **Risk Scoring**
   - Combines all analysis results
   - Assigns numerical risk scores
   - Provides actionable recommendations
   - Tracks threat patterns over time

### Real-Time vs. Historical Data
The screen shows both current and historical information:

**Real-Time Analysis:**
- Current URL extraction and safety checks
- Live threat assessment
- Up-to-date sender information
- Current message analysis

**Historical Data:**
- Original detection metadata
- Stored analysis results
- Historical sender patterns
- Detection method records

## How to Use the Log Details Screen

### Step 1: Start with the General Tab
Begin by understanding the basic facts:
- **When** did this happen?
- **Who** sent the message?
- **What** type of communication?
- **What** did they say?

### Step 2: Check the Security Tab
Review the technical analysis:
- **Why** was this flagged as suspicious?
- **What** specific patterns were detected?
- **Are** any links dangerous?
- **How** sophisticated is the threat?

### Step 3: Review the Metadata Tab
Understand the context:
- **Where** was this detected?
- **What** device was targeted?
- **How** was it detected?
- **What** detection methods were used?

### Step 4: Evaluate the Threat Tab
Make your decision:
- **What** is the overall risk level?
- **How** was the score calculated?
- **What** should you do next?
- **How** should you respond?

## Making Informed Decisions

### High-Risk Threats (Red)
**Characteristics:** Multiple red flags, clear scam indicators, dangerous content
**Actions:**
- ✅ Block the sender immediately
- ✅ Do not click any links
- ✅ Do not provide personal information
- ✅ Report the threat
- ✅ Delete the message
- ✅ Warn others about similar threats

### Medium-Risk Threats (Yellow)
**Characteristics:** Some suspicious elements, unknown sender, mixed signals
**Actions:**
- ⚠️ Verify the sender independently
- ⚠️ Be cautious with any links
- ⚠️ Don't provide sensitive information
- ⚠️ Monitor for similar threats
- ⚠️ Consider blocking if suspicious

### Low-Risk Threats (Green)
**Characteristics:** Minimal indicators, known sender, clean analysis
**Actions:**
- ✅ Still exercise caution
- ✅ Verify unusual requests
- ✅ Report if something feels wrong
- ✅ Monitor for changes in behavior

## Understanding False Positives

### What Are False Positives?
False positives occur when legitimate messages are incorrectly flagged as threats. This can happen when:
- **Urgent language** is used for legitimate reasons
- **New senders** contact you for valid purposes
- **Links** point to new but legitimate websites
- **Language patterns** resemble scams but are legitimate

### How to Handle False Positives
1. **Check the breakdown** - See which factors triggered the alert
2. **Verify independently** - Contact the sender through known channels
3. **Consider context** - Is the urgent language justified?
4. **Trust your instincts** - If something feels wrong, investigate
5. **Report if needed** - Help improve the system

## Privacy and Security

### Your Data Protection
- **Local processing** - Most analysis happens on your device
- **Minimal sharing** - Only essential data is shared for threat detection
- **Your control** - You control what data is collected and stored
- **Transparency** - You can see exactly what information is stored

### Data Collection
The system collects only the information necessary for threat detection:
- **Message content** - For analysis
- **Sender information** - For reputation checking
- **Device context** - For threat patterns
- **Timing information** - For behavioral analysis

## Tips for Effective Use

### Regular Review
- **Check new threats** as they're detected
- **Review patterns** across multiple threats
- **Update your security** based on trends
- **Report issues** to help improve detection

### Pattern Recognition
- **Note common tactics** used against you
- **Identify vulnerable times** or contexts
- **Track sender patterns** and behaviors
- **Monitor threat evolution** over time

### Continuous Learning
- **Stay informed** about new threat types
- **Learn from each threat** you encounter
- **Share knowledge** with others
- **Contribute to improvement** through feedback

## Getting Help

### When to Seek Additional Help
- **Complex threats** that you're unsure about
- **Repeated attacks** from the same source
- **Sophisticated scams** that seem legitimate
- **Financial threats** or identity theft attempts

### Available Resources
- **Knowledge Base** - Detailed information about threats
- **Community Reports** - Shared threat intelligence
- **Security Updates** - Latest threat information
- **Support Team** - Expert assistance when needed

---

*The Log Details Screen is designed to give you complete visibility into threats while providing actionable guidance for your response. Use all four tabs together for the most comprehensive understanding of each threat.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsOverview = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Overview"
      subtitle="Understanding the threat analysis dashboard"
      content={content}
    />
  );
};

export default KnowledgeBaseLogDetailsOverview; 