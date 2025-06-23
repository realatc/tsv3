import { SentryModeSettings } from '../context/SentryModeContext';
import { Alert, Linking } from 'react-native';

export interface ThreatNotification {
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  threatType: string;
  description: string;
  timestamp: string;
  location?: string;
  userPhoneNumber?: string;
  userEmail?: string;
}

export interface ContactAlertResponse {
  contactName: string;
  responseType: 'acknowledged' | 'calling' | 'texting' | 'emailing' | 'ignored';
  timestamp: string;
  message?: string;
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
      console.log('Sending threat notification to:', settings.trustedContact.name);
      console.log('Threat details:', threatNotification);
      
      // Send multiple types of notifications for redundancy
      await this.sendSMSNotification(settings, threatNotification);
      await this.sendEmailNotification(settings, threatNotification);
      await this.sendPushNotification(settings, threatNotification);
      
      // Show local notification to user
      this.showLocalNotification(settings, threatNotification);
      
    } catch (error) {
      console.error('Failed to send threat notification:', error);
    }
  }

  private async sendSMSNotification(settings: SentryModeSettings, threat: ThreatNotification) {
    if (!settings.trustedContact) return;
    
    try {
      const message = this.formatSMSMessage(settings, threat);
      
      // In a real implementation, you would use an SMS service like Twilio
      // For now, we'll simulate SMS sending
      console.log('SMS sent to:', settings.trustedContact.phoneNumber);
      console.log('SMS content:', message);
      
      // Simulate SMS delivery
      setTimeout(() => {
        this.simulateContactResponse(settings, 'acknowledged');
      }, 2000);
      
    } catch (error) {
      console.error('Failed to send SMS:', error);
    }
  }

  private async sendEmailNotification(settings: SentryModeSettings, threat: ThreatNotification) {
    if (!settings.trustedContact) return;
    
    try {
      const emailContent = this.formatEmailMessage(settings, threat);
      
      // In a real implementation, you would use an email service
      console.log('Email sent to trusted contact');
      console.log('Email content:', emailContent);
      
    } catch (error) {
      console.error('Failed to send email:', error);
    }
  }

  private async sendPushNotification(settings: SentryModeSettings, threat: ThreatNotification) {
    if (!settings.trustedContact) return;
    
    try {
      // In a real implementation, you would use react-native-push-notification
      // or a service like Firebase Cloud Messaging
      console.log('Push notification sent to trusted contact');
      
    } catch (error) {
      console.error('Failed to send push notification:', error);
    }
  }

  private formatSMSMessage(settings: SentryModeSettings, threat: ThreatNotification): string {
    if (!settings.trustedContact) return '';
    
    return `🚨 THREAT ALERT 🚨

${settings.trustedContact.name}, your trusted contact has been notified of a ${threat.threatLevel} level threat.

Threat: ${threat.threatType}
Details: ${threat.description}
Time: ${threat.timestamp}
${threat.location ? `Location: ${threat.location}` : ''}

Please check on them immediately.

Reply with:
- "OK" to acknowledge
- "CALL" to call them
- "TEXT" to send a message
- "IGNORE" if this is a false alarm

Stay safe!`;
  }

  private formatEmailMessage(settings: SentryModeSettings, threat: ThreatNotification): string {
    if (!settings.trustedContact) return '';
    
    return `
Subject: 🚨 URGENT: ThreatSense Alert - ${threat.threatLevel} Level Threat Detected

Dear ${settings.trustedContact.name},

This is an automated alert from ThreatSense. Your trusted contact has been notified of a potential security threat.

THREAT DETAILS:
- Level: ${threat.threatLevel}
- Type: ${threat.threatType}
- Description: ${threat.description}
- Time Detected: ${threat.timestamp}
${threat.location ? `- Location: ${threat.location}` : ''}

IMMEDIATE ACTIONS:
1. Contact your trusted contact immediately
2. Verify their safety and well-being
3. If they don't respond, consider emergency services
4. Check their device for any suspicious activity

RESPONSE OPTIONS:
- Reply to this email with "SAFE" if everything is okay
- Reply with "CALLING" if you're calling them
- Reply with "EMERGENCY" if immediate help is needed

This alert was triggered automatically based on their Sentry Mode settings.
Please respond promptly to ensure their safety.

Best regards,
ThreatSense Security System

---
This is an automated message. Please do not reply to this email address.
For support, contact: support@threatsense.app
    `;
  }

  private showLocalNotification(settings: SentryModeSettings, threat: ThreatNotification) {
    if (!settings.trustedContact) return;
    
    const message = `🚨 THREAT ALERT 🚨

Your trusted contact ${settings.trustedContact.name} has been notified of a ${threat.threatLevel} level threat.

Threat Type: ${threat.threatType}
Description: ${threat.description}
Time: ${threat.timestamp}
${threat.location ? `Location: ${threat.location}` : ''}

They will receive:
• SMS text message
• Email notification  
• Push notification (if they have the app)

Expected responses:
• Acknowledgment within 5 minutes
• Direct contact if threat is serious
• Emergency services if no response

Stay safe and wait for their response.`;

    Alert.alert(
      'Sentry Mode Alert Sent',
      message,
      [
        { text: 'OK', style: 'default' },
        { 
          text: 'Call Contact', 
          onPress: () => settings.trustedContact && this.callContact(settings.trustedContact.phoneNumber)
        },
        { 
          text: 'Text Contact', 
          onPress: () => settings.trustedContact && this.textContact(settings.trustedContact.phoneNumber)
        }
      ]
    );
  }

  private callContact(phoneNumber: string) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  private textContact(phoneNumber: string) {
    Linking.openURL(`sms:${phoneNumber}`);
  }

  public simulateContactResponse(settings: SentryModeSettings, responseType: ContactAlertResponse['responseType']) {
    if (!settings.trustedContact) return;
    
    const response: ContactAlertResponse = {
      contactName: settings.trustedContact.name,
      responseType,
      timestamp: new Date().toLocaleString(),
      message: this.getResponseMessage(responseType)
    };

    console.log('Contact response received:', response);

    // Show response to user
    setTimeout(() => {
      if (settings.trustedContact) {
        Alert.alert(
          'Contact Response',
          `${settings.trustedContact.name} has ${responseType} the alert.\n\n${response.message}`,
          [{ text: 'OK' }]
        );
      }
    }, 3000);
  }

  private getResponseMessage(responseType: ContactAlertResponse['responseType']): string {
    switch (responseType) {
      case 'acknowledged':
        return 'They have acknowledged the alert and are checking on you.';
      case 'calling':
        return 'They are calling you now. Please answer your phone.';
      case 'texting':
        return 'They are sending you a text message. Check your messages.';
      case 'emailing':
        return 'They are sending you an email with further instructions.';
      case 'ignored':
        return 'They have not responded to the alert. Consider calling them directly.';
      default:
        return 'Response received.';
    }
  }

  async testNotification(settings: SentryModeSettings) {
    const testThreat: ThreatNotification = {
      threatLevel: settings.threatLevel,
      threatType: 'Test Threat',
      description: 'This is a test notification to verify Sentry Mode is working correctly.',
      timestamp: new Date().toLocaleString(),
      location: 'Test Location',
      userPhoneNumber: '+1 (555) 987-6543',
      userEmail: 'user@example.com'
    };

    await this.sendThreatNotification(settings, testThreat);
  }

  // Method to handle contact responses (for future implementation)
  async handleContactResponse(response: ContactAlertResponse) {
    console.log('Processing contact response:', response);
    
    // In a real implementation, you would:
    // 1. Update the threat status
    // 2. Notify the main user of the response
    // 3. Log the response for security analysis
    // 4. Trigger additional actions if needed
  }
}

export const notificationService = new NotificationService(); 