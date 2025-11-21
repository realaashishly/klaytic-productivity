
import React, { useState } from 'react';
import { ExternalLink, Plus, X, Folder, FolderOpen, ArrowRight } from 'lucide-react';
import { LinkResource } from '../types';

const INITIAL_LINKS: LinkResource[] = [
  {
    id: '1',
    title: 'MidJourney',
    url: 'https://midjourney.com',
    category: 'AI Arts',
    description: ''
  },
  {
      id: '2',
      title: 'Runway ML',
      url: 'https://runwayml.com',
      category: 'AI Arts',
      description: ''
  },
  {
      id: '3',
      title: 'Google AI Blog',
      url: 'https://blog.google/technology/ai/',
      category: 'Research',
      description: ''
  }
];

const Links: React.FC = () => {
  const [links, setLinks] = useState<LinkResource[]>(INITIAL_LINKS);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [newLink, setNewLink] = useState({ url: '', title: '', category: '' });
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleAddLink = () => {
    if (!newLink.url || !newLink.title) return;
    const resource: LinkResource = {
        id: Math.random().toString(),
        title: newLink.title,
        url: newLink.url,
        category: newLink.category || 'Uncategorized',
        description: ''
    };
    setLinks(prev => [resource, ...prev]);
    setShowEmbedModal(false);
    setNewLink({ url: '', title: '', category: '' });
  };

  // Get unique categories
  const categories = Array.from(new Set(links.map(l => l.category))).sort();

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full relative">
       <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
          <div>
             <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">LINKS</h1>
             <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Network Nodes</p>
          </div>
          <button 
            onClick={() => setShowEmbedModal(true)}
            className="bg-white text-black px-6 py-3 font-bold text-xs uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-2 clip-corner-tr"
          >
            <Plus size={16} /> NEW LINK
          </button>
       </header>

       {activeCategory ? (
           <div className="animate-in slide-in-from-right-4">
               <button 
                 onClick={() => setActiveCategory(null)} 
                 className="mb-6 text-neutral-500 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2"
               >
                   <ArrowRight size={14} className="rotate-180"/> Back to Folders
               </button>
               
               <h2 className="text-2xl text-white font-outfit font-bold mb-8 flex items-center gap-3">
                   <FolderOpen className="text-cyan-500" /> {activeCategory}
               </h2>

               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {links.filter(l => l.category === activeCategory).map(link => (
                      <a 
                        key={link.id}
                        href={link.url}
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-6 hover:border-cyan-500 hover:bg-white/5 transition-all group clip-corner-tr relative block"
                      >
                          <div className="flex items-center justify-between mb-4">
                              <span className="w-8 h-8 bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 group-hover:text-cyan-400 group-hover:border-cyan-500/50 rounded">
                                  <ExternalLink size={14} />
                              </span>
                          </div>
                          <h3 className="text-lg font-bold text-white font-outfit uppercase leading-tight group-hover:text-cyan-400 transition-colors truncate">
                              {link.title}
                          </h3>
                          <p className="text-[10px] text-neutral-600 font-mono mt-2 truncate">{link.url}</p>
                      </a>
                  ))}
               </div>
           </div>
       ) : (
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {categories.map(cat => {
                   const count = links.filter(l => l.category === cat).length;
                   return (
                       <button 
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className="bg-neutral-900/50 backdrop-blur-md border border-white/10 p-8 hover:border-cyan-500 hover:bg-white/5 transition-all group relative text-left"
                       >
                           <Folder size={32} className="text-neutral-600 mb-4 group-hover:text-cyan-500 transition-colors" />
                           <h3 className="text-xl font-bold text-white font-outfit uppercase mb-1">{cat}</h3>
                           <p className="text-xs text-neutral-500 font-mono uppercase tracking-widest">{count} Nodes</p>
                       </button>
                   );
               })}
           </div>
       )}

       {/* Modal */}
       {showEmbedModal && (
           <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm">
              <div className="bg-[#0d0d0d] border border-cyan-500/30 p-8 w-full max-w-md relative clip-corner-all shadow-2xl">
                  <button onClick={() => setShowEmbedModal(false)} className="absolute top-4 right-4 text-neutral-500 hover:text-white">
                      <X size={20} />
                  </button>
                  <h2 className="text-xl font-bold text-white mb-6 font-mono uppercase tracking-widest">Add Link</h2>
                  <div className="space-y-4 font-mono">
                      <div>
                          <label className="block text-[10px] text-cyan-500 uppercase mb-1">Category</label>
                          <input 
                            className="w-full bg-black border border-neutral-800 p-3 text-white text-xs outline-none focus:border-cyan-500"
                            placeholder="e.g., AI Arts"
                            value={newLink.category}
                            onChange={e => setNewLink({...newLink, category: e.target.value})}
                            list="categories"
                          />
                          <datalist id="categories">
                              {categories.map(c => <option key={c} value={c} />)}
                          </datalist>
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyan-500 uppercase mb-1">Title</label>
                          <input 
                            className="w-full bg-black border border-neutral-800 p-3 text-white text-xs outline-none focus:border-cyan-500"
                            placeholder="Site Name..."
                            value={newLink.title}
                            onChange={e => setNewLink({...newLink, title: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-[10px] text-cyan-500 uppercase mb-1">URL</label>
                          <input 
                            className="w-full bg-black border border-neutral-800 p-3 text-white text-xs outline-none focus:border-cyan-500"
                            placeholder="https://..."
                            value={newLink.url}
                            onChange={e => setNewLink({...newLink, url: e.target.value})}
                          />
                      </div>
                      
                      <button 
                        onClick={handleAddLink}
                        disabled={!newLink.url}
                        className="w-full bg-cyan-900/20 text-cyan-400 border border-cyan-500/50 py-3 font-bold uppercase text-xs hover:bg-cyan-500 hover:text-black transition-colors mt-4"
                      >
                          SAVE
                      </button>
                  </div>
              </div>
           </div>
       )}
    </div>
  );
};

export default Links;
