import express from 'express';
import { templates, getAllTemplates } from '../templates/index.js';

const router = express.Router();

// Get all available templates
router.get('/', (req, res) => {
  try {
    const templatesList = getAllTemplates();
    res.json({ templates: templatesList });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Error fetching templates' });
  }
});

// Get specific template by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  if (!templates[id]) {
    return res.status(404).json({ error: 'Template not found' });
  }
  
  const template = templates[id];
  res.json({
    id: template.id,
    name: template.name,
    description: template.description,
    code: template.code
  });
});

export default router;
