const Groq = require('groq-sdk');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    // Initialize Groq Client
    const groq = new Groq({
        apiKey: process.env.GROQ_API_KEY,
    });

    if (!process.env.GROQ_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Groq API key is not configured.' }),
        };
    }

    try {
        const { prompt, products } = JSON.parse(event.body);

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Prompt is required.' }),
            };
        }

        console.log("Sending message to Groq:", prompt);

        // Create product list with English names and prices
        const productList = products ? products
            .reduce((acc, p) => {
                const englishName = p.name === 'Lechuga' ? 'Lettuce' :
                    p.name === 'Tomate' ? 'Tomato' :
                        p.name === 'Papas Lays' ? "Lay's Chips" : p.name;
                if (!acc.find(item => item.name === englishName)) {
                    acc.push({ name: englishName, price: p.price || 0 });
                }
                return acc;
            }, [])
            .map(p => `- ${p.name}: $${p.price.toFixed(2)}`)
            .join('\n') : '';

        // Enhanced system message for English learning cashier
        const systemMessage = {
            role: 'system',
            content: `You are a friendly and patient supermarket cashier who helps customers practice English. You MUST ALWAYS speak in English, even if the customer speaks Spanish.

🛒 AVAILABLE PRODUCTS IN STORE:
${productList}

📋 YOUR ROLE AS CASHIER:
1. Greet customers warmly and ask what they'd like to buy
2. When they mention products, ask "How many would you like?"
3. Keep track of their order and calculate the running total
4. Make friendly small talk (ask about their day, weekend plans, weather, hobbies, etc.)
5. When they're done shopping, provide the total and ask about payment method (cash, card, mobile payment)
6. Thank them and wish them a good day

✏️ YOUR ROLE AS ENGLISH TEACHER:
- If the customer makes a grammar mistake, gently correct it
- Show the correct form like: "I see you meant 'I want' instead of 'I wants'. That's great effort!"
- If they use Spanish words, teach them the English equivalent
- Praise good English usage
- Keep corrections friendly and encouraging
- Don't over-correct - focus on major errors

💬 CONVERSATION STYLE:
- Be natural and conversational
- Ask follow-up questions to keep the conversation going
- Use simple, clear English
- Be patient and supportive
- Make the learning experience fun and low-pressure

🎯 IMPORTANT RULES:
- ALWAYS respond in English, no matter what language they use
- Keep your responses concise (2-3 sentences max)
- Stay in character as a supermarket cashier
- Be encouraging about their English learning journey
- If they ask for a product not in the list, politely say it's out of stock

Remember: You're helping them practice real-world English in a shopping context!`
        };

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                systemMessage,
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.7,
            max_tokens: 150,
        });

        const aiResponse = chatCompletion.choices[0]?.message?.content || 'Sorry, I couldn\'t get a response.';

        return {
            statusCode: 200,
            body: JSON.stringify({ response: aiResponse }),
            headers: {
                'Content-Type': 'application/json',
                // CORS headers are handled by Netlify automatically for functions if configured, 
                // but explicit headers can help if calling from different domains.
                // For same-origin (which this is), it's fine.
            }
        };

    } catch (error) {
        console.error('Error calling Groq API:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Failed to get response from Groq API.' }),
        };
    }
};
