import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('✅ Backend running');
});

// Chat route (AI integration)
app.post('/api/chat', async (req, res) => {
  try {
    const items = req.body.items;
    if (!items || items.length === 0) {
      return res.json({ reply: 'No items selected.' });
    }

    const prompt = items
      .map(i => `[${i['#']}] ${i['Area']}: ${i['Verification Requirement']}`)
      .join('\n');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        prompt,
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('HF ERROR:', text);
      return res.json({ reply: 'HF Error: ' + text });
    }

    const data = await response.json();
    const aiReply = data?.choices?.[0]?.text || 'No response from AI';
    res.json({ reply: aiReply });

  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ reply: 'Error contacting AI service.' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));