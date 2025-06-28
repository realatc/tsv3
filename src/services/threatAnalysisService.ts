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

  async analyzeText(text: string, sender?: string, eventId?: string, logObj?: any): Promise<ThreatAnalysisResult> {
    // If forceThreatLevel is present, use it
    if (logObj && logObj.forceThreatLevel) {
      const forcedLevel = logObj.forceThreatLevel === 'Critical' ? 'High' : logObj.forceThreatLevel;
      const forcedType = logObj.sentryDemoThreatType || 'Identity Theft Attempt';
      const forcedDescription = logObj.message || 'Demo high threat';
      const mockResult: ThreatAnalysisResult = {
        threatLevel: forcedLevel,
        threatType: forcedType,
        description: forcedDescription,
        confidence: 1,
        recommendations: [],
      };
      await this.triggerSentryModeNotification(mockResult, sender, forcedDescription, eventId);
      return mockResult;
    }

    // Perform intelligent threat analysis based on content
    const textLower = text.toLowerCase();
    let threatLevel: 'Low' | 'Medium' | 'High' = 'Low';
    let threatType = 'Suspicious Activity';
    let description = 'No significant threat indicators found.';
    let confidence = 0.5;
    let recommendations = ['Stay alert', 'Monitor for changes'];

    // Check for high threats
    if (textLower.includes('social security') || textLower.includes('ssn') || 
        textLower.includes('bank account') || textLower.includes('credit card') ||
        textLower.includes('password') || textLower.includes('login') ||
        textLower.includes('irs') || textLower.includes('tax') ||
        textLower.includes('final warning') || textLower.includes('legal action')) {
      threatLevel = 'High';
      threatType = 'Identity Theft Attempt';
      description = 'Detected request for highly sensitive personal information or financial data.';
      confidence = 0.95;
      recommendations = [
        'Do not provide any personal information',
        'Do not click any links',
        'Block the sender immediately',
        'Report to authorities if necessary'
      ];
    }
    // Check for medium threats
    else if (textLower.includes('prize') || textLower.includes('winner') ||
             textLower.includes('claim') || textLower.includes('free') ||
             textLower.includes('limited time') || textLower.includes('act now') ||
             textLower.includes('https://') || textLower.includes('http://')) {
      threatLevel = 'Medium';
      threatType = 'Suspicious Activity';
      description = 'Detected suspicious patterns consistent with potential scams or spam.';
      confidence = 0.75;
      recommendations = [
        'Be cautious with any links',
        'Do not provide personal information',
        'Verify the sender if possible'
      ];
    }

    const mockResult: ThreatAnalysisResult = {
      threatLevel,
      threatType,
      description,
      confidence,
      recommendations
    };

    // Trigger Sentry Mode notification if enabled
    await this.triggerSentryModeNotification(mockResult, sender, text.substring(0, 100), eventId);

    return mockResult;
  }

  private async triggerSentryModeNotification(threatResult: ThreatAnalysisResult, sender?: string, messagePreview?: string, eventId?: string) {
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

    await notificationService.sendThreatNotification(this.sentryModeSettings, threatNotification, sender, messagePreview, eventId);
  }

  // Mock method to simulate different threat levels for testing
  async simulateThreat(level: 'Low' | 'Medium' | 'High'): Promise<ThreatAnalysisResult> {
    const threatTypes = {
      'Low': 'Suspicious Activity',
      'Medium': 'Phishing Attempt',
      'High': 'Malware Detection',
    };

    const descriptions = {
      'Low': 'Minor suspicious activity detected',
      'Medium': 'Moderate threat level - exercise caution',
      'High': 'High threat level - immediate attention required',
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

  // Public wrapper for demo use
  public async triggerDemoSentryModeNotification(threatResult: ThreatAnalysisResult, sender?: string, messagePreview?: string, eventId?: string) {
    await this.triggerSentryModeNotification(threatResult, sender, messagePreview, eventId);
  }
}

export const threatAnalysisService = new ThreatAnalysisService(); 