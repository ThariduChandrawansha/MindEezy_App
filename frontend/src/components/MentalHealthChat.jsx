import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircleHeart, X, Send, Bot, User, Loader2, ChevronDown, Sparkles, Stethoscope, ArrowRight } from 'lucide-react';
import axios from 'axios';

const INITIAL_MESSAGE = {
  id: 1,
  role: 'bot',
  text: "Hi there! 👋 I'm your MindEezy AI mental health companion.\n\nI'm here to listen, support, and guide you through whatever you're feeling. Everything you share here is private.\n\n💬 How are you feeling today?",
  time: new Date()
};

const MentalHealthChat = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [recommendedDoc, setRecommendedDoc] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setHasUnread(false);
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isThinking) return;

    const userMsg = { id: Date.now(), role: 'user', text, time: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Direct call to AI Backend for Real Responses
      const res = await axios.post('http://localhost:5001/predict_emotion', { text });
      
      const emotion = res.data.emotion || 'unknown';
      const botText = res.data.response || "Thank you for sharing. I'm here to listen. Can you tell me more?";
      const isSafetyAlert = res.data.safety_alert || false;

      // Brief thinking delay for natural feel
      await new Promise(r => setTimeout(r, 800 + Math.random() * 400));

      const botMsg = { 
        id: Date.now() + 1, 
        role: 'bot', 
        text: botText, 
        emotion: isSafetyAlert ? 'anger' : emotion, // Use rose color for crisis
        isCrisis: isSafetyAlert,
        time: new Date() 
      };
      
      setMessages(prev => [...prev, botMsg]);

      // Logic to suggest a professional based on emotion
      const negativeEmotions = ['sadness', 'fear', 'anger', 'crisis'];
      if (negativeEmotions.includes(emotion)) {
        try {
          const docsRes = await axios.get('http://localhost:5000/api/public/doctors');
          const allDocs = docsRes.data;
          
          const emotionSpecialtyMap = {
            sadness: ['depression', 'grief', 'mood', 'clinical', 'psychologist'],
            anger: ['anger', 'stress', 'conflict', 'behavioral', 'management'],
            fear: ['anxiety', 'trauma', 'ptsd', 'panic', 'stress'],
            crisis: ['crisis', 'trauma', 'emergency', 'psychiatrist']
          };

          const keywords = emotionSpecialtyMap[emotion] || [];
          const matched = allDocs.find(doc => {
            const haystack = `${(doc.specialty || '')} ${(doc.bio || '')}`.toLowerCase();
            return keywords.some(k => haystack.includes(k));
          });

          if (matched) {
            setRecommendedDoc({ ...matched, type: emotion });
          }
        } catch (e) {
          console.error("Doc suggest error", e);
        }
      }

      // Show unread indicator if chat is closed
      if (!isOpen) setHasUnread(true);

    } catch (err) {
      console.error("Chat Error:", err);
      // Fallback if backend is down
      const errorMsg = {
        id: Date.now() + 1,
        role: 'bot',
        text: "I'm having a little trouble connecting to my brain right now, but I'm still here in spirit. 💙\n\nPlease try again in a moment, or reach out to our professionals if you need immediate guidance.",
        time: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatText = (text) => {
    // Simple markdown-like bold and line breaks
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line.split(/(\*\*.*?\*\*)/).map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>
            : part
        )}
        {i < text.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const emotionColors = {
    anger: 'bg-rose-100 border-rose-200',
    sadness: 'bg-blue-100 border-blue-200',
    fear: 'bg-purple-100 border-purple-200',
    joy: 'bg-emerald-100 border-emerald-200',
    love: 'bg-pink-100 border-pink-200',
    surprise: 'bg-amber-100 border-amber-200',
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label="Open mental health chat"
        className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-105 transition-all duration-300"
      >
        {isOpen ? (
          <ChevronDown className="h-5 w-5" />
        ) : (
          <>
            <MessageCircleHeart className="h-5 w-5" />
            <span className="font-bold text-sm tracking-wide hidden sm:block">Mental Health Chat</span>
            {hasUnread && (
              <span className="absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-500 rounded-full animate-bounce border-2 border-white" />
            )}
          </>
        )}
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-[9998] w-[370px] max-w-[calc(100vw-2rem)] rounded-3xl shadow-2xl shadow-indigo-900/30 overflow-hidden flex flex-col border border-indigo-100"
          style={{ height: '520px' }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-emerald-400 rounded-full border-2 border-indigo-600 animate-pulse" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm tracking-tight">MindEezy AI Companion</h3>
                <p className="text-indigo-200 text-xs font-medium flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Always here for you
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-xl transition-colors text-white/80 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 h-8 w-8 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-sm ${
                  msg.role === 'bot'
                    ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                    : 'bg-gradient-to-br from-slate-600 to-slate-800'
                }`}>
                  {msg.role === 'bot' ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm border ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-sm border-indigo-500'
                    : `bg-white text-slate-700 rounded-tl-sm ${msg.emotion ? emotionColors[msg.emotion] : 'border-slate-100'}`
                }`}>
                  {formatText(msg.text)}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isThinking && (
              <div className="flex gap-2.5 flex-row">
                <div className="shrink-0 h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5">
                  <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Recommended Professional Sidebar-like Card */}
          {recommendedDoc && (
            <div className="bg-violet-50 border-t border-violet-100 p-3 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-violet-600 flex items-center justify-center shrink-0 shadow-lg shadow-violet-200">
                  <Stethoscope className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-violet-600 font-black uppercase tracking-widest mb-0.5">Recommended Specialist</p>
                  <p className="text-sm font-black text-slate-800 truncate">{recommendedDoc.username}</p>
                </div>
                <button 
                  onClick={() => navigate(`/professionals/${recommendedDoc.id}`)}
                  className="px-3 py-1.5 bg-white border border-violet-200 text-violet-600 hover:bg-violet-600 hover:text-white transition-all rounded-lg font-bold text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-sm"
                >
                  Book <ArrowRight className="h-3 w-3" />
                </button>
                <button onClick={() => setRecommendedDoc(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Quick Prompts */}
          <div className="bg-white px-3 pt-2 pb-1 flex gap-2 overflow-x-auto shrink-0 border-t border-slate-100">
            {["I'm feeling anxious", "I feel sad today", "I'm overwhelmed", "I need support"].map(prompt => (
              <button
                key={prompt}
                onClick={() => { setInput(prompt); inputRef.current?.focus(); }}
                className="shrink-0 text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full font-bold transition-colors border border-indigo-100 whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="bg-white px-3 py-3 border-t border-slate-100 flex items-end gap-2 shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share how you're feeling..."
              rows={1}
              className="flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all text-slate-700 placeholder:text-slate-400 max-h-24"
              style={{ overflowY: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isThinking}
              className="shrink-0 h-10 w-10 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 transition-all hover:scale-105 disabled:opacity-40 disabled:scale-100"
            >
              {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="bg-slate-50 px-4 py-2 border-t border-slate-100 shrink-0">
            <p className="text-[10px] text-slate-400 text-center font-medium">
              🔒 Private & confidential · Not a substitute for professional help · Call <a href="tel:1926" className="text-indigo-500 font-bold">1926</a> in crisis
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MentalHealthChat;
