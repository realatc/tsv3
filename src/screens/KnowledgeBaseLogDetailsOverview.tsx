import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const logDetailsOverviewMd = `
The **Log Details** screen is your comprehensive view of any message that has been analyzed by ThreatSense. This screen provides detailed information about the message's content, security status, metadata, and threat assessment.

## What You'll Find Here

### Four Main Tabs
The Log Details screen is organized into four specialized tabs, each focusing on a different aspect of the message analysis:

1. **General Tab** - Basic message information and content
2. **Security Tab** - Security analysis and safety checks
3. **Metadata Tab** - Technical details and message structure
4. **Threat Tab** - AI-powered threat assessment and analysis

### Navigation
- **Tab Navigation** - Swipe between tabs or tap tab headers
- **Learn More** - Each tab has an info icon (ℹ️) that links to detailed documentation
- **Back Navigation** - Use the back button to return to the previous screen

## How to Use This Screen

### Getting Started
1. **Select a message** from your log history
2. **Review the overview** - Check the threat level indicator at the top
3. **Explore each tab** - Tap through the tabs to understand different aspects
4. **Read the details** - Each section provides specific information about the message

### Understanding the Information
- **Green indicators** usually mean safe or normal
- **Yellow indicators** suggest caution or minor concerns
- **Red indicators** indicate potential threats or serious issues
- **Blue indicators** provide neutral information or context

### Taking Action
Based on what you find:
- **Safe messages** - No action needed
- **Suspicious messages** - Exercise caution, don't click links
- **Threatening messages** - Block sender, delete message, report if necessary

## Key Features

### Real-time Analysis
All information is generated in real-time using:
- **AI analysis** of message content
- **Security checks** against known threats
- **Pattern recognition** for common scams
- **URL safety verification** using Google Safe Browsing

### Comprehensive Coverage
The analysis covers:
- **Message content** - What the message says
- **Sender information** - Who sent it
- **Technical details** - How it was sent
- **Security status** - Whether it's safe
- **Threat assessment** - Risk level and specific concerns

### User-friendly Interface
- **Clear organization** - Information is logically grouped
- **Visual indicators** - Color-coded status indicators
- **Easy navigation** - Intuitive tab-based interface
- **Detailed explanations** - Each section includes helpful context

## Understanding the Tabs

### General Tab
**Purpose:** Basic message information and content overview
**What you'll see:**
- Message subject and sender
- Content preview
- Timestamp and message size
- Basic categorization

### Security Tab
**Purpose:** Security analysis and safety assessment
**What you'll see:**
- URL safety status
- Attachment analysis
- Sender reputation
- Security recommendations

### Metadata Tab
**Purpose:** Technical details about the message
**What you'll see:**
- Message headers
- Routing information
- Technical specifications
- Link analysis

### Threat Tab
**Purpose:** AI-powered threat assessment
**What you'll see:**
- Threat level and confidence score
- Detailed threat analysis
- Specific risk factors
- Recommended actions

## Best Practices

### Regular Review
- **Check new messages** - Review details for suspicious messages
- **Monitor patterns** - Look for repeated threats or scams
- **Stay informed** - Use the knowledge base to learn about threats

### Taking Action
- **Don't panic** - Take time to understand the threat
- **Verify information** - Check multiple indicators
- **Use caution** - When in doubt, err on the side of safety
- **Report threats** - Help improve the system by reporting issues

### Learning and Improvement
- **Read the analysis** - Understand why messages are flagged
- **Use the knowledge base** - Learn about different threat types
- **Share knowledge** - Help others understand threats
- **Stay updated** - Keep the app updated for latest protections

## Privacy and Security

### Your Data
- **Local processing** - Most analysis happens on your device
- **Minimal sharing** - Only essential data is shared for threat detection
- **Your control** - You decide what to report and share
- **Secure storage** - Your data is protected and encrypted

### Threat Detection
- **Continuous monitoring** - The system constantly improves
- **Community protection** - Benefits from collective threat knowledge
- **Regular updates** - Detection patterns are updated frequently
- **Accuracy focus** - Designed to minimize false positives

## Getting Help

### Built-in Resources
- **Knowledge base** - Comprehensive documentation for each feature
- **Contextual help** - Info icons provide specific guidance
- **Clear explanations** - Each section includes helpful descriptions

### Additional Support
- **App settings** - Customize your experience
- **User guides** - Step-by-step instructions
- **Community resources** - Learn from other users

---

*The Log Details screen provides you with everything you need to understand and respond to any message that ThreatSense analyzes.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsOverview = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Overview"
      subtitle="Comprehensive message analysis and details"
      content={logDetailsOverviewMd}
      createdDate={CREATED_DATE}
      updatedDate={UPDATED_DATE}
    />
  );
};

export default KnowledgeBaseLogDetailsOverview; 