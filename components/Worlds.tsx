
import React, { useState } from 'react';
import { Lock, Unlock, Folder, ShieldCheck, ArrowRight, X, Upload, File } from 'lucide-react';
import { WorldVault, Asset } from '../types';

const MOCK_VAULTS: WorldVault[] = [
  { id: '1', name: 'Project Omega', description: 'Top secret blueprints', isLocked: true, password: 'Gemini', content: [] },
  { id: '2', name: 'Financials 2025', description: 'Q1-Q4 Projections', isLocked: true, password: 'Gemini', content: [] },
];

const Worlds: React.FC = () => {
  const [vaults, setVaults] = useState<WorldVault[]>(MOCK_VAULTS);
  const [selectedVault, setSelectedVault] = useState<WorldVault | null>(null);
  const [viewVault, setViewVault] = useState<WorldVault | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = () => {
    if (selectedVault && passwordInput === 'Gemini') {
       const updatedVaults = vaults.map(v => v.id === selectedVault.id ? {...v, isLocked: false} : v);
       setVaults(updatedVaults);
       setViewVault(updatedVaults.find(v => v.id === selectedVault.id) || null);
       setSelectedVault(null);
       setPasswordInput('');
    } else {
      setError('Access Denied');
    }
  };

  return (
    <div className="p-6 md:p-12 max-w-[1800px] mx-auto w-full h-screen flex flex-col">
      <header className="mb-12 border-b border-white/10 pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter hologram-text">SECURE VAULTS</h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-xs font-mono">Encrypted Data Drives</p>
        </div>
        {viewVault && (
           <button onClick={() => setViewVault(null)} className="text-red-500 hover:text-white text-xs uppercase font-bold tracking-widest">
              CLOSE_CONNECTION
           </button>
        )}
      </header>

      {viewVault ? (
         <div className="flex-1 animate-in fade-in">
            <div className="bg-[#050505] border border-green-900/50 p-8 mb-8 flex items-center justify-between">
               <div>
                  <h2 className="text-2xl font-bold text-green-500 font-mono uppercase">{viewVault.name}</h2>
                  <p className="text-green-800 text-xs font-mono mt-1">DECRYPTION SUCCESSFUL</p>
               </div>
               <div className="text-green-500 animate-pulse"><Unlock size={24} /></div>
            </div>
            {/* Content Grid would go here */}
         </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {vaults.map(vault => (
             <div 
               key={vault.id} 
               onClick={() => vault.isLocked ? setSelectedVault(vault) : setViewVault(vault)}
               className={`
                 relative p-8 border transition-all duration-300 group cursor-pointer clip-corner-tr
                 ${vault.isLocked 
                   ? 'bg-[#050505] border-red-900/30 hover:border-red-500' 
                   : 'bg-[#050505] border-green-900/30 hover:border-green-500'}
               `}
             >
                <div className="absolute top-0 left-0 w-1 h-full bg-neutral-900 group-hover:bg-white transition-colors"></div>
                
                <div className={`w-10 h-10 flex items-center justify-center mb-6 border ${vault.isLocked ? 'border-red-900 text-red-500' : 'border-green-900 text-green-500'}`}>
                    {vault.isLocked ? <Lock size={16} /> : <Unlock size={16} />}
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-outfit uppercase">{vault.name}</h3>
                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest">{vault.description}</p>
             </div>
           ))}
        </div>
      )}

      {/* Auth Modal */}
      {selectedVault && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
           <div className="bg-[#050505] border border-red-900/50 p-10 w-full max-w-md text-center relative shadow-[0_0_50px_rgba(220,38,38,0.2)]">
              <button onClick={() => setSelectedVault(null)} className="absolute top-4 right-4 text-neutral-600 hover:text-white"><X size={20}/></button>
              
              <ShieldCheck size={48} className="mx-auto mb-6 text-red-500 animate-pulse" strokeWidth={1} />
              
              <h2 className="text-xl font-bold text-white mb-2 uppercase font-mono tracking-widest">Restricted Access</h2>
              
              <input 
                type="password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setError(''); }}
                className="w-full bg-black border border-red-900/30 rounded-none px-4 py-4 text-white text-center text-xl tracking-[0.5em] outline-none focus:border-red-500 mb-4 font-mono"
                autoFocus
                placeholder="******"
              />
              
              {error && <p className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4">{error}</p>}

              <button 
                onClick={handleUnlock}
                className="w-full bg-red-900/20 text-red-500 border border-red-900 py-3 font-bold hover:bg-red-500 hover:text-black transition-colors uppercase tracking-widest text-xs"
              >
                AUTHENTICATE
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Worlds;