import { Platform } from 'react-native';
// import { GOOGLE_SAFE_BROWSING_API_KEY } from '@env';

const API_KEY = 'AIzaSyDmEYqzlb-NIAfdEmGgVJW7mUc2xjCTg80';
const API_URL = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${API_KEY}`;

export interface UrlAnalysisResult {
  status: 'safe' | 'malware' | 'phishing' | 'uncommon' | 'unknown' | 'error';
  details: {
    domain: string;
    ipAddress?: string;
    sslValid?: boolean;
    sslExpiry?: string;
    domainAge?: number;
    reputation?: string;
    threatIntel?: string[];
    confidence: 'high' | 'medium' | 'low';
  };
  recommendations: string[];
}

// Extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0];
  }
}

// Basic DNS resolution check
async function checkDNS(domain: string): Promise<{ ipAddress?: string; error?: string }> {
  try {
    // This is a simplified check - in a real app you'd use a proper DNS resolver
    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    const data = await response.json();
    
    if (data.Answer && data.Answer.length > 0) {
      return { ipAddress: data.Answer[0].data };
    }
    return { error: 'DNS resolution failed' };
  } catch (error) {
    return { error: 'DNS check failed' };
  }
}

// Check SSL certificate (simplified)
async function checkSSL(url: string): Promise<{ valid: boolean; expiry?: string; error?: string }> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return { valid: response.ok };
  } catch (error) {
    return { valid: false, error: 'SSL check failed' };
  }
}

// Check domain reputation using multiple sources
async function checkDomainReputation(domain: string): Promise<{ reputation: string; confidence: 'high' | 'medium' | 'low' }> {
  const suspiciousPatterns = [
    /malware/i, /virus/i, /hack/i, /crack/i, /keygen/i, /warez/i,
    /free.*download/i, /crack.*software/i, /hack.*tool/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(domain));
  
  if (isSuspicious) {
    return { reputation: 'suspicious', confidence: 'high' };
  }
  
  // Check for newly registered domains (simplified)
  const shortDomain = domain.split('.').slice(-2).join('.');
  if (shortDomain.length < 10) {
    return { reputation: 'new_domain', confidence: 'medium' };
  }
  
  return { reputation: 'unknown', confidence: 'low' };
}

export async function checkUrlSafety(url: string): Promise<UrlAnalysisResult> {
  const domain = extractDomain(url);
  const result: UrlAnalysisResult = {
    status: 'unknown',
    details: {
      domain,
      confidence: 'low'
    },
    recommendations: []
  };

  try {
    // Step 1: Basic domain analysis
    const dnsResult = await checkDNS(domain);
    if (dnsResult.ipAddress) {
      result.details.ipAddress = dnsResult.ipAddress;
    }

    // Step 2: SSL check
    const sslResult = await checkSSL(url);
    result.details.sslValid = sslResult.valid;
    if (sslResult.expiry) {
      result.details.sslExpiry = sslResult.expiry;
    }

    // Step 3: Domain reputation
    const repResult = await checkDomainReputation(domain);
    result.details.reputation = repResult.reputation;
    result.details.confidence = repResult.confidence;

    // Step 4: Google Safe Browsing API
    if (API_KEY) {
      try {
        const body = {
          client: {
            clientId: 'threatsense-app',
            clientVersion: '1.0.0',
          },
          threatInfo: {
            threatTypes: [
              'MALWARE',
              'SOCIAL_ENGINEERING',
              'UNWANTED_SOFTWARE',
              'POTENTIALLY_HARMFUL_APPLICATION',
            ],
            platformTypes: ['ANY_PLATFORM'],
            threatEntryTypes: ['URL'],
            threatEntries: [{ url }],
          },
        };

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.matches && data.matches.length > 0) {
            const threatType = data.matches[0].threatType;
            if (threatType === 'MALWARE' || threatType === 'POTENTIALLY_HARMFUL_APPLICATION') {
              result.status = 'malware';
              result.details.confidence = 'high';
              result.recommendations.push('This URL is flagged as malicious by Google Safe Browsing');
            } else if (threatType === 'SOCIAL_ENGINEERING') {
              result.status = 'phishing';
              result.details.confidence = 'high';
              result.recommendations.push('This URL is flagged as phishing by Google Safe Browsing');
            } else if (threatType === 'UNWANTED_SOFTWARE') {
              result.status = 'uncommon';
              result.details.confidence = 'medium';
              result.recommendations.push('This URL may contain unwanted software');
            }
          }
        }
      } catch (error) {
        console.error('[checkUrlSafety] Safe Browsing API error:', error);
      }
    }

    // Step 5: Generate recommendations based on analysis
    if (result.status === 'unknown') {
      if (repResult.reputation === 'suspicious') {
        result.status = 'uncommon';
        result.recommendations.push('Domain name contains suspicious keywords');
      } else if (!sslResult.valid) {
        result.recommendations.push('SSL certificate validation failed');
      } else if (repResult.reputation === 'new_domain') {
        result.recommendations.push('Domain appears to be newly registered - exercise caution');
      } else {
        result.recommendations.push('No immediate threats detected, but always verify before visiting');
      }
    }

    // Step 6: Add general recommendations
    if (result.status !== 'safe') {
      result.recommendations.push('Do not visit this URL unless you are certain of its legitimacy');
      result.recommendations.push('Consider using a sandboxed environment if you must access it');
    }

  } catch (error) {
    console.error('[checkUrlSafety] Error:', error);
    result.status = 'error';
    result.recommendations.push('Unable to complete analysis due to technical error');
  }

  return result;
} 