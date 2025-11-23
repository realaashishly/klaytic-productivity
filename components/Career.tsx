
import React, { useState, useRef, useEffect } from 'react';
import { GraduationCap, Loader2, Send, User, Bot, Sparkles, TrendingUp, DollarSign, ChevronRight, History, Plus, MessageSquare } from 'lucide-react';
import { careerCounselorChat } from '../services/geminiService';
import { CareerChatMessage } from '../types';
import { getCareerSessions, createCareerSession, addMessageToSession, updateSessionTitle } from '@/actions/careerActions';

interface CareerSession {
  id: string;
  date: Date;
  title: string;
  messages: CareerChatMessage[];
}

const Career: React.FC = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [sessions, setSessions] = useState<CareerSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>("");
  const [currentMessages, setCurrentMessages] = useState<CareerChatMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch sessions on mount
  useEffect(() => {
    const fetchSessions = async () => {
      const fetchedSessions = await getCareerSessions();
      // @ts-ignore
      setSessions(fetchedSessions);

      if (fetchedSessions.length > 0) {
        // Load most recent
        setCurrentSessionId(fetchedSessions[0].id);
        setCurrentMessages(fetchedSessions[0].messages);
      } else {
        startNewSession();
      }
    };
    fetchSessions();
  }, []);

  const startNewSession = async () => {
    const newSession = await createCareerSession();
    if (newSession) {
      // @ts-ignore
      setSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setCurrentMessages(newSession.messages);
    }
  };

  const loadSession = (id: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setCurrentMessages(session.messages);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: CareerChatMessage = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      type: 'text'
    };

    // Optimistic update
    const updatedMessages = [...currentMessages, userMsg];
    setCurrentMessages(updatedMessages);
    setInput('');
    setLoading(true);

    let activeSessionId = currentSessionId;

    if (!activeSessionId) {
      const newSession = await createCareerSession();
      if (newSession) {
        activeSessionId = newSession.id;
        setCurrentSessionId(activeSessionId);
        // @ts-ignore
        setSessions(prev => [newSession, ...prev]);
      }
    }

    // Save user message
    if (activeSessionId) {
      await addMessageToSession(activeSessionId, userMsg);

      // Update title if it's the first user message
      const currentSession = sessions.find(s => s.id === activeSessionId);
      if (currentSession && currentSession.title === 'New Career Analysis' && updatedMessages.length > 1) {
        const newTitle = userMsg.content.substring(0, 25) + "...";
        await updateSessionTitle(activeSessionId, newTitle);
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, title: newTitle } : s));
      }
    }

    try {
      const response = await careerCounselorChat(updatedMessages, userMsg.content);
      const finalMessages = [...updatedMessages, response];
      setCurrentMessages(finalMessages);

      if (activeSessionId) {
        await addMessageToSession(activeSessionId, response);
        // Update local session state
        setSessions(prev => prev.map(s => s.id === activeSessionId ? { ...s, messages: finalMessages } : s));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full h-screen flex flex-col overflow-hidden relative">
      <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">CAREER</h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Advisor Interface</p>
        </div>
      </header>

      <div className="flex-1 flex gap-6 min-h-0">

        {/* Sidebar - Recent Chats */}
        <div className="w-80 hidden md:flex flex-col bg-[#050505] border border-white/10 rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <button
              onClick={startNewSession}
              className="w-full bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 py-3 font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all flex items-center justify-center gap-2"
            >
              <Plus size={14} /> New Session
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Recent Logs</div>
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => loadSession(session.id)}
                className={`w-full text-left p-3 rounded border transition-all group flex items-start gap-3
                            ${currentSessionId === session.id ? 'bg-white/10 border-cyan-500/50 text-white' : 'border-transparent hover:bg-white/5 text-neutral-400'}
                        `}
              >
                <MessageSquare size={14} className="mt-0.5 shrink-0 opacity-70" />
                <div className="overflow-hidden">
                  <div className="text-xs font-mono font-bold truncate">{session.title}</div>
                  <div className="text-[10px] text-neutral-600 mt-1">{new Date(session.date).toLocaleDateString()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Terminal */}
        <div className="flex-1 flex flex-col bg-[#050505] border border-white/10 relative overflow-hidden rounded-lg">
          {/* Scanline overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent,rgba(0,0,0,0.5)_2px,transparent_2px)] bg-[size:100%_4px] opacity-20"></div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 space-y-8 font-mono">
            {currentMessages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} relative z-10`}>

                {msg.role === 'ai' && (
                  <div className="w-10 h-10 border border-cyan-900/50 bg-cyan-950/20 flex items-center justify-center mr-4 shrink-0 text-cyan-500 rounded-full">
                    <Bot size={18} />
                  </div>
                )}

                <div className={`max-w-3xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>

                  {msg.content && (
                    <div className={`p-5 text-sm border rounded-2xl ${msg.role === 'user'
                      ? 'bg-white/10 border-white/20 text-white rounded-br-sm'
                      : 'bg-black border-cyan-900/30 text-cyan-100 rounded-bl-sm'
                      }`}>
                      <span className="text-[9px] font-bold opacity-50 block mb-2 uppercase tracking-wider">{msg.role === 'user' ? 'YOU' : 'AI ADVISOR'}</span>
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  )}

                  {/* Result Card */}
                  {msg.type === 'result' && msg.data && (
                    <div className="mt-6 w-full bg-black border border-cyan-500/50 p-8 relative overflow-hidden group clip-corner-tr shadow-[0_0_30px_-10px_rgba(6,182,212,0.2)]">
                      <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>

                      <h3 className="text-3xl font-bold text-white uppercase mb-8 font-outfit tracking-widest">{msg.data.roleTitle}</h3>

                      <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="border border-neutral-800 p-4 bg-neutral-900/20">
                          <div className="text-[10px] text-neutral-500 uppercase mb-2 tracking-widest">Compensation</div>
                          <div className="text-xl text-green-400 font-bold font-mono">{msg.data.salaryRange}</div>
                        </div>
                        <div className="border border-neutral-800 p-4 bg-neutral-900/20">
                          <div className="text-[10px] text-neutral-500 uppercase mb-2 tracking-widest">Outlook</div>
                          <div className="text-xl text-purple-400 font-bold font-mono">{msg.data.growthTrend}</div>
                        </div>
                      </div>

                      <div className="mb-0">
                        <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Path Calculation</div>
                        <div className="space-y-3">
                          {msg.data.roadmap.map((step, i) => (
                            <div key={i} className="flex items-start gap-4 text-sm text-neutral-300 border-b border-neutral-900 pb-2 last:border-0">
                              <span className="text-cyan-500 font-bold font-mono text-xs pt-1">{`0${i + 1}`}</span>
                              <span>{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-neutral-800 bg-black relative z-20">
            <div className="flex items-center gap-4 bg-neutral-900/50 border border-neutral-800 rounded-full px-6 py-3">
              <span className="text-cyan-500 font-mono animate-pulse">{`>`}</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about career paths, salaries, or skills..."
                disabled={loading}
                className="flex-1 bg-transparent text-white font-mono outline-none uppercase text-sm"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="text-neutral-500 hover:text-cyan-500 transition-colors"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Career;
