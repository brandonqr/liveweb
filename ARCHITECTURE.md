# LiveWeb Architecture

## Overview

LiveWeb is a full-stack web application that enables voice-driven web development using Google's Gemini 3 Flash AI model. This document describes the system architecture, design decisions, and data flow.

---

## Table of Contents

- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Component Architecture](#component-architecture)
- [Data Flow](#data-flow)
- [Key Design Decisions](#key-design-decisions)
- [Security Considerations](#security-considerations)
- [Performance Optimizations](#performance-optimizations)
- [Scalability](#scalability)

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Frontend (Vite)                    │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │ Web Speech │  │   React    │  │  Iframe    │     │  │
│  │  │    API     │  │ Components │  │  Renderer  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  │         │              │                │            │  │
│  └─────────┼──────────────┼────────────────┼────────────┘  │
│            │              │                │               │
│            └──────────────┴────────────────┘               │
│                           │                                │
└───────────────────────────┼────────────────────────────────┘
                            │ HTTP/SSE
                            │
┌───────────────────────────▼────────────────────────────────┐
│                   Express Backend                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                    API Routes                         │  │
│  │  /generate  /checkpoints  /templates  /logs          │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │   Code     │  │ Checkpoint │  │  Template  │     │  │
│  │  │ Generation │  │  Manager   │  │  Handler   │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           │                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer                               │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐     │  │
│  │  │  In-Memory │  │   Gemini   │  │    API     │     │  │
│  │  │   Store    │  │   Cache    │  │  Detector  │     │  │
│  │  └────────────┘  └────────────┘  └────────────┘     │  │
│  └──────────────────────────────────────────────────────┘  │
└───────────────────────────┬────────────────────────────────┘
                            │ HTTPS
                            │
┌───────────────────────────▼────────────────────────────────┐
│                  Google Gemini API                          │
│              (Gemini 3 Flash Model)                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3+ | UI framework |
| **Vite** | 5.0+ | Build tool and dev server |
| **Tailwind CSS** | 3.4+ | Styling framework |
| **Framer Motion** | 11.0+ | Animations |
| **i18next** | 23.0+ | Internationalization |
| **Lucide React** | Latest | Icon library |
| **Web Speech API** | Native | Voice recognition |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 4.18+ | Web framework |
| **@google/genai** | Latest | Gemini SDK |
| **cors** | 2.8+ | CORS middleware |
| **dotenv** | 16.0+ | Environment config |
| **i18next** | 23.0+ | Backend i18n |

---

## Component Architecture

### Frontend Components

```
App.jsx (Root)
├── AppHeader
│   ├── LanguageSwitcher
│   ├── Status Badge
│   └── Action Buttons
│       ├── Microphone Toggle
│       ├── Templates Button
│       ├── Checkpoints Button
│       ├── API Keys Button
│       └── Download Button
├── AppContent
│   ├── EmptyState (when no code)
│   │   ├── EmptyStateHero
│   │   └── ExampleGrid
│   │       └── ExampleCard[]
│   └── CodeRenderer (when code exists)
│       └── Sandboxed Iframe
├── AppFooter
│   └── LogsPanel
│       └── LogEntry[]
├── CheckpointsPanel (Sidebar)
│   ├── CheckpointsPanelHeader
│   ├── CheckpointsList
│   │   └── CheckpointItem[]
│   └── CheckpointsPanelFooter
├── TemplatesPanel (Sidebar)
│   └── Template Cards[]
└── APIKeysConfig (Sidebar)
    ├── APIKeysConfigHeader
    ├── APIKeysList
    │   └── API Key Items[]
    └── APIKeyForm
```

### Backend Services

```
server/
├── app.js (Express App)
├── routes/
│   ├── health.js
│   ├── generate.js
│   ├── checkpoints.js
│   ├── templates.js
│   ├── apis.js
│   └── logs.js (SSE)
├── services/
│   ├── codeGeneration.js
│   │   └── Main generation orchestrator
│   ├── gemini/
│   │   ├── geminiClient.js
│   │   ├── promptBuilder.js
│   │   ├── thinkingLevelSelector.js
│   │   └── cacheManager.js
│   ├── codeProcessing/
│   │   ├── codeCleaner.js
│   │   └── codeEnhancer.js
│   ├── checkpoints.js
│   └── templates/
│       ├── templateHandler.js
│       ├── templateMatcher.js
│       └── templateValidator.js
├── stores/
│   └── inMemoryStore.js
├── utils/
│   ├── apiKeys/
│   │   ├── detector.js
│   │   ├── injector.js
│   │   └── strategies/
│   ├── codeInjector.js
│   └── pageIdManager.js
└── templates/
    └── Template definitions
```

---

## Data Flow

### 1. Voice Input Flow

```
User speaks
    ↓
Web Speech API captures audio
    ↓
Speech-to-text conversion (browser)
    ↓
Transcript sent to React state
    ↓
useCodeGeneration hook triggered
    ↓
POST /api/generate with prompt
```

### 2. Code Generation Flow

```
POST /api/generate
    ↓
Express route handler
    ↓
codeGeneration.js service
    ↓
Prompt Builder
    ├── Load system prompts
    ├── Add context (current code)
    ├── Add guidelines (Three.js, Mapbox, etc.)
    └── Build final prompt
    ↓
Gemini Client
    ├── Check cache
    ├── Send to Gemini API
    └── Receive response
    ↓
Code Processing
    ├── Clean code (remove markdown)
    ├── Enhance code (add meta tags)
    ├── Detect APIs (Mapbox, etc.)
    └── Inject API keys
    ↓
Checkpoint Manager
    └── Save checkpoint
    ↓
Response to frontend
    ↓
CodeRenderer updates iframe
```

### 3. Real-Time Logging Flow

```
Backend operation starts
    ↓
sseLogs.broadcast() called
    ↓
SSE stream sends event
    ↓
Frontend EventSource receives
    ↓
useSSELogs hook processes
    ↓
Logger state updated
    ↓
LogsPanel re-renders
```

### 4. Checkpoint Management Flow

```
Code generated
    ↓
Checkpoint created automatically
    ↓
Stored in inMemoryStore
    ↓
User clicks checkpoint
    ↓
GET /api/checkpoints/:pageId/:checkpointId
    ↓
Code retrieved from store
    ↓
CodeRenderer updates with checkpoint code
```

---

## Key Design Decisions

### 1. In-Memory Storage

**Decision**: Use in-memory storage instead of a database.

**Rationale**:
- Simplicity for local development
- Fast read/write operations
- No database setup required
- Suitable for single-user sessions

**Trade-offs**:
- Data lost on server restart
- Not suitable for production multi-user scenarios
- Limited by server memory

**Future**: Consider Redis or PostgreSQL for production.

### 2. Sandboxed Iframe

**Decision**: Render generated code in a sandboxed iframe.

**Rationale**:
- Security: Isolates generated code from parent document
- Prevents XSS attacks
- Allows full HTML/CSS/JS without restrictions
- Easy to reset/reload

**Sandbox Attributes**:
```html
<iframe sandbox="allow-scripts allow-same-origin allow-forms" />
```

### 3. Server-Sent Events (SSE) for Logs

**Decision**: Use SSE instead of WebSockets for real-time logs.

**Rationale**:
- Simpler than WebSockets
- One-way communication (server → client)
- Automatic reconnection
- Works over HTTP
- No additional libraries needed

**Trade-offs**:
- One-way only (sufficient for logs)
- Less efficient than WebSockets for bidirectional

### 4. Gemini Thinking Levels

**Decision**: Use "low" thinking level by default.

**Rationale**:
- Faster response times (1-3 seconds)
- Good balance of quality and speed
- Suitable for iterative development
- Can be adjusted per request

**Options**:
- `minimal`: Fastest (Gemini 3 Flash only)
- `low`: Fast with good quality (default)
- `high`: Best quality, slower

### 5. Context Caching

**Decision**: Implement Gemini context caching for system prompts.

**Rationale**:
- Reduces token usage
- Faster response times
- Lower costs
- System prompts rarely change

**Implementation**:
- Cache system prompts and guidelines
- TTL: 1 hour
- Invalidate on prompt changes

### 6. Custom Hooks Architecture

**Decision**: Split logic into custom React hooks.

**Rationale**:
- Separation of concerns
- Reusability
- Easier testing
- Cleaner component code

**Hooks**:
- `useSpeechRecognition`: Voice input
- `useCodeGeneration`: Code generation logic
- `useAppState`: Application state
- `useLogger`: Logging system
- `useKeyboardShortcuts`: Keyboard events
- `usePanelManagement`: Sidebar panels
- `useSSELogs`: Real-time logs

---

## Security Considerations

### 1. API Key Protection

- **Server-side only**: Gemini API key never exposed to frontend
- **Environment variables**: Stored in `.env` (gitignored)
- **No client-side storage**: API keys never sent to browser

### 2. Iframe Sandboxing

- **Restricted permissions**: `allow-scripts allow-same-origin allow-forms`
- **No top navigation**: Prevents redirects
- **No popups**: Prevents unwanted windows
- **Isolated context**: Cannot access parent document

### 3. Input Validation

- **Prompt validation**: Max length, sanitization
- **Code validation**: Check for malicious patterns
- **API endpoint validation**: Request body validation

### 4. CORS Configuration

- **Whitelist origins**: Only localhost in development
- **Production**: Update to specific domains
- **Credentials**: Not allowed by default

### 5. Content Security Policy

**Recommended for production**:
```javascript
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline';"
  );
  next();
});
```

---

## Performance Optimizations

### 1. Frontend Optimizations

- **Code splitting**: Lazy load components
- **Memoization**: Use `useMemo` and `useCallback`
- **Virtual scrolling**: For large lists (checkpoints)
- **Debouncing**: Voice input processing
- **Image optimization**: Lazy load images

### 2. Backend Optimizations

- **Context caching**: Gemini prompt caching
- **Response compression**: gzip/brotli
- **Connection pooling**: HTTP keep-alive
- **In-memory caching**: Frequently accessed data

### 3. Network Optimizations

- **SSE**: Efficient real-time updates
- **HTTP/2**: Multiplexing
- **CDN**: Static assets (production)
- **Minification**: CSS/JS bundles

### 4. Gemini API Optimizations

- **Thinking level**: Use "low" for speed
- **Prompt optimization**: Concise, clear prompts
- **Context management**: Only send necessary context
- **Streaming**: Future feature for progressive rendering

---

## Scalability

### Current Limitations

- **Single server**: No load balancing
- **In-memory storage**: Limited by RAM
- **No horizontal scaling**: Stateful server

### Scaling Strategies

#### Vertical Scaling
- Increase server resources (CPU, RAM)
- Suitable for small-medium traffic

#### Horizontal Scaling
1. **Stateless backend**:
   - Move to Redis/PostgreSQL
   - Session management
   - Shared cache

2. **Load balancing**:
   - Nginx/HAProxy
   - Multiple backend instances
   - Sticky sessions for SSE

3. **Microservices** (future):
   ```
   ┌─────────────┐
   │   Gateway   │
   └──────┬──────┘
          │
     ┌────┴────┬────────┬────────┐
     │         │        │        │
   ┌─▼──┐  ┌──▼─┐  ┌──▼─┐  ┌───▼──┐
   │Gen │  │Chk │  │Tmp │  │ API  │
   │Svc │  │Svc │  │Svc │  │ Keys │
   └────┘  └────┘  └────┘  └──────┘
   ```

4. **Caching layers**:
   - Redis for sessions
   - CDN for static assets
   - Gemini response caching

5. **Database**:
   - PostgreSQL for persistence
   - Redis for fast access
   - S3 for code storage

---

## Monitoring and Observability

### Recommended Tools

1. **Application Monitoring**:
   - PM2 for process management
   - New Relic / Datadog for APM

2. **Logging**:
   - Winston / Pino for structured logs
   - ELK stack for log aggregation

3. **Metrics**:
   - Prometheus for metrics
   - Grafana for visualization

4. **Error Tracking**:
   - Sentry for error monitoring
   - Custom error boundaries

### Key Metrics to Track

- Request latency (p50, p95, p99)
- Error rates
- Gemini API response times
- Memory usage
- Active connections
- Checkpoint creation rate

---

## Future Improvements

### Short-term (v1.1)

- [ ] Add Redis for persistence
- [ ] Implement rate limiting
- [ ] Add request caching
- [ ] Improve error handling
- [ ] Add unit tests

### Medium-term (v2.0)

- [ ] WebSocket support for streaming
- [ ] Multi-user support
- [ ] Cloud deployment
- [ ] Database integration
- [ ] Advanced caching strategies

### Long-term (v3.0)

- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Real-time collaboration
- [ ] Plugin system
- [ ] Enterprise features

---

## Deployment Architecture

### Development

```
Local Machine
├── Frontend (Vite Dev Server) :5173
└── Backend (Node.js) :3000
```

### Production (Recommended)

```
┌─────────────────────────────────────┐
│            Load Balancer            │
│         (Nginx / CloudFlare)        │
└──────────┬──────────────────────────┘
           │
    ┌──────┴──────┐
    │             │
┌───▼───┐     ┌───▼───┐
│ App 1 │     │ App 2 │
│ :3000 │     │ :3000 │
└───┬───┘     └───┬───┘
    │             │
    └──────┬──────┘
           │
    ┌──────▼──────┐
    │    Redis    │
    │   (Cache)   │
    └─────────────┘
```

---

## Conclusion

LiveWeb's architecture is designed for simplicity and developer experience in local development, with clear paths for scaling and production deployment. The modular design allows for easy extension and customization while maintaining security and performance.

For questions or suggestions about the architecture, please open an issue on GitHub.

---

**Last Updated**: December 2024

