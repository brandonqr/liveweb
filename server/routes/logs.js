import express from 'express';
import { sseClients } from '../stores/inMemoryStore.js';

const router = express.Router();

// SSE endpoint for real-time logs
router.get('/stream', (req, res) => {
  console.log('🔌 New SSE client connecting...');
  
  // Set headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable nginx buffering
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow CORS for SSE

  // Add client to set
  sseClients.add(res);
  console.log(`✅ SSE client connected. Total clients: ${sseClients.size}`);

  // Send initial connection message
  const initialMessage = JSON.stringify({
    level: 'info',
    message: 'Conectado al stream de logs',
    timestamp: new Date().toISOString()
  });
  res.write(`data: ${initialMessage}\n\n`);

  // Handle client disconnect
  req.on('close', () => {
    console.log('🔌 SSE client disconnected');
    sseClients.delete(res);
    console.log(`📊 Remaining SSE clients: ${sseClients.size}`);
    res.end();
  });
});

export default router;
