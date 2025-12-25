import express from 'express';
import healthRouter from './health.js';
import logsRouter from './logs.js';
import generateRouter from './generate.js';
import checkpointsRouter from './checkpoints.js';
import templatesRouter from './templates.js';
import apisRouter from './apis.js';

const router = express.Router();

// Mount routes
router.use('/', healthRouter);
router.use('/api/logs', logsRouter);
router.use('/api/generate', generateRouter);
router.use('/api/checkpoints', checkpointsRouter);
router.use('/api/templates', templatesRouter);
router.use('/api/apis', apisRouter);

export default router;
