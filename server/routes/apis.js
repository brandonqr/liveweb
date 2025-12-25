import express from 'express';
import { getAllAPIConfigs } from '../utils/apiKeys/index.js';

const router = express.Router();

// Get all available API configurations
router.get('/', (req, res) => {
  try {
    const allAPIs = getAllAPIConfigs();
    // Convert to array format for frontend
    const apisList = Object.entries(allAPIs).map(([id, config]) => ({
      id,
      name: config.name,
      placeholder: config.placeholder,
      docsUrl: config.docsUrl
    }));
    res.json({ apis: apisList });
  } catch (error) {
    console.error('Error fetching APIs:', error);
    res.status(500).json({ error: 'Error fetching APIs' });
  }
});

export default router;
