import { ApiError } from '@google/genai';
import { RETRYABLE_STATUS_CODES } from '../../config/constants.js';

/**
 * Handle API errors from Gemini
 * @param {Error} error - Error object
 * @returns {Object} Error response
 */
export function handleGenerationError(error) {
  // Handle ApiError from Google GenAI SDK
  if (error instanceof ApiError) {
    const isRetryableError = RETRYABLE_STATUS_CODES.includes(error.status);
    
    if (!isRetryableError || process.env.NODE_ENV === 'development') {
      console.error('API Error:', {
        name: error.name,
        status: error.status,
        message: error.message?.substring(0, 200),
        ...(error.details && { details: error.details })
      });
    }
    
    // Handle specific HTTP status codes
    switch (error.status) {
      case 400:
        return {
          status: 400,
          error: 'Invalid request',
          message: 'The request parameters are invalid. Please check your input.',
          details: error.message
        };
      
      case 401:
        return {
          status: 401,
          error: 'Authentication failed',
          message: 'Invalid or missing API key. Please check your GEMINI_API_KEY in .env file.',
          details: error.message
        };
      
      case 403:
        return {
          status: 403,
          error: 'Access forbidden',
          message: 'Your API key does not have permission to access this resource.',
          details: error.message
        };
      
      case 404:
        return {
          status: 404,
          error: 'Model not found',
          message: 'The requested model (gemini-3-flash-preview) was not found. Please check the model name.',
          details: error.message
        };
      
      case 429:
        return {
          status: 429,
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please wait a moment and try again.',
          details: error.message,
          retryAfter: '30 seconds'
        };
      
      case 500:
      case 502:
      case 503:
      case 504:
        return {
          status: 502,
          error: 'Service temporarily unavailable',
          message: 'The Gemini API is experiencing temporary issues. Please try again in 30 seconds.',
          details: error.message,
          retryAfter: '30 seconds'
        };
      
      default:
        return {
          status: error.status || 500,
          error: 'API error',
          message: error.message || 'An error occurred while generating code.',
          details: error.details
        };
    }
  }
  
  // Handle non-ApiError exceptions
  console.error('Unexpected error:', error);
  
  // Check for common error patterns
  if (error.message?.includes('API_KEY') || error.message?.includes('authentication')) {
    return {
      status: 401,
      error: 'Authentication failed',
      message: 'Invalid API key. Please check your GEMINI_API_KEY in .env file.'
    };
  }
  
  if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
    return {
      status: 429,
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please wait a moment and try again.',
      retryAfter: '30 seconds'
    };
  }
  
  if (error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT')) {
    return {
      status: 504,
      error: 'Request timeout',
      message: 'The request took too long to complete. Please try again.',
      retryAfter: '30 seconds'
    };
  }
  
  // Generic error fallback
  return {
    status: 500,
    error: 'Internal server error',
    message: 'An unexpected error occurred while generating code.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
}
