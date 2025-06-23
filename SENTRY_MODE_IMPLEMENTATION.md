# Sentry Mode Implementation

## Overview
Sentry Mode is a security feature that automatically notifies a trusted contact when ThreatSense detects threats above a specified level. This implementation provides a complete framework for threat monitoring and emergency notifications.

## Architecture

### Core Components

#### 1. SentryModeContext (`src/context/SentryModeContext.tsx`)
- **Purpose**: Manages Sentry Mode settings and state
- **Features**:
  - Settings persistence using AsyncStorage
  - Integration with threat analysis service
  - Real-time settings updates
- **Settings**:
  - `isEnabled`: Boolean toggle for Sentry Mode
  - `threatLevel`: Threshold level ('Low', 'Medium', 'High', 'Critical')
  - `trustedContact`: Contact information for notifications

#### 2. SentryModeScreen (`src/screens/SentryModeScreen.tsx`)
- **Purpose**: Main UI for configuring Sentry Mode
- **Features**:
  - Toggle Sentry Mode on/off
  - Threat level selection
  - Contact picker integration
  - Settings status display
  - Test notification functionality
  - Demo threat simulation

#### 3. ContactPicker (`src/components/ContactPicker.tsx`)
- **Purpose**: Handles selection of trusted contacts
- **Features**:
  - Mock contact selection (demo mode)
  - Contact display and management
  - Integration with device contacts (future)

#### 4. ThreatLevelPicker (`src/components/ThreatLevelPicker.tsx`)
- **Purpose**: Visual threat level selection
- **Features**:
  - Color-coded threat levels
  - Modal selection interface
  - Descriptive labels and icons

#### 5. NotificationService (`src/services/notificationService.ts`)
- **Purpose**: Handles notification logic and delivery
- **Features**:
  - Threat level threshold checking
  - Mock notification system
  - Test notification functionality
  - Future integration with push notifications

#### 6. ThreatAnalysisService (`src/services/threatAnalysisService.ts`)
- **Purpose**: Integrates threat analysis with Sentry Mode
- **Features**:
  - Automatic notification triggering
  - Threat simulation for testing
  - Integration with existing threat analysis

#### 7. SentryModeDemo (`src/components/SentryModeDemo.tsx`)
- **Purpose**: Demonstrates Sentry Mode functionality
- **Features**:
  - Threat level simulation buttons
  - Real-time testing interface
  - Visual feedback and status display

## Implementation Phases

### Phase 1: UI and Configuration ✅
- [x] Settings screen with toggle
- [x] Threat level selection
- [x] Contact picker interface
- [x] Settings persistence

### Phase 2: Contact Integration & Persistence ✅
- [x] AsyncStorage integration
- [x] Contact picker with mock data
- [x] Threat level picker with visual indicators
- [x] Settings context and state management
- [x] Enhanced UI with status cards

### Phase 3: Notification Logic ✅
- [x] Notification service framework
- [x] Threat analysis integration
- [x] Test notification functionality
- [x] Demo threat simulation
- [x] Threshold-based notification logic

## Usage Instructions

### Setting Up Sentry Mode
1. Navigate to Settings via the profile icon
2. Tap "Sentry Mode" in the Security section
3. Toggle "Enable Sentry Mode" to ON
4. Select threat level threshold
5. Choose a trusted contact
6. Test the configuration

### Testing Sentry Mode
1. Enable Sentry Mode with a trusted contact
2. Use "Test Notification" to send a test alert
3. Use the demo buttons to simulate different threat levels
4. Check console logs for notification details

### Threat Level Thresholds
- **Low**: Minor threats only
- **Medium**: Moderate threats
- **High**: Significant threats (default)
- **Critical**: Severe threats only

## Technical Details

### Data Flow
1. User configures Sentry Mode settings
2. Settings are saved to AsyncStorage
3. Threat analysis service is updated with settings
4. When threats are detected, notification service checks threshold
5. If threshold is met, notification is sent to trusted contact

### Integration Points
- **App.tsx**: SentryModeProvider wraps the app
- **SettingsSheet**: Navigation to SentryModeScreen
- **Threat Analysis**: Automatic notification triggering
- **Navigation**: Stack navigation integration

### Future Enhancements
1. **Real Contact Integration**: Use react-native-contacts for actual contact selection
2. **Push Notifications**: Implement real push notification delivery
3. **SMS Backup**: Send SMS as backup notification method
4. **Location Services**: Include GPS location in notifications
5. **Multiple Contacts**: Support for multiple trusted contacts
6. **Custom Messages**: Allow users to customize notification messages
7. **Notification History**: Track sent notifications
8. **Emergency Contacts**: Integration with emergency contact systems

## Security Considerations
- Contact information is stored locally
- Notifications are logged for debugging
- Threshold-based filtering prevents spam
- User consent required for all features
- Privacy-first design approach

## Dependencies
- `@react-native-async-storage/async-storage`: Settings persistence
- `react-native-contacts`: Contact integration (future)
- `react-native-push-notification`: Push notifications (future)

## Testing
- Manual testing via demo interface
- Console logging for notification details
- Settings persistence verification
- Threshold logic validation
- Contact selection testing

## Troubleshooting
- Ensure Sentry Mode is enabled before testing
- Verify trusted contact is selected
- Check console logs for notification details
- Reset settings if configuration issues occur
- Verify threat level threshold is appropriate

This implementation provides a solid foundation for emergency notification features while maintaining user privacy and control. 