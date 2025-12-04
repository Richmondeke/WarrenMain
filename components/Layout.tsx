import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { NAV_ITEMS } from '../constants';
import { Role } from '../types';
import { 
  Menu, X, Bell, LogOut, Hexagon, Zap
} from 'lucide-react';
import { clsx } from 'clsx';

export const Layout: React.FC = () => {
  const { user, role, switchRole } = useUser();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [...NAV_ITEMS[role], ...NAV_ITEMS.COMMON];

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-200">
      {/* Sidebar - Desktop */}
      <aside className={clsx(
        "fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/50 backdrop-blur-2xl border-r border-white/5 transition-transform duration-300 md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <Hexagon className="text-white" size={24} fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Warren</h1>
          </div>

          {/* User Profile Snippet */}
          <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
            <img src={user.avatar_url} alt="Profile" className="w-10 h-10 rounded-full border border-blue-500/30" />
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-slate-400 truncate">{user.firm_name}</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={clsx(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Role Switcher */}
          <div className="mt-auto pt-6 border-t border-white/5">
             <button
              onClick={switchRole}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-medium shadow-lg shadow-blue-900/20 transition-all"
            >
              <Zap size={18} />
              Switch to {role === Role.INVESTOR ? 'Founder' : 'Investor'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Mobile Header */}
        <header className="h-16 flex items-center justify-between px-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md md:bg-transparent md:border-none z-40">
           <button 
            className="md:hidden text-slate-400"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X /> : <Menu />}
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scroll-smooth">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};