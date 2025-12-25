/**
 * API Patterns Configuration
 * Centralized configuration for all API detection patterns
 */

export const API_PATTERNS = {
  mapbox: {
    name: 'Mapbox',
    patterns: [
      /mapboxgl\.accessToken\s*=/i,
      /mapboxgl\.accessToken\s*:\s*['"]/i,
      /mapbox\.com/i,
      /mapbox-gl/i,
      /mapboxgl/i,
      /YOUR_MAPBOX_TOKEN/i,
      /MAPBOX.*TOKEN/i,
      /mapbox.*api.*key/i
    ],
    placeholder: 'YOUR_MAPBOX_TOKEN',
    injectionPattern: /mapboxgl\.accessToken\s*=\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `mapboxgl.accessToken = '${key}';`,
    docsUrl: 'https://docs.mapbox.com/help/getting-started/access-tokens/'
  },
  googleMaps: {
    name: 'Google Maps',
    patterns: [
      /google\.maps/i,
      /new google\.maps\.Map/i,
      /googlemaps/i,
      /gmaps/i,
      /GOOGLE.*MAPS.*API.*KEY/i,
      /YOUR_GOOGLE_MAPS_API_KEY/i,
      /maps\.googleapis\.com/i
    ],
    placeholder: 'YOUR_GOOGLE_MAPS_API_KEY',
    injectionPattern: /key\s*=\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `key=${key}`,
    docsUrl: 'https://developers.google.com/maps/documentation/javascript/get-api-key'
  },
  openai: {
    name: 'OpenAI',
    patterns: [
      /new OpenAI\(/i,
      /openai\.apiKey/i,
      /OPENAI.*API.*KEY/i,
      /YOUR_OPENAI_API_KEY/i,
      /api\.openai\.com/i
    ],
    placeholder: 'YOUR_OPENAI_API_KEY',
    injectionPattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `apiKey: '${key}'`,
    docsUrl: 'https://platform.openai.com/api-keys'
  },
  stripe: {
    name: 'Stripe',
    patterns: [
      /new Stripe\(/i,
      /stripe\.publishableKey/i,
      /STRIPE.*API.*KEY/i,
      /YOUR_STRIPE_API_KEY/i,
      /stripe\.com/i
    ],
    placeholder: 'YOUR_STRIPE_API_KEY',
    injectionPattern: /publishableKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `publishableKey: '${key}'`,
    docsUrl: 'https://stripe.com/docs/keys'
  },
  firebase: {
    name: 'Firebase',
    patterns: [
      /firebase\.initializeApp/i,
      /firebaseConfig/i,
      /FIREBASE.*API.*KEY/i,
      /YOUR_FIREBASE_API_KEY/i,
      /firebase\.googleapis\.com/i
    ],
    placeholder: 'YOUR_FIREBASE_API_KEY',
    injectionPattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `apiKey: '${key}'`,
    docsUrl: 'https://firebase.google.com/docs/web/setup'
  },
  algolia: {
    name: 'Algolia',
    patterns: [
      /algoliasearch\(/i,
      /ALGOLIA.*API.*KEY/i,
      /YOUR_ALGOLIA_API_KEY/i,
      /algolia\.net/i
    ],
    placeholder: 'YOUR_ALGOLIA_API_KEY',
    injectionPattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `apiKey: '${key}'`,
    docsUrl: 'https://www.algolia.com/doc/guides/security/api-keys/'
  },
  sendgrid: {
    name: 'SendGrid',
    patterns: [
      /sendgrid/i,
      /SENDGRID.*API.*KEY/i,
      /YOUR_SENDGRID_API_KEY/i,
      /sendgrid\.com/i
    ],
    placeholder: 'YOUR_SENDGRID_API_KEY',
    injectionPattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `apiKey: '${key}'`,
    docsUrl: 'https://docs.sendgrid.com/api-reference/how-to-use-the-sendgrid-v3-api/authentication'
  },
  twilio: {
    name: 'Twilio',
    patterns: [
      /twilio/i,
      /TWILIO.*API.*KEY/i,
      /YOUR_TWILIO_API_KEY/i,
      /twilio\.com/i
    ],
    placeholder: 'YOUR_TWILIO_API_KEY',
    injectionPattern: /apiKey\s*:\s*['"][^'"]*['"]/gi,
    injectionTemplate: (key) => `apiKey: '${key}'`,
    docsUrl: 'https://www.twilio.com/docs/usage/api'
  },
  gemini: {
    name: 'Google Gemini',
    patterns: [
      /@google\/genai/i,
      /GoogleGenerativeAI/i,
      /new GoogleGenerativeAI\(/i,
      /gemini/i,
      /GEMINI.*API.*KEY/i,
      /YOUR_GEMINI_API_KEY/i,
      /google\.ai/i,
      /generativelanguage\.googleapis\.com/i,
      /gemini.*chat/i,
      /gemini.*model/i,
      /chat.*gemini/i,
      /ai.*chat/i
    ],
    placeholder: 'YOUR_GEMINI_API_KEY',
    injectionPattern: /new GoogleGenerativeAI\(['"][^'"]*['"]\)/gi,
    injectionTemplate: (key) => `new GoogleGenerativeAI('${key}')`,
    docsUrl: 'https://ai.google.dev/gemini-api/docs/api-key'
  }
};
