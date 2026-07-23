import React, { useState, useRef, useEffect } from 'react';
import { MessageSquareText, Send, Sparkles, RefreshCw, Bot, User, HelpCircle, BookOpen } from 'lucide-react';
import { TeachMeMessage, Topic } from '../types';
import { MathMarkdown } from '../components/MathMarkdown';
import { MathToolbar } from '../components/MathToolbar';

export const TeachMePage: React.FC = () => {
  const [topic, setTopic] = useState<Topic>('Algebra');
  const [problemGoal, setProblemGoal] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState<TeachMeMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I'm your MathDetective Socratic Tutor in **Teach Me Mode**. 

Instead of just telling you the answer, I will ask you guiding questions to help you discover the mathematical reasoning yourself!

Select a topic or type a problem goal below to start our session.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || isSending) return;

    const userMsg: TeachMeMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    if (!customText) setInputMessage('');
    setIsSending(true);

    try {
      const res = await fetch('/api/teach-me', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          problem: problemGoal || 'General Socratic math guidance',
          history: updatedHistory.map((m) => ({ sender: m.sender, text: m.text })),
          userMessage: textToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to communicate with tutor');

      const aiMsg: TeachMeMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: TeachMeMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ Sorry, I encountered an error: ${err.message || 'Please try sending your message again.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSending(false);
    }
  };

  const handlePromptStarter = (starter: string) => {
    setProblemGoal(starter);
    handleSendMessage(`I'd like to learn about: "${starter}". How should we start?`);
  };

  const promptStarters = [
    'How do I isolate x in 2x + 5 = 15?',
    'Guide me through factoring x² - 5x + 6 = 0',
    'Explain how the Chain Rule works in calculus',
    'How do I convert degrees to radians in trig?',
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-800 text-xs font-bold tracking-wide">
            <MessageSquareText className="w-3.5 h-3.5 text-cyan-600" />
            <span>INTERACTIVE SOCRATIC AI TUTOR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Teach Me Mode
          </h1>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            Learn through active reasoning. The AI tutor asks guiding questions rather than just handing out answers.
          </p>
        </div>

        {/* SETUP CONTROLS */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 space-y-4 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topic Area</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value as Topic)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="Algebra">Algebra</option>
                <option value="Equations">Equations</option>
                <option value="Functions">Functions</option>
                <option value="Geometry">Geometry</option>
                <option value="Trigonometry">Trigonometry</option>
                <option value="Calculus">Calculus</option>
                <option value="Linear Algebra">Linear Algebra</option>
                <option value="Probability">Probability</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Specific Problem or Goal (Optional)</label>
              <input
                type="text"
                value={problemGoal}
                onChange={(e) => setProblemGoal(e.target.value)}
                placeholder="e.g. Solve 3x² - 12 = 0"
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Quick Starters */}
          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Click a starter to begin:</span>
            <div className="flex flex-wrap gap-2">
              {promptStarters.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => handlePromptStarter(starter)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-cyan-50 border border-slate-200 text-xs text-slate-700 hover:text-cyan-800 font-medium transition-colors text-left"
                >
                  "{starter}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* CHAT MESSAGES WINDOW */}
        <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-md flex flex-col h-[520px]">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl space-y-1.5 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-50 text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className={`flex items-center justify-between gap-4 text-[10px] font-bold border-b pb-1 ${
                    msg.sender === 'user' ? 'border-white/20 text-indigo-100' : 'border-slate-200 text-slate-400'
                  }`}>
                    <span>{msg.sender === 'user' ? 'You' : 'MathDetective AI Tutor'}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <MathMarkdown content={msg.text} className={msg.sender === 'user' ? 'text-white' : ''} />
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isSending && (
              <div className="flex gap-3 text-xs justify-start">
                <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-500 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                  Tutor is formulating a guiding question...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* INPUT FORM */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <MathToolbar onInsert={(snippet) => setInputMessage((prev) => prev + snippet)} compact />
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your response or question..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                id="teachme-chat-input"
              />
              <button
                type="submit"
                disabled={isSending || !inputMessage.trim()}
                className="px-5 py-3 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 transition-colors flex items-center gap-1.5 shrink-0 shadow-sm"
                id="teachme-send-btn"
              >
                <Send className="w-4 h-4 text-white" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
