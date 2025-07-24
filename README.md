# ThreatSense

AI-powered mobile security app that protects users from digital threats in real-time.

## System Overview

ThreatSense provides comprehensive protection against digital threats through AI-powered analysis, real-time monitoring, and emergency notification systems.

## Key Features

- **Live Text Analyzer** - Paste any text for instant threat analysis
- **Sentry Mode** - Emergency notifications to trusted contacts
- **Related Content** - AI-generated articles about similar threats
- **URL Safety Scanner** - Checks links against Google Safe Browsing
- **Real-time AI Analysis** - Powered by Gemini AI and Perplexity
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
- **AI**: Gemini AI, Perplexity API
- **Security**: Google Safe Browsing, SSL validation
- **Storage**: AsyncStorage, local data persistence

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

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Security

ThreatSense is built with security and privacy in mind:

- **Local Processing**: Sensitive data processed locally when possible
- **Encrypted Communication**: All API calls use HTTPS
- **Privacy-First**: Minimal data collection and storage
- **User Control**: Full control over what data is shared

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue in this repository
- Check the [documentation](docs/README.md)
- Review the [troubleshooting guide](docs/troubleshooting.md)
