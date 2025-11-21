
import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import { Trash2, BrainCircuit, ImagePlus, Edit2, Calendar, Clock, AlertTriangle, ChevronRight, ChevronDown, MoreVertical, GripVertical, X } from 'lucide-react';
import { generateVisualization, analyzeTaskDeepDive } from '../services/geminiService';

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onUpdate }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPainting, setIsPainting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Click outside to close menu
  useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
              setShowStatusMenu(false);
          }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Editing State
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDesc, setEditedDesc] = useState(task.description);
  const [editedTags, setEditedTags] = useState(task.tags.join(', '));
  const [editedStatus, setEditedStatus] = useState(task.status);
  const [editedDate, setEditedDate] = useState(task.dueDate ? task.dueDate.split('T')[0] : '');
  const [editedTime, setEditedTime] = useState(task.dueDate && task.dueDate.includes('T') ? task.dueDate.split('T')[1] : '');

  const handleVisualize = async () => {
    setIsPainting(true);
    try {
      const url = await generateVisualization(task.title);
      onUpdate({ ...task, imageUrl: url });
    } catch (e) {
      console.error(e);
    } finally {
      setIsPainting(false);
    }
  };

  const handleDeepDive = async () => {
    if (task.analysis) {
      setExpanded(!expanded);
      return;
    }
    
    setIsAnalyzing(true);
    setExpanded(true);
    try {
      const analysis = await analyzeTaskDeepDive(task);
      onUpdate({ ...task, analysis });
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveEdit = () => {
     let finalIso = undefined;
     if (editedDate) {
         finalIso = editedTime ? `${editedDate}T${editedTime}` : editedDate;
     }

     onUpdate({
         ...task,
         title: editedTitle,
         description: editedDesc,
         tags: editedTags.split(',').map(t => t.trim()).filter(t => t),
         status: editedStatus,
         dueDate: finalIso
     });
     setIsEditing(false);
  };

  const handleDragStart = (e: React.DragEvent) => {
      e.dataTransfer.setData('taskId', task.id);
      e.dataTransfer.effectAllowed = 'move';
  };

  const getDueStatus = () => {
    if (!task.dueDate) return null;
    const due = new Date(task.dueDate);
    const now = new Date();
    const diffMs = due.getTime() - now.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMs < 0 && task.status !== TaskStatus.DONE) {
        return { text: 'OVERDUE', color: 'text-red-400', icon: AlertTriangle };
    }
    if (diffHrs < 24 && diffHrs > 0) {
        return { text: `${diffHrs}H REMAINING`, color: 'text-amber-400', icon: Clock };
    }
    return { text: due.toLocaleDateString(), color: 'text-neutral-400', icon: Calendar };
  };

  const dueStatus = getDueStatus();

  // Luxury Styling Logic
  const getStyles = () => {
    switch (task.status) {
      case TaskStatus.TODO:
        return {
          topGradient: "from-red-500 via-red-900/50 to-transparent",
          glow: "shadow-[0_-4px_20px_-10px_rgba(239,68,68,0.3)]",
          badge: "text-red-400 border-red-500/30 hover:bg-red-950/30",
          label: "PENDING"
        };
      case TaskStatus.IN_PROGRESS:
        return {
          topGradient: "from-amber-400 via-amber-900/50 to-transparent",
          glow: "shadow-[0_-4px_20px_-10px_rgba(251,191,36,0.3)]",
          badge: "text-amber-400 border-amber-500/30 hover:bg-amber-950/30",
          label: "ACTIVE"
        };
      case TaskStatus.DONE:
        return {
          topGradient: "from-emerald-500 via-emerald-900/50 to-transparent",
          glow: "shadow-[0_-4px_20px_-10px_rgba(16,185,129,0.3)]",
          badge: "text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/30",
          label: "COMPLETED"
        };
      default: 
        return { topGradient: "", glow: "", badge: "", label: "" };
    }
  };

  const styles = getStyles();

  if (isEditing) {
      return (
          <div className="relative bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/10 rounded-xl p-6 shadow-2xl z-20 animate-in fade-in duration-200">
               <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                   <h4 className="text-sm font-bold text-white font-mono uppercase tracking-widest">Edit Protocol</h4>
                   <button onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-white"><X size={16}/></button>
               </div>
               {/* ... (Editing Inputs remain same structure but scaled slightly if needed) ... */}
               <div className="space-y-5 font-mono text-sm">
                   <div className="space-y-2">
                       <label className="text-cyan-500 text-xs uppercase tracking-widest font-bold">Objective Title</label>
                       <input className="w-full bg-black/50 border border-neutral-800 p-3 text-white focus:border-cyan-500/50 outline-none rounded transition-colors" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} />
                   </div>
                   
                   <div className="space-y-2">
                       <label className="text-cyan-500 text-xs uppercase tracking-widest font-bold">Directives</label>
                       <textarea className="w-full bg-black/50 border border-neutral-800 p-3 text-neutral-200 h-32 resize-none focus:border-cyan-500/50 outline-none rounded leading-relaxed" value={editedDesc} onChange={e => setEditedDesc(e.target.value)} />
                   </div>

                   <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-white/5">
                      <button onClick={saveEdit} className="px-6 py-2 bg-cyan-500/10 border border-cyan-500/50 text-cyan-400 text-xs uppercase font-bold hover:bg-cyan-500 hover:text-black rounded tracking-wider transition-all">Confirm Update</button>
                   </div>
               </div>
          </div>
      )
  }

  return (
    <div 
      draggable
      onDragStart={handleDragStart}
      className={`group relative w-full rounded-xl bg-neutral-900/40 backdrop-blur-md border border-white/5 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 cursor-grab active:cursor-grabbing ${styles.glow}`}
    >
      
      {/* Top Gradient Line */}
      <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r ${styles.topGradient}`}></div>
      <div className={`absolute top-0 left-0 w-full h-[20px] bg-gradient-to-b ${styles.topGradient} opacity-10`}></div>

      {/* Drag Handle Indicator */}
      <div className="absolute top-1/2 -left-2 -translate-y-1/2 text-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical size={16} />
      </div>

      {/* Image Header */}
      {task.imageUrl && (
        <div className="h-40 w-full relative overflow-hidden rounded-t-xl border-b border-white/5 group-hover:h-44 transition-all duration-700 ease-out">
          <img src={task.imageUrl} alt="Visual" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
        </div>
      )}

      <div className="p-6 relative z-10">
        
        {/* Header Row */}
        <div className="flex justify-between items-start mb-4">
            <div className="flex flex-wrap gap-2">
                {task.tags.slice(0, 2).map(tag => (
                    <span key={tag} className="text-[10px] font-bold px-2.5 py-1 border border-white/10 bg-white/5 text-neutral-300 rounded uppercase tracking-wider">
                        {tag}
                    </span>
                ))}
            </div>
            
            {/* Action Menu - Visible on Hover */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-x-2 group-hover:translate-x-0">
                <button onClick={() => setIsEditing(true)} className="p-2 text-neutral-400 hover:text-white transition-colors rounded hover:bg-white/5" title="Edit">
                    <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(task.id)} className="p-2 text-neutral-400 hover:text-red-500 transition-colors rounded hover:bg-red-500/10" title="Delete">
                    <Trash2 size={14} />
                </button>
            </div>
        </div>

        {/* Content - Typography Improved */}
        <div className="mb-8">
            <h3 className="text-lg font-bold text-white leading-snug mb-3 font-outfit tracking-wide group-hover:text-cyan-100 transition-colors">
                {task.title}
            </h3>
            <p className="text-base text-neutral-300 font-sans leading-relaxed">
                {task.description}
            </p>
        </div>

        {/* Footer Row */}
        <div className="flex items-center justify-between pt-5 border-t border-white/5">
            
            {/* Due Date Info */}
            <div className="flex items-center gap-2">
                {dueStatus ? (
                    <div className={`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider ${dueStatus.color}`}>
                        <dueStatus.icon size={14} /> {dueStatus.text}
                    </div>
                ) : (
                    <div className="text-xs text-neutral-500 uppercase tracking-wider font-bold flex items-center gap-1.5">
                        <Clock size={14} /> Indefinite
                    </div>
                )}
            </div>

            <div className="flex items-center gap-3">
                {/* AI Tools */}
                {!task.imageUrl && (
                    <button 
                        onClick={handleVisualize}
                        disabled={isPainting}
                        className="p-1.5 rounded text-neutral-400 hover:text-purple-400 hover:bg-purple-500/10 transition-colors"
                        title="Generate Asset"
                    >
                        <ImagePlus size={16} className={isPainting ? 'animate-spin' : ''}/>
                    </button>
                )}
                <button 
                    onClick={handleDeepDive}
                    disabled={isAnalyzing}
                    className={`p-1.5 rounded transition-colors ${task.analysis ? 'text-cyan-400 bg-cyan-500/10' : 'text-neutral-400 hover:text-cyan-400 hover:bg-cyan-500/10'}`}
                    title="AI Analysis"
                >
                    <BrainCircuit size={16} className={isAnalyzing ? 'animate-pulse' : ''}/>
                </button>

                {/* Status Dropdown */}
                <div className="relative" ref={menuRef}>
                    <button 
                        onClick={() => setShowStatusMenu(!showStatusMenu)}
                        className={`ml-2 px-3 py-1.5 rounded border text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2
                            ${styles.badge}
                        `}
                    >
                       {styles.label}
                       <ChevronDown size={12} />
                    </button>

                    {showStatusMenu && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-[#0d0d0d] border border-white/10 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {[
                                { s: TaskStatus.TODO, l: 'Pending', c: 'hover:text-red-400' },
                                { s: TaskStatus.IN_PROGRESS, l: 'Active', c: 'hover:text-amber-400' },
                                { s: TaskStatus.DONE, l: 'Completed', c: 'hover:text-emerald-400' }
                            ].map((opt) => (
                                <button
                                    key={opt.s}
                                    onClick={() => {
                                        onUpdate({...task, status: opt.s});
                                        setShowStatusMenu(false);
                                    }}
                                    className={`w-full text-left px-4 py-3 text-xs font-mono text-neutral-400 hover:bg-white/5 transition-colors ${opt.c} ${task.status === opt.s ? 'text-white bg-white/5' : ''}`}
                                >
                                    {opt.l}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* AI Analysis Expanded View */}
        {(expanded || isAnalyzing) && (
            <div className="mt-4 pt-4 border-t border-dashed border-white/10 animate-in slide-in-from-top-2">
                {isAnalyzing ? (
                    <div className="flex items-center gap-3 text-sm text-cyan-500 font-mono animate-pulse py-2">
                        <BrainCircuit size={16} /> 
                        <span>NEURAL NET PROCESSING...</span>
                    </div>
                ) : task.analysis ? (
                    <div className="space-y-4 bg-black/30 p-5 rounded-lg border border-white/5">
                        <div className="flex items-start gap-3">
                            <div className="text-cyan-500 mt-0.5"><BrainCircuit size={16}/></div>
                            <p className="text-sm text-neutral-200 italic font-mono leading-relaxed">
                                "{task.analysis.strategicAdvice}"
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 mt-2">
                             <div className="bg-white/5 rounded p-3 border border-white/5">
                                 <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Est. Effort</div>
                                 <div className="text-sm font-bold text-white font-mono">{task.analysis.estimatedEffort}</div>
                             </div>
                             <div className="bg-white/5 rounded p-3 border border-white/5">
                                 <div className="text-[9px] text-neutral-500 uppercase tracking-widest mb-1">Risk Factor</div>
                                 <div className="text-sm font-bold text-red-400 font-mono">{task.analysis.risks.length} Detected</div>
                             </div>
                        </div>
                    </div>
                ) : null}
            </div>
        )}

      </div>
    </div>
  );
};

export default TaskCard;
