/**
 * APIKeysList Component
 * List of API key forms
 */
import { APIKeyForm } from './APIKeyForm';

/**
 * Helper function to get API docs URL
 * @param {string} apiId - API identifier
 * @returns {string} Docs URL
 */
function getAPIDocs(apiId) {
  const docs = {
    mapbox: 'https://docs.mapbox.com/help/getting-started/access-tokens/',
    googleMaps: 'https://developers.google.com/maps/documentation/javascript/get-api-key',
    openai: 'https://platform.openai.com/api-keys',
    stripe: 'https://stripe.com/docs/keys',
    firebase: 'https://firebase.google.com/docs/web/setup',
    algolia: 'https://www.algolia.com/doc/guides/security/api-keys/',
    sendgrid: 'https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication',
    twilio: 'https://www.twilio.com/docs/usage/api',
    gemini: 'https://ai.google.dev/gemini-api/docs/api-key'
  };
  return docs[apiId] || '#';
}

/**
 * APIKeysList component
 * @param {Array} apis - Array of API configurations
 * @param {Object} apiKeys - Current API keys object
 * @param {Object} saving - Saving state object
 * @param {Function} onChange - Change handler
 * @param {Function} onSave - Save handler
 * @param {Function} onDelete - Delete handler
 */
export const APIKeysList = ({
  apis,
  apiKeys,
  saving,
  onChange,
  onSave,
  onDelete
}) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {apis.map((api) => {
        const hasKey = apiKeys[api.id] && apiKeys[api.id].trim() !== '';
        const isSaving = saving[api.id];
        
        return (
          <APIKeyForm
            key={api.id}
            api={api}
            value={apiKeys[api.id] || ''}
            hasKey={hasKey}
            isSaving={isSaving}
            onChange={onChange}
            onSave={onSave}
            onDelete={onDelete}
            getDocsUrl={getAPIDocs}
          />
        );
      })}
    </div>
  );
};

export default APIKeysList;
