import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `# Log Details: General Tab

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

const KnowledgeBaseLogDetailsGeneral = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: General Tab"
      subtitle="Basic message information and content"
      content={content}
    />
  );
};

export default KnowledgeBaseLogDetailsGeneral; 