import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const logDetailsGeneralMd = `
The **General** tab provides the basic information about the analyzed message. This is your starting point for understanding what the message contains and who sent it.

## What You'll See

### Message Information
**What it shows:** Basic details about the message itself
**Includes:**
- **Subject/Title** - What the message is about
- **Sender** - Who sent the message
- **Timestamp** - When the message was received
- **Message Type** - Email, SMS, social media, etc.

**Why it matters:** This gives you the essential context for understanding the message

### Content Preview
**What it shows:** A preview of the message content
**How it's displayed:** The first few lines or a summary of the message
**What to look for:**
- **Urgent language** - "Act now" or "Limited time"
- **Requests for information** - Asking for personal details
- **Suspicious offers** - Promises that seem too good to be true
- **Threatening language** - Demands or consequences

**Why it matters:** The content preview helps you quickly identify potential red flags

### Sender Details
**What it shows:** Information about who sent the message
**Includes:**
- **Sender name** - Display name or contact name
- **Email address/phone** - Contact information
- **Domain information** - For emails, the sending domain
- **Contact status** - Whether you know this person

**Why it matters:** Unknown or suspicious senders are often indicators of threats

### Message Category
**What it shows:** How the message has been classified
**Common categories:**
- **Personal** - From known contacts
- **Business** - Work-related communications
- **Marketing** - Promotional messages
- **Unknown** - Unrecognized senders
- **Suspicious** - Flagged by security analysis

**Why it matters:** Categories help you understand the context and expected content

## Understanding the Information

### Safe Indicators
**Green flags that suggest a message is legitimate:**
- **Known sender** - Someone in your contacts
- **Expected content** - Matches the sender's usual communication
- **Professional domain** - Legitimate business email addresses
- **Appropriate timing** - Message arrives when expected

### Warning Signs
**Red flags that suggest potential threats:**
- **Unknown sender** - Someone you don't recognize
- **Urgent requests** - Demanding immediate action
- **Personal information requests** - Asking for sensitive data
- **Suspicious offers** - Promises that seem unrealistic
- **Poor grammar/spelling** - Unprofessional communication

### Context Matters
**Consider the full picture:**
- **Relationship with sender** - Do you know this person?
- **Expected communication** - Is this type of message normal?
- **Timing** - Does the urgency make sense?
- **Content** - Does the message match the sender's style?

## How to Use This Information

### Quick Assessment
1. **Check the sender** - Do you recognize them?
2. **Read the subject** - What is this about?
3. **Review the preview** - Any obvious red flags?
4. **Consider the category** - Does it match expectations?

### Making Decisions
**Based on what you see:**
- **Safe messages** - Proceed normally
- **Suspicious messages** - Check other tabs for more analysis
- **Unknown senders** - Be extra cautious
- **Urgent requests** - Verify before acting

### Next Steps
**After reviewing the General tab:**
- **If safe** - You can proceed with confidence
- **If suspicious** - Check the Security and Threat tabs
- **If unknown** - Look for additional context in other tabs
- **If threatening** - Review the Threat tab for specific guidance

## Common Scenarios

### Legitimate Urgency
**When urgent language is appropriate:**
- **Work emergencies** - From known colleagues
- **Family matters** - From family members
- **Account security** - From verified services
- **Medical situations** - From healthcare providers

**How to verify:**
- Contact the sender through known channels
- Check if the urgency makes sense
- Verify the sender's identity

### Suspicious Urgency
**When urgent language is concerning:**
- **Unknown senders** - People you don't know
- **Financial requests** - Asking for money or information
- **Account problems** - From unfamiliar services
- **Legal threats** - From unknown sources

**What to do:**
- Don't act immediately
- Check other tabs for analysis
- Verify independently if needed
- Report if suspicious

## Best Practices

### Regular Review
- **Check new messages** - Review details for unknown senders
- **Monitor patterns** - Look for repeated suspicious activity
- **Update contacts** - Keep your contact list current
- **Stay informed** - Learn about common threat patterns

### Verification Steps
- **Contact directly** - Use known contact methods
- **Check independently** - Don't use links in suspicious messages
- **Ask questions** - Verify unusual requests
- **Trust instincts** - If something feels wrong, investigate

### Security Habits
- **Don't rush** - Take time to evaluate messages
- **Verify senders** - Confirm identity before responding
- **Check context** - Consider the full situation
- **Report threats** - Help improve security for everyone

## Privacy Considerations

### Your Information
- **Message content** - What you've received
- **Sender details** - Who contacted you
- **Timing information** - When messages arrive
- **Contact relationships** - Who you know

### Data Protection
- **Local storage** - Information stays on your device
- **Your control** - You decide what to share
- **Secure processing** - Analysis happens locally
- **Minimal sharing** - Only essential data is transmitted

---

*The General tab gives you the essential context you need to understand any message and make informed decisions about how to respond.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsGeneral = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: General Tab"
      subtitle="Basic message information and content"
      content={logDetailsGeneralMd}
      createdDate={CREATED_DATE}
      updatedDate={UPDATED_DATE}
    />
  );
};

export default KnowledgeBaseLogDetailsGeneral; 