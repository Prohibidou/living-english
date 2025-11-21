import React, { useState, useEffect, useRef } from 'react';

// --- React Component ---
const App = () => {
  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState('Ready to talk. Press the mic button.');
  const [transcript, setTranscript] = useState([
    { speaker: 'ai', text: 'Welcome to the supermarket! How can I help you today?' },
  ]);
  const [isRecording, setIsRecording] = useState(false);

  // --- REFS ---
  const recognitionRef = useRef(null);

  // --- SCENE SETUP ---
  const scene = {
    context: "You are a friendly and helpful supermarket cashier talking to a customer who is practicing their English. The customer is at your checkout counter. They have bought a carton of milk, a loaf of bread, and three apples. Your name is Sarah. Keep your responses short, natural, and friendly. Ask questions to keep the conversation going.",
    character: "Cashier",
    items: [
      { name: 'Milk', emoji: '🥛' },
      { name: 'Bread', emoji: '🍞' },
      { name: 'Apples', emoji: '🍎' },
    ],
  };

  // --- SPEECH RECOGNITION SETUP ---
  useEffect(() => {
    // Setup speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const spokenText = event.results[0][0].transcript;
        addMessage('user', spokenText);
        generateAiResponse(spokenText);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
        setStatus('Ready to talk. Press the mic button.');
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setStatus(`Speech error: ${event.error}`);
      };
    } else {
      setStatus("Sorry, your browser doesn't support speech recognition.");
    }
  }, []);

  // --- CORE FUNCTIONS ---

  const speak = (text) => {
    // Stop any currently speaking utterance
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onstart = () => {
        setStatus('Speaking...');
    };
    utterance.onend = () => {
        setStatus('Ready to talk. Press the mic button.');
    };
    speechSynthesis.speak(utterance);
  };

  const addMessage = (speaker, text) => {
    setTranscript(prev => [...prev, { speaker, text }]);
  };

  const generateAiResponse = async (userText) => {
    setStatus('Thinking...');
    
    // Construct the full prompt including context, history, and the new user message
    const conversationHistory = transcript.map(msg => `${msg.speaker === 'user' ? 'Customer' : 'Sarah'}: ${msg.text}`).join('\n');
    const prompt = `${scene.context}\n\n--- Conversation History ---\n${conversationHistory}\nCustomer: ${userText}\nSarah:`;

    try {
      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const aiText = data.response;
      
      addMessage('ai', aiText);
      speak(aiText);

    } catch (error) {
        console.error("AI generation error", error);
        const errorMsg = `Sorry, I had a problem: ${error.message}`;
        addMessage('ai', errorMsg);
        speak(errorMsg);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      // Ensure we're not speaking before trying to listen
      speechSynthesis.cancel();
      recognitionRef.current?.start();
      setIsRecording(true);
      setStatus('Listening...');
    }
  };

  // --- RENDER ---
  return (
    <div className="app-container">
      {/* --- 1. SCENE VIEW --- */}
      <div className="scene-container">
        {/* SVG Background */}
        <svg viewBox="0 0 800 400" className="scene-background" preserveAspectRatio="xMidYMid slice">
          {/* Floor */}
          <path d="M0 400 L800 400 L800 300 L0 300 Z" fill="#b0a090" />
          <path d="M0 300 L800 300 L450 250 L350 250 Z" fill="#c0b0a0" />
          
          {/* Back Wall */}
          <rect x="0" y="0" width="800" height="300" fill="#d0e0f0" />

          {/* Shelves */}
          <rect x="0" y="50" width="800" height="200" fill="#a0a0a0" />
          <rect x="0" y="70" width="800" height="5" fill="#888" />
          <rect x="0" y="130" width="800" height="5" fill="#888" />
          <rect x="0" y="190" width="800" height="5" fill="#888" />
          
          {/* Products on shelves (simple rects) */}
          <rect x="50" y="80" width="30" height="40" fill="#ffcccc" />
          <rect x="90" y="85" width="30" height="35" fill="#ccffcc" />
          <rect x="400" y="80" width="30" height="40" fill="#ccccff" />
          <rect x="600" y="140" width="30" height="40" fill="#ffffcc" />
          <rect x="640" y="145" width="30" height="35" fill="#ffccff" />

          {/* Distant Shopper Silhouette */}
          <circle cx="700" cy="150" r="15" fill="#a0b0c0" />
          <rect x="685" y="165" width="30" height="50" fill="#a0b0c0" />
        </svg>
        
        {/* Cashier SVG */}
        <svg viewBox="0 0 100 200" className="character-svg">
          <defs>
            <clipPath id="char-clip">
              <rect x="0" y="0" width="100" height="200"/>
            </clipPath>
          </defs>
          <g clipPath="url(#char-clip)">
            {/* Body */}
            <path d="M0 200 C 10 100, 90 100, 100 200 Z" fill="#5a9bd5" />
            {/* Head */}
            <circle cx="50" cy="50" r="30" fill="#f0d0b0" />
            {/* Hair */}
            <path d="M20 35 C 30 5, 70 5, 80 35 L 75 50 L 25 50 Z" fill="#a05a2c" />
          </g>
        </svg>

        {/* Counter */}
        <div className="checkout-counter">
            <div className="item-display">
                {scene.items.map(item => (
                    <div key={item.name} className="item" title={item.name}>
                        <span style={{ fontSize: '40px' }}>{item.emoji}</span>
                    </div>
                ))}
            </div>
            {/* Cash Register SVG */}
            <svg viewBox="0 0 100 80" className="cash-register-svg">
              <rect x="5" y="10" width="90" height="65" fill="#444" rx="5"/>
              <rect x="15" y="20" width="40" height="30" fill="#8ef" />
              <rect x="65" y="25" width="20" height="8" fill="#666" />
              <rect x="65" y="37" width="20" height="8" fill="#666" />
              <rect x="65" y="49" width="20" height="8" fill="#666" />
            </svg>
        </div>
      </div>

      {/* --- 2. CHAT VIEW --- */}
      <div className="chat-container">
        <div className="transcript">
          {transcript.map((msg, index) => (
            <p key={index}>
              <strong>{msg.speaker === 'user' ? 'You' : 'Cashier'}:</strong> {msg.text}
            </p>
          ))}
        </div>
        <div className="controls">
          <button
            className={`mic-button ${isRecording ? 'recording' : ''}`}
            onClick={handleMicClick}
            disabled={status.includes('Initializing')}
          >
            {isRecording ? 'Stop' : 'Mic'}
          </button>
          <p className="status">{status}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
