import { SentryModeSettings } from '../context/SentryModeContext';
import { Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp, setGlobalContactResponseModal, setGlobalSentryAlertModal } from '../context/AppContext';

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

export interface SentryModeAlert {
  id: string;
  eventId: string;
  timestamp: string;
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  threatType: string;
  description: string;
  sender?: string;
  messagePreview?: string;
  contactName: string;
  contactPhone: string;
  status: 'sent' | 'acknowledged' | 'contacted' | 'emergency' | 'no_response';
  responseTime?: string;
  responseType?: 'sms' | 'email' | 'call' | 'text';
  responseMessage?: string;
}

const NOTIFICATION_HISTORY_KEY = 'sentry_mode_notifications';

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
    threatNotification: ThreatNotification,
    sender?: string,
    messagePreview?: string,
    eventId?: string
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
      
      // Add audit log entry for notification
      if (eventId) {
        try {
          await import('../utils/auditLog').then(({ addAuditLogEntry }) => {
            addAuditLogEntry(eventId, {
              action: 'notified_contact',
              actor: 'system',
              details: `Trusted contact ${settings.trustedContact?.name} was notified about a ${threatNotification.threatType} (${threatNotification.threatLevel})`
            });
          });
        } catch (e) { console.error('Failed to add audit log entry for notification', e); }
      }
      
      // Create notification record
      const alertId = `alert-${Date.now()}`;
      const alert: SentryModeAlert = {
        id: alertId,
        eventId: eventId || 'unknown',
        timestamp: new Date().toISOString(),
        threatLevel: threatNotification.threatLevel,
        threatType: threatNotification.threatType,
        description: threatNotification.description,
        sender,
        messagePreview,
        contactName: settings.trustedContact.name,
        contactPhone: settings.trustedContact.phoneNumber,
        status: 'sent'
      };

      // Save to history
      await this.saveNotificationToHistory(alert);
      
      // Send multiple types of notifications for redundancy
      await this.sendSMSNotification(settings, threatNotification);
      await this.sendEmailNotification(settings, threatNotification);
      await this.sendPushNotification(settings, threatNotification);
      
      // Show local notification to user
      let isSentryDemo = false;
      let sentryDemoJohnResponse = undefined;
      if (eventId) {
        try {
          const logsRaw = await AsyncStorage.getItem('@threatsense/logs');
          if (logsRaw) {
            const logs = JSON.parse(logsRaw);
            const log = logs.find((l: any) => l.id === eventId);
            if (log && log.demoType === 'sentry') {
              isSentryDemo = true;
              sentryDemoJohnResponse = log.sentryDemoJohnResponse;
            }
          }
        } catch (e) { console.error('Failed to check for Sentry Demo log', e); }
      }
      this.showLocalNotification(settings, threatNotification, alertId, eventId, sentryDemoJohnResponse);
      
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

  private showLocalNotification(settings: SentryModeSettings, threat: ThreatNotification, alertId?: string, eventId?: string, sentryDemoJohnResponse?: string) {
    if (!settings.trustedContact) return;

    // Compose the alert modal content
    const alertModalContent = {
      message: `Your trusted contact ${settings.trustedContact.name} has been notified of a ${threat.threatLevel} level threat.`,
      details: {
        level: threat.threatLevel,
        type: threat.threatType,
        description: threat.description,
        time: threat.timestamp,
        location: threat.location || 'Current Location',
        eventId: eventId, // Add the eventId so the View Log Details button can work
      },
      notification: [
        'SMS text message',
        'Email notification',
        'Push notification (if they have the app)'
      ],
      responses: [
        'Acknowledgment within 5 minutes',
        'Direct contact if threat is serious',
        'Emergency services if no response'
      ],
      footer: 'Stay safe and wait for their response.',
      onCall: () => settings.trustedContact && this.callContact(settings.trustedContact.phoneNumber),
      onText: () => settings.trustedContact && this.textContact(settings.trustedContact.phoneNumber),
      onOk: (alertId?: string) => {
        if (sentryDemoJohnResponse) {
          setGlobalContactResponseModal({
            message: sentryDemoJohnResponse,
            threatType: threat.threatType,
            responseType: 'acknowledged',
            timestamp: new Date().toISOString(),
            alertId: alertId,
          });
        }
      }
    };
    setGlobalSentryAlertModal(alertModalContent);
  }

  private callContact(phoneNumber: string) {
    Linking.openURL(`tel:${phoneNumber}`);
  }

  private textContact(phoneNumber: string) {
    Linking.openURL(`sms:${phoneNumber}`);
  }

  private getResponseMessage(responseType: 'acknowledged' | 'contacted' | 'emergency' | 'no_response', threatType?: string): string {
    // Context-aware responses based on threat type
    if (responseType === 'no_response') {
      return 'No response received from your trusted contact.';
    }
    if (threatType) {
      switch (threatType) {
        case 'Phishing Attempt':
          return 'Definitely do not click that link. This looks like a phishing scam.';
        case 'Identity Theft Attempt':
          return 'The DMV or IRS would never text you about this. Best to block this sender.';
        case 'Suspicious Activity':
          return 'This looks suspicious. I would ignore or block the sender.';
        case 'Prize Scam':
          return 'You didn\'t enter a contest, so this is likely a scam. Don\'t reply.';
        default:
          return 'This doesn\'t look legitimate. Be cautious and don\'t interact.';
      }
    }
    return 'This doesn\'t look legitimate. Be cautious and don\'t interact.';
  }

  public simulateContactResponse(settings: SentryModeSettings, responseType: 'acknowledged' | 'contacted' | 'emergency' | 'no_response', threatType?: string, onAuditLog?: () => void, alertId?: string, eventId?: string, customResponseMessage?: string) {
    if (!settings.trustedContact) return;
    const responseMessage = customResponseMessage || this.getResponseMessage(responseType, threatType);
    const updateAlertAndAudit = async () => {
      // Update the specific alert status
      const history = await this.getNotificationHistory();
      let targetAlert = alertId ? history.find(a => a.id === alertId) : history[0];
      if (targetAlert && (!targetAlert.status || targetAlert.status === 'sent')) {
        await this.updateNotificationStatus(targetAlert.id, 'acknowledged', 'sms', responseMessage);
        // Add audit log entry for contact response
        const eid = eventId || targetAlert.eventId || 'unknown';
        if (eid && eid !== 'unknown') {
          try {
            const { addAuditLogEntry } = await import('../utils/auditLog');
            await addAuditLogEntry(eid, {
              action: 'contact_response',
              actor: settings.trustedContact?.name || 'contact',
              details: `Contact responded: ${responseMessage}`
            });
            if (onAuditLog) onAuditLog();
          } catch (e) { console.error('Failed to add audit log entry for contact response', e); }
        }
      }
    };
    updateAlertAndAudit();
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

  private async saveNotificationToHistory(alert: SentryModeAlert) {
    try {
      const existing = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
      const history: SentryModeAlert[] = existing ? JSON.parse(existing) : [];
      history.unshift(alert); // Add to beginning
      
      // Keep only last 50 notifications
      const trimmedHistory = history.slice(0, 50);
      await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(trimmedHistory));
      
      console.log('[NotificationService] Saved alert to history:', alert.id);
    } catch (error) {
      console.error('[NotificationService] Error saving notification to history:', error);
    }
  }

  async getNotificationHistory(): Promise<SentryModeAlert[]> {
    try {
      const existing = await AsyncStorage.getItem(NOTIFICATION_HISTORY_KEY);
      return existing ? JSON.parse(existing) : [];
    } catch (error) {
      console.error('[NotificationService] Error retrieving notification history:', error);
      return [];
    }
  }

  async updateNotificationStatus(alertId: string, status: SentryModeAlert['status'], responseType?: string, responseMessage?: string) {
    try {
      const history = await this.getNotificationHistory();
      const alertIndex = history.findIndex(alert => alert.id === alertId);
      
      if (alertIndex !== -1) {
        history[alertIndex].status = status;
        history[alertIndex].responseTime = new Date().toISOString();
        if (responseType) history[alertIndex].responseType = responseType as any;
        if (responseMessage) history[alertIndex].responseMessage = responseMessage;
        
        await AsyncStorage.setItem(NOTIFICATION_HISTORY_KEY, JSON.stringify(history));
        console.log('[NotificationService] Updated alert status:', alertId, status);
      }
    } catch (error) {
      console.error('[NotificationService] Error updating notification status:', error);
    }
  }
}

export const notificationService = new NotificationService(); 