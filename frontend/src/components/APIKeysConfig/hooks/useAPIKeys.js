/**
 * useAPIKeys Hook
 * Manages API keys state and operations
 */
import { useState, useEffect, useCallback } from 'react';
import { saveAPIKey, getAPIKeysForPage, deleteAPIKey } from '../../../utils/apiKeysStorage';
import { getAvailableAPIs } from '../../../services/api';

/**
 * Hook for managing API keys
 * @param {string} pageId - Current page ID
 * @param {boolean} isOpen - Whether panel is open
 * @param {Function} onKeysUpdated - Callback when keys are updated
 * @returns {Object} API keys state and handlers
 */
export function useAPIKeys(pageId, isOpen, onKeysUpdated) {
  const [apiKeys, setApiKeys] = useState({});
  const [saving, setSaving] = useState({});
  const [availableAPIs, setAvailableAPIs] = useState([]);
  const [loadingAPIs, setLoadingAPIs] = useState(false);

  // Load APIs and existing keys when panel opens
  useEffect(() => {
    if (pageId && isOpen) {
      // Load existing keys
      const existingKeys = getAPIKeysForPage(pageId);
      setApiKeys(existingKeys);
      
      // Load all available APIs
      setLoadingAPIs(true);
      getAvailableAPIs()
        .then(data => {
          setAvailableAPIs(data.apis || []);
        })
        .catch(error => {
          console.error('Error loading available APIs:', error);
          // Fallback to hardcoded list
          const fallbackAPIs = [
            { id: 'mapbox', name: 'Mapbox', placeholder: 'YOUR_MAPBOX_TOKEN', docsUrl: 'https://docs.mapbox.com/help/getting-started/access-tokens/' },
            { id: 'googleMaps', name: 'Google Maps', placeholder: 'YOUR_GOOGLE_MAPS_API_KEY', docsUrl: 'https://developers.google.com/maps/documentation/javascript/get-api-key' },
            { id: 'openai', name: 'OpenAI', placeholder: 'YOUR_OPENAI_API_KEY', docsUrl: 'https://platform.openai.com/api-keys' },
            { id: 'stripe', name: 'Stripe', placeholder: 'YOUR_STRIPE_API_KEY', docsUrl: 'https://stripe.com/docs/keys' },
            { id: 'firebase', name: 'Firebase', placeholder: 'YOUR_FIREBASE_API_KEY', docsUrl: 'https://firebase.google.com/docs/web/setup' },
            { id: 'algolia', name: 'Algolia', placeholder: 'YOUR_ALGOLIA_API_KEY', docsUrl: 'https://www.algolia.com/doc/guides/security/api-keys/' },
            { id: 'sendgrid', name: 'SendGrid', placeholder: 'YOUR_SENDGRID_API_KEY', docsUrl: 'https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication' },
            { id: 'twilio', name: 'Twilio', placeholder: 'YOUR_TWILIO_API_KEY', docsUrl: 'https://www.twilio.com/docs/usage/api' },
            { id: 'gemini', name: 'Google Gemini', placeholder: 'YOUR_GEMINI_API_KEY', docsUrl: 'https://ai.google.dev/gemini-api/docs/api-key' }
          ];
          setAvailableAPIs(fallbackAPIs);
        })
        .finally(() => {
          setLoadingAPIs(false);
        });
    }
  }, [pageId, isOpen]);

  const handleSave = useCallback(async (apiId) => {
    if (!pageId || !apiKeys[apiId]) return;
    
    setSaving(prev => ({ ...prev, [apiId]: true }));
    
    try {
      saveAPIKey(pageId, apiId, apiKeys[apiId]);
      if (onKeysUpdated) onKeysUpdated();
      
      // Visual feedback
      setTimeout(() => {
        setSaving(prev => ({ ...prev, [apiId]: false }));
      }, 500);
    } catch (error) {
      console.error('Error saving API key:', error);
      setSaving(prev => ({ ...prev, [apiId]: false }));
    }
  }, [pageId, apiKeys, onKeysUpdated]);

  const handleDelete = useCallback((apiId) => {
    if (!pageId) return;
    deleteAPIKey(pageId, apiId);
    setApiKeys(prev => {
      const updated = { ...prev };
      delete updated[apiId];
      return updated;
    });
    if (onKeysUpdated) onKeysUpdated();
  }, [pageId, onKeysUpdated]);

  const handleChange = useCallback((apiId, value) => {
    setApiKeys(prev => ({
      ...prev,
      [apiId]: value
    }));
  }, []);

  return {
    apiKeys,
    saving,
    availableAPIs,
    loadingAPIs,
    handleSave,
    handleDelete,
    handleChange
  };
}
