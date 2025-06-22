import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `# How Threat Levels Are Calculated

The app calculates threat levels for logs using a simple rule-based scoring system. Here's how it works:

## Inputs Used
- NLP Analysis: A string describing the content analysis of the message.
- Behavioral Analysis: A string describing the sender's behavior and context.
- Sender: The sender's email or phone number.

## Scoring Logic
For each log, the app checks for certain keywords in the NLP and behavioral analysis strings, as well as the sender's address. Points are added to a score based on the following rules:

### NLP Analysis:
- If it contains "urgent", "suspicious", or "threat" → +2 points
- If it contains "impersonation", "phishing", or "scam" → +2 points

### Behavioral Analysis:
- If it contains "not in contacts" → +1 point
- If it contains "matches scam" or "matches robocall" → +2 points

### Sender:
- If the sender ends with "@fakebank.com", or includes "irs" or "randomsms" → +2 points

## Threat Level & Scoring
- The maximum possible score is 9.
- The threat level is assigned as:
    - High: score ≥ 4
    - Medium: score ≥ 2 and < 4
    - Low: score < 2
- The badge will display the threat level and the score (e.g., High (7/9)).

## Example
If a log's NLP analysis is "Urgent language, suspicious link, impersonation detected." and the behavioral analysis is "Sender not in contacts. Matches known phishing patterns." the score would be:
- "urgent" → +2
- "suspicious" → +2
- "impersonation" → +2
- "not in contacts" → +1
- "matches" (if "matches scam" or "matches robocall") → +2
- Total: 9 (100%), so the threat level is High.

## Summary
The app uses keyword-based scoring from NLP and behavioral analysis strings, plus sender info, to assign a threat level and percentage to each log.`;

const KnowledgeBaseThreatLevelArticle = () => {
  return (
    <KnowledgeBaseArticle
      title="How Threat Levels Are Calculated"
      subtitle="The logic behind the app's threat scoring system"
      content={content}
    />
  );
};

export default KnowledgeBaseThreatLevelArticle; 