/**
 * System Prompt
 * Main entry point - exports the complete SYSTEM_PROMPT
 * Maintains backward compatibility with original import
 */
import { buildSystemPrompt } from './builder.js';

export const SYSTEM_PROMPT = buildSystemPrompt();
