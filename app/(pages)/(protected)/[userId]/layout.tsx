// app/auth/layout.tsx

import AtmosphericBackground from '@/components/AtmosphericBackground';
import Companion from '@/components/Companion';
import Sidebar from '@/components/Sidebar';
import React from 'react';

// This layout will apply to all pages inside the /auth route segment
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We only include the essential styling wrappers, but NO Sidebar or Companion.
    return (
        <div className="flex min-h-screen bg-[#030303] text-neutral-300 font-sans selection:bg-cyan-500/20 selection:text-cyan-200 relative overflow-hidden">

            <AtmosphericBackground />

            {/* Now unconditionally rendered for all non-auth pages: */}
            <Sidebar />

            <main className="flex-1 overflow-y-auto h-screen relative scroll-smooth z-10">
                {children}
            </main>

            <Companion />
        </div>
    );
}