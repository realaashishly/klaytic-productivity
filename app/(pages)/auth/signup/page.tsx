'use client'
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ShieldCheck, Activity, Cpu, User, AlertCircle } from 'lucide-react';
import { handleGoogleAuth } from '../authService';
import { authClient } from '@/lib/better-auth/auth-client';
import { redirect } from 'next/navigation';

export default function SignupPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // NEW STATE: For Confirm Password and Error Feedback
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [UserSignUp, setUserSignUp] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        setMounted(true);
    }, []);

    // Validation Check: Clear error when passwords start matching again
    useEffect(() => {
        if (passwordError && UserSignUp.password === confirmPassword) {
            setPasswordError("");
        }
    }, [UserSignUp.password, confirmPassword, passwordError]);


    const handleSignup = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (UserSignUp.password !== confirmPassword) {
            setPasswordError("PASSKEY MISMATCH: Confirmation passkey does not match the set passkey.");
            return;
        }

        if (UserSignUp.password.length < 6) {
            setPasswordError("PASSKEY WEAK: Passkey must be at least 6 characters.");
            return;
        }

        setPasswordError("");

        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2500);


        const { data, error } = await authClient.signUp.email({
            name: UserSignUp.name,
            email: UserSignUp.email,
            password: UserSignUp.password,
            callbackURL: "/",
        }, {
            onRequest: (ctx) => {
                //show loading
            },
            onSuccess: (ctx) => {
                //redirect to the dashboard or sign in page
                redirect("/");
            },
            onError: (ctx) => {
                // display the error message
                alert(ctx.error.message);
            },
        });

        return { data, error };
    }

    const handleGoogleSignup = async () => {
        setIsLoading(true);

        const data = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/",
            errorCallbackURL: "/error",
            newUserCallbackURL: "/welcome",
        });

        setIsLoading(false);
    }

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

            {/* Ambient Background - Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.03)_25%,rgba(6,182,212,0.03)_50%,transparent_50%,transparent_75%,rgba(6,182,212,0.03)_75%,rgba(6,182,212,0.03)_100%)] bg-size-[20px_20px] opacity-20 pointer-events-none"></div>

            {/* Background Glows */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-900/20 rounded-full blur-[128px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[128px] pointer-events-none" />

            {/* Main Container */}
            <div className={`w-full max-w-lg mx-4 transition-all duration-1000 scale-95 md:scale-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

                {/* Top Decoration Line */}
                <div className="flex justify-between items-end mb-2 px-2">
                    <div className="flex items-center gap-2 text-cyan-500 text-xs font-mono tracking-widest uppercase">
                        <Activity size={14} className="animate-pulse" />
                        System Enrollment
                    </div>
                    <div className="text-neutral-600 text-[10px] font-mono tracking-widest">ID: REGISTRY_NODE_04</div>
                </div>

                {/* Card Structure */}
                <div className="bg-neutral-900/50 backdrop-blur-md border border-white/15 p-1 relative overflow-hidden shadow-2xl clip-corner-tr">

                    {/* Decorative accents */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 blur-2xl pointer-events-none"></div>
                    <div className="absolute left-0 top-10 w-0.5 h-20 bg-linear-to-b from-transparent via-cyan-500/50 to-transparent"></div>

                    <div className="p-6 md:p-8 bg-black/20 relative z-10">
                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tighter font-outfit uppercase flex items-center gap-3">
                                New <span className="text-cyan-500">.Operator</span>
                            </h1>
                            <div className="h-px w-full bg-linear-to-r from-cyan-500/50 to-transparent mb-3"></div>
                            <p className="text-neutral-400 text-xs font-mono uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle size={14} className="text-cyan-500" />
                                Clearance Level: Unassigned
                            </p>
                        </div>

                        <form onSubmit={handleSignup} className="space-y-3">

                            {/* Name Field */}
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 font-mono">Identity Tag</label>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <User className="h-4 w-4 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        placeholder="FULL NAME"
                                        value={UserSignUp.name}
                                        onChange={(e) => setUserSignUp({ ...UserSignUp, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-12 pr-4 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 font-mono">Comm Channel</label>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <Mail className="h-4 w-4 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        placeholder="EMAIL@ADDRESS.COM"
                                        value={UserSignUp.email}
                                        onChange={(e) => setUserSignUp({ ...UserSignUp, email: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-12 pr-4 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 font-mono">Set Passkey</label>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <Lock className="h-4 w-4 text-neutral-500 group-focus-within:text-cyan-400 transition-colors" />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••••••"
                                        value={UserSignUp.password}
                                        onChange={(e) => setUserSignUp({ ...UserSignUp, password: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-12 pr-12 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-cyan-400 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Confirm Password Field (FIXED) */}
                            <div className="space-y-1 group">
                                <label className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest ml-1 font-mono">Verify Passkey</label>
                                <div className="relative transition-all duration-300 focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-20">
                                        <ShieldCheck className={`h-4 w-4 transition-colors ${UserSignUp.password && UserSignUp.password === confirmPassword ? 'text-green-500' : 'text-neutral-500 group-focus-within:text-cyan-400'}`} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        placeholder="••••••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 rounded-none py-3 pl-12 pr-12 text-white placeholder:text-neutral-700 font-mono text-sm focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-950/10 transition-all duration-300 hover:border-white/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-neutral-600 hover:text-cyan-400 transition-colors focus:outline-none"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20 group-focus-within:border-cyan-500 transition-colors"></div>
                                </div>
                            </div>

                            {/* Password Error Display */}
                            {passwordError && (
                                <div className="text-xs font-mono uppercase tracking-widest text-red-500 ml-1 flex items-center gap-2 pt-1 pb-2">
                                    <AlertCircle size={14} className="text-red-500" />
                                    {passwordError}
                                </div>
                            )}


                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-cyan-600/10 hover:bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 hover:border-cyan-400 font-bold py-3 px-6 mt-2 transition-all duration-300 uppercase tracking-widest font-mono text-sm flex items-center justify-between group relative overflow-hidden"
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    {isLoading ? (
                                        <>ENCRYPTING <Cpu className="animate-spin" size={16} /></>
                                    ) : (
                                        "Initialize"
                                    )}
                                </span>
                                <ArrowRight className={`h-4 w-4 relative z-10 transition-transform duration-300 ${isLoading ? 'translate-x-10 opacity-0' : 'group-hover:translate-x-1'}`} />
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-cyan-500/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                            </button>

                            {/* Alternate Auth Divider */}
                            <div className="relative my-4 group">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-neutral-800 group-hover:border-neutral-700 transition-colors"></div>
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase">
                                    <span className="bg-[#0a0a0a]/80 backdrop-blur px-2 text-neutral-600 font-mono tracking-widest group-hover:text-cyan-500/50 transition-colors">Quick Link</span>
                                </div>
                            </div>

                            {/* Google Auth Button */}
                            <button
                                type="button"
                                onClick={handleGoogleSignup}
                                className="w-full bg-neutral-900/50 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white font-bold py-3 px-6 transition-all duration-300 uppercase tracking-widest font-mono text-xs flex items-center justify-center gap-3 relative overflow-hidden group"
                            >
                                <svg className="w-4 h-4 filter grayscale group-hover:grayscale-0 transition-all duration-300" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                <span>Initialize Google Link</span>
                                <div className="absolute bottom-0 left-0 w-1 h-1 bg-white/10 group-hover:bg-white/40 transition-colors"></div>
                                <div className="absolute top-0 right-0 w-1 h-1 bg-white/10 group-hover:bg-white/40 transition-colors"></div>
                            </button>

                            {/* Back to Login */}
                            <div className="text-center mt-4">
                                <a href="/auth/login" className="text-[10px] text-neutral-500 hover:text-cyan-500 font-mono uppercase tracking-widest border-b border-transparent hover:border-cyan-500/50 pb-0.5 transition-all">
                                    Existing Operator? Access Gate
                                </a>
                            </div>

                        </form>
                    </div>

                    {/* Bottom Status Bar on Card */}
                    <div className="h-1 w-full bg-neutral-900 relative">
                        {isLoading && <div className="absolute inset-0 bg-cyan-500 animate-pulse"></div>}
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-4 text-center flex justify-between items-center text-neutral-600 px-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest">Sys.Ver. 2.4.0</span>
                    <div className="flex gap-1">
                        <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
                        <span className="w-1 h-1 bg-cyan-900 rounded-full animate-pulse"></span>
                    </div>
                </div>

            </div>
        </div>
    );


};

// Make the function asynchronous
// const handleGoogleSignup = async () => {

//     setIsLoading(true);

//     try {
//         const googledata = await handleGoogleAuth();

//         console.log('googledata - ', googledata);


//     } catch (error) {
//         console.error("Google Signup failed:", error);
//     } finally {
//         setIsLoading(false);
//     }
// };


