import React, { useState } from 'react';
import { UserProfile, Page } from '../types';

interface SettingsProps {
    profile: UserProfile;
    onProfileUpdate: (partialProfile: Partial<UserProfile>) => void;
    onNavigate: (page: Page) => void;
}

const Settings: React.FC<SettingsProps> = ({ profile, onProfileUpdate, onNavigate }) => {
    const [dreamScore, setDreamScore] = useState(profile.dreamScore || 1400);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        onProfileUpdate({ dreamScore: Number(dreamScore) });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Settings</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Manage your preferences and goals.</p>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Your Goal</h2>
                <div>
                    <label htmlFor="dream-score" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Set Your Dream SAT Score
                    </label>
                    <div className="mt-2 flex items-center">
                         <input
                            id="dream-score"
                            type="number"
                            min="400"
                            max="1600"
                            step="10"
                            value={dreamScore}
                            onChange={(e) => setDreamScore(Number(e.target.value))}
                            className="w-full max-w-xs px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white/70 dark:bg-slate-700/70"
                        />
                    </div>
                     <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">This will be displayed on your profile to track your progress.</p>
                </div>
            </div>
            
             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8 opacity-60">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Notifications</h2>
                <p className="text-slate-500 dark:text-slate-400">Notification preferences coming soon!</p>
            </div>

             <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8 opacity-60">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Default Test Parameters</h2>
                <p className="text-slate-500 dark:text-slate-400">Options to customize your practice tests are on the way!</p>
            </div>


            <div className="flex justify-end items-center">
                {saved && <span className="text-green-600 dark:text-green-400 mr-4">Settings saved!</span>}
                <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
};

export default Settings;