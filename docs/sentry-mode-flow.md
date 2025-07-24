# Sentry Mode Emergency Flow

## Overview

Sentry Mode is ThreatSense's emergency notification system that automatically alerts trusted contacts when threats are detected above a specified threshold.

## Diagram

```mermaid
flowchart LR
    A[Threat Detected] --> B{Is Sentry Mode Enabled?}
    B -->|No| C[Continue Normal Flow]
    B -->|Yes| D{Threat Level >= Threshold?}
    
    D -->|No| C
    D -->|Yes| E[Generate Alert ID]
    
    E --> F[Prepare Notification]
    F --> G[Send SMS Alert]
    F --> H[Send Email Alert]
    F --> I[Send Push Notification]
    
    G --> J[Wait for Response]
    H --> J
    I --> J
    
    J --> K{Response Received?}
    K -->|No| L[Escalate Alert]
    K -->|Yes| M[Process Response]
    
    M --> N{Response Type?}
    N -->|OK| O[Acknowledge]
    N -->|Help| P[Contact Emergency]
    N -->|Ignore| Q[Log Response]
    
    O --> R[End Process]
    P --> R
    Q --> R
    L --> R
    
    style A fill:#ffebee
    style E fill:#fff3e0
    style F fill:#e3f2fd
    style J fill:#f3e5f5
    style R fill:#e8f5e8
```

## Flow Explanation

### 1. Threat Detection
- **Trigger**: High-threat content detected by AI analysis
- **Threshold Check**: Compares threat level against user-configured threshold
- **Mode Verification**: Ensures Sentry Mode is enabled

### 2. Alert Generation
- **Alert ID**: Unique identifier for tracking the incident
- **Multi-Channel**: Simultaneous notifications via SMS, email, and push
- **Contact Selection**: Targets pre-configured trusted contacts

### 3. Response Handling
- **Timeout**: Waits for contact response within configured timeframe
- **Escalation**: Automatic escalation if no response received
- **Response Processing**: Handles different types of contact responses

### 4. Response Types
- **OK**: Contact acknowledges and confirms safety
- **Help**: Contact requests emergency assistance
- **Ignore**: Contact dismisses the alert

### 5. Process Completion
- **Logging**: All actions and responses are logged
- **Cleanup**: Alert resources are released
- **Recovery**: System returns to normal monitoring state 