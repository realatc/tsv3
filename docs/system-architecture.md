# System Architecture

## Overview

This diagram shows the complete system architecture of ThreatSense, including data flow, component interactions, and the processing pipeline from user input to threat assessment.

## Diagram

```mermaid
graph LR
    A[User Input] --> B[Input Parser]
    B --> C[Content Analysis]
    B --> D[URL Analysis]
    B --> E[Sender Analysis]
    
    C --> F[Perplexity AI Analysis]
    D --> G[Google Safe Browsing]
    E --> H[Contact History]
    
    F --> I[Risk Calculator]
    G --> I
    H --> I
    
    I --> J[Threat Level]
    J --> K{Threat Level?}
    
    K -->|Critical| L[Block & Alert]
    K -->|High| M[Alert & Log]
    K -->|Medium| N[Log & Warn]
    K -->|Low| O[Log Only]
    
    L --> Q[Sentry Mode]
    M --> Q
    N --> R[UI Update]
    O --> R
    
    Q --> S[Contact Notifications]
    R --> T[User Interface]
    
    %% Related Content Flow
    T --> U[Related Content]
    U --> V[Gemini AI Query Generation]
    V --> W[Google Custom Search]
    W --> X[Related Articles]
    
    style A fill:#e1f5fe
    style F fill:#e3f2fd
    style V fill:#e3f2fd
    style I fill:#fff3e0
    style K fill:#f3e5f5
    style Q fill:#ffebee
    style T fill:#e8f5e8
```

## Component Details

### Input Processing
- **User Input**: Text messages, URLs, or content from various sources
- **Input Parser**: Validates and normalizes input data
- **Content Analysis**: Extracts key information and patterns
- **URL Analysis**: Checks links for safety using Google Safe Browsing
- **Sender Analysis**: Evaluates sender history and trustworthiness

### AI Processing
- **Perplexity AI Analysis**: Primary threat analysis using Perplexity's cybersecurity expertise
  - Analyzes text for phishing indicators, social engineering, malware patterns
  - Provides threat level, detailed summary, and actionable recommendations
  - Uses advanced cybersecurity guidelines and real-time threat intelligence
- **Google Safe Browsing**: Validates URLs against Google's threat database
- **Contact History**: Analyzes previous interactions with the sender

### Risk Assessment
- **Risk Calculator**: Combines all analysis results into a threat score
- **Threat Level**: Determines the appropriate response level (Low, Medium, High, Critical)
- **Decision Logic**: Routes to appropriate handling based on threat level

### Response System
- **Sentry Mode**: Emergency notification system for high-threat situations
- **UI Updates**: Real-time interface updates for user awareness
- **Contact Notifications**: Automated alerts to trusted contacts
- **User Interface**: Clean, intuitive display of results and status

### Related Content Generation
- **Gemini AI Query Generation**: Uses Gemini to create search queries from threat analysis
- **Google Custom Search**: Finds relevant articles and news about similar threats
- **Related Articles**: Provides users with contextual information and resources 