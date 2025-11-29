import React, { useState, useRef, useEffect } from 'react';
import '../styles/ChatInterface.css';

const ChatInterface = ({ products }) => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef(null);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Initialize speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'en-US'; // English for practice

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputText(transcript);
                setIsRecording(false);
            };

            recognitionRef.current.onerror = () => {
                setIsRecording(false);
            };

            recognitionRef.current.onend = () => {
                setIsRecording(false);
            };
        }
    }, []);

    useEffect(() => {
        // Auto scroll to bottom
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        const userMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsLoading(true);

        try {
            // Use relative path for Netlify Functions (works in prod and dev if proxied)
            // Or absolute path if needed, but relative is best for portability
            const apiUrl = import.meta.env.PROD
                ? '/.netlify/functions/chat'
                : 'http://localhost:3001/api/chat'; // Keep localhost for local dev if not using netlify dev

            // Actually, let's just use the relative path and assume we might use 'netlify dev' locally
            // But to be safe for the user's current local setup without netlify dev:
            const url = window.location.hostname === 'localhost' && window.location.port === '5173'
                ? 'http://localhost:3001/api/chat'
                : '/.netlify/functions/chat';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: text,
                    products: products
                }),
            });

            const data = await response.json();

            if (data.response) {
                const aiMessage = { role: 'assistant', content: data.response };
                setMessages(prev => [...prev, aiMessage]);

                // Speak the response
                speakText(data.response);
            } else {
                throw new Error(data.error || 'No response');
            }
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, there was an error processing your message.'
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US'; // English voice
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            alert('Your browser does not support voice recognition');
            return;
        }

        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(inputText);
    };

    return (
        <div className="chat-interface">
            <div className="chat-header">
                <h3>🛒 English Practice Cashier</h3>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="chat-welcome">
                        🎤 Hello! I'm your cashier. What would you like to buy today?
                    </div>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`chat-message ${msg.role}`}>
                        <div className="message-bubble">
                            {msg.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message assistant">
                        <div className="message-bubble loading">
                            <span className="dot"></span>
                            <span className="dot"></span>
                            <span className="dot"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-container" onSubmit={handleSubmit}>
                <button
                    type="button"
                    className={`mic-button ${isRecording ? 'recording' : ''}`}
                    onClick={toggleRecording}
                    title="Speak in English"
                >
                    🎤
                </button>
                <input
                    type="text"
                    className="chat-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type or speak in English..."
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    className="send-button"
                    disabled={!inputText.trim() || isLoading}
                >
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;
