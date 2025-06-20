# Log Details: Metadata Tab

The **Metadata** tab provides technical details about how the threat was detected and processed. This information helps you understand the context of the threat and how ThreatSense analyzed it.

## What You'll See

### Message Metadata

#### Device
**What it shows:** The device that detected and processed the threat
**How it's collected:** Automatically detected from your device information
**Example:** "iPhone 15"
**Why it matters:** Helps identify which device was targeted and track threats across multiple devices

#### Location
**What it shows:** General location where the threat was detected
**How it's collected:** Based on your device's location settings (with your permission)
**Example:** "Austin, TX"
**Why it matters:** Some threats target specific geographic areas or occur during travel

#### Received At
**What it shows:** Exact timestamp when the threat was detected
**How it's collected:** Automatically captured when the message is processed
**Format:** ISO 8601 timestamp (e.g., "2024-12-15T14:30:00Z")
**Why it matters:** Precise timing helps track threat patterns and response times

#### Message Length
**What it shows:** Number of characters in the message
**How it's collected:** Automatically calculated from the message content
**Example:** "245 characters"
**Why it matters:** Longer messages may contain more complex threats or multiple suspicious elements

#### Sender History
**What it shows:** How many previous messages you've received from this sender
**How it's collected:** Counted from your message history
**Example:** "1 previous messages"
**Why it matters:** New or unknown senders are often more suspicious than familiar contacts

#### Sender Flagged
**What it shows:** Whether this sender has been previously flagged as suspicious
**How it's collected:** Based on your previous threat reports and community reports
**Values:** "Yes", "No", or "Unknown"
**Why it matters:** Previously flagged senders are more likely to be threats

#### Attachments
**What it shows:** Whether the message contained any file attachments
**How it's collected:** Analyzed from the message structure
**Example:** "None" or "PDF, 2.3MB"
**Why it matters:** Attachments can contain malware or be used in sophisticated attacks

#### Links
**What it shows:** Number of links detected in the message (historical record)
**How it's collected:** Counted when the message was first analyzed and stored as metadata
**Example:** "1" or "3"
**Why it matters:** Multiple links may indicate more complex threats

#### URLs Found
**What it shows:** The actual URLs extracted from the message (current analysis)
**How it's collected:** Real-time extraction using regex patterns to find URLs in the message text
**Example:** "https://paypal-verify-account.com/secure/login"
**Why it matters:** Shows exactly what links were found, not just the count

**Key Difference:** 
- **Links** = Historical count stored when first analyzed
- **URLs Found** = Current real-time extraction of actual URLs

#### Network
**What it shows:** Type of network connection when the threat was detected
**How it's collected:** Detected from your device's network status
**Example:** "Wi-Fi", "Cellular", "Ethernet"
**Why it matters:** Some threats are more common on certain network types

#### App Version
**What it shows:** Version of ThreatSense that detected the threat
**How it's collected:** From the app's version information
**Example:** "1.2.3"
**Why it matters:** Helps track which app versions detected which threats

#### Threat Detection
**What it shows:** Which detection methods were used to analyze this threat
**How it's collected:** Recorded during the analysis process
**Example:** "NLP, Safe Browsing"
**Why it matters:** Shows the breadth of analysis applied to the threat

#### Geolocation
**What it shows:** More detailed location information (if available)
**How it's collected:** Enhanced location data with your permission
**Example:** "Austin, TX, USA"
**Why it matters:** Provides context for location-based threats

## Understanding Metadata vs. Runtime Analysis

### Stored Metadata (Historical)
- **Purpose:** Preserves the original analysis results
- **When collected:** When the threat is first detected
- **Examples:** Links count, sender history, device info
- **Benefits:** Consistent historical record, faster loading

### Runtime Analysis (Current)
- **Purpose:** Provides current, accurate information
- **When collected:** Every time you view the details
- **Examples:** URLs Found, current threat assessment
- **Benefits:** Always up-to-date, reflects any changes

## How This Information Helps You

### Threat Context
Metadata provides important context about:
- **When and where** the threat occurred
- **What device** was targeted
- **How sophisticated** the threat was
- **What detection methods** were used

### Pattern Analysis
By reviewing metadata across multiple threats, you can identify:
- **Geographic patterns** in threats
- **Device-specific targeting**
- **Network vulnerabilities**
- **Timing patterns** in attacks

### Security Improvements
Metadata helps you:
- **Identify weak points** in your security
- **Understand threat trends**
- **Make informed security decisions**
- **Track the effectiveness** of security measures

## Privacy and Security

### Data Collection
- **Local processing:** Most analysis happens on your device
- **Minimal sharing:** Only essential data is shared for threat detection
- **Your control:** You can control what data is collected
- **Transparency:** This tab shows exactly what information is stored

### Data Protection
- **Encrypted storage:** All metadata is encrypted
- **Secure transmission:** Data is transmitted securely
- **Access control:** Only you can access your threat data
- **Data retention:** You control how long data is kept

## Tips for Using This Tab

1. **Review all fields** - Each piece of metadata provides valuable context
2. **Compare with other threats** - Look for patterns across multiple threats
3. **Check the timing** - Note when threats occur most frequently
4. **Monitor device patterns** - See if certain devices are targeted more
5. **Track detection methods** - Understand how threats are being caught

---

*Metadata helps ThreatSense provide more accurate threat detection and gives you insights into your security patterns.* 