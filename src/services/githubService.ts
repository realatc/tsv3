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
  
  // In production, you'd store this securely (not in the app)
  // For now, we'll use a placeholder - you'll need to create a GitHub token
  private token = 'YOUR_GITHUB_TOKEN_HERE'; // Replace with your actual token

  async createIssue(issue: GitHubIssue): Promise<GitHubApiResponse> {
    const url = `${this.baseUrl}/repos/${this.owner}/${this.repo}/issues`;
    
    const payload = {
      title: issue.title,
      body: issue.body,
      labels: issue.labels || ['bug', 'mobile-app']
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`GitHub API Error: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      return {
        html_url: data.html_url,
        number: data.number,
        title: data.title,
      };
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw error;
    }
  }

  // Alternative method using GitHub's issue creation URL with pre-filled data
  createIssueUrl(issue: GitHubIssue): string {
    const title = encodeURIComponent(issue.title);
    const body = encodeURIComponent(issue.body);
    return `https://github.com/${this.owner}/${this.repo}/issues/new?title=${title}&body=${body}`;
  }

  // Check if GitHub token is configured
  isTokenConfigured(): boolean {
    return this.token !== 'YOUR_GITHUB_TOKEN_HERE' && this.token.length > 0;
  }
}

export default new GitHubService(); 