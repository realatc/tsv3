interface GitHubIssue {
  title: string;
  body: string;
  labels?: string[];
}

interface GitHubApiResponse {
  html_url: string;
  number: number;
  title: string;
}

class GitHubService {
  private baseUrl = 'https://api.github.com';
  private owner = 'realatc';
  private repo = 'tsv3';
  
  // Use backend API instead of direct GitHub calls for security
  private backendUrl = 'http://localhost:3000'; // Change this to your backend URL

  async createIssue(issue: GitHubIssue): Promise<GitHubApiResponse> {
    try {
      // Use the backend API which has the GitHub token
      const response = await fetch(`${this.backendUrl}/api/bug-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: issue.title,
          description: issue.body,
          expected: '',
          actual: '',
          steps: '',
          additional: '',
          device: 'iOS',
          appVersion: '1.0.0',
          timestamp: Date.now()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Backend API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return {
        html_url: data.issueUrl,
        number: data.issueNumber,
        title: issue.title,
      };
    } catch (error) {
      console.error('Backend API Error:', error);
      throw error;
    }
  }

  // Alternative method using GitHub's issue creation URL with pre-filled data
  createIssueUrl(issue: GitHubIssue): string {
    const title = encodeURIComponent(issue.title);
    const body = encodeURIComponent(issue.body);
    return `https://github.com/${this.owner}/${this.repo}/issues/new?title=${title}&body=${body}`;
  }

  // Check if backend is available for GitHub integration
  isTokenConfigured(): boolean {
    // For now, assume backend is available if we're in development
    // In production, you might want to check if backend is reachable
    return true;
  }
}

export default new GitHubService(); 