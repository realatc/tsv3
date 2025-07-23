interface BugReportData {
  title: string;
  description: string;
  expected?: string;
  actual?: string;
  steps?: string;
  additional?: string;
  device: string;
  appVersion: string;
  timestamp: number;
}

interface BugReportResponse {
  success: boolean;
  issueUrl?: string;
  issueNumber?: number;
  error?: string;
}

class BugReportService {
  private backendUrl = 'http://localhost:3000'; // Change this to your backend URL

  async submitBugReport(bugData: BugReportData): Promise<BugReportResponse> {
    try {
      const response = await fetch(`${this.backendUrl}/api/bug-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bugData),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Bug report submission error:', error);
      return {
        success: false,
        error: 'Failed to submit bug report'
      };
    }
  }

  // Alternative method using GitHub's issue creation URL
  createGitHubIssueUrl(bugData: BugReportData): string {
    const title = encodeURIComponent(`Bug Report: ${bugData.title}`);
    const body = encodeURIComponent(`## Bug Description
${bugData.description}

## What you expected to happen
${bugData.expected || 'Not specified'}

## What actually happened
${bugData.actual || 'Not specified'}

## Steps to Reproduce
${bugData.steps || 'Not specified'}

## Additional Information
${bugData.additional || 'None'}

## Device Information
- Device: ${bugData.device}
- App Version: ${bugData.appVersion}
- Date: ${new Date(bugData.timestamp).toLocaleDateString()}

---
*This issue was created from the ThreatSense mobile app*`);

    return `https://github.com/realatc/tsv3/issues/new?title=${title}&body=${body}`;
  }
}

export default new BugReportService(); 