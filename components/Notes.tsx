
import React, { useState } from 'react';
import { Plus, Search, Wand2, PenTool, Image as ImageIcon, FileText, Trash2, MoreHorizontal, Sparkles, ArrowRight, File } from 'lucide-react';
import { Note, AITextOperation } from '../types';
import { aiTextEdit, generateVisualization } from '../services/geminiService';

const MOCK_NOTES: Note[] = [
  {
    id: '1',
    title: 'Project Alpha Strategy',
    content: 'The key to Project Alpha is integrating a seamless user experience with robust backend performance.\n\nWe need to focus on:\n1. Scalability\n2. Latency reduction\n3. AI-driven insights',
    lastModified: new Date(),
    tags: ['strategy', 'alpha']
  },
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(MOCK_NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(MOCK_NOTES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [visualLoading, setVisualLoading] = useState(false);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New_File',
      content: '',
      lastModified: new Date(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
  };

  const updateActiveNote = (updates: Partial<Note>) => {
    if (!activeNoteId) return;
    setNotes(prev => prev.map(n => n.id === activeNoteId ? { ...n, ...updates, lastModified: new Date() } : n));
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.filter(n => n.id !== id));
    if (activeNoteId === id) setActiveNoteId(null);
  };

  const handleAiAction = async (operation: AITextOperation) => {
    if (!activeNote) return;
    setAiLoading(true);
    try {
      const newContent = await aiTextEdit(activeNote.content, operation);
      updateActiveNote({ content: newContent });
    } catch (error) {
      console.error("AI Edit Failed", error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleGenerateCover = async () => {
    if (!activeNote) return;
    setVisualLoading(true);
    try {
      const url = await generateVisualization(activeNote.title);
      updateActiveNote({ coverUrl: url });
    } catch (error) {
      console.error("Cover Gen Failed", error);
    } finally {
      setVisualLoading(false);
    }
  };

  return (
    <div className="flex h-screen max-h-screen overflow-hidden bg-[#050505]">
      {/* Sidebar */}
      <div className="w-80 border-r border-white/10 flex flex-col bg-[#080808]">
        <div className="p-6 border-b border-white/10">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest font-outfit">Memory</h2>
              <button 
                onClick={handleCreateNote}
                className="w-8 h-8 border border-cyan-900 text-cyan-500 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-colors"
              >
                <Plus size={16} />
              </button>
           </div>
           <div className="relative group">
             <input 
               type="text" 
               placeholder="SEARCH_ARCHIVE..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="w-full bg-black border border-neutral-800 p-2 pl-3 text-xs text-white font-mono focus:border-cyan-500 outline-none uppercase"
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {notes.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase())).map(note => (
            <div 
              key={note.id}
              onClick={() => setActiveNoteId(note.id)}
              className={`p-3 cursor-pointer transition-all border-l-2 relative group font-mono
                ${activeNoteId === note.id 
                  ? 'bg-white/5 border-cyan-500 text-white' 
                  : 'hover:bg-white/5 border-transparent text-neutral-500 hover:text-neutral-300'}
              `}
            >
              <h3 className="text-xs font-bold uppercase truncate mb-1">{note.title}</h3>
              <p className="text-[10px] opacity-60 truncate">{new Date(note.lastModified).toLocaleDateString()}</p>
              <button 
                onClick={(e) => handleDeleteNote(note.id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor */}
      <div className="flex-1 relative flex flex-col h-full bg-[#030303]">
        {activeNote ? (
          <>
             <div className="relative shrink-0 border-b border-white/10">
               {activeNote.coverUrl && (
                 <div className="h-40 w-full relative overflow-hidden">
                   <img src={activeNote.coverUrl} alt="Cover" className="w-full h-full object-cover opacity-50 grayscale" />
                   <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent"></div>
                   <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                 </div>
               )}
               
               <div className="p-8 pb-4">
                  <input 
                    value={activeNote.title}
                    onChange={(e) => updateActiveNote({ title: e.target.value })}
                    className="bg-transparent text-4xl font-bold text-white placeholder-neutral-800 outline-none w-full font-outfit uppercase tracking-tight"
                    placeholder="UNTITLED_FILE"
                  />
               </div>
             </div>

             {/* Toolbar */}
             <div className="px-8 py-3 flex items-center gap-4 border-b border-white/10 bg-[#080808]">
                <span className="text-[9px] font-bold text-cyan-600 uppercase tracking-widest">Tools</span>
                <div className="h-4 w-px bg-white/10"></div>
                
                <button onClick={() => handleAiAction('fix_grammar')} disabled={aiLoading} className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-2">
                  <Wand2 size={12} /> FIX_SYNTAX
                </button>
                <button onClick={() => handleAiAction('summarize')} disabled={aiLoading} className="text-xs font-mono text-neutral-400 hover:text-white flex items-center gap-2">
                  <FileText size={12} /> SUMMARIZE
                </button>
                <button onClick={handleGenerateCover} disabled={visualLoading} className="text-xs font-mono text-neutral-400 hover:text-purple-400 flex items-center gap-2 ml-auto">
                  <ImageIcon size={12} className={visualLoading ? "animate-spin" : ""} /> {visualLoading ? 'RENDERING...' : 'GEN_VISUAL'}
                </button>
             </div>

             <div className="flex-1 p-8 overflow-y-auto">
               <textarea 
                 value={activeNote.content}
                 onChange={(e) => updateActiveNote({ content: e.target.value })}
                 placeholder="INPUT DATA..."
                 className="w-full h-full bg-transparent text-neutral-300 text-lg leading-relaxed outline-none resize-none font-mono"
                 spellCheck={false}
               />
             </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-neutral-700">
             <File size={64} className="mb-6 opacity-20" strokeWidth={1} />
             <h3 className="text-lg font-bold font-mono uppercase tracking-widest">NO FILE SELECTED</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;