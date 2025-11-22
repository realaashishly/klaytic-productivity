import React, { useState, useRef } from 'react';
import { Loader2, ChevronRight } from 'lucide-react';
import { generateProjectPlan } from '../services/geminiService';
import { Task } from '../types';

interface PlanGeneratorProps {
  onPlanGenerated: (tasks: Task[]) => void;
}

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ onPlanGenerated }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleGenerate = async () => {
    if (!goal.trim() || loading) return;
    
    setLoading(true);
    try {
      // We ensure the goal is uppercase when sending to API (if needed)
      const tasks = await generateProjectPlan(goal.toUpperCase());
      onPlanGenerated(tasks);
      setGoal('');
    } catch (err) {
      console.error(err);
      alert("Failed to generate plan.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div 
      className="mb-12 bg-black border border-neutral-800 relative overflow-hidden group cursor-text"
      onClick={handleContainerClick}
    >
      {/* Terminal Header */}
      <div className="bg-neutral-900/50 px-4 py-1 flex items-center justify-between border-b border-neutral-800 select-none cursor-default">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
         </div>
         <span className="text-[9px] font-mono text-neutral-500 uppercase">COMMAND_LINE_INTERFACE_V1</span>
      </div>

      <div className="flex items-center p-4 relative">
        {/* Scanline */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.02),transparent)] animate-pulse"></div>
        
        <span className="text-cyan-500 font-mono mr-4 flex items-center shrink-0 text-sm font-bold select-none">
            root@klaytic:~<ChevronRight size={14} />
        </span>
        
        <input
          ref={inputRef}
          type="text"
          value={goal}
          // FIX 1: Removed .toUpperCase() to prevent cursor jumping while editing
          onChange={(e) => setGoal(e.target.value)}
          // FIX 2: Stop propagation allows users to highlight/select text without re-triggering focus
          onClick={(e) => e.stopPropagation()}
          disabled={loading}
          autoFocus // FIX 3: Immediately focus on mount
          placeholder="ENTER MISSION OBJECTIVE..."
          // CSS 'uppercase' handles the visual styling perfectly without breaking state
          className="flex-1 bg-transparent text-white text-sm font-mono placeholder-neutral-700 outline-none uppercase tracking-wider z-10 disabled:opacity-50"
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        
        <button
          onClick={(e) => {
             e.stopPropagation();
             handleGenerate();
          }}
          disabled={loading || !goal.trim()}
          className={`
            px-4 py-2 border border-neutral-800 font-mono text-xs uppercase font-bold transition-all min-w-[100px] flex justify-center items-center z-10
            ${goal.trim() && !loading ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500 hover:text-black cursor-pointer' : 'text-neutral-600 cursor-not-allowed'}
          `}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 size={12} className="animate-spin"/> EXE
            </span>
          ) : (
            'EXECUTE'
          )}
        </button>
      </div>
    </div>
  );
};

export default PlanGenerator;