import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const logDetailsMetadataMd = `
The **Metadata** tab provides technical details about the message structure and delivery. This is where you'll find information about message headers, routing, and the technical context of how the message was sent and received.

## What You'll See

### Message Headers
**What it shows:** Technical information about how the message was sent
**How it's collected:** Extracted from the message's technical headers
**Common headers:**
- **From** - The sender's email address or contact information
- **To** - The recipient's address
- **Subject** - The message subject line
- **Date** - When the message was sent
- **Message-ID** - Unique identifier for the message

**Why it matters:** Headers can reveal information about the message's origin and routing

### Routing Information
**What it shows:** How the message traveled from sender to recipient
**How it's tracked:** Analysis of message delivery path
**Information includes:**
- **Sending server** - The server that sent the message
- **Receiving server** - The server that received it
- **Transit time** - How long the message took to arrive
- **Route path** - The path the message took

**Why it matters:** Unusual routing can indicate spoofing or other security issues

### Technical Specifications
**What it shows:** Technical details about the message format and encoding
**How it's analyzed:** Examination of message structure and format
**Specifications include:**
- **Message format** - Email, SMS, or other format
- **Encoding** - How the text is encoded
- **Size** - Total message size in bytes
- **Attachments** - Number and types of attached files

**Why it matters:** Technical details can reveal manipulation or unusual characteristics

### Link Analysis
**What it shows:** Detailed information about any links in the message
**How it's extracted:** Automated parsing of message content
**Analysis includes:**
- **URL count** - How many links were found
- **Link types** - HTTP, HTTPS, or other protocols
- **Domain information** - The websites the links point to
- **Link text** - The visible text for each link

**Why it matters:** Links are often the most dangerous part of threats

## Understanding Metadata

### Normal Patterns
**What to expect from legitimate messages:**
- **Consistent routing** - Messages follow expected paths
- **Proper headers** - All required headers are present
- **Reasonable timing** - Delivery times make sense
- **Known domains** - Links point to familiar websites

### Suspicious Indicators
**Red flags in metadata:**
- **Unusual routing** - Messages take unexpected paths
- **Missing headers** - Important technical information is absent
- **Spoofed addresses** - Sender address doesn't match routing
- **Suspicious domains** - Links point to unknown or fake websites

### Technical Anomalies
**Unusual technical characteristics:**
- **Very large messages** - May contain hidden content
- **Unusual encoding** - Could hide malicious content
- **Multiple redirects** - Links that bounce through many servers
- **Compressed content** - May hide harmful attachments

## How Metadata Analysis Works

### Header Parsing
The system extracts and analyzes:
- **Email headers** - For email messages
- **SMS metadata** - For text messages
- **Social media data** - For platform messages
- **Network information** - For all message types

### Route Tracing
Message delivery is tracked through:
- **Server logs** - Where available
- **Header analysis** - Using received headers
- **Timing analysis** - Delivery time patterns
- **Geographic data** - Server locations

### Link Extraction
Links are identified and analyzed:
- **Pattern matching** - Finding URL patterns in text
- **Domain resolution** - Checking where links actually go
- **Protocol analysis** - HTTP, HTTPS, or other protocols
- **Redirect tracking** - Following link redirects

### Technical Profiling
Messages are profiled for:
- **Size analysis** - Unusual message sizes
- **Format checking** - Proper message structure
- **Encoding verification** - Valid text encoding
- **Attachment scanning** - File type and size analysis

## Common Metadata Issues

### Email Spoofing
**What it looks like:**
- **Fake sender addresses** - From field doesn't match routing
- **Inconsistent headers** - Headers don't match the claimed sender
- **Unusual routing** - Messages from unexpected servers
- **Missing authentication** - No SPF, DKIM, or DMARC records

**How to detect:**
- Check the full email headers
- Look for authentication failures
- Verify sender addresses independently
- Compare routing with expected paths

### Link Manipulation
**What to watch for:**
- **Hidden redirects** - Links that go to different sites
- **URL shortening** - Shortened links that hide destinations
- **Domain spoofing** - URLs that look legitimate but aren't
- **Protocol switching** - HTTP instead of HTTPS

**How to protect yourself:**
- Hover over links to see real destinations
- Use link preview tools
- Check domain names carefully
- Avoid clicking suspicious links

### Message Tampering
**Signs of manipulation:**
- **Modified headers** - Headers that don't match content
- **Unusual encoding** - Content that's been altered
- **Size discrepancies** - Message size doesn't match content
- **Timing anomalies** - Messages sent at unusual times

**What to do:**
- Verify message authenticity
- Check with the sender directly
- Look for other suspicious indicators
- Report if manipulation is detected

## Using Metadata for Security

### Verification Steps
1. **Check sender consistency** - Does the sender match the routing?
2. **Verify link destinations** - Where do the links actually go?
3. **Review timing** - Does the delivery time make sense?
4. **Examine headers** - Are all headers present and correct?

### Pattern Recognition
- **Repeated threats** - Similar metadata patterns
- **Known attackers** - Consistent technical signatures
- **Attack methods** - Common metadata manipulation techniques
- **Geographic patterns** - Threats from specific regions

### Technical Indicators
- **Server reputation** - Known malicious servers
- **Domain age** - Recently registered suspicious domains
- **Routing anomalies** - Unusual delivery paths
- **Header inconsistencies** - Technical discrepancies

## Privacy and Technical Details

### What's Collected
- **Message structure** - How the message is formatted
- **Routing information** - How it was delivered
- **Technical specifications** - Format and encoding details
- **Link information** - URLs and their destinations

### What's Protected
- **Message content** - The actual text is analyzed locally
- **Personal information** - Sender and recipient details
- **Technical data** - Only used for security analysis
- **Your privacy** - No personal data is shared

### Data Retention
- **Local storage** - Metadata stays on your device
- **Temporary analysis** - Used only for threat detection
- **Your control** - You decide what to keep
- **Secure processing** - All analysis is encrypted

## Best Practices

### Regular Review
- **Check metadata** - Review technical details regularly
- **Monitor patterns** - Look for repeated suspicious activity
- **Update knowledge** - Stay informed about new threats
- **Report issues** - Help improve detection systems

### Technical Awareness
- **Learn about headers** - Understand what they mean
- **Check routing** - Verify message paths
- **Examine links** - Look at link destinations
- **Trust but verify** - Don't assume everything is safe

### Security Habits
- **Verify sources** - Check message origins
- **Examine links** - Look before you click
- **Report threats** - Help protect others
- **Stay updated** - Keep security knowledge current

---

*The Metadata tab provides the technical context you need to understand how messages are delivered and identify potential security issues.*`;

const CREATED_DATE = '2024-12-15';
const UPDATED_DATE = new Date().toISOString().split('T')[0];

const KnowledgeBaseLogDetailsMetadata = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Metadata Tab"
      subtitle="Technical details and message structure"
      content={logDetailsMetadataMd}
      createdDate={CREATED_DATE}
      updatedDate={UPDATED_DATE}
    />
  );
};

export default KnowledgeBaseLogDetailsMetadata; 