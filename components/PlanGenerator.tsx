
import React, { useState } from 'react';
import { Loader2, Command, Sparkles, ChevronRight } from 'lucide-react';
import { generateProjectPlan } from '../services/geminiService';
import { Task } from '../types';

interface PlanGeneratorProps {
  onPlanGenerated: (tasks: Task[]) => void;
}

const PlanGenerator: React.FC<PlanGeneratorProps> = ({ onPlanGenerated }) => {
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    
    setLoading(true);
    try {
      const tasks = await generateProjectPlan(goal);
      onPlanGenerated(tasks);
      setGoal('');
    } catch (err) {
      alert("Failed to generate plan.");
    } finally {
      setLoading(false);
    }
  };

  const isTyping = goal.length > 0;

  return (
    <div className="mb-12 bg-black border border-neutral-800 relative overflow-hidden group">
      {/* Terminal Header */}
      <div className="bg-neutral-900/50 px-4 py-1 flex items-center justify-between border-b border-neutral-800">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
         </div>
         <span className="text-[9px] font-mono text-neutral-500 uppercase">COMMAND_LINE_INTERFACE_V1</span>
      </div>

      <div className="flex items-center p-4 relative">
        {/* Scanline across input */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.02),transparent)] animate-pulse"></div>
        
        <span className="text-cyan-500 font-mono mr-4 flex items-center shrink-0 text-sm font-bold">
           root@klaytic:~<ChevronRight size={14} />
        </span>
        
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Enter mission objective..."
          className="flex-1 bg-transparent text-white text-sm font-mono placeholder-neutral-700 outline-none uppercase tracking-wider"
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        
        <button
          onClick={handleGenerate}
          disabled={loading || !goal.trim()}
          className={`
            px-4 py-2 border border-neutral-800 font-mono text-xs uppercase font-bold transition-all
            ${goal.trim() ? 'bg-cyan-900/20 text-cyan-400 border-cyan-500/50 hover:bg-cyan-500 hover:text-black' : 'text-neutral-600 cursor-not-allowed'}
          `}
        >
          {loading ? <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin"/> EXE</span> : 'EXECUTE'}
        </button>
      </div>
    </div>
  );
};

export default PlanGenerator;