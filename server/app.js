import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { corsMiddleware } from './middleware/cors.js';
import routes from './routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));

// Health check route (before static files)
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes - mount at /api explicitly
app.use('/api', routes);

// Serve static files from frontend/dist in production
// The frontend/dist is packaged INSIDE the Docker image by the Dockerfile
if (process.env.NODE_ENV === 'production') {
  // Use absolute path from app root (/app) - process.cwd() should be /app in Docker
  const frontendDistPath = path.join(process.cwd(), 'frontend', 'dist');
  
  // Verify path exists and log for debugging
  if (fs.existsSync(frontendDistPath)) {
    console.log(`✅ Serving frontend from: ${frontendDistPath}`);
    app.use(express.static(frontendDistPath));
    
    // SPA fallback - serve index.html for all non-API routes
    app.get('*', (req, res) => {
      // Skip API and health routes
      if (req.path.startsWith('/api/') || req.path.startsWith('/health')) {
        return res.status(404).json({ error: 'Endpoint not found' });
      }
      res.sendFile(path.join(frontendDistPath, 'index.html'));
    });
  } else {
    console.error(`❌ Frontend dist not found at: ${frontendDistPath}`);
    console.error(`   Current working directory: ${process.cwd()}`);
    console.error(`   This should not happen if the Docker image was built correctly.`);
  }
} else {
  // In development, mount API routes at root for backward compatibility
  app.use('/', routes);
}

export default app;
