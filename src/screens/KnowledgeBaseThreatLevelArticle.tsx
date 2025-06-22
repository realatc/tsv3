import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `
# How Threat Levels Are Calculated

ThreatSense uses a sophisticated algorithm to determine the risk level of incoming messages and communications. Here's how our threat assessment works:

## Threat Level Categories

### 🟢 Low Risk
- Messages from known, trusted contacts
- No suspicious patterns detected
- Safe content and links
- Normal communication patterns

### 🟡 Medium Risk
- Messages from unknown senders
- Contains links to external websites
- Requests for personal information
- Unusual timing or frequency

### 🟠 High Risk
- Suspicious link patterns
- Requests for financial information
- Urgent or threatening language
- Impersonation attempts detected

### 🔴 Critical Risk
- Confirmed phishing attempts
- Malicious links or attachments
- Financial scam indicators
- Immediate action required

## Analysis Factors

Our system evaluates multiple factors:

### 1. Sender Analysis
- Known vs unknown sender
- Sender reputation score
- Previous interaction history
- Domain authenticity

### 2. Content Analysis
- Keyword detection
- Language patterns
- Urgency indicators
- Request types

### 3. Link Analysis
- URL safety checks
- Domain reputation
- Redirect patterns
- SSL certificate validation

### 4. Behavioral Analysis
- Message timing
- Frequency patterns
- Response urgency
- Social engineering indicators

## Real-Time Updates

Threat levels are updated in real-time as new information becomes available. Our system continuously learns from:
- User feedback
- New threat patterns
- Security research
- Community reports

## Privacy Protection

All analysis is performed locally on your device when possible, ensuring your privacy is protected while maintaining security.`;

const KnowledgeBaseThreatLevelArticle = () => {
  return (
    <KnowledgeBaseArticle
      title="How Threat Levels Are Calculated"
      subtitle="Understanding our risk assessment system"
      content={content}
    />
  );
};

export default KnowledgeBaseThreatLevelArticle; 