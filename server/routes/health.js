import express from 'express';

const router = express.Router();

// Test route
router.get('/', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'LiveWeb API Server is running',
    version: '1.0.0'
  });
});

// Health check route
router.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

export default router;
