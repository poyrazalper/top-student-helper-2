import React, { useState, useRef, useEffect } from 'react';
import { Page, UserProfile } from '../types';
import CountdownTimer from './CountdownTimer';
import { Logo, UserCircleIcon } from './icons';
import { AVATARS } from './avatars';

interface HeaderProps {
    currentView: Page;
    onNavigate: (view: Page) => void;
    username: string | null;
    profile: UserProfile;
    onLogout: () => void;
}

const NavLink: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => {
    const activeClass = "bg-slate-200/80 dark:bg-slate-700/80 text-indigo-600 dark:text-indigo-400";
    const inactiveClass = "hover:bg-slate-200/50 dark:hover:bg-slate-700/50";
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-md font-semibold transition-colors text-sm ${isActive ? activeClass : inactiveClass}`}
        >
            {children}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ currentView, onNavigate, username, profile, onLogout }) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    
    const navItems: { view: Page, label: string }[] = [
        { view: 'topics', label: 'Topics' },
        { view: 'question-bank', label: 'Question Bank' },
        { view: 'mock-test', label: 'Mock Tests' },
        { view: 'statistics', label: 'Statistics' },
        { view: 'error-log', label: 'Error Log' },
        { view: 'flashcards', label: 'Flashcards' },
    ];
    
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    
    const AvatarComponent = profile.avatarId !== undefined ? AVATARS[profile.avatarId] : UserCircleIcon;

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur flex-none transition-colors duration-500 lg:z-50 lg:border-b lg:border-slate-900/10 dark:border-slate-50/[0.06] bg-white/80 dark:bg-slate-900/80">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-8">
                        <Logo />
                        <nav className="hidden md:flex items-center space-x-2">
                            {navItems.map(item => (
                                <NavLink
                                    key={item.view}
                                    isActive={currentView === item.view}
                                    onClick={() => onNavigate(item.view)}
                                >
                                    {item.label}
                                </NavLink>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden lg:block">
                           <CountdownTimer />
                        </div>
                        {username && (
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setIsProfileMenuOpen(prev => !prev)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors">
                                    <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-white font-bold overflow-hidden">
                                        <AvatarComponent className="w-full h-full" />
                                    </div>
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none py-2 animate-fade-in-fast">
                                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                                            <p className="text-sm font-semibold text-slate-900 dark:text-white" role="none">{username}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400" role="none">Level {profile.level}</p>
                                        </div>
                                        <div className="py-1">
                                            <button onClick={() => { onNavigate('profile'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Profile</button>
                                            <button onClick={() => { onNavigate('settings'); setIsProfileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Settings</button>
                                            <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700">Logout</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;