import React, { useState } from 'react';
import { AcademicCapIcon } from './icons';

interface LoginProps {
    onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleLoginClick = () => {
        // Password validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);

        if (username.trim() === '') {
            setError('Username cannot be empty.');
            return;
        }

        if (!hasUpperCase || !hasNumber) {
            setError('Password must contain at least one uppercase letter and one number.');
            return;
        }
        
        setError(null);
        onLogin(username);
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 space-y-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg">
                <div className="text-center">
                    <AcademicCapIcon className="w-16 h-16 mx-auto text-indigo-600 dark:text-indigo-400" />
                    <h1 className="mt-4 text-3xl font-extrabold text-slate-900 dark:text-white">
                        Welcome to SAT Prep Hub
                    </h1>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        Sign in to start your journey
                    </p>
                </div>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLoginClick(); }}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Username
                        </label>
                        <div className="mt-1">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password"className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Password
                        </label>
                        <div className="mt-1">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 dark:bg-slate-700/70 text-slate-900 dark:text-slate-100"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    
                    {error && (
                        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
                    )}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;