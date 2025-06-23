import { notificationService, ThreatNotification } from './notificationService';
import { SentryModeSettings } from '../context/SentryModeContext';

export interface ThreatAnalysisResult {
  threatLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  threatType: string;
  description: string;
  confidence: number;
  recommendations: string[];
}

class ThreatAnalysisService {
  private sentryModeSettings: SentryModeSettings | null = null;

  setSentryModeSettings(settings: SentryModeSettings) {
    this.sentryModeSettings = settings;
  }

  async analyzeText(text: string): Promise<ThreatAnalysisResult> {
    // This is a mock analysis - in a real app, you'd use your actual threat analysis logic
    const mockResult: ThreatAnalysisResult = {
      threatLevel: 'Medium',
      threatType: 'Phishing Attempt',
      description: 'Detected suspicious patterns consistent with phishing attempts',
      confidence: 0.85,
      recommendations: [
        'Do not click on any links',
        'Do not provide personal information',
        'Report to authorities if necessary'
      ]
    };

    // Trigger Sentry Mode notification if enabled
    await this.triggerSentryModeNotification(mockResult);

    return mockResult;
  }

  private async triggerSentryModeNotification(threatResult: ThreatAnalysisResult) {
    if (!this.sentryModeSettings) {
      return;
    }

    const threatNotification: ThreatNotification = {
      threatLevel: threatResult.threatLevel,
      threatType: threatResult.threatType,
      description: threatResult.description,
      timestamp: new Date().toLocaleString(),
      location: 'Current Location' // In real app, get from GPS
    };

    await notificationService.sendThreatNotification(this.sentryModeSettings, threatNotification);
  }

  // Mock method to simulate different threat levels for testing
  async simulateThreat(level: 'Low' | 'Medium' | 'High' | 'Critical'): Promise<ThreatAnalysisResult> {
    const threatTypes = {
      'Low': 'Suspicious Activity',
      'Medium': 'Phishing Attempt',
      'High': 'Malware Detection',
      'Critical': 'Identity Theft Attempt'
    };

    const descriptions = {
      'Low': 'Minor suspicious activity detected',
      'Medium': 'Moderate threat level - exercise caution',
      'High': 'High threat level - immediate attention required',
      'Critical': 'Critical threat level - immediate action required'
    };

    const mockResult: ThreatAnalysisResult = {
      threatLevel: level,
      threatType: threatTypes[level],
      description: descriptions[level],
      confidence: 0.9,
      recommendations: [
        'Stay alert',
        'Do not engage with suspicious content',
        'Contact support if needed'
      ]
    };

    await this.triggerSentryModeNotification(mockResult);
    return mockResult;
  }
}

export const threatAnalysisService = new ThreatAnalysisService(); 