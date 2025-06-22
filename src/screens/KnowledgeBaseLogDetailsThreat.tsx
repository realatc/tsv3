import React from 'react';
import KnowledgeBaseArticle from '../components/KnowledgeBaseArticle';

const content = `# Log Details: Threat Tab

## Overview

The Threat Tab provides comprehensive AI-powered threat analysis for each log entry. This tab displays threat levels, confidence scores, categories, and detailed breakdowns to help you understand the security implications of detected communications.

## Threat Assessment Section

### Threat Level
- **Visual Indicator**: Color-coded badge showing threat severity
- **Score Display**: Numerical score (0-100) indicating overall threat level
- **Level Categories**: Low, Medium, High, Critical

### Confidence Score
- **Percentage Display**: Shows AI confidence in the threat assessment
- **Reliability Indicator**: Higher confidence means more reliable analysis

### Threat Categories
The system identifies specific threat types using visual icons:

::threat_categories::

### Summary
- **AI-Generated Summary**: Concise explanation of the threat
- **Key Points**: Highlights the most important security concerns
- **Action Items**: Suggested next steps for threat response

## Score Breakdown Section

### Detailed Analysis
- **Component Scores**: Individual factors contributing to the threat level
- **Point System**: Each factor adds points to the overall score
- **Transparency**: Clear explanation of how the score was calculated

### Common Factors
- **Sender Reputation**: Historical behavior and trustworthiness
- **Content Analysis**: Suspicious patterns in message content
- **URL Safety**: Links to malicious or suspicious websites
- **Timing Patterns**: Unusual communication timing
- **Language Analysis**: Deceptive or manipulative language

## Understanding the Analysis

### Threat Level Interpretation
- **Low (0-25)**: Minimal risk, routine monitoring
- **Medium (26-50)**: Moderate concern, increased vigilance
- **High (51-75)**: Significant threat, immediate attention
- **Critical (76-100)**: Severe threat, urgent response required

### Confidence Score Meaning
- **90-100%**: Very high confidence in analysis
- **70-89%**: High confidence with minor uncertainty
- **50-69%**: Moderate confidence, consider additional factors
- **Below 50%**: Low confidence, manual review recommended

### Category Combinations
Multiple categories may be assigned to a single threat:
- **Phishing + Impersonation**: Fake entity trying to steal credentials
- **Scam + Urgent**: Time-sensitive fraudulent scheme
- **Unsolicited + Suspicious**: Unwanted communication with concerning elements

## Best Practices

### For High Threat Levels
1. **Immediate Action**: Review and respond quickly
2. **Documentation**: Record all details for incident response
3. **Reporting**: Report to appropriate security teams
4. **Blocking**: Consider blocking sender if appropriate

### For Medium Threat Levels
1. **Vigilance**: Monitor for escalation
2. **Verification**: Verify sender identity through other channels
3. **Caution**: Exercise caution with any links or attachments

### For Low Threat Levels
1. **Monitoring**: Continue routine monitoring
2. **Education**: Use as training examples
3. **Baseline**: Establish normal communication patterns

## Technical Details

### AI Analysis Process
1. **Content Scanning**: Analyzes message text and metadata
2. **Pattern Recognition**: Identifies known threat patterns
3. **Risk Assessment**: Calculates threat probability and severity
4. **Classification**: Assigns appropriate categories
5. **Scoring**: Generates numerical threat score

### Data Sources
- **Internal Database**: Historical threat patterns
- **External APIs**: Real-time threat intelligence
- **Machine Learning**: Continuously improving models
- **User Feedback**: Learning from user actions

### Update Frequency
- **Real-time**: Immediate analysis of new messages
- **Continuous**: Ongoing model improvements
- **Periodic**: Regular threat intelligence updates`;

const KnowledgeBaseLogDetailsThreat = () => {
  return (
    <KnowledgeBaseArticle
      title="Log Details: Threat Tab"
      subtitle="AI analysis and threat assessment"
      content={content}
    />
  );
};

export default KnowledgeBaseLogDetailsThreat; 