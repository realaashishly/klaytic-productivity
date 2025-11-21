
import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import TaskCard from './TaskCard';
import PlanGenerator from './PlanGenerator';
import { Plus, X, Cpu } from 'lucide-react';
import { useTasks } from '../context/TasksContext';

const TaskBoard: React.FC = () => {
  const { tasks, setTasks } = useTasks();
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '', dueTime: '', tags: '' });

  const addTasks = (newTasks: Task[]) => {
    setTasks(prev => [...newTasks, ...prev]);
    window.dispatchEvent(new CustomEvent('nexus-task-added'));
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Delete this task?")) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleManualSubmit = () => {
    if (!newTask.title) return;

    let finalDate = newTask.dueDate;
    if (newTask.dueDate && newTask.dueTime) {
      finalDate = `${newTask.dueDate}T${newTask.dueTime}`;
    }

    const task: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTask.title,
      description: newTask.description,
      dueDate: finalDate,
      tags: newTask.tags.split(',').map(t => t.trim()).filter(t => t),
      status: TaskStatus.TODO,
      priority: 0,
      aiGenerated: false
    };

    addTasks([task]);
    setNewTask({ title: '', description: '', dueDate: '', dueTime: '', tags: '' });
    setShowModal(false);
  };

  // Drag and Drop Logic
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    if (!taskId) return;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status };
      }
      return t;
    }));
  };

  const columns = [
    { id: TaskStatus.TODO, label: 'PENDING', color: 'text-red-500', bg: 'bg-red-950/5' },
    { id: TaskStatus.IN_PROGRESS, label: 'ACTIVE', color: 'text-yellow-500', bg: 'bg-yellow-950/5' },
    { id: TaskStatus.DONE, label: 'COMPLETED', color: 'text-green-500', bg: 'bg-green-950/5' },
  ];

  return (
    <div className="p-8 md:p-16 max-w-[1800px] mx-auto w-full h-full relative">

      <header className="mb-12 flex justify-between items-end relative z-10 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-6xl font-bold text-white mb-4 tracking-tighter font-outfit">TASKS</h1>
          <p className="text-cyan-500 tracking-[0.3em] uppercase text-sm font-mono">Allocation Matrix</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-white text-black px-8 py-4 font-bold text-sm uppercase tracking-widest hover:bg-cyan-400 transition-colors flex items-center gap-3 clip-corner-tr shadow-[0_0_20px_rgba(255,255,255,0.2)]"
        >
          <Plus size={18} /> ADD TASK
        </button>
      </header>

      <PlanGenerator onPlanGenerated={addTasks} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 relative z-10">
        {columns.map(col => {
          const columnTasks = tasks.filter(t => t.status === col.id);
          return (
            <div
              key={col.id}
              className={`flex flex-col h-full rounded-xl transition-colors duration-300 ${col.bg}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              <div className={`flex items-center justify-between mb-6 pb-4 border-b border-white/5 px-4 pt-4`}>
                <h3 className={`font-mono font-bold text-base ${col.color} tracking-widest`}>
                  {col.label}
                </h3>
                <span className="text-sm font-mono text-white bg-white/10 px-2 py-1 rounded">
                  {columnTasks.length}
                </span>
              </div>

              <div className="space-y-6 flex-1 px-2 pb-4 min-h-[200px]">
                {columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDelete}
                    onUpdate={handleUpdate}
                  />
                ))}
                {columnTasks.length === 0 && (
                  <div className="h-32 border border-dashed border-neutral-800 flex items-center justify-center bg-[#0d0d0d]/50 rounded-lg m-2">
                    <span className="text-neutral-600 text-xs font-mono uppercase tracking-widest">DROP ZONE</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="bg-[#0d0d0d] border border-cyan-500/50 p-10 w-full max-w-lg relative shadow-[0_0_50px_rgba(6,182,212,0.2)] clip-corner-all">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 text-neutral-500 hover:text-white"><X size={24} /></button>

            <h2 className="text-2xl font-bold text-white mb-8 font-mono uppercase tracking-widest border-b border-white/10 pb-4">
              <Cpu size={24} className="inline-block mr-3 text-cyan-500" /> New Task
            </h2>

            <div className="space-y-6 font-mono">
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">Title</label>
                <input
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-base focus:border-cyan-500 outline-none"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="Task name..."
                />
              </div>
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">Details</label>
                <textarea
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-sm focus:border-cyan-500 outline-none h-32 resize-none"
                  value={newTask.description}
                  onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Details..."
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-cyan-500 uppercase mb-2">Deadline</label>
                  <input
                    type="date"
                    className="w-full bg-black border border-neutral-800 p-4 text-white text-sm outline-none"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs text-cyan-500 uppercase mb-2">Time</label>
                  <input
                    type="time"
                    className="w-full bg-black border border-neutral-800 p-4 text-white text-sm outline-none"
                    value={newTask.dueTime}
                    onChange={e => setNewTask({ ...newTask, dueTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-cyan-500 uppercase mb-2">Tags</label>
                <input
                  className="w-full bg-black border border-neutral-800 p-4 text-white text-sm focus:border-cyan-500 outline-none"
                  value={newTask.tags}
                  onChange={e => setNewTask({ ...newTask, tags: e.target.value })}
                  placeholder="Design, backend..."
                />
              </div>

              <button
                onClick={handleManualSubmit}
                disabled={!newTask.title}
                className="w-full mt-8 bg-cyan-900/20 border border-cyan-500/50 text-cyan-400 py-5 font-bold text-sm hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBoard;
