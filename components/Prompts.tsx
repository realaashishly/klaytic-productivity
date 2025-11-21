
import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Lock, Unlock, Plus, MessageSquare, ArrowRight, Loader2, Send, Trash2, Bot, User } from 'lucide-react';
import { MiniApp } from '../types';
import { generateVisualization, runCustomAppChat } from '../services/geminiService';

const Prompts: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'create' | 'locked' | 'chat'>('list');
  const [apps, setApps] = useState<MiniApp[]>([]);
  const [selectedApp, setSelectedApp] = useState<MiniApp | null>(null);
  const [newAppName, setNewAppName] = useState('');
  const [newAppInstruction, setNewAppInstruction] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedApp?.chatHistory]);

  const handleCreateApp = async () => {
      if (!newAppName || !newAppInstruction) return;
      setIsCreating(true);
      const iconUrl = await generateVisualization(`Minimalist vector icon for ${newAppName}, dark theme cyberpunk logo`);
      
      const newApp: MiniApp = {
          id: Math.random().toString(),
          title: newAppName,
          description: newAppInstruction.substring(0, 50) + "...",
          systemInstruction: newAppInstruction,
          icon: iconUrl,
          createdAt: new Date(),
          chatHistory: []
      };
      setApps([newApp, ...apps]);
      setIsCreating(false);
      setViewMode('list');
      setNewAppName('');
      setNewAppInstruction('');
  };

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full h-screen overflow-hidden flex flex-col relative">
      <header className="mb-8 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">AGENTS</h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Custom Logic Modules</p>
        </div>
        {viewMode === 'list' ? (
            <button 
                onClick={() => setViewMode('create')}
                className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-2 clip-corner-tr"
            >
                <Plus size={16} /> CREATE NEW
            </button>
        ) : (
            <button onClick={() => setViewMode('list')} className="text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest">
                BACK TO LIST
            </button>
        )}
      </header>

      <div className="flex-1 min-h-0 relative">
          
          {viewMode === 'list' && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 overflow-y-auto h-full pb-20">
                  {apps.map(app => (
                      <div 
                        key={app.id} 
                        onClick={() => { setSelectedApp(app); setViewMode('chat'); }}
                        className="bg-[#050505] border border-white/10 p-6 cursor-pointer hover:border-cyan-500/50 transition-all group relative clip-corner-tr"
                      >
                          <div className="w-16 h-16 mb-6 border border-neutral-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all">
                              <img src={app.icon} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="absolute top-4 right-4 text-[8px] font-mono text-neutral-600 uppercase group-hover:text-cyan-500">V.1.0</div>
                          <h3 className="text-lg font-bold text-white font-mono uppercase mb-1">{app.title}</h3>
                          <p className="text-[10px] font-mono text-neutral-500 line-clamp-2">{app.description}</p>
                      </div>
                  ))}
                  {apps.length === 0 && (
                      <div className="col-span-full flex flex-col items-center justify-center text-neutral-700 h-64 border border-dashed border-neutral-900 bg-black/50">
                          <Terminal size={32} className="mb-4 opacity-20" />
                          <p className="font-mono text-xs uppercase tracking-widest">NO AGENTS FOUND</p>
                      </div>
                  )}
              </div>
          )}

          {viewMode === 'create' && (
              <div className="max-w-2xl mx-auto bg-[#050505] border border-white/10 p-10 clip-corner-tr">
                  <h2 className="text-xl font-bold text-white mb-8 font-mono uppercase tracking-widest border-b border-white/10 pb-4">Create Agent</h2>
                  <div className="space-y-6 font-mono">
                      <div>
                          <label className="block text-[10px] text-cyan-500 uppercase mb-1">Name</label>
                          <input 
                            className="w-full bg-black border border-neutral-800 p-4 text-white text-sm outline-none focus:border-cyan-500"
                            placeholder="Agent Name..."
                            value={newAppName}
                            onChange={e => setNewAppName(e.target.value)}
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyan-500 uppercase mb-1">Instructions</label>
                          <textarea 
                             className="w-full h-32 bg-black border border-neutral-800 p-4 text-white text-sm outline-none focus:border-cyan-500 resize-none"
                             placeholder="Describe how the agent should behave..."
                             value={newAppInstruction}
                             onChange={e => setNewAppInstruction(e.target.value)}
                          />
                      </div>
                      <button 
                         onClick={handleCreateApp}
                         disabled={isCreating}
                         className="w-full bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 py-4 font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-colors"
                      >
                          {isCreating ? 'CREATING...' : 'LAUNCH'}
                      </button>
                  </div>
              </div>
          )}

          {viewMode === 'chat' && selectedApp && (
              <div className="h-full flex flex-col bg-[#050505] border border-white/10">
                  <div className="flex-1 p-8 text-center text-neutral-500 font-mono text-xs uppercase tracking-widest flex items-center justify-center">
                      Agent Interface Loaded.
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default Prompts;
