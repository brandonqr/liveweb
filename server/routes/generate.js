import express from 'express';
import { generateCode, handleGenerationError } from '../services/codeGeneration.js';

const router = express.Router();

// Code generation endpoint
router.post('/', async (req, res) => {
  const { prompt, currentCode, pageId, templateId, selectedComponent } = req.body;

  try {
    const result = await generateCode({
      prompt,
      currentCode,
      pageId,
      templateId,
      selectedComponent
    });
    
    res.json(result);
  } catch (error) {
    const errorResponse = handleGenerationError(error);
    res.status(errorResponse.status).json(errorResponse);
  }
});

export default router;
