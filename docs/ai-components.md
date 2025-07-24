# AI Components

## Overview

ThreatSense leverages multiple AI technologies to provide comprehensive threat detection and analysis.

## Diagram

```mermaid
graph LR
    subgraph "AI Analysis Engine"
        A[Gemini AI] --> B[Language Model]
        C[Perplexity AI] --> D[Threat Intel]
        E[Google Custom Search] --> F[Related Articles]
    end
    
    subgraph "Security APIs"
        G[Google Safe Browsing] --> H[URL Safety]
        I[DNS Services] --> J[Domain Reputation]
        K[SSL Checker] --> L[Certificate Validation]
    end
    
    subgraph "Local Processing"
        M[Pattern Matching] --> N[Keyword Analysis]
        O[Contact History] --> P[Behavioral Analysis]
        Q[Risk Calculator] --> R[Threat Scoring]
    end
    
    B --> Q
    D --> Q
    F --> Q
    H --> Q
    J --> Q
    L --> Q
    N --> Q
    P --> Q
    
    Q --> S[Final Assessment]
    
    style A fill:#e3f2fd
    style C fill:#e3f2fd
    style E fill:#e3f2fd
    style G fill:#fff3e0
    style I fill:#fff3e0
    style K fill:#fff3e0
    style M fill:#f3e5f5
    style O fill:#f3e5f5
    style Q fill:#ffebee
    style S fill:#e8f5e8
```

## AI Technology Stack

### Core AI Engines
- **Gemini AI**: Google's advanced language model for text analysis
- **Perplexity AI**: Real-time threat intelligence and research
- **Google Custom Search**: Contextual article and news retrieval

### Security APIs
- **Google Safe Browsing**: URL reputation and safety checking
- **DNS Services**: Domain reputation and blacklist checking
- **SSL Checker**: Certificate validation and encryption verification

### Local Processing
- **Pattern Matching**: Rule-based threat pattern detection
- **Keyword Analysis**: Suspicious keyword and phrase identification
- **Contact History**: Behavioral analysis of sender patterns
- **Risk Calculator**: Multi-factor threat scoring algorithm

### Integration Points
- **Data Fusion**: Combines all analysis results
- **Weighted Scoring**: Applies different weights to different factors
- **Context Awareness**: Considers user context and history
- **Real-time Updates**: Continuous learning and adaptation 