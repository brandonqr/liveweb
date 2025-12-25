# 🎙️ LiveWeb - AI-Powered Web Builder

<div align="center">

![LiveWeb Banner](https://img.shields.io/badge/Gemini-3_Flash-blue?style=for-the-badge&logo=google&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-22+-green?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![GitHub](https://img.shields.io/github/stars/brandonqr/liveweb?style=for-the-badge&logo=github&color=blue)
![GitHub](https://img.shields.io/github/forks/brandonqr/liveweb?style=for-the-badge&logo=github&color=blue)

**Build complete web applications with your voice using Google Gemini 3 Flash**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Examples](#-examples) • [Contributing](#-contributing) • [Deployment](#-deployment)

</div>

---

## 📖 Overview

LiveWeb is a revolutionary web development tool that allows you to create complete, functional web applications using natural language voice commands. Powered by Google's Gemini 3 Flash AI model, it transforms your spoken ideas into production-ready HTML, CSS, and JavaScript code in real-time.

### ✨ Key Highlights

- 🎤 **Voice-First Development**: Build applications by speaking naturally
- ⚡ **Real-Time Generation**: See your code come to life instantly
- 🧠 **Context-Aware**: Maintains conversation history for iterative development
- 🎨 **Template Library**: Start with pre-built templates for common use cases
- 🔄 **Checkpoint System**: Save and restore different versions of your work
- 🌍 **Multi-Language**: Full support for English and Spanish
- 🔌 **API Integration**: Automatic detection and configuration for external APIs
- 🎯 **Component Selection**: Click to select and modify specific elements

---

## 🎯 Features

### Core Capabilities

| Feature | Description |
|---------|-------------|
| **Voice Recognition** | Native Web Speech API integration for hands-free coding |
| **AI Code Generation** | Gemini 3 Flash with optimized prompts for web development |
| **Live Preview** | Sandboxed iframe rendering with real-time updates |
| **Iterative Modifications** | Context-aware edits that preserve existing code |
| **3D Support** | Automatic Three.js integration for 3D scenes |
| **Template System** | Pre-built templates for landing pages, dashboards, portfolios, etc. |
| **Checkpoint Management** | Version control with automatic snapshots |
| **API Key Management** | Secure storage and injection of API keys (Mapbox, Gemini, etc.) |
| **Component Selector** | Visual element selection for targeted modifications |
| **Multi-Language UI** | English and Spanish interface with i18n support |

### Advanced Features

- **SSE Logging**: Real-time server logs streamed to the frontend
- **Error Handling**: Comprehensive error recovery and user feedback
- **Keyboard Shortcuts**: Press `T` to toggle voice recognition
- **Code Export**: Download your project as a ZIP file
- **Responsive Design**: Works on desktop and mobile devices
- **Dark Mode**: Beautiful dark UI optimized for extended use

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** (get one at [Google AI Studio](https://aistudio.google.com))
- **Modern Browser** with Web Speech API support (Chrome or Edge recommended)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/liveweb.git
cd liveweb
```

2. **Install backend dependencies**

```bash
npm install
```

3. **Install frontend dependencies**

```bash
cd frontend
npm install
cd ..
```

4. **Configure environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### Running the Application

**Option 1: Development Mode (Recommended)**

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Option 2: Production Mode**

```bash
npm start
```

Then open your browser to:
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost:3000` (Express API)

---

## 🎮 Usage Guide

### Getting Started

1. **Open the application** in your browser (`http://localhost:5173`)
2. **Grant microphone permissions** when prompted
3. **Click the microphone button** or press `T` to start listening
4. **Speak your command** in English or Spanish
5. **Watch the magic happen** as your code is generated and rendered

### Example Commands

#### Basic Web Pages
```
"Create a landing page with a blue gradient background and a centered title"
"Add a navigation bar with Home, About, and Contact links"
"Create a hero section with a call-to-action button"
```

#### Interactive Elements
```
"Add a contact form with name, email, and message fields"
"Create a photo gallery with 6 images in a grid"
"Add a dark mode toggle button in the top right corner"
```

#### 3D Scenes (Three.js)
```
"Create a 3D Minecraft-style world with green grass and blue sky"
"Add some cubic trees randomly around the scene"
"Put a purple glowing statue in the center that rotates"
"Make the statue explode into particles when clicked"
```

#### Using Templates
```
"Show me the available templates"
"Use the dashboard template"
"Modify the sidebar to include a settings icon"
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `T` | Toggle voice recognition on/off |
| `Esc` | Cancel current operation |

---

## 📁 Project Structure

```
liveweb/
├── server/                      # Backend (Express.js)
│   ├── app.js                   # Main Express application
│   ├── config/                  # Configuration files
│   │   ├── constants.js         # App constants
│   │   ├── i18n/                # Backend i18n
│   │   └── prompts/             # Gemini prompt templates
│   ├── middleware/              # Express middleware
│   ├── routes/                  # API routes
│   │   ├── generate.js          # Code generation endpoint
│   │   ├── checkpoints.js       # Checkpoint management
│   │   ├── templates.js         # Template system
│   │   ├── apis.js              # API configuration
│   │   └── logs.js              # SSE logging
│   ├── services/                # Business logic
│   │   ├── codeGeneration.js    # Main generation service
│   │   ├── gemini/              # Gemini client & cache
│   │   ├── checkpoints.js       # Checkpoint service
│   │   └── templates/           # Template handler
│   ├── stores/                  # In-memory data stores
│   ├── templates/               # Template definitions
│   └── utils/                   # Utility functions
│
├── frontend/                    # Frontend (React + Vite)
│   ├── src/
│   │   ├── App.jsx              # Main application component
│   │   ├── components/          # React components
│   │   │   ├── AppHeader.jsx    # Header with controls
│   │   │   ├── AppContent.jsx   # Main content area
│   │   │   ├── AppFooter.jsx    # Footer with logs
│   │   │   ├── CodeRenderer.jsx # Iframe renderer
│   │   │   ├── EmptyState/      # Welcome screen
│   │   │   ├── CheckpointsPanel/ # Version control
│   │   │   ├── TemplatesPanel.jsx # Template browser
│   │   │   └── APIKeysConfig/   # API key management
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useSpeechRecognition.js
│   │   │   ├── useCodeGeneration.js
│   │   │   ├── useAppState.js
│   │   │   └── ...
│   │   ├── services/            # API client
│   │   │   └── api.js           # Backend communication
│   │   ├── utils/               # Utility functions
│   │   ├── locales/             # i18n translations
│   │   ├── styles/              # CSS files
│   │   └── lib/                 # Shared libraries
│   ├── package.json
│   └── vite.config.js
│
├── DOCS/                        # Documentation
│   ├── gemini3.md               # Gemini 3 documentation
│   ├── gemini3-integration-notes.md
│   └── prompint-strategies.md   # Prompting best practices
│
├── .env.example                 # Environment template
├── .gitignore                   # Git ignore rules
├── package.json                 # Backend dependencies
├── server.js                    # Server entry point
└── README.md                    # This file
```

---

## 🛠️ Technology Stack

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web server framework |
| **@google/genai** | Official Gemini SDK |
| **cors** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **i18next** | Internationalization |

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **Vite** | Build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **Framer Motion** | Animation library |
| **Lucide React** | Icon library |
| **i18next** | Internationalization |
| **Web Speech API** | Native voice recognition |

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required
GEMINI_API_KEY=your_api_key_here

# Optional
PORT=3000                        # Backend port (default: 3000)
NODE_ENV=development             # Environment mode
```

### Customizing Voice Recognition

Edit `frontend/src/App.jsx` to change the language:

```javascript
const { isListening, transcript, ... } = useSpeechRecognition('es-ES')  // Spanish
// or
const { isListening, transcript, ... } = useSpeechRecognition('en-US')  // English
```

### Adjusting Gemini Thinking Level

Edit `server/services/gemini/geminiClient.js`:

```javascript
thinkingConfig: {
  thinkingLevel: "low"      // Fast (recommended)
  // thinkingLevel: "minimal"  // Fastest
  // thinkingLevel: "high"     // Highest quality (slower)
}
```

### Changing Backend Port

1. Update `.env`:
```env
PORT=8080
```

2. Update `frontend/src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8080';
```

---

## 📚 Documentation

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/generate` | POST | Generate code from prompt |
| `/api/checkpoints/:pageId` | GET | Get checkpoints for a page |
| `/api/checkpoints/:pageId/:checkpointId` | GET | Get specific checkpoint |
| `/api/templates` | GET | List all templates |
| `/api/templates/:id` | GET | Get specific template |
| `/api/apis` | GET | List available API configurations |
| `/api/logs` | GET | SSE stream for real-time logs |

### Detailed Documentation

- [Gemini 3 Integration Guide](DOCS/gemini3.md)
- [Prompt Engineering Strategies](DOCS/prompint-strategies.md)
- [Integration Notes](DOCS/gemini3-integration-notes.md)

---

## 🎨 Examples

### Example 1: Landing Page
```
"Create a modern landing page with a gradient background from purple to blue"
"Add a navigation bar with a logo on the left and menu items on the right"
"Create a hero section with a large title, subtitle, and call-to-action button"
"Add a features section with three cards showing icons and descriptions"
```

### Example 2: Dashboard
```
"Use the dashboard template"
"Modify the sidebar to include icons for Dashboard, Analytics, and Settings"
"Add a chart showing monthly revenue in the main area"
"Create a stats section with four cards showing key metrics"
```

### Example 3: 3D Scene
```
"Create a 3D scene with Three.js"
"Add a green ground plane and blue sky"
"Place a rotating cube in the center"
"Add ambient and directional lighting"
"Make the cube change color when clicked"
```

---

## 🐛 Troubleshooting

### Microphone Not Working

- ✅ Verify browser has microphone permissions
- ✅ Use Chrome or Edge (best Web Speech API support)
- ✅ Check that no other app is using the microphone
- ✅ Try refreshing the page and granting permissions again

### "GEMINI_API_KEY not configured" Error

- ✅ Verify `.env` file exists in the root directory
- ✅ Verify it contains `GEMINI_API_KEY=your_key_here`
- ✅ Restart the backend server after modifying `.env`
- ✅ Check for typos in the variable name

### Backend Connection Error

- ✅ Verify backend is running on port 3000 (`npm run dev`)
- ✅ Check `API_BASE_URL` in `frontend/src/services/api.js`
- ✅ Verify no firewall is blocking the connection
- ✅ Check browser console for CORS errors

### Code Not Rendering in Preview

- ✅ Check browser console for errors
- ✅ Verify the generated HTML is valid
- ✅ Try disabling browser extensions that might block iframes
- ✅ Check if Content Security Policy is blocking scripts

### Voice Recognition Not Working

- ✅ Web Speech API only works over HTTPS or localhost
- ✅ Some browsers don't support Web Speech API (use Chrome/Edge)
- ✅ Check browser compatibility at [caniuse.com](https://caniuse.com/speech-recognition)

---

## 🔒 Security

### Best Practices

- 🔐 **API Keys**: Never commit `.env` files to version control
- 🔐 **Sandboxed Iframe**: Generated code runs in an isolated sandbox
- 🔐 **CORS**: Backend configured with appropriate CORS policies
- 🔐 **Input Validation**: All user inputs are validated before processing
- 🔐 **Rate Limiting**: Consider adding rate limiting for production use

### Iframe Sandbox Attributes

```html
<iframe sandbox="allow-scripts allow-same-origin allow-forms" />
```

This prevents:
- Access to parent document
- Popup windows
- Top-level navigation
- Automatic feature execution

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

---

## 🚀 Deployment

LiveWeb includes comprehensive deployment infrastructure for production environments.

### Quick Deployment

1. **Configure GitHub Secrets** (see [SECRETS_SETUP.md](.github/SECRETS_SETUP.md))
2. **Push to main branch** - Automatic deployment via GitHub Actions
3. **Or manually deploy** using PM2 or Docker (see [DEPLOYMENT.md](DEPLOYMENT.md))

### Deployment Options

- **GitHub Actions**: Automated CI/CD pipeline
- **PM2**: Process manager for Node.js
- **Docker**: Containerized deployment
- **Nginx**: Reverse proxy for custom domains

For detailed deployment instructions, see:
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [DEPLOYMENT_SETUP.md](DEPLOYMENT_SETUP.md) - Setup instructions
- [PORT_CONFIGURATION.md](PORT_CONFIGURATION.md) - Port configuration

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini Team** for the amazing AI model
- **React Team** for the excellent UI library
- **Vite Team** for the blazing-fast build tool
- **Tailwind CSS** for the utility-first CSS framework
- **All Contributors** who help improve this project

---

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/brandonqr/liveweb/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/brandonqr/liveweb/discussions)
- 📚 **Documentation**: [Full Documentation](https://github.com/brandonqr/liveweb#readme)

---

## 🗺️ Roadmap

### Version 1.1 (Planned)

- [ ] Local Whisper integration for better voice recognition
- [ ] Image generation with Gemini Pro Vision
- [ ] Command history and undo/redo
- [ ] Code export to GitHub
- [ ] Collaborative editing (multi-user)
- [ ] Plugin system for custom integrations

### Version 2.0 (Future)

- [ ] Desktop application (Electron)
- [ ] Mobile app (React Native)
- [ ] Cloud deployment integration
- [ ] AI-powered code optimization
- [ ] Visual component editor
- [ ] Built-in testing framework

---

<div align="center">

**Made with ❤️ by the LiveWeb Team**

[⬆ Back to Top](#-liveweb---ai-powered-web-builder)

</div>
