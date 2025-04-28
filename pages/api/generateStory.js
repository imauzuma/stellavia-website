export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { promptText } = req.body;

  if (!promptText) {
    return res.status(400).json({ message: 'Missing promptText' });
  }

  try {
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

    const data = await response.json();

    return res.status(200).json({ story: data.content });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to generate story' });
  }
}
