'use client'
import React, { useEffect, useState } from 'react';
import { Task, TaskStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Activity, CheckCircle2, Clock, AlertCircle, Target, Bot, Zap, AlertTriangle, PartyPopper, Sun, Moon, CloudSun, Sunset } from 'lucide-react';
import { generateBoardInsights, generateDashboardMessage } from '../services/geminiService';
import { useTasks } from '../context/TasksContext';

const Dashboard: React.FC = () => {
  const { tasks } = useTasks();
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [time, setTime] = useState(new Date());

  const [aiMessage, setAiMessage] = useState({ message: "Initializing systems...", mood: 'motivational' });
  const [loadingMessage, setLoadingMessage] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const totalTasks = tasks.length;
  const completed = tasks.filter(t => t.status === TaskStatus.DONE).length;
  const inProgress = tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length;
  const todo = tasks.filter(t => t.status === TaskStatus.TODO).length;

  const completionRate = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  const statusData = [
    { name: 'Pending', value: todo, color: '#ef4444' }, // Red
    { name: 'Active', value: inProgress, color: '#eab308' }, // Yellow
    { name: 'Done', value: completed, color: '#22c55e' }, // Green
  ];

  // ---------------------------------------------------------
  // UPDATED: Analysis Logic with Full Caching
  // ---------------------------------------------------------
  useEffect(() => {
    if (tasks.length > 0) {
      // 1. Create a signature based on the current state of tasks
      const taskSignature = JSON.stringify(tasks.map(t => ({ id: t.id, status: t.status, title: t.title })));
      
      // 2. Retrieve cached values
      const cachedSignature = localStorage.getItem('klaytic_tasks_signature');
      const cachedInsight = localStorage.getItem('klaytic_insight');
      const cachedAiMessageStr = localStorage.getItem('klaytic_ai_message');

      // 3. Check if cache is valid (Signature matches + data exists)
      const isCacheValid = cachedSignature === taskSignature && cachedInsight && cachedAiMessageStr;

      if (isCacheValid) {
        // --- USE CACHED DATA ---
        setInsight(cachedInsight);
        try {
            // We must parse the message object back from the string
            setAiMessage(JSON.parse(cachedAiMessageStr));
        } catch (e) {
            console.error("Failed to parse cached message", e);
            // Fallback to fetching if cache is corrupt
            fetchAndCacheData(taskSignature);
        }
        setLoadingInsight(false);
        setLoadingMessage(false);
      } else {
        // --- FETCH NEW DATA & UPDATE CACHE ---
        fetchAndCacheData(taskSignature);
      }
    }

    // Helper function to fetch and save
    function fetchAndCacheData(currentSignature: string) {
        // Update signature immediately
        localStorage.setItem('klaytic_tasks_signature', currentSignature);

        // Fetch Insight
        setLoadingInsight(true);
        generateBoardInsights(tasks).then(res => {
            setInsight(res);
            localStorage.setItem('klaytic_insight', res);
            setLoadingInsight(false);
        });

        // Fetch AI Message
        setLoadingMessage(true);
        generateDashboardMessage(tasks).then(res => {
            const messageData = res as any;
            setAiMessage(messageData);
            // We must stringify the object to save it
            localStorage.setItem('klaytic_ai_message', JSON.stringify(messageData));
            setLoadingMessage(false);
        });
    }
  }, [tasks]);
  // ---------------------------------------------------------

  const getYearProgress = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const currentWeek = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7));
    return currentWeek;
  };

  const currentWeekIndex = getYearProgress();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthWeeks = [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5];
  let globalWeekCounter = 0;

  // Helper for Time of Day
  const getTimeOfDay = () => {
    const hours = time.getHours();
    if (hours >= 5 && hours < 12) return { text: 'Morning', icon: CloudSun };
    if (hours >= 12 && hours < 17) return { text: 'Afternoon', icon: Sun };
    if (hours >= 17 && hours < 21) return { text: 'Evening', icon: Sunset };
    return { text: 'Night', icon: Moon };
  };
  const timeOfDay = getTimeOfDay();

  // Helper for AI Emoji
  const getAiEmoji = () => {
    switch (aiMessage.mood) {
      case 'strict': return "😤";
      case 'funny': return "😜";
      case 'motivational': return "🧘";
      default: return "🤖";
    }
  };

  return (
    <div className="p-8 md:p-16 max-w-[1800px] mx-auto w-full">
      <header className="mb-16 flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-8">
        <div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 tracking-tighter font-outfit">DASHBOARD</h1>
          <p className="text-neutral-400 tracking-[0.3em] uppercase text-sm font-mono flex items-center gap-3">
            {/* Green Blinker */}
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_#22c55e]"></span>
            System Active
          </p>
        </div>

        <div className="text-right">
          {/* 12 Hour Time with AM/PM */}
          <div className="text-5xl font-mono font-bold text-white tracking-tight tabular-nums mb-2">
            {time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}
          </div>
          <div className="flex items-center justify-end gap-3 text-cyan-500 font-mono text-sm uppercase tracking-widest">
            <timeOfDay.icon size={16} />
            <span>{timeOfDay.text}</span>
          </div>
          <div className="text-neutral-600 font-mono text-xs uppercase tracking-widest mt-1">
            {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">

        {/* Insight Panel */}
        <div className="lg:col-span-5 bg-neutral-900/50 backdrop-blur-md border border-white/15 p-10 relative overflow-hidden group clip-corner-tr shadow-lg">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-900/20 blur-3xl"></div>
          <div className="absolute left-0 top-0 w-1.5 h-full bg-cyan-500"></div>

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Target className="text-cyan-500 animate-pulse" size={24} />
              <h2 className="text-lg font-bold text-white uppercase tracking-widest font-outfit">Analysis</h2>
            </div>
            <div className="text-xs font-mono text-neutral-500 uppercase">SAVED</div>
          </div>

          <div className="text-neutral-300 font-mono text-base leading-relaxed h-[160px] overflow-y-auto pr-4 custom-scrollbar">
            {loadingInsight ? (
              <div className="space-y-3 animate-pulse">
                <div className="h-3 bg-neutral-800 w-full rounded"></div>
                <div className="h-3 bg-neutral-800 w-3/4 rounded"></div>
                <div className="h-3 bg-neutral-800 w-5/6 rounded"></div>
              </div>
            ) : (
              <p>{insight || "No tasks found. System idle."}</p>
            )}
          </div>
        </div>

        {/* Year Progress */}
        <div className="lg:col-span-7 bg-neutral-900/50 backdrop-blur-md border border-white/15 p-10 relative overflow-hidden clip-corner-tr shadow-lg">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-white uppercase tracking-widest font-outfit flex items-center gap-3">
              <Activity size={20} className="text-cyan-500" /> WEEKS LEFT
            </h3>
            <div className="text-xs font-mono font-bold text-neutral-500 uppercase">
              Week {currentWeekIndex} / 52
            </div>
          </div>

          <div className="flex justify-between items-end h-[120px] gap-1 overflow-x-auto pb-2 scrollbar-hide">
            {months.map((month, mIdx) => {
              const weeksInThisMonth = monthWeeks[mIdx];
              return (
                <div key={month} className="flex flex-col items-center gap-1.5 h-full justify-end min-w-[30px]">
                  <div className="flex flex-col gap-1.5">
                    {Array.from({ length: weeksInThisMonth }).map((_, wIdx) => {
                      globalWeekCounter++;
                      const isPast = globalWeekCounter < currentWeekIndex;
                      const isCurrent = globalWeekCounter === currentWeekIndex;

                      return (
                        <div
                          key={wIdx}
                          className={`w-2 h-2 transition-all duration-500 
                                 ${isCurrent ? 'bg-cyan-400 shadow-[0_0_8px_#22d3ee] scale-125' : ''}
                                 ${isPast ? 'bg-cyan-900/60' : 'bg-neutral-800'}
                               `}
                        ></div>
                      );
                    })}
                  </div>
                  <span className="text-[9px] font-mono text-neutral-500 uppercase mt-2">{month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Efficiency', value: `${completionRate}%`, icon: Activity, color: 'text-purple-400' },
          { label: 'Completed', value: completed, icon: CheckCircle2, color: 'text-green-500' },
          { label: 'Active', value: inProgress, icon: Clock, color: 'text-yellow-500' },
          { label: 'Pending', value: todo, icon: AlertCircle, color: 'text-red-500' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-neutral-900/50 backdrop-blur-md border border-white/15 p-8 relative group hover:border-white/30 transition-all duration-300 shadow-lg">
            <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex items-start justify-between mb-6">
              <stat.icon size={24} className={`${stat.color} opacity-90`} strokeWidth={1.5} />
              <span className="text-xs font-mono text-neutral-600 uppercase">stat_{idx}</span>
            </div>
            <span className="text-5xl font-bold text-white tracking-tight font-mono block mb-2">{stat.value}</span>
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-[0.2em]">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Workload Distribution */}
        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/15 p-10 flex flex-col relative overflow-hidden shadow-lg">
          <h3 className="text-lg font-bold text-white uppercase tracking-widest mb-8 font-outfit border-b border-white/5 pb-4">
            Task Distribution
          </h3>
          <div className="h-[280px] w-full relative flex items-center justify-center">
            {totalTasks === 0 ? (
              <div className="text-neutral-600 font-mono text-sm flex flex-col items-center">
                <div className="w-20 h-20 border border-neutral-800 mb-4 flex items-center justify-center text-3xl opacity-30">NULL</div>
                NO DATA
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={110}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={true}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'monospace', fontSize: '12px' }}
                    itemStyle={{ color: '#fff', textTransform: 'uppercase' }}
                    cursor={{ fill: 'transparent' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Center Stat */}
            {totalTasks > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-4xl font-bold text-white font-mono">{totalTasks}</span>
                <span className="text-xs text-neutral-500 uppercase tracking-widest mt-1">Total</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Companion Widget - K */}
        <div className="bg-neutral-900/50 backdrop-blur-md border border-white/15 p-10 flex flex-col justify-center relative overflow-hidden group hover:border-cyan-500/30 transition-colors shadow-lg">

          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.03)_25%,rgba(6,182,212,0.03)_50%,transparent_50%,transparent_75%,rgba(6,182,212,0.03)_75%,rgba(6,182,212,0.03)_100%)] bg-size-[20px_20px] opacity-20 pointer-events-none"></div>

          <div className="flex items-start gap-8 relative z-10">
            <div className={`w-28 h-28 border border-white/10 flex items-center justify-center shrink-0 bg-black relative shadow-2xl`}>
              {/* Corners */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500"></div>
              {/* Dynamic Emoji */}
              <div className="text-6xl animate-bounce-slow filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {getAiEmoji()}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-3 font-mono">K</h3>
              <div className="text-xl text-white font-mono leading-relaxed mb-6 border-l-2 border-neutral-800 pl-6 italic">
                "{loadingMessage ? "Thinking..." : aiMessage.message}"
              </div>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-neutral-600 font-mono">
                <Bot size={14} />
                Mood: <span className="text-white">{aiMessage.mood.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;