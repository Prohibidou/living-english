// Load environment variables
require('dotenv').config();

// Import required packages
const express = require('express');
const Groq = require('groq-sdk');
const cors = require('cors');

// --- Basic Setup ---
const app = express();
const port = 3001;

// --- Groq Client Initialization ---
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// --- Middleware ---
// Enable CORS for the frontend development server
app.use(cors({ origin: 'http://localhost:5173' }));
// Enable JSON body parsing for POST requests
app.use(express.json());

// --- API Endpoint ---
app.post('/api/chat', async (req, res) => {
    // Check for API key
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === "YOUR_GROQ_API_KEY") {
        return res.status(400).json({ error: 'Groq API key is not configured. Please check your .env file.' });
    }

    // Get the prompt from the request body
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required.' });
    }

    try {
        // Request chat completion from Groq
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama3-8b-8192', // Using Llama 3 8B model
            temperature: 0.7,
            max_tokens: 150,
        });

        // Send back the AI's response
        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I couldn\'t get a response.';
        res.json({ response: aiResponse });

    } catch (error) {
        console.error('Error calling Groq API:', error);
        res.status(500).json({ error: 'Failed to get response from Groq API.' });
    }
});

// --- Start Server ---
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
