require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();

// Configure CORS - Allow requests from your frontend development server
const corsOptions = {
  origin: 'http://localhost:5173', // UPDATED PORT to match frontend logs
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions));
app.use(express.json());

// Ensure API Key is loaded
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('Error: OPENAI_API_KEY is not set in the .env file.');
  process.exit(1); // Exit if the key is missing
}

const openai = new OpenAI({ apiKey });

app.post('/api/ai', async (req, res) => {
  try {
    const { prompt, model = 'gpt-3.5-turbo' } = req.body; // Default to gpt-3.5-turbo for cost/speed
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    console.log(`Received prompt: ${prompt}, Model: ${model}`); // Log received prompt

    const completion = await openai.chat.completions.create({
      model: model,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    console.log(`OpenAI Response: ${aiResponse}`); // Log AI response

    if (aiResponse) {
        res.json({ result: aiResponse });
    } else {
        res.status(500).json({ error: 'Failed to get response content from OpenAI' });
    }

  } catch (error) {
    console.error('Error processing /api/ai:', error);
    // Provide more specific error feedback if possible
    const statusCode = error.response ? error.response.status : 500;
    const errorMessage = error.response ? error.response.data : error.message;
    res.status(statusCode).json({ error: 'Failed to process AI request', details: errorMessage });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend server running on http://localhost:${PORT}`)); 