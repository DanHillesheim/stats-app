import { getAssetFromKV } from '@cloudflare/kv-asset-handler';
import { onRequestPost as handleGrokPost } from './api/grok';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});

async function handleRequest(event) {
  const url = new URL(event.request.url);
  
  // Handle API routes
  if (url.pathname === '/api/grok' && event.request.method === 'POST') {
    return handleGrokPost({
      env: {
        GROK_API_KEY: GROK_API_KEY,
        GROK_API_ENDPOINT: GROK_API_ENDPOINT,
        GROK_MODEL: GROK_MODEL,
        VITE_GROK_API_KEY: VITE_GROK_API_KEY,
        VITE_GROK_API_ENDPOINT: VITE_GROK_API_ENDPOINT,
        VITE_GROK_MODEL: VITE_GROK_MODEL
      },
      request: event.request
    });
  }
  
  // Handle static assets
  try {
    return await getAssetFromKV(event, {
      waitUntil(promise) {
        return event.waitUntil(promise);
      }
    });
  } catch (e) {
    // If asset not found, serve index.html for client-side routing
    if (e.status === 404) {
      const pathname = url.pathname;
      url.pathname = '/index.html';
      event.request = new Request(url.toString(), event.request);
      return await getAssetFromKV(event, {
        waitUntil(promise) {
          return event.waitUntil(promise);
        }
      });
    }
    throw e;
  }
}