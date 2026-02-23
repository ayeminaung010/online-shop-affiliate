'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { t } from '@/lib/i18n';

// Simple markdown link parser for chat messages
function renderMessage(text) {
    // Split by newlines
    const lines = text.split('\n');
    return lines.map((line, i) => {
        // Very basic markdown parsing for links [text](url) and bold **text**
        let rawHtml = line
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>');

        return (
            <div key={i} className={line.trim() === '' ? 'h-2' : ''} dangerouslySetInnerHTML={{ __html: rawHtml }} />
        );
    });
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Mingalapar! How can I help you find deals today? Try asking for "jeans under 300".' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom of messages
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg }),
            });

            if (!res.ok) throw new Error('API Error');
            const data = await res.json();

            setMessages(prev => [...prev, { role: 'bot', text: data.text }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I encountered an error searching for that.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-6rem)] mb-4 flex flex-col overflow-hidden shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5 duration-300 origin-bottom-right">
                    {/* Header */}
                    <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <h3 className="font-semibold text-sm">Vantage Assistant</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-primary-foreground/80 hover:text-white transition-colors p-1"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30 premium-scroll">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.role === 'bot' && (
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Bot className="w-4 h-4 text-primary" />
                                    </div>
                                )}

                                <div className={`text-sm px-3 py-2 rounded-2xl max-w-[85%] ${msg.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-card border border-border text-foreground shadow-sm rounded-bl-sm leading-relaxed' // Add relaxed leading for markdown lists
                                    }`}>
                                    {msg.role === 'user' ? msg.text : renderMessage(msg.text)}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-4 h-4 text-primary" />
                                </div>
                                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1.5">
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-card border-t border-border">
                        <form onSubmit={handleSubmit} className="flex items-center gap-2">
                            <Input
                                placeholder="E.g., shoes under 500..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 rounded-full bg-muted/50 border-border focus-visible:ring-1 focus-visible:ring-primary h-10"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!input.trim() || isLoading}
                                className="rounded-full w-10 h-10 shrink-0 shadow-sm"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}

            {/* Floating Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={`w-14 h-14 rounded-full shadow-xl transition-all duration-300 hover:scale-105 ${isOpen ? 'bg-muted text-muted-foreground hover:bg-border' : 'bg-primary text-primary-foreground'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </Button>
        </div>
    );
}
