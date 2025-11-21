'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Activity, Cpu } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate network request
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        // Simulate Google auth
        setTimeout(() => setIsLoading(false), 2000);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-neutral-950 relative overflow-hidden font-sans text-neutral-200 selection:bg-cyan-500/30">

            {/* Inline styles for custom clip paths matching the dashboard vibe */}
            <style>{`
        .clip-corner-tr {
          clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%);
        }
        .clip-corner-bl {
          clip-path: polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px));
        }
        .font-outfit {
          font-family: system-ui, -apple-system, sans-serif; /* Fallback if font not loaded */
        }
      `}</style>

            {/* Ambient Background - Grid Pattern from Dashboard */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.03)_25%,rgba(6,182,212,0.03)_50%,transparent_50%,transparent_75%,rgba(6,182,212,0.03)_75%,rgba(6,182,212,0.03)_100%)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>

            {/* Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

            {/* Main Container */}
            <div className={`w-full max-w-lg mx-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Top Decoration Line */}
                <div className="flex justify-between items-end mb-2 px-2">
                    <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono tracking-widest uppercase">
                        <Activity size={14} className="animate-pulse" />
                        System Secure
                    </div>
                    <div className="text-neutral-600 text-[10px] font-mono tracking-widest">ID: ACCESS_GATE_01</div>
                </div>

                {/* Card Structure */}
                <div className="bg-neutral-900/50 backdrop-blur-md border border-white/15 p-1 relative overflow-hidden shadow-2xl clip-corner-tr">

                    {/* Decorative accents */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 blur-2xl pointer-events-none"></div>
                    <div className="absolute left-0 top-10 w-0.5 h-20 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="p-8 md:p-10 bg-black/20 relative z-10">
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter font-outfit uppercase flex items-center gap-3">
                                Identity <span className="text-cyan-500">.Logs</span>
                            </h1>
                            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent mb-4"></div>
                            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                                <ShieldCheck size={14} className="text-cyan-500" />
                                Required Authentication Level: 4
                            </p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2 group">
                                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 font-mono">User Identifier</label>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <Mail className="h-4 w-4 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="OPERATOR@KLAYTIC.SYS"
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-4 pl-12 pr-4 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    {/* Corner accents for input */}
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2 group">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono">Security Key</label>
                                </div>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••••••"
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-4 pl-12 pr-12 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-cyan-400 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    {/* Corner accents for input */}
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 font-bold py-4 px-6 mt-4 transition-all duration-300 uppercase tracking-widest font-mono text-sm flex items-center justify-between group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <>PROCESSING <Cpu className="animate-spin" size={16} /></>
                                    ) : (
                                        "Initiate Sequence"
                                    )}
                                </span>
                                <ArrowRight className={`h-4 w-4 relative z-10 transition-transform duration-300 ${isLoading ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'}`} />

                                {/* Button scanline effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>

                            {/* Alternate Auth Divider */}
                            <div className="relative my-6 group">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-800 group-hover:border-neutral-700 transition-colors"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-[#0a0a0a]/80 backdrop-blur px-2 text-neutral-600 font-mono tracking-widest group-hover:text-cyan-500/50 transition-colors">Alternate Protocol</span>
                                </div>
                            </div>

                            {/* Google Auth Button */}
                            <button
                                type="button"
                                onClick={handleGoogleLogin}
                                className="w-full bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-bold py-4 px-6 transition-all duration-300 uppercase tracking-widest font-mono text-xs flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <svg className="w-4 h-4 filter grayscale group-hover:grayscale-0 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Initialize Google Link</span>

                                {/* Corner accents */}
                                <div className="absolute bottom-0 left-0 w-1 h-1 bg-white/10 group-hover:bg-white/40 transition-colors"></div>
                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-white/40 transition-colors"></div>
                            </button>

                            {/* Forgot Password Link */}
                            <div className="text-center mt-6 flex w-full justify-between">
                                <Link href="#" className="text-[10px] text-neutral-500 hover:text-cyan-500 font-mono uppercase tracking-widest border-b border-transparent hover:border-cyan-500/50 pb-0.5 transition-all">
                                    Reset Security Credentials
                                </Link>
                                <Link href={'/auth/signup'} className="text-[10px] text-neutral-500 hover:text-cyan-500 font-mono uppercase tracking-widest border-b border-transparent hover:border-cyan-500/50 pb-0.5 transition-all">Existing Operator? Access Gate</Link>
                            </div>

                        </form>
                    </div>

                    {/* Bottom Status Bar on Card */}
                    <div className="h-1 w-full bg-neutral-900 relative">
                        {isLoading && <div className="absolute inset-0 bg-cyan-500 animate-pulse"></div>}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center flex justify-between items-center text-neutral-600 px-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest">Sys.Ver. 2.4.0</span>
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                        <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                        <span className="w-1 h-1 bg-cyan-900 rounded-full animate-pulse"></span>
                    </div>
                </div>

            </div>
        </div>
    );
}