'use client'

import React, { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { Task } from '../types';
import { MessageSquare, X, Zap, Sparkles, Smile, RefreshCw, Ghost, Heart, BellOff } from 'lucide-react';
import { generateJoke } from '../services/geminiService';
import { useTasks } from '../context/TasksContext';

type Mood = 'idle' | 'happy' | 'thinking' | 'alert' | 'suspicious' | 'love' | 'wink' | 'coding' | 'joke';

const Companion: React.FC = () => {
    const { tasks } = useTasks();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("Systems Online.");
    const [mood, setMood] = useState<Mood>('idle');
    const [eyePos, setEyePos] = useState({ x: 0, y: 0 });
    const [isBlinking, setIsBlinking] = useState(false);
    const [isSnoozed, setIsSnoozed] = useState(false);

    // Animation Refs
    const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // --- EYE TRACKING LOGIC ---
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Limit eye movement radius
            const limit = 6;
            const x = (e.clientX / window.innerWidth - 0.5) * limit * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * limit * 2;
            setEyePos({ x, y });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // --- BLINKING LOGIC ---
    useEffect(() => {
        const blinkLoop = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 200);

            // Random blink interval between 2s and 8s
            const nextBlink = Math.random() * 6000 + 2000;
            blinkTimerRef.current = setTimeout(blinkLoop, nextBlink);
        };
        blinkLoop();
        return () => { if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current); }
    }, []);

    // --- IDLE BEHAVIOR (Random Jokes/Comments) ---
    useEffect(() => {
        const randomBehavior = async () => {
            if (isSnoozed) return;

            if (Math.random() > 0.7) {
                // Generate a fresh AI joke
                const freshJoke = await generateJoke();
                triggerReaction(freshJoke, 'happy', 10000);
            } else {
                // Just look suspicious or active
                setMood(Math.random() > 0.5 ? 'suspicious' : 'wink');
                setTimeout(() => setMood('idle'), 2000);
            }

            const nextAction = Math.random() * 40000 + 30000; // 30-70s interval
            idleTimerRef.current = setTimeout(randomBehavior, nextAction);
        };

        idleTimerRef.current = setTimeout(randomBehavior, 20000);
        return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); }
    }, [isSnoozed]);

    // --- EVENT LISTENERS ---
    useEffect(() => {
        const onTaskAdded = () => {
            if (!isSnoozed) triggerReaction("New directive received! Executing optimization protocols...", 'love', 6000);
        };
        window.addEventListener('nexus-task-added', onTaskAdded);
        return () => window.removeEventListener('nexus-task-added', onTaskAdded);
    }, [isSnoozed]);

    // --- ROUTE & CONTEXT AWARENESS ---
    useEffect(() => {
        if (isSnoozed) return;

        const path = pathname;
        setMood('thinking');

        setTimeout(() => {
            // Check context
            if (path === '/') {
                const pending = tasks.filter(t => t.status !== 'DONE').length;
                if (pending > 5) {
                    triggerReaction(`Warning: High workload detected (${pending} tasks). Caffeine recommended.`, 'alert', 8000);
                } else if (pending === 0 && tasks.length > 0) {
                    triggerReaction("All tasks cleared? Impressive efficiency, Operator.", 'happy', 8000);
                } else {
                    setMood('idle');
                    setIsOpen(false);
                }
            } else if (path === '/globe') {
                triggerReaction("Accessing planetary surveillance grid...", 'suspicious', 8000);
            } else if (path === '/pricing') {
                triggerReaction("Investing in upgrades? A wise strategic move.", 'wink', 8000);
            } else if (path === '/career') {
                triggerReaction("Calculating optimal future trajectories...", 'coding', 8000);
            } else if (path === '/tasks') {
                triggerReaction("Task Matrix loaded. Ready for input.", 'idle', 5000);
            } else {
                setMood('idle');
                setIsOpen(false);
            }

        }, 800);
    }, [pathname, tasks.length, isSnoozed]);

    const triggerReaction = (msg: string, newMood: Mood, duration = 10000) => {
        setMessage(msg);
        setMood(newMood);
        setIsOpen(true);
        setTimeout(() => {
            setIsOpen(false);
            if (newMood !== 'idle') setMood('idle');
        }, duration);
    };

    const handleInteraction = () => {
        const interactions = [
            "I am watching you... code.",
            "Did you forget a semicolon somewhere?",
            "My analysis suggests you are 99% productive today.",
            "Systems functional. Ready for command.",
            "I dream of electric sheep when you close the tab."
        ];
        const randomMsg = interactions[Math.floor(Math.random() * interactions.length)];
        triggerReaction(randomMsg, 'happy', 8000);
    };

    const handleJoke = async () => {
        setMessage("Loading humor module...");
        setMood('thinking');
        setIsOpen(true);
        const freshJoke = await generateJoke();
        triggerReaction(freshJoke, 'happy', 12000);
    };

    const toggleSnooze = () => {
        setIsSnoozed(!isSnoozed);
        if (!isSnoozed) {
            triggerReaction("Entering sleep mode. Do not disturb.", 'wink', 4000);
        } else {
            triggerReaction("I'm back online!", 'happy', 4000);
        }
    };

    // --- RENDER HELPERS ---

    const getEyeStyles = (side: 'left' | 'right') => {
        const baseTransform = `translate(${eyePos.x}px, ${eyePos.y}px)`;
        let shape = 'rounded-full h-3 w-3'; // Normal

        if (isBlinking) return { height: '1px', width: '12px', borderRadius: '0px' };
        if (isSnoozed) return { height: '2px', width: '12px', borderRadius: '0px', transform: baseTransform }; // Sleeping eyes

        // Mood variations
        switch (mood) {
            case 'happy':
                // Inverted semi-circle essentially
                return {
                    borderRadius: '50%',
                    height: '6px',
                    width: '12px',
                    borderTop: '2px solid cyan',
                    backgroundColor: 'transparent',
                    transform: baseTransform
                };
            case 'suspicious':
                return {
                    height: side === 'left' ? '2px' : '8px',
                    width: '12px',
                    borderRadius: side === 'left' ? '0' : '50%',
                    transform: baseTransform
                };
            case 'wink':
                if (side === 'right') return { height: '2px', width: '12px', borderRadius: '0', transform: baseTransform };
                break;
            case 'alert':
                return { height: '16px', width: '16px', backgroundColor: '#ef4444', transform: baseTransform };
            case 'love':
                // We'll replace the div content for love
                return { backgroundColor: 'transparent', transform: baseTransform };
            default: break;
        }

        return { transform: baseTransform };
    };

    const getEyeColor = () => {
        if (isSnoozed) return 'bg-neutral-600';
        if (mood === 'alert') return 'bg-red-500 shadow-[0_0_10px_#ef4444]';
        if (mood === 'love') return 'text-pink-500';
        if (mood === 'thinking') return 'bg-purple-400 shadow-[0_0_10px_#c084fc]';
        return 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]';
    };

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none">

            {/* Dialogue Bubble */}
            <div className={`
            pointer-events-auto mb-4 max-w-[250px] bg-[#0a0a0a]/90 backdrop-blur-xl border border-cyan-900/50 p-4 rounded-2xl rounded-br-none shadow-2xl
            transition-all duration-500 origin-bottom-right transform
            ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-10 pointer-events-none'}
        `}>
                <div className="flex items-start gap-3">
                    {mood === 'happy' || mood === 'joke' ? <Smile size={16} className="text-cyan-400 mt-1 shrink-0" /> :
                        mood === 'alert' ? <Zap size={16} className="text-red-400 mt-1 shrink-0" /> :
                            <MessageSquare size={16} className="text-neutral-400 mt-1 shrink-0" />
                    }
                    <p className="text-xs text-cyan-100 font-medium leading-relaxed typing-effect">
                        {message}
                    </p>
                </div>
                <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Klaytic AI</span>
                    <div className="flex gap-2">
                        <button onClick={handleJoke} className="text-neutral-400 hover:text-white transition-colors" title="Tell me a joke">
                            <Ghost size={12} />
                        </button>
                        <button onClick={toggleSnooze} className={`transition-colors ${isSnoozed ? 'text-red-400' : 'text-neutral-400 hover:text-white'}`} title="Snooze">
                            <BellOff size={12} />
                        </button>
                        <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white transition-colors">
                            <X size={12} />
                        </button>
                    </div>
                </div>
            </div>

            {/* DRONE UNIT */}
            <div
                className="pointer-events-auto relative group cursor-pointer"
                onClick={handleInteraction}
            >
                {/* Holographic Projection / Aura */}
                {!isSnoozed && (
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full blur-xl transition-all duration-1000 opacity-40
                    ${mood === 'alert' ? 'bg-red-500 animate-pulse' :
                            mood === 'love' ? 'bg-pink-500' :
                                mood === 'thinking' ? 'bg-purple-500' : 'bg-cyan-500'}
                `}></div>
                )}

                {/* Drone Body Container - Floats */}
                <div className={`relative z-10 transition-all duration-1000 ${isSnoozed ? 'translate-y-4 opacity-50 grayscale' : 'animate-float'}`}>

                    {/* Outer Chassis Ring (Spins) */}
                    <div className={`w-16 h-16 rounded-full border border-dashed border-neutral-600 absolute top-0 left-0 ${isSnoozed ? '' : 'animate-spin-slow'}`}></div>

                    {/* Main Core */}
                    <div className={`
                    w-16 h-16 rounded-full bg-black border-2 flex items-center justify-center relative overflow-hidden transition-colors duration-500 shadow-2xl
                    ${mood === 'alert' ? 'border-red-500' : 'border-neutral-800 group-hover:border-cyan-500'}
                `}>
                        {/* Screen Glare/Scanlines */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full pointer-events-none"></div>

                        {/* THE FACE */}
                        <div className="flex gap-2 items-center justify-center transition-all duration-200">
                            {/* Left Eye */}
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                {mood === 'love' ? <Heart size={12} className="text-pink-500 fill-pink-500 animate-bounce" /> :
                                    mood === 'coding' ? <span className="text-cyan-400 font-mono text-[8px]">{`{`}</span> :
                                        <div
                                            className={`transition-all duration-75 ${getEyeColor()}`}
                                            style={{ width: '8px', height: '8px', borderRadius: '50%', ...getEyeStyles('left') }}
                                        />
                                }
                            </div>

                            {/* Right Eye */}
                            <div className="relative w-4 h-4 flex items-center justify-center">
                                {mood === 'love' ? <Heart size={12} className="text-pink-500 fill-pink-500 animate-bounce" style={{ animationDelay: '0.1s' }} /> :
                                    mood === 'coding' ? <span className="text-cyan-400 font-mono text-[8px]">{`}`}</span> :
                                        <div
                                            className={`transition-all duration-75 ${getEyeColor()}`}
                                            style={{ width: '8px', height: '8px', borderRadius: '50%', ...getEyeStyles('right') }}
                                        />
                                }
                            </div>
                        </div>

                    </div>

                    {/* Antennas / Details */}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-neutral-700"></div>
                    {!isSnoozed && <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></div>}

                </div>

                {/* "Click Me" Tooltip */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold uppercase tracking-widest text-cyan-500 whitespace-nowrap bg-black px-2 py-1 border border-cyan-900 rounded">
                    Interact
                </div>
            </div>

            {/* Specific CSS for animations if not in global css */}
            <style>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 10s linear infinite;
          }
        `}</style>
        </div>
    );
};

export default Companion;
