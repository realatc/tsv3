# ThreatSense

AI-powered mobile security app that protects users from digital threats in real-time.

## System Overview

ThreatSense provides comprehensive protection against digital threats through AI-powered analysis, real-time monitoring, and emergency notification systems.

## Key Features

- **Live Text Analyzer** - Paste any text for instant threat analysis using Perplexity AI
- **Sentry Mode** - Emergency notifications to trusted contacts
- **Related Content** - AI-generated articles about similar threats using Gemini AI
- **URL Safety Scanner** - Checks links against Google Safe Browsing
- **Real-time AI Analysis** - Powered by Perplexity AI for threat detection and Gemini AI for content generation
- **Privacy-Focused** - Local processing when possible

## System Diagrams

For detailed system diagrams and technical documentation:

- [📊 System Architecture](docs/system-architecture.md) - Complete system overview and data flow
- [🛡️ Sentry Mode Flow](docs/sentry-mode-flow.md) - Emergency notification system
- [🤖 AI Components](docs/ai-components.md) - AI technology stack and analysis
- [📈 Performance Metrics](docs/performance-metrics.md) - System performance and capabilities
- [📱 User Interface Flow](docs/user-interface-flow.md) - UI/UX flows and user journey

## Technology Stack

- **Frontend**: React Native
- **Backend**: Node.js
- **AI**: Perplexity AI (threat analysis), Gemini AI (content generation)
- **Security**: Google Safe Browsing, SSL validation
- **Storage**: AsyncStorage, local data persistence

## AI Integration

### Perplexity AI
- **Primary Threat Analysis**: Analyzes text for phishing, social engineering, and malware patterns
- **Real-time Intelligence**: Provides current threat data and cybersecurity expertise
- **Structured Output**: Returns threat level, detailed analysis, and actionable recommendations

### Gemini AI
- **Query Generation**: Creates search queries from threat analysis for finding related content
- **Content Enhancement**: Generates contextual search terms for better article discovery
- **Natural Language Processing**: Uses Google's Gemini 1.5 Flash model for advanced text understanding

## Getting Started

> **Note**: Make sure you have completed the [React Native Environment Setup](https://reactnative.dev/docs/environment-setup) before proceeding.

### Prerequisites

- Node.js (v16 or later)
- React Native CLI
- Xcode (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```sh
   git clone <repository-url>
   cd tsv3
   ```

2. **Install dependencies**
   ```sh
   npm install
   # OR
   yarn install
   ```

3. **iOS Setup** (macOS only)
   ```sh
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Start Metro**
   ```sh
   npm start
   # OR
   yarn start
   ```

5. **Run the app**
   ```sh
   # iOS
   npm run ios
   # OR
   yarn ios
   
   # Android
   npm run android
   # OR
   yarn android
   ```

## Documentation

For comprehensive documentation, see the [docs/](docs/) directory:

- [📚 Documentation Overview](docs/README.md) - Complete documentation index
- [🔧 Development Guide](docs/development/) - Setup and development instructions
- [👥 User Guide](docs/user-guide/) - End-user documentation
- [🔌 API Documentation](docs/api/) - Backend API specifications

## Contributing

Please read our contributing guidelines before submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
