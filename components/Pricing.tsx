
import React from 'react';
import { Cpu, Globe2, Zap, Shield, Bot, ChevronRight, CreditCard } from 'lucide-react';
import Link from 'next/link';

const Pricing: React.FC = () => {
    return (
        <div className="min-h-screen w-full bg-[#030303] flex flex-col items-center justify-center relative overflow-hidden animate-in fade-in p-8">

            {/* Algorithmic Art Background (Red Tinted) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-0 w-full h-full bg-[#030303]"></div>
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="algoGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#dc2626" strokeWidth="0.5" />
                            <circle cx="20" cy="20" r="1" fill="#ffffff" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#algoGrid)" />
                    <circle cx="50%" cy="50%" r="300" fill="url(#algoGrid)" stroke="#dc2626" strokeWidth="1" opacity="0.3" />
                    <line x1="0" y1="0" x2="100%" y2="100%" stroke="#dc2626" strokeWidth="1" opacity="0.1" />
                    <line x1="100%" y1="0" x2="0" y2="100%" stroke="#ffffff" strokeWidth="1" opacity="0.1" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-transparent"></div>
            </div>

            <div className="text-center mb-20 relative z-10 max-w-4xl mx-auto">
                <div className="inline-block mb-4 px-4 py-1 rounded-none border border-red-600 bg-red-950/30 text-red-500 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                    System Override
                </div>
                <h1 className="text-7xl md:text-8xl font-bold text-white mb-8 tracking-tighter font-outfit">
                    FULL <span className="text-red-600">ACCESS</span>
                </h1>
                <p className="text-neutral-400 text-xl font-light max-w-2xl mx-auto leading-relaxed font-mono">
                    Unlock the complete capability of the Klaytic Neural Net.
                </p>
            </div>

            <div className="relative z-10 w-full max-w-md group">
                {/* Glow Effect (Red) */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-white to-red-900 rounded-none blur opacity-40 group-hover:opacity-80 transition-opacity duration-700"></div>

                <div className="relative bg-[#050505] p-1">
                    <div className="bg-black border border-red-900/50 p-10 overflow-hidden relative">

                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                        {/* Red Accent Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>

                        {/* Header */}
                        <div className="relative z-10 flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-bold text-white font-outfit uppercase tracking-wide">Operator</h2>
                                <p className="text-red-600 text-xs uppercase tracking-[0.3em] font-bold mt-2">Level 5 Access</p>
                            </div>
                            <div className="w-12 h-12 bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                                <Bot size={24} className="text-black" />
                            </div>
                        </div>

                        {/* Price */}
                        <div className="relative z-10 flex items-baseline gap-2 mb-10 pb-10 border-b border-white/10">
                            <span className="text-7xl font-bold text-red-600 font-outfit tracking-tight">$10</span>
                            <span className="text-neutral-500 font-medium uppercase tracking-wider text-sm">/ month</span>
                        </div>

                        {/* Features List */}
                        <div className="relative z-10 space-y-6 mb-12">
                            {[
                                { icon: Cpu, text: "Gemini 3 Pro Engine", sub: "Advanced Reasoning" },
                                { icon: Globe2, text: "50 World Map Credits", sub: "Planetary Intel" },
                                { icon: Zap, text: "Image Generation", sub: "Nano Banana & Imagen" },
                                { icon: Shield, text: "Secure Vault", sub: "Encrypted Storage" },
                            ].map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 group/item">
                                    <div className="w-10 h-10 bg-neutral-900 flex items-center justify-center border border-neutral-800 text-neutral-400 group-hover/item:text-white group-hover/item:border-red-600 group-hover/item:bg-red-600 group-hover/item:text-black transition-all shrink-0">
                                        <feature.icon size={18} />
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-white">{feature.text}</div>
                                        <div className="text-xs text-neutral-500 font-mono uppercase mt-0.5">{feature.sub}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* CTA Button */}
                        <button className="relative z-10 w-full py-5 bg-red-600 text-white font-bold text-sm uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)] flex items-center justify-center gap-3 group/btn rounded-none">
                            <span>Upgrade Now</span>
                            <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="relative z-10 mt-6 flex justify-center items-center gap-6 opacity-50">
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest">
                                <CreditCard size={12} /> Secure
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-neutral-400 uppercase tracking-widest">
                                <Shield size={12} /> Cancel Anytime
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-16 relative z-10">
                <Link href="/" className="text-neutral-500 hover:text-red-500 text-xs font-bold uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-red-500 pb-1">
                    Return to Dashboard
                </Link>
            </div>

        </div>
    );
};

export default Pricing;
