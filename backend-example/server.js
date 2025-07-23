const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GitHub configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'realatc';
const GITHUB_REPO = 'tsv3';

// Create GitHub issue
async function createGitHubIssue(bugData) {
  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/issues`;
  
  const payload = {
    title: `Bug Report: ${bugData.title}`,
    body: `## Bug Description
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
*This issue was created from the ThreatSense mobile app*`,
    labels: ['bug', 'mobile-app', 'user-reported']
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
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
      success: true,
      issueUrl: data.html_url,
      issueNumber: data.number,
    };
  } catch (error) {
    console.error('GitHub API Error:', error);
    throw error;
  }
}

// Bug report endpoint
app.post('/api/bug-reports', async (req, res) => {
  try {
    const bugData = req.body;
    
    // Validate required fields
    if (!bugData.title || !bugData.description) {
      return res.status(400).json({
        success: false,
        error: 'Title and description are required'
      });
    }

    // Create GitHub issue
    const result = await createGitHubIssue(bugData);
    
    res.json({
      success: true,
      issueUrl: result.issueUrl,
      issueNumber: result.issueNumber,
    });
  } catch (error) {
    console.error('Bug report error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create bug report'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Bug report server running on port ${PORT}`);
}); 