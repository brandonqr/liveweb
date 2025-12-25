import express from 'express';
import { getCheckpoints, getCheckpoint } from '../services/checkpoints.js';

const router = express.Router();

// Get checkpoints for a page
router.get('/:pageId', (req, res) => {
  const { pageId } = req.params;
  const checkpoints = getCheckpoints(pageId);
  res.json({ checkpoints });
});

// Get code for a specific checkpoint
router.get('/:pageId/:checkpointId', (req, res) => {
  const { pageId, checkpointId } = req.params;
  
  const result = getCheckpoint(pageId, checkpointId);
  
  if (!result) {
    return res.status(404).json({ error: 'Checkpoint not found' });
  }
  
  res.json(result);
});

export default router;
