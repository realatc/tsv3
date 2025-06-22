export const threatCategoryDetails: Record<
  string,
  { icon: string; color: string; description: string; indicates: string }
> = {
  Urgent: {
    icon: 'clock-alert-outline',
    color: '#FFA726',
    description: 'Time-sensitive threats requiring immediate attention.',
    indicates: 'Immediate action required.',
  },
  Impersonation: {
    icon: 'account-question-outline',
    color: '#EF5350',
    description: 'Attempts to impersonate trusted entities.',
    indicates: 'Identity deception.',
  },
  Phishing: {
    icon: 'fish',
    color: '#42A5F5',
    description: 'Attempts to steal credentials or personal information.',
    indicates: 'Credential harvesting.',
  },
  Scam: {
    icon: 'alert-circle-outline',
    color: '#AB47BC',
    description: 'Fraudulent schemes or deceptive practices.',
    indicates: 'Financial fraud.',
  },
  Unsolicited: {
    icon: 'email-alert-outline',
    color: '#FF7043',
    description: 'Unwanted or unexpected communications.',
    indicates: 'Spam or unwanted contact.',
  },
  Unofficial: {
    icon: 'domain-off',
    color: '#78909C',
    description: 'Communications from unofficial or suspicious sources.',
    indicates: 'Unverified source.',
  },
  Suspicious: {
    icon: 'help-circle-outline',
    color: '#BDBDBD',
    description: 'General suspicious activity requiring investigation.',
    indicates: 'Needs further analysis.',
  },
  Default: {
    icon: 'help-circle-outline',
    color: '#9E9E9E',
    description: 'Default category for uncategorized threats.',
    indicates: 'N/A',
  },
}; 