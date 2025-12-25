# LiveWeb API Documentation

## Overview

LiveWeb provides a RESTful API for generating web code using Google Gemini 3 Flash. The API is built with Express.js and supports real-time logging via Server-Sent Events (SSE).

**Base URL**: `http://localhost:3000`

---

## Table of Contents

- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Health Check](#health-check)
  - [Code Generation](#code-generation)
  - [Checkpoints](#checkpoints)
  - [Templates](#templates)
  - [API Configurations](#api-configurations)
  - [Real-Time Logs](#real-time-logs)
- [Request/Response Examples](#requestresponse-examples)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Authentication

Currently, the API does not require authentication for local development. The Gemini API key is configured server-side via environment variables.

**Future versions** may include API key authentication for production deployments.

---

## Endpoints

### Health Check

Check if the server is running and healthy.

#### `GET /`

**Description**: Root endpoint returning server status.

**Response**:
```json
{
  "status": "ok",
  "message": "LiveWeb API Server is running",
  "version": "1.0.0"
}
```

#### `GET /health`

**Description**: Health check endpoint.

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2024-12-23T10:30:00.000Z"
}
```

---

### Code Generation

Generate HTML/CSS/JS code from natural language prompts.

#### `POST /api/generate`

**Description**: Generate code using Gemini 3 Flash based on a text prompt.

**Request Body**:
```json
{
  "prompt": "Create a landing page with a blue gradient background",
  "currentCode": "<!-- Optional: existing code to modify -->",
  "pageId": "optional-page-id",
  "templateId": "optional-template-id",
  "selectedComponent": "optional-css-selector"
}
```

**Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `prompt` | string | Yes | Natural language description of what to create/modify |
| `currentCode` | string | No | Existing HTML code to modify (for iterative changes) |
| `pageId` | string | No | Unique page identifier for checkpoint management |
| `templateId` | string | No | Template ID to use as base |
| `selectedComponent` | string | No | CSS selector of element to modify |

**Response**:
```json
{
  "code": "<!DOCTYPE html><html>...</html>",
  "success": true,
  "pageId": "page-abc123",
  "checkpointId": "checkpoint-xyz789",
  "detectedAPIs": ["mapbox", "threejs"],
  "metadata": {
    "generationTime": 2.5,
    "tokensUsed": 1234,
    "thinkingLevel": "low"
  }
}
```

**Status Codes**:
- `200 OK`: Code generated successfully
- `400 Bad Request`: Invalid request parameters
- `500 Internal Server Error`: Generation failed
- `503 Service Unavailable`: Gemini API unavailable

**Example Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a hero section with a gradient background",
    "currentCode": ""
  }'
```

---

### Checkpoints

Manage code version history with checkpoints.

#### `GET /api/checkpoints/:pageId`

**Description**: Get all checkpoints for a specific page.

**Parameters**:
- `pageId` (path): Unique page identifier

**Response**:
```json
{
  "checkpoints": [
    {
      "id": "checkpoint-1",
      "timestamp": "2024-12-23T10:00:00.000Z",
      "prompt": "Create a landing page",
      "preview": "<!DOCTYPE html>..."
    },
    {
      "id": "checkpoint-2",
      "timestamp": "2024-12-23T10:05:00.000Z",
      "prompt": "Add a navigation bar",
      "preview": "<!DOCTYPE html>..."
    }
  ]
}
```

#### `GET /api/checkpoints/:pageId/:checkpointId`

**Description**: Get code for a specific checkpoint.

**Parameters**:
- `pageId` (path): Unique page identifier
- `checkpointId` (path): Checkpoint identifier

**Response**:
```json
{
  "code": "<!DOCTYPE html><html>...</html>",
  "checkpoint": {
    "id": "checkpoint-1",
    "timestamp": "2024-12-23T10:00:00.000Z",
    "prompt": "Create a landing page"
  }
}
```

**Status Codes**:
- `200 OK`: Checkpoint found
- `404 Not Found`: Page or checkpoint not found

---

### Templates

Access pre-built templates for common use cases.

#### `GET /api/templates`

**Description**: Get all available templates.

**Response**:
```json
{
  "templates": [
    {
      "id": "landing",
      "name": "Landing Page",
      "description": "Modern landing page with hero section",
      "category": "marketing",
      "preview": "https://..."
    },
    {
      "id": "dashboard",
      "name": "Dashboard",
      "description": "Admin dashboard with sidebar",
      "category": "app",
      "preview": "https://..."
    }
  ]
}
```

#### `GET /api/templates/:templateId`

**Description**: Get a specific template with full code.

**Parameters**:
- `templateId` (path): Template identifier

**Response**:
```json
{
  "id": "landing",
  "name": "Landing Page",
  "description": "Modern landing page with hero section",
  "category": "marketing",
  "code": "<!DOCTYPE html><html>...</html>",
  "features": ["responsive", "animated", "seo-optimized"],
  "dependencies": ["tailwindcss"]
}
```

**Status Codes**:
- `200 OK`: Template found
- `404 Not Found`: Template not found

---

### API Configurations

Get available external API configurations.

#### `GET /api/apis`

**Description**: List all available API configurations (Mapbox, OpenWeather, etc.).

**Response**:
```json
{
  "apis": [
    {
      "id": "mapbox",
      "name": "Mapbox",
      "placeholder": "pk.ey...",
      "docsUrl": "https://docs.mapbox.com"
    },
    {
      "id": "openweather",
      "name": "OpenWeather",
      "placeholder": "abc123...",
      "docsUrl": "https://openweathermap.org/api"
    }
  ]
}
```

---

### Real-Time Logs

Stream server logs in real-time using Server-Sent Events (SSE).

#### `GET /api/logs`

**Description**: SSE endpoint for real-time server logs.

**Response**: Event stream

**Event Format**:
```
event: log
data: {"level":"info","message":"Code generation started","timestamp":"2024-12-23T10:00:00.000Z"}

event: log
data: {"level":"success","message":"Code generated successfully","timestamp":"2024-12-23T10:00:02.500Z"}
```

**Log Levels**:
- `info`: Informational messages
- `success`: Successful operations
- `warning`: Warning messages
- `error`: Error messages

**Example (JavaScript)**:
```javascript
const eventSource = new EventSource('http://localhost:3000/api/logs');

eventSource.addEventListener('log', (event) => {
  const log = JSON.parse(event.data);
  console.log(`[${log.level}] ${log.message}`);
});
```

---

## Request/Response Examples

### Example 1: Generate a Simple Page

**Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a simple page with a centered title saying Hello World"
  }'
```

**Response**:
```json
{
  "code": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>Hello World</title>\n  <style>\n    body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }\n    h1 { font-size: 3rem; }\n  </style>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>",
  "success": true,
  "pageId": "page-abc123",
  "checkpointId": "checkpoint-1",
  "detectedAPIs": [],
  "metadata": {
    "generationTime": 1.8,
    "tokensUsed": 456
  }
}
```

### Example 2: Modify Existing Code

**Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Change the background color to blue",
    "currentCode": "<!DOCTYPE html><html><body><h1>Hello</h1></body></html>",
    "pageId": "page-abc123"
  }'
```

**Response**:
```json
{
  "code": "<!DOCTYPE html>\n<html>\n<head>\n  <style>body { background-color: blue; }</style>\n</head>\n<body>\n  <h1>Hello</h1>\n</body>\n</html>",
  "success": true,
  "pageId": "page-abc123",
  "checkpointId": "checkpoint-2",
  "detectedAPIs": [],
  "metadata": {
    "generationTime": 1.2,
    "tokensUsed": 234
  }
}
```

### Example 3: Use a Template

**Request**:
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Use the dashboard template and change the sidebar color to dark gray",
    "templateId": "dashboard"
  }'
```

---

## Error Handling

All errors follow a consistent format:

**Error Response**:
```json
{
  "error": "Error message",
  "status": 400,
  "details": {
    "field": "prompt",
    "reason": "Prompt cannot be empty"
  }
}
```

### Common Error Codes

| Status Code | Description |
|-------------|-------------|
| `400` | Bad Request - Invalid parameters |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server error |
| `503` | Service Unavailable - Gemini API unavailable |

### Error Examples

**Missing Prompt**:
```json
{
  "error": "Prompt is required",
  "status": 400
}
```

**Gemini API Error**:
```json
{
  "error": "Failed to generate code",
  "status": 500,
  "details": {
    "geminiError": "API quota exceeded"
  }
}
```

**Checkpoint Not Found**:
```json
{
  "error": "Checkpoint not found",
  "status": 404,
  "details": {
    "pageId": "page-abc123",
    "checkpointId": "checkpoint-999"
  }
}
```

---

## Rate Limiting

**Current Status**: No rate limiting implemented for local development.

**Production Recommendations**:
- Implement rate limiting middleware (e.g., `express-rate-limit`)
- Suggested limits:
  - 10 requests per minute per IP for `/api/generate`
  - 100 requests per minute per IP for other endpoints

**Example Implementation**:
```javascript
import rateLimit from 'express-rate-limit';

const generateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later'
});

app.use('/api/generate', generateLimiter);
```

---

## WebSocket Support

**Future Feature**: Real-time code streaming as it's being generated.

**Planned Endpoint**: `ws://localhost:3000/ws/generate`

**Event Format**:
```json
{
  "type": "chunk",
  "data": "<div>Partial code...</div>"
}
```

---

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Same origin)

**Production**: Update CORS configuration in `server/middleware/cors.js` to include your production domain.

---

## API Versioning

**Current Version**: v1 (implicit)

**Future**: API versioning will be introduced:
- `/v1/api/generate`
- `/v2/api/generate`

---

## Additional Resources

- [Gemini 3 Documentation](DOCS/gemini3.md)
- [Prompt Engineering Guide](DOCS/prompint-strategies.md)
- [Integration Notes](DOCS/gemini3-integration-notes.md)

---

## Support

For API issues or questions:
- Open an issue on [GitHub](https://github.com/yourusername/liveweb/issues)
- Check existing [discussions](https://github.com/yourusername/liveweb/discussions)

---

**Last Updated**: December 2024

