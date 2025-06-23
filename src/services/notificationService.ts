import { SentryModeSettings } from '../context/SentryModeContext';

export interface ThreatNotification {
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  threatType: string;
  description: string;
  timestamp: string;
  location?: string;
}

class NotificationService {
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;
    
    // In a real implementation, you would:
    // 1. Request notification permissions
    // 2. Set up push notification tokens
    // 3. Configure notification channels (Android)
    
    this.isInitialized = true;
  }

  async sendThreatNotification(
    settings: SentryModeSettings,
    threatNotification: ThreatNotification
  ) {
    if (!settings.isEnabled || !settings.trustedContact) {
      console.log('Sentry Mode not enabled or no trusted contact set');
      return;
    }

    // Check if threat level meets the threshold
    const threatLevels = ['Low', 'Medium', 'High', 'Critical'];
    const threatIndex = threatLevels.indexOf(threatNotification.threatLevel);
    const thresholdIndex = threatLevels.indexOf(settings.threatLevel);
    
    if (threatIndex < thresholdIndex) {
      console.log('Threat level below threshold, not sending notification');
      return;
    }

    try {
      // In a real implementation, you would:
      // 1. Send push notification to the trusted contact
      // 2. Include threat details and location
      // 3. Possibly send SMS as backup
      
      console.log('Sending threat notification to:', settings.trustedContact.name);
      console.log('Threat details:', threatNotification);
      
      // Mock notification - in real app, this would be a push notification
      this.showMockNotification(settings, threatNotification);
      
    } catch (error) {
      console.error('Failed to send threat notification:', error);
    }
  }

  private showMockNotification(settings: SentryModeSettings, threat: ThreatNotification) {
    // This is a mock implementation for demo purposes
    // In a real app, you'd use react-native-push-notification or similar
    
    const message = `🚨 THREAT ALERT 🚨
    
Your trusted contact ${settings.trustedContact?.name} has been notified of a ${threat.threatLevel} level threat.

Threat Type: ${threat.threatType}
Description: ${threat.description}
Time: ${threat.timestamp}
${threat.location ? `Location: ${threat.location}` : ''}

Stay safe and contact them if needed.`;

    // For demo purposes, we'll use an alert
    // In production, this would be a proper push notification
    setTimeout(() => {
      // This would trigger a real push notification in production
      console.log('Mock notification sent:', message);
    }, 1000);
  }

  async testNotification(settings: SentryModeSettings) {
    const testThreat: ThreatNotification = {
      threatLevel: settings.threatLevel,
      threatType: 'Test Threat',
      description: 'This is a test notification to verify Sentry Mode is working correctly.',
      timestamp: new Date().toLocaleString(),
      location: 'Test Location'
    };

    await this.sendThreatNotification(settings, testThreat);
  }
}

export const notificationService = new NotificationService(); 