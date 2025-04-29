export default async function handler(req, res) {
  console.log('API Route: /api/generateStory - Method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Method Not Allowed:', req.method);
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  try {
    const { promptText, prompt } = req.body;
    const promptContent = promptText || prompt;
    
    console.log('Request body received:', req.body);
    console.log('Using prompt content:', promptContent);

    if (!promptContent) {
      console.log('Missing prompt content in request body');
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    console.log('API Key exists:', !!apiKey);
    
    if (!apiKey) {
      console.error('Missing API key for Claude');
      return res.status(500).json({ error: 'Server configuration error: Missing API key' });
    }
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: promptContent
          }
        ]
      })
    });

    console.log('Claude API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      return res.status(502).json({ 
        error: 'Failed to fetch from Claude', 
        details: errorText 
      });
    }

    const data = await response.json();
    console.log('Claude API Response Data Structure:', Object.keys(data));
    
    if (!data.content) {
      console.error('Missing content in Claude API response:', data);
      return res.status(500).json({ 
        error: 'Invalid response from Claude API',
        details: data
      });
    }

    return res.status(200).json({ story: data.content });
  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({ 
      error: 'Internal Server Error', 
      details: error.message 
    });
  }
}
