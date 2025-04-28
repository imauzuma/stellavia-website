export default async function handler(req, res) {
  console.log('API Route: /api/generateStory - Method:', req.method);
  
  if (req.method !== 'POST') {
    console.log('Method Not Allowed:', req.method);
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { promptText } = req.body;
    console.log('Request body received:', req.body);

    if (!promptText) {
      console.log('Missing promptText in request body');
      return res.status(400).json({ message: 'Missing promptText' });
    }

    console.log('API Key exists:', !!process.env.CLAUDE_API_KEY);
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CLAUDE_API_KEY}`,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: promptText
          }
        ]
      })
    });

    console.log('Claude API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API Error:', response.status, errorText);
      return res.status(response.status).json({ 
        message: `Claude API Error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Claude API Response Data:', data);

    if (!data.content) {
      console.error('Missing content in Claude API response:', data);
      return res.status(500).json({ 
        message: 'Invalid response from Claude API',
        details: data
      });
    }

    return res.status(200).json({ story: data.content });
  } catch (error) {
    console.error('API Route Error:', error);
    return res.status(500).json({ 
      message: 'Failed to generate story',
      error: error.message
    });
  }
}
