
import React, { useState, useEffect, useRef } from 'react';
import {
    Search, Sparkles, Map as MapIcon, Loader2, Image as ImageIcon,
    DollarSign, TrendingUp, Cloud, Sun, CloudRain, Wind, Briefcase, Building2, Code, Users, Globe2, Zap,
    BarChart3, PieChart, Shield, Lock, Cpu, Server, Activity, HeartPulse, Newspaper, Video, Send, MessageSquare, RefreshCcw, Coins
} from 'lucide-react';
import { searchGlobalIntelligence, generateVisualization, chatWithGlobalIntel } from '../services/geminiService';
import { GlobalAnalysisResult, GlobalWidget, GlobalChatMessage } from '../types';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { decrementUserCredits } from '@/actions/userActions';

// --- Detailed Geometric World Map Data ---
const WORLD_REGIONS = [
    // --- North America (Cyan) ---
    { id: 'CA', name: 'Canada', path: "M 70 40 L 250 40 L 290 110 L 150 130 L 70 100 Z", color: "#06b6d4", cx: 160, cy: 70 },
    { id: 'US', name: 'United States', path: "M 60 110 L 150 130 L 290 110 L 300 160 L 160 180 L 60 140 Z", color: "#06b6d4", cx: 180, cy: 140 },
    { id: 'MX', name: 'Mexico', path: "M 100 180 L 160 185 L 170 230 L 120 240 L 100 210 Z", color: "#06b6d4", cx: 135, cy: 210 },
    { id: 'GL', name: 'Greenland', path: "M 290 30 L 380 30 L 360 90 L 290 80 Z", color: "#06b6d4", cx: 330, cy: 60 },
    { id: 'CAM', name: 'Central America', path: "M 125 240 L 175 235 L 185 260 L 160 270 Z", color: "#06b6d4", cx: 155, cy: 250 },
    { id: 'CU', name: 'Caribbean', path: "M 180 210 L 230 210 L 220 230 L 190 225 Z", color: "#06b6d4", cx: 205, cy: 220 },

    // --- South America (Pink) ---
    { id: 'CO', name: 'Colombia', path: "M 160 270 L 210 270 L 210 300 L 155 290 Z", color: "#ec4899", cx: 185, cy: 285 },
    { id: 'VE', name: 'Venezuela', path: "M 180 260 L 230 265 L 230 290 L 210 290 Z", color: "#ec4899", cx: 210, cy: 275 },
    { id: 'BR', name: 'Brazil', path: "M 215 290 L 310 300 L 290 400 L 230 380 L 215 300 Z", color: "#ec4899", cx: 260, cy: 340 },
    { id: 'PE', name: 'Peru', path: "M 155 295 L 210 305 L 200 360 L 160 340 Z", color: "#ec4899", cx: 180, cy: 325 },
    { id: 'AR', name: 'Argentina', path: "M 180 400 L 220 390 L 210 510 L 190 510 Z", color: "#ec4899", cx: 200, cy: 450 },
    { id: 'CL', name: 'Chile', path: "M 160 350 L 180 360 L 180 500 L 165 490 Z", color: "#ec4899", cx: 170, cy: 420 },
    { id: 'BO', name: 'Bolivia', path: "M 190 340 L 230 340 L 230 380 L 200 370 Z", color: "#ec4899", cx: 210, cy: 360 },

    // --- Europe (Purple) ---
    { id: 'UK', name: 'United Kingdom', path: "M 410 110 L 435 110 L 430 135 L 405 130 Z", color: "#a855f7", cx: 420, cy: 120 },
    { id: 'IS', name: 'Iceland', path: "M 370 70 L 390 70 L 385 85 L 365 80 Z", color: "#a855f7", cx: 378, cy: 78 },
    { id: 'NO', name: 'Scandinavia', path: "M 440 60 L 490 60 L 480 110 L 445 115 Z", color: "#a855f7", cx: 465, cy: 85 },
    { id: 'FR', name: 'France', path: "M 410 140 L 445 140 L 445 165 L 415 165 Z", color: "#a855f7", cx: 430, cy: 152 },
    { id: 'DE', name: 'Germany', path: "M 445 130 L 470 130 L 470 155 L 445 155 Z", color: "#a855f7", cx: 458, cy: 142 },
    { id: 'ES', name: 'Spain', path: "M 400 170 L 435 165 L 435 195 L 395 190 Z", color: "#a855f7", cx: 415, cy: 180 },
    { id: 'IT', name: 'Italy', path: "M 455 160 L 475 160 L 485 190 L 465 185 Z", color: "#a855f7", cx: 470, cy: 175 },
    { id: 'EE', name: 'Eastern Europe', path: "M 470 125 L 510 125 L 500 160 L 470 155 Z", color: "#a855f7", cx: 490, cy: 140 },

    // --- Africa (Orange) ---
    { id: 'MA', name: 'West Africa', path: "M 395 200 L 450 200 L 450 270 L 390 260 Z", color: "#f97316", cx: 420, cy: 230 },
    { id: 'EG', name: 'Egypt & North', path: "M 460 195 L 530 200 L 520 240 L 460 230 Z", color: "#f97316", cx: 495, cy: 215 },
    { id: 'CF', name: 'Central Africa', path: "M 460 270 L 520 270 L 510 330 L 450 320 Z", color: "#f97316", cx: 485, cy: 295 },
    { id: 'ET', name: 'East Africa', path: "M 530 245 L 560 255 L 540 310 L 520 300 Z", color: "#f97316", cx: 540, cy: 275 },
    { id: 'ZA', name: 'South Africa', path: "M 460 350 L 520 350 L 510 410 L 470 400 Z", color: "#f97316", cx: 490, cy: 380 },
    { id: 'MG', name: 'Madagascar', path: "M 540 350 L 560 350 L 555 390 L 535 380 Z", color: "#f97316", cx: 548, cy: 370 },

    // --- Asia (Emerald) ---
    { id: 'RU', name: 'Russia', path: "M 510 60 L 800 60 L 830 130 L 550 130 L 510 110 Z", color: "#10b981", cx: 670, cy: 90 },
    { id: 'CN', name: 'China', path: "M 600 140 L 730 140 L 720 210 L 610 200 Z", color: "#10b981", cx: 665, cy: 175 },
    { id: 'IN', name: 'India', path: "M 620 205 L 680 205 L 670 270 L 630 260 Z", color: "#10b981", cx: 650, cy: 235 },
    { id: 'JP', name: 'Japan', path: "M 770 140 L 790 150 L 780 180 L 760 170 Z", color: "#10b981", cx: 775, cy: 160 },
    { id: 'ME', name: 'Middle East', path: "M 540 190 L 590 190 L 600 230 L 545 220 Z", color: "#10b981", cx: 570, cy: 210 },
    { id: 'SEA', name: 'Southeast Asia', path: "M 690 220 L 750 220 L 760 280 L 700 280 Z", color: "#10b981", cx: 725, cy: 250 },
    { id: 'ID', name: 'Indonesia', path: "M 660 290 L 760 290 L 770 320 L 670 320 Z", color: "#10b981", cx: 715, cy: 305 },
    { id: 'KZ', name: 'Central Asia', path: "M 550 130 L 610 130 L 600 180 L 540 170 Z", color: "#10b981", cx: 575, cy: 155 },

    // --- Oceania (Blue) ---
    { id: 'AU', name: 'Australia', path: "M 700 350 L 800 350 L 810 430 L 690 420 Z", color: "#3b82f6", cx: 750, cy: 390 },
    { id: 'NZ', name: 'New Zealand', path: "M 820 440 L 840 440 L 830 480 L 810 470 Z", color: "#3b82f6", cx: 825, cy: 460 },
];

// --- Icon Mapper ---
const getIconComponent = (iconName: string) => {
    const icons: any = {
        'dollar-sign': DollarSign, 'trending-up': TrendingUp, 'cloud': Cloud, 'sun': Sun, 'cloud-rain': CloudRain,
        'wind': Wind, 'briefcase': Briefcase, 'building-2': Building2, 'code': Code, 'users': Users,
        'globe-2': Globe2, 'zap': Zap, 'bar-chart-3': BarChart3, 'pie-chart': PieChart, 'shield': Shield,
        'lock': Lock, 'cpu': Cpu, 'server': Server, 'activity': Activity, 'heart-pulse': HeartPulse,
        'newspaper': Newspaper, 'video': Video, 'search': Search
    };
    const Icon = icons[iconName] || Sparkles;
    return <Icon size={16} />;
};

const Globe: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'data' | 'chat'>('data');

    // Credit System
    const { user, isLoading, error } = useUser();
    const [credits, setCredits] = useState(50);

    useEffect(() => {
        if (user?.credits !== undefined) {
            setCredits(user.credits);
        }
    }, [user]);

    const handleUpdateCredits = async () => {
        try {
            const updatedCredits = await decrementUserCredits();
            setCredits(updatedCredits);
        } catch (error) {
            console.error("Error updating credits:", error);
        }
    };



    // Intel State
    const [globalAnalysis, setGlobalAnalysis] = useState<GlobalAnalysisResult | null>(null);
    const [contextImage, setContextImage] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

    // Chat State
    const [chatHistory, setChatHistory] = useState<GlobalChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeTab === 'chat') {
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [chatHistory, activeTab]);

    // Persistence Logic
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedQuery = localStorage.getItem('nexus_globe_query');
            const savedAnalysis = localStorage.getItem('nexus_globe_analysis');
            const savedImage = localStorage.getItem('nexus_globe_image');
            const savedChat = localStorage.getItem('nexus_globe_chat');

            if (savedQuery) setSearchQuery(savedQuery);
            if (savedAnalysis) {
                try {
                    setGlobalAnalysis(JSON.parse(savedAnalysis));
                } catch (e) { console.error(e); }
            }
            if (savedImage) setContextImage(savedImage);
            if (savedChat) {
                try {
                    setChatHistory(JSON.parse(savedChat));
                } catch (e) { console.error(e); }
            }
            setIsLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        if (typeof window !== 'undefined') {
            localStorage.setItem('nexus_globe_query', searchQuery);

            if (globalAnalysis) localStorage.setItem('nexus_globe_analysis', JSON.stringify(globalAnalysis));
            else localStorage.removeItem('nexus_globe_analysis');

            if (contextImage) localStorage.setItem('nexus_globe_image', contextImage);
            else localStorage.removeItem('nexus_globe_image');

            if (chatHistory.length > 0) localStorage.setItem('nexus_globe_chat', JSON.stringify(chatHistory));
            else localStorage.removeItem('nexus_globe_chat');
        }
    }, [searchQuery, globalAnalysis, contextImage, chatHistory, isLoaded]);

    const performGlobalSearch = async (query: string) => {
        if (!query) return;

        if (credits <= 0) {
            alert("You have run out of credits for this month. Please upgrade to continue using Global Intel.");
            return;
        }

        setSuggestions([]);
        setIsAnalyzing(true);
        setGlobalAnalysis(null);
        setContextImage(null);
        setActiveTab('data');

        // Reset Chat
        setChatHistory([{
            id: 'init',
            role: 'ai',
            content: `Ready to discuss: ${query}`
        }]);

        try {
            const [analysis, imageUrl] = await Promise.all([
                searchGlobalIntelligence(query),
                generateVisualization(query)
            ]);
            setGlobalAnalysis(analysis);
            setContextImage(imageUrl);

            handleUpdateCredits();
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleManualSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        // CLEAR selection when searching manually to avoid confusion
        setSelectedRegionId(null);

        performGlobalSearch(searchQuery);
    };

    const handleRegionClick = (regionName: string, regionId: string) => {
        setSelectedRegionId(regionId);
        const query = `Current situation and key trends in ${regionName}`;
        setSearchQuery(query);
    };

    const handleRefresh = () => {
        if (searchQuery) {
            performGlobalSearch(searchQuery);
        }
    };

    const handleChatSubmit = async () => {
        if (!chatInput.trim() || !globalAnalysis) return;

        const userMsg: GlobalChatMessage = {
            id: Math.random().toString(),
            role: 'user',
            content: chatInput
        };

        setChatHistory(prev => [...prev, userMsg]);
        setChatInput('');
        setChatLoading(true);

        try {
            const response = await chatWithGlobalIntel(chatHistory, globalAnalysis, userMsg.content);
            setChatHistory(prev => [...prev, response]);
        } catch (e) {
            console.error(e);
        } finally {
            setChatLoading(false);
        }
    };

    const renderWidget = (widget: GlobalWidget) => {
        const isFull = widget.width === 'full';

        return (
            <div key={widget.id} className={`${isFull ? 'col-span-2' : 'col-span-1'} bg-neutral-900/30 border border-neutral-800 rounded-2xl p-4 animate-in fade-in zoom-in duration-500`}>
                <div className="flex items-center gap-2 mb-3 text-cyan-400">
                    {getIconComponent(widget.icon)}
                    <span className="text-[10px] font-bold uppercase tracking-widest">{widget.title}</span>
                </div>

                {widget.type === 'stat' && (
                    <div>
                        <div className="text-2xl font-bold text-white">{widget.content.value}</div>
                        <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-neutral-500">{widget.content.label}</span>
                            {widget.content.trend && <span className="text-xs font-bold text-green-400 bg-green-950/30 px-2 py-0.5 rounded">{widget.content.trend}</span>}
                        </div>
                    </div>
                )}

                {widget.type === 'list' && widget.content.items && (
                    <div className="space-y-2">
                        {widget.content.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm text-neutral-300 border-l-2 border-neutral-800 pl-3 py-1 hover:border-cyan-500/50 hover:bg-white/5 transition-all rounded-r-lg cursor-default">
                                <div className="w-1 h-1 bg-cyan-500 rounded-full shrink-0"></div>
                                {item}
                            </div>
                        ))}
                    </div>
                )}

                {widget.type === 'tags' && widget.content.items && (
                    <div className="flex flex-wrap gap-2">
                        {widget.content.items.map((tag, i) => (
                            <span key={i} className="bg-black border border-neutral-700 text-neutral-300 px-3 py-1 rounded-full text-xs font-medium hover:border-white/50 transition-colors cursor-default">
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {widget.type === 'text' && (
                    <p className="text-sm text-neutral-400 leading-relaxed">
                        {widget.content.text}
                    </p>
                )}

                {widget.type === 'insight' && (
                    <div className="relative overflow-hidden rounded-xl p-4 bg-linear-to-br from-purple-900/20 to-blue-900/20 border border-white/5">
                        <Sparkles size={16} className="text-yellow-400 mb-2" />
                        <p className="text-sm font-medium text-white italic leading-relaxed">"{widget.content.text}"</p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="p-8 md:p-12 max-w-[1800px] mx-auto w-full h-screen flex flex-col overflow-hidden relative">
            {/* Gradient Header Background */}
            <div className="absolute top-0 left-0 w-full h-80 bg-linear-to-b from-cyan-900/20 to-transparent pointer-events-none z-0"></div>

            <header className="mb-8 relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shrink-0">
                <div>
                    <h1 className="text-5xl font-bold text-white mb-2 tracking-tighter font-outfit">WORLD</h1>
                    <p className="text-neutral-500 tracking-[0.3em] uppercase text-xs font-mono">Planetary Intelligence</p>
                </div>

                <div className="flex flex-col gap-2 w-full max-w-lg items-end">
                    {/* Credits Counter */}
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-widest mb-2
                ${credits > 0 ? 'bg-green-950/30 text-green-400 border-green-900' : 'bg-red-950/30 text-red-400 border-red-900'}
            `}>
                        <Coins size={12} />
                        <span>Credits: {credits}/50</span>
                        {credits <= 0 && (
                            <Link href="/pricing" className="ml-2 underline hover:text-white">Top Up</Link>
                        )}
                    </div>

                    <form onSubmit={handleManualSearch} className="relative w-full z-50">
                        <div className="relative group">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search world trends..."
                                className="w-full bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl py-4 pl-12 pr-12 text-white text-lg font-medium focus:border-cyan-500 focus:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] outline-none transition-all"
                                disabled={credits <= 0}
                            />
                            <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500 animate-pulse" size={20} />
                        </div>
                        {suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl animate-slide-up z-50">
                                {suggestions.map(s => (
                                    <button type="button" key={s} onClick={() => { setSearchQuery(s); performGlobalSearch(s); setSelectedRegionId(null); }} className="w-full text-left px-6 py-3 text-sm text-neutral-400 hover:bg-neutral-900 hover:text-white flex items-center gap-3 border-b border-neutral-900 transition-colors">
                                        <Search size={14} /> {s}
                                    </button>
                                ))}
                            </div>
                        )}
                    </form>
                </div>
            </header>

            <div className="flex-1 flex flex-col lg:flex-row gap-8 min-h-0 relative z-10">

                {/* Left: Interactive Geometric Map */}
                <div className="flex-1 relative bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-neutral-900 overflow-hidden flex flex-col justify-center group shrink-0 lg:shrink select-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-neutral-900/20 to-[#050505]"></div>

                    <svg viewBox="0 0 900 550" className="w-full h-full max-w-6xl drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] z-10 p-4">
                        <defs>
                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="4" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                            <filter id="pulse-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="8" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>

                        <path d="M 50 50 L 850 50 L 850 500 L 50 500 Z" fill="none" stroke="#111" strokeWidth="0.5" className="opacity-10" />

                        {WORLD_REGIONS.map(region => {
                            const isSelected = selectedRegionId === region.id;

                            // Only calculate relevance if NO specific country is selected (prevent clutter)
                            const showRelevance = !selectedRegionId;
                            const isRelevant = showRelevance && globalAnalysis?.relevantContinents.some(rc =>
                                rc.toLowerCase().includes(region.name.toLowerCase()) ||
                                region.name.toLowerCase().includes(rc.toLowerCase()) ||
                                rc.toLowerCase().includes("global")
                            );

                            // Base Style (Dark Technical)
                            let fill = "#1a1a1a";
                            let stroke = "#333";
                            let strokeWidth = 0.5;
                            let filter = "";

                            if (isSelected) {
                                fill = `${region.color}40`;
                                stroke = region.color;
                                strokeWidth = 2.5;
                                filter = "url(#pulse-glow)";
                            } else if (isRelevant) {
                                fill = `${region.color}15`; // Subtle hint
                                stroke = `${region.color}60`;
                                strokeWidth = 1.5;
                                filter = "url(#glow)";
                            }

                            return (
                                <g
                                    key={region.id}
                                    onClick={() => handleRegionClick(region.name, region.id)}
                                    className="cursor-pointer group/region"
                                >
                                    <path
                                        d={region.path}
                                        fill={fill}
                                        stroke={stroke}
                                        strokeWidth={strokeWidth}
                                        filter={filter}
                                        className="transition-all duration-500 ease-out hover:fill-white/10 hover:stroke-white/50"
                                    />

                                    {/* Interactive Labels */}
                                    <text
                                        x={region.cx}
                                        y={region.cy}
                                        fill="white"
                                        fontSize="10"
                                        textAnchor="middle"
                                        className={`pointer-events-none transition-all duration-300 font-bold tracking-widest uppercase select-none
                           ${isSelected || isRelevant ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 group-hover/region:opacity-100 group-hover/region:translate-y-0'}
                         `}
                                        style={{ textShadow: '0 2px 10px black' }}
                                    >
                                        {region.name}
                                    </text>

                                    {/* Active Indicators - Fixed Animation Origin */}
                                    {(isSelected) && (
                                        <circle
                                            cx={region.cx}
                                            cy={region.cy}
                                            r={4}
                                            fill={region.color}
                                            className="animate-ping opacity-75"
                                            style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                                        />
                                    )}
                                </g>
                            );
                        })}
                    </svg>
                </div>

                {/* Right: Intel & Chat Panel */}
                <div className="w-full lg:w-[500px] flex flex-col h-full min-h-0 bg-neutral-900/50 backdrop-blur-md rounded-3xl border border-neutral-900 relative overflow-hidden">

                    {/* Panel Tabs */}
                    <div className="flex border-b border-neutral-900">
                        <button
                            onClick={() => setActiveTab('data')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'data' ? 'bg-neutral-900/50 text-white border-b-2 border-cyan-500' : 'text-neutral-600 hover:text-neutral-400'}`}
                        >
                            Data Feed
                        </button>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`flex-1 py-4 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'chat' ? 'bg-neutral-900/50 text-white border-b-2 border-purple-500' : 'text-neutral-600 hover:text-neutral-400'}`}
                        >
                            Chat
                        </button>
                    </div>

                    {/* Panel Content */}
                    <div className="flex-1 overflow-hidden relative">

                        {/* DATA TAB */}
                        {activeTab === 'data' && (
                            <div className="absolute inset-0 overflow-y-auto p-6 scrollbar-hide">
                                {isAnalyzing ? (
                                    <div className="flex flex-col items-center justify-center h-full text-cyan-500 animate-pulse">
                                        <Loader2 size={32} className="animate-spin mb-4" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Analyzing...</p>
                                    </div>
                                ) : globalAnalysis ? (
                                    <>
                                        <div className="flex justify-between items-start mb-4">
                                            <button onClick={handleRefresh} className="text-neutral-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-neutral-800">
                                                <RefreshCcw size={14} />
                                            </button>
                                        </div>

                                        {/* Generated Visual Header */}
                                        {contextImage && (
                                            <div className="w-full h-40 rounded-2xl overflow-hidden mb-6 relative group border border-neutral-800">
                                                <img src={contextImage} alt="Intel Context" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent flex items-end p-4">
                                                    <span className="text-[10px] font-bold text-white bg-purple-500/80 px-2 py-1 rounded backdrop-blur-sm uppercase tracking-wider">Visual</span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="mb-8 animate-slide-up">
                                            <p className="text-lg font-medium text-white leading-relaxed font-outfit border-l-2 border-cyan-500 pl-4">
                                                {globalAnalysis.summary}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pb-20">
                                            {globalAnalysis.widgets.map(widget => renderWidget(widget))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full text-neutral-700">
                                        <Globe2 size={48} className="mb-4 opacity-20" />
                                        <p className="text-xs font-bold uppercase tracking-widest">Map Idle</p>
                                        <p className="text-[10px] text-neutral-600 mt-2">Select a region or search</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* CHAT TAB */}
                        {activeTab === 'chat' && (
                            <div className="absolute inset-0 flex flex-col">
                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    {chatHistory.length === 0 && (
                                        <div className="text-center text-neutral-600 mt-10">
                                            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                                            <p className="text-xs">Chat ready.</p>
                                        </div>
                                    )}
                                    {chatHistory.map(msg => (
                                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-white text-black' : 'bg-neutral-900 border border-neutral-800 text-neutral-300'}`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {chatLoading && (
                                        <div className="flex justify-start">
                                            <div className="bg-neutral-900 border border-neutral-800 px-4 py-3 rounded-2xl flex items-center gap-2 text-cyan-500 text-xs font-bold uppercase tracking-widest">
                                                <Loader2 size={12} className="animate-spin" /> Analyzing
                                            </div>
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />
                                </div>

                                <div className="p-4 border-t border-neutral-900 bg-[#080808]">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleChatSubmit()}
                                            placeholder="Ask about this..."
                                            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl py-3 pl-4 pr-12 text-white text-sm focus:border-purple-500 outline-none transition-colors"
                                            disabled={chatLoading || !globalAnalysis}
                                        />
                                        <button
                                            onClick={handleChatSubmit}
                                            disabled={chatLoading || !chatInput}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white text-black rounded-lg hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                                        >
                                            <Send size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Globe;
