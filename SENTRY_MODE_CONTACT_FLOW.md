# Sentry Mode Contact Alert Flow

## Overview

Sentry Mode creates a comprehensive emergency notification system that automatically alerts trusted contacts when threats are detected. This document explains the complete flow from threat detection to contact response.

## Contact Alert Flow

### 1. Threat Detection & Alert Triggering

**When a threat is detected:**
- ThreatSense analyzes incoming messages/texts
- If threat level meets or exceeds user's threshold, Sentry Mode activates
- System automatically sends notifications to trusted contact through multiple channels

**Alert Channels:**
- **SMS Text Message** (Primary)
- **Email Notification** (Secondary)
- **Push Notification** (If contact has ThreatSense app)

### 2. What the Trusted Contact Receives

#### SMS Message Content:
```
🚨 THREAT ALERT 🚨

[Contact Name], your trusted contact has been notified of a [Threat Level] level threat.

Threat: [Threat Type]
Details: [Description]
Time: [Timestamp]
Location: [GPS Location if available]

Please check on them immediately.

Reply with:
- "OK" to acknowledge
- "CALL" to call them
- "TEXT" to send a message
- "IGNORE" if this is a false alarm

Stay safe!
```

#### Email Content:
- Professional email with detailed threat information
- Clear instructions on immediate actions
- Response options and emergency procedures
- Contact information for support

### 3. Contact Response Options

The trusted contact can respond in several ways:

#### A. Acknowledgment Response
- **Action**: Reply "OK" to SMS or email
- **Result**: Main user receives confirmation that contact is aware
- **Timeline**: Expected within 5 minutes

#### B. Direct Contact Response
- **Action**: Reply "CALL" or "TEXT"
- **Result**: Contact initiates direct communication
- **Timeline**: Immediate action

#### C. Emergency Response
- **Action**: Reply "EMERGENCY" to email
- **Result**: Triggers additional emergency protocols
- **Timeline**: Immediate escalation

#### D. No Response
- **Action**: Contact doesn't respond within 5 minutes
- **Result**: System suggests main user call contact directly
- **Timeline**: 5-minute timeout

### 4. What the Main User Experiences

#### Immediate Alert:
- Local notification showing alert was sent
- Options to call or text contact directly
- Clear explanation of what contact received

#### Contact Response:
- Real-time updates when contact responds
- Different messages based on response type
- Guidance on next steps

#### Response Messages:
- **"Acknowledged"**: "They have acknowledged the alert and are checking on you."
- **"Calling"**: "They are calling you now. Please answer your phone."
- **"Texting"**: "They are sending you a text message. Check your messages."
- **"Emailing"**: "They are sending you an email with further instructions."
- **"Ignored"**: "They have not responded to the alert. Consider calling them directly."

### 5. Live Environment Implementation

#### OS Contact Integration:
- **Real Contact Selection**: Users can browse their actual device contacts
- **Permission Handling**: Proper iOS/Android contact permissions
- **Search Functionality**: Quick contact search and selection
- **Fallback Options**: Mock contacts for demo/testing

#### Notification Services:
- **SMS Service**: Integration with Twilio or similar SMS provider
- **Email Service**: SMTP or email service integration
- **Push Notifications**: Firebase Cloud Messaging or similar
- **Backup Systems**: Multiple delivery methods for reliability

### 6. Contact App Integration

#### For Contacts with ThreatSense App:
- **Push Notifications**: Instant app notifications
- **In-App Alerts**: Dedicated threat alert interface
- **Response Interface**: Built-in response buttons
- **History Tracking**: Log of all alerts and responses

#### For Contacts without ThreatSense App:
- **SMS/Email Only**: Standard messaging channels
- **Web Interface**: Optional web-based response portal
- **App Download Prompt**: Encouragement to download for better experience

### 7. Response Flow Architecture

```
Threat Detected
       ↓
Sentry Mode Triggered
       ↓
Multiple Notifications Sent
       ↓
Contact Receives Alert
       ↓
Contact Responds
       ↓
Response Processed
       ↓
Main User Notified
       ↓
Follow-up Actions
```

### 8. Privacy & Security

#### Data Protection:
- **Local Storage**: Contact info stored locally on device
- **Encrypted Transmission**: All notifications encrypted
- **Minimal Data**: Only essential information shared
- **User Control**: Full control over what's shared

#### Permission Requirements:
- **Contact Access**: Read-only access to select trusted contact
- **Location Services**: Optional GPS location sharing
- **Notification Permissions**: Local and push notifications

### 9. Testing & Demo Features

#### Test Notifications:
- **Simulated Threats**: Test different threat levels
- **Mock Responses**: Simulate contact responses
- **Full Flow Testing**: End-to-end notification testing
- **Demo Mode**: Safe testing without real alerts

#### Development Features:
- **Console Logging**: Detailed logs for debugging
- **Mock Contacts**: Demo contact selection
- **Simulated Delays**: Realistic timing simulation
- **Error Handling**: Graceful failure handling

### 10. Future Enhancements

#### Advanced Features:
- **Multiple Contacts**: Support for multiple trusted contacts
- **Custom Messages**: User-defined alert messages
- **Response Tracking**: Detailed response analytics
- **Emergency Services**: Direct emergency service integration
- **Location Sharing**: Real-time location updates
- **Voice Alerts**: Voice-based emergency notifications

#### Integration Possibilities:
- **Smart Home**: Integration with smart home security
- **Wearable Devices**: Smartwatch notifications
- **Vehicle Systems**: Car-based emergency alerts
- **Social Media**: Social media safety check-ins

## Implementation Status

### ✅ Completed:
- Contact picker with OS integration
- Multi-channel notification system
- Response simulation and handling
- Local notification display
- Test and demo functionality

### 🔄 In Progress:
- Real SMS/email service integration
- Push notification implementation
- Contact response tracking
- Advanced privacy controls

### 📋 Planned:
- Multiple contact support
- Custom alert messages
- Emergency service integration
- Advanced analytics

## Usage Instructions

### Setting Up Sentry Mode:
1. Enable Sentry Mode in settings
2. Select threat level threshold
3. Choose trusted contact from device contacts
4. Test the notification system
5. Configure additional settings as needed

### Testing the System:
1. Use "Test Notification" button
2. Simulate different threat levels
3. Verify contact receives alerts
4. Test response handling
5. Check all notification channels

### Real-World Usage:
1. System automatically monitors for threats
2. Alerts sent when threshold is met
3. Contact responds through preferred method
4. Main user receives response updates
5. Follow appropriate safety protocols

This comprehensive contact alert flow ensures that trusted contacts are immediately notified of potential threats and can respond appropriately to ensure the user's safety. 