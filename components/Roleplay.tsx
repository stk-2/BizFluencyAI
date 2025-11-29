
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, Scenario, UserProfile } from '../types';
import { getRoleplayResponse, getFeedbackOnMessage } from '../services/geminiService';

interface RoleplayProps {
  user: UserProfile;
  model: string;
  apiKey: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'negotiation',
    title: 'Price Negotiation',
    description: 'Negotiate a software license contract with a vendor.',
    icon: '💰',
    systemInstruction: 'You are a tough but professional sales representative for a software company. The user is a client trying to lower the price. Do not give in easily. Keep responses concise (under 50 words).'
  },
  {
    id: 'status_update',
    title: 'Project Status Update',
    description: 'Report a delay to your manager.',
    icon: '📊',
    systemInstruction: 'You are a supportive but concerned project manager. The user is reporting a delay. Ask specific questions about the timeline and mitigation plan. Keep responses concise.'
  },
  {
    id: 'networking',
    title: 'Networking Event',
    description: 'Small talk with a potential partner.',
    icon: '🤝',
    systemInstruction: 'You are a potential business partner at a conference. Be friendly, open, and ask about the user\'s business. Keep responses conversational and concise.'
  }
];

const Roleplay: React.FC<RoleplayProps> = ({ user, model, apiKey }) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setMessages([
      {
        id: 'init',
        role: 'model',
        text: `(Scenario: ${scenario.title}) Hello! Let's get started. I'm ready when you are.`
      }
    ]);
  };

  const handleSend = async () => {
    if (!input.trim() || !selectedScenario || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // 1. Get Feedback on user message
      const feedbackJson = await getFeedbackOnMessage(userMsg.text, selectedScenario.title, model, apiKey);
      let feedback = null;
      try {
        const parsed = JSON.parse(feedbackJson);
        feedback = `Tip: ${parsed.tip}\nBetter: "${parsed.corrected}"`;
      } catch (e) { /* ignore json parse error */ }

      // Update user message with feedback
      setMessages(prev => prev.map(m => m.id === userMsg.id ? { ...m, feedback: feedback || undefined } : m));

      // 2. Get Model Response
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      // Add current user msg to history for the API call
      history.push({ role: 'user', parts: [{ text: userMsg.text }] });

      const responseText = await getRoleplayResponse(
        history, 
        userMsg.text, // redundant but needed for some implementations, usually history covers it
        `${selectedScenario.systemInstruction}. The user's level is ${user.level}. Adjust vocabulary accordingly.`,
        model,
        apiKey
      );

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText || "I didn't catch that. Could you repeat?"
      };
      setMessages(prev => [...prev, botMsg]);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Select a Roleplay Scenario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SCENARIOS.map(scenario => (
            <button
              key={scenario.id}
              onClick={() => handleStart(scenario)}
              className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:shadow-md hover:border-indigo-300 transition-all group"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{scenario.icon}</div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{scenario.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{scenario.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-4 border-b dark:border-slate-700 bg-slate-50 dark:bg-slate-900 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <button onClick={() => setSelectedScenario(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold mr-2">&larr;</button>
           <div>
             <h3 className="font-bold text-slate-800 dark:text-white">{selectedScenario.title}</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400">Role: {selectedScenario.systemInstruction.split('.')[0]}</p>
           </div>
        </div>
        <div className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-medium">
          Target: {user.level}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-900" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div 
              className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.text}
            </div>
            
            {/* Feedback Bubble */}
            {msg.feedback && (
              <div className="mt-2 max-w-[75%] bg-amber-50 dark:bg-amber-900/30 border border-amber-100 dark:border-amber-800/50 p-3 rounded-lg text-xs text-amber-800 dark:text-amber-200 flex gap-2">
                <span className="text-lg">💡</span>
                <div className="whitespace-pre-wrap">{msg.feedback}</div>
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-slate-400 text-sm ml-4">
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t dark:border-slate-700">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-4"
        >
          <input
            type="text"
            className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-full focus:ring-2 focus:ring-indigo-500 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Type your response..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit"
            disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white px-6 py-3 rounded-full font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Roleplay;
