'use client'

import React from 'react';
import { LayoutDashboard, ListTodo, Box, Link2, UserCircle2, GraduationCap, Globe2, CreditCard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@/hooks/useUser';

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const { user, isLoading, isAuthenticated } = useUser();

  console.log("User data Sidebar:", user?.id);

  const isActive = (path: string) => pathname === path
    ? "text-cyan-400 bg-cyan-950/30 border-r-2 border-cyan-500"
    : "text-neutral-500 hover:text-white hover:bg-white/5 border-r-2 border-transparent";

  const NavItem = ({ to, icon: Icon, label }: { to: string, icon: any, label: string }) => (
    <Link
      href={to}
      className={`flex items-center justify-center p-4 my-1 transition-all duration-200 group relative ${isActive(to)}`}
    >
      <Icon size={20} className="shrink-0" />

      {/* Tooltip for fixed sidebar */}
      <div className="absolute left-16 bg-black border border-neutral-800 text-cyan-500 text-xs font-bold uppercase tracking-widest px-4 py-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-[0_0_10px_rgba(6,182,212,0.2)]">
        {label}
      </div>
    </Link>
  );

  return (
    <div
      className="w-20 bg-[#050505] border-r border-white/10 h-screen flex flex-col py-8 sticky top-0 z-50 backdrop-blur-md"
    >
      {/* Logo Area */}
      <div className="mb-12 px-2 flex items-center justify-center overflow-hidden relative">
        <div className={`w-12 h-12 flex items-center justify-center border border-white/20 bg-white/5 relative shrink-0 transition-all hover:border-white/50 group`}>
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {/* Changed K to White */}
          <span className="text-3xl font-bold text-white font-outfit">K</span>
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-white"></div>
          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-white"></div>
        </div>
      </div>

      <nav className="flex-1 flex flex-col w-full">
        <NavItem to={`/${user?.id}/dashboard`} icon={LayoutDashboard} label="Dashboard" />
        <NavItem to={`/${user?.id}/tasks`} icon={ListTodo} label="Tasks" />

        <div className="h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent mx-auto my-4 w-10"></div>

        <NavItem to={`/${user?.id}/career`} icon={GraduationCap} label="Career" />
        <NavItem to={`/${user?.id}/globe`} icon={Globe2} label="WORLD" />

        <div className="h-px bg-linear-to-r from-transparent via-neutral-800 to-transparent mx-auto my-4 w-10"></div>

        <NavItem to={`/${user?.id}/assets`} icon={Box} label="Files" />
        <NavItem to={`/${user?.id}/links`} icon={Link2} label="Links" />
      </nav>

      <div className="mt-auto flex flex-col w-full pt-6 border-t border-white/5">
        <NavItem to={`/${user?.id}/pricing`} icon={CreditCard} label="Upgrade" />
        <NavItem to={`/${user?.id}/profile`} icon={UserCircle2} label="Profile" />
      </div>
    </div>
  );
};

export default Sidebar;