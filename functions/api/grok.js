/**
 * Cloudflare Worker function to proxy Grok API requests
 * This allows us to keep the API key secure on the server side
 */

export async function onRequestPost(context) {
  const { env, request } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await request.json();
    
    // Get API configuration from environment variables
    const apiKey = env.GROK_API_KEY || env.VITE_GROK_API_KEY;
    const apiEndpoint = env.GROK_API_ENDPOINT || env.VITE_GROK_API_ENDPOINT || 'https://api.x.ai/v1/chat/completions';
    const model = env.GROK_MODEL || env.VITE_GROK_MODEL || 'grok-4-latest';
    
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }), 
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        }
      );
    }
    
    // Update the model in the request if needed
    if (body.model !== model) {
      body.model = model;
    }
    
    // Make the request to Grok API
    const grokResponse = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    const data = await grokResponse.json();
    
    // Return the response
    return new Response(JSON.stringify(data), {
      status: grokResponse.status,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error', message: error.message }), 
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
}