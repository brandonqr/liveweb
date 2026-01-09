import express from 'express';
import healthRouter from './health.js';
import logsRouter from './logs.js';
import generateRouter from './generate.js';
import checkpointsRouter from './checkpoints.js';
import templatesRouter from './templates.js';
import apisRouter from './apis.js';

const router = express.Router();

// Mount routes
// Note: These routes are mounted at /api in server/app.js
// So /logs becomes /api/logs, /templates becomes /api/templates, etc.
// Health is mounted directly in app.js at /health, so we don't include it here
router.use('/logs', logsRouter);
router.use('/generate', generateRouter);
router.use('/checkpoints', checkpointsRouter);
router.use('/templates', templatesRouter);
router.use('/apis', apisRouter);

export default router;
