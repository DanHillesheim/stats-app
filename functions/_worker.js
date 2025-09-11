import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle API routes
    if (url.pathname === '/api/grok' && request.method === 'POST') {
      // Import the grok handler dynamically
      const { onRequestPost } = await import('./api/grok');
      return onRequestPost({ env, request });
    }
    
    // Handle static assets
    try {
      // Create a fake event object for getAssetFromKV
      const event = {
        request,
        waitUntil: (promise) => ctx.waitUntil(promise),
      };
      
      return await getAssetFromKV(event, {
        ASSET_NAMESPACE: env.__STATIC_CONTENT,
        ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
      });
    } catch (e) {
      // If asset not found, serve index.html for client-side routing
      if (e.status === 404) {
        url.pathname = '/index.html';
        const indexRequest = new Request(url.toString(), request);
        const event = {
          request: indexRequest,
          waitUntil: (promise) => ctx.waitUntil(promise),
        };
        return await getAssetFromKV(event, {
          ASSET_NAMESPACE: env.__STATIC_CONTENT,
          ASSET_MANIFEST: JSON.parse(env.__STATIC_CONTENT_MANIFEST),
        });
      }
      
      // Return error response
      return new Response('Error: ' + e.message, { status: 500 });
    }
  },
};