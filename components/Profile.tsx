import React from 'react';
import { UserCircleIcon } from './icons';
import { UserProfile, TestResult } from '../types';
import { AVATARS } from './avatars';
import { TASKS } from '../constants';

interface ProfileProps {
    username: string;
    profile: UserProfile;
    testHistory: TestResult[];
    onAvatarChange: (id: number) => void;
}

const Profile: React.FC<ProfileProps> = ({ username, profile, testHistory, onAvatarChange }) => {
    
    const latestFullSim = testHistory
        .filter(t => t.testType === 'Full Simulation')
        .sort((a, b) => b.timestamp - a.timestamp)[0];

    const dreamScoreProgress = latestFullSim && profile.dreamScore ? (latestFullSim.totalScore / profile.dreamScore) * 100 : 0;
    
    const xpProgress = (profile.xp / profile.xpToNextLevel) * 100;
    
    const AvatarComponent = profile.avatarId !== undefined ? AVATARS[profile.avatarId] : UserCircleIcon;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8 flex flex-col sm:flex-row items-center text-center sm:text-left">
                 <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto sm:mx-0 sm:mr-8 flex-shrink-0 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <AvatarComponent className="w-full h-full text-slate-400 dark:text-slate-500" />
                </div>
                <div>
                    <h1 className="mt-4 sm:mt-0 text-4xl font-bold text-slate-900 dark:text-white">
                        {username}
                    </h1>
                    <p className="mt-2 text-slate-500 dark:text-slate-400">
                        Keep up the great work! Consistency is key to improving your SAT score.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Progress</h2>
                     <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">Level {profile.level}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">{profile.xp} / {profile.xpToNextLevel} XP</span>
                     </div>
                     <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-indigo-500 h-4 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                     </div>
                </div>
                 <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Dream Score</h2>
                     <div className="flex items-end justify-between mb-2">
                        <span className="font-bold text-green-600 dark:text-green-400 text-3xl">{latestFullSim ? latestFullSim.totalScore : 'N/A'}</span>
                        <span className="text-sm text-slate-500 dark:text-slate-400">/ {profile.dreamScore || 'Not Set'}</span>
                     </div>
                     <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 overflow-hidden">
                        <div className="bg-green-500 h-4 rounded-full transition-all duration-500" style={{ width: `${dreamScoreProgress > 100 ? 100 : dreamScoreProgress}%` }}></div>
                     </div>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Achievements</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                     {TASKS.map(task => {
                         const isCompleted = profile.completedTasks?.includes(task.id) ?? false;
                         return (
                             <div key={task.id} className={`p-4 rounded-lg flex items-start space-x-3 transition-colors ${isCompleted ? 'bg-green-100/80 dark:bg-green-900/40' : 'bg-slate-100/70 dark:bg-slate-900/50'}`}>
                                 <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                                     {isCompleted && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                 </div>
                                 <div>
                                    <p className={`font-semibold ${isCompleted ? 'text-green-800 dark:text-green-200' : 'text-slate-800 dark:text-slate-200'}`}>{task.description}</p>
                                    <p className={`text-sm ${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-slate-500'}`}>+ {task.xp} XP</p>
                                 </div>
                             </div>
                         )
                     })}
                 </div>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-8">
                 <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Choose Your Avatar</h2>
                 <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-12 gap-4 mt-4">
                    {AVATARS.map((Avatar, index) => (
                        <button
                            key={index}
                            onClick={() => onAvatarChange(index)}
                            className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-slate-800 transition-all transform hover:scale-110 ${profile.avatarId === index ? 'ring-2 ring-offset-2 ring-indigo-500 dark:ring-offset-slate-900' : ''}`}
                        >
                            <div className="rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                                <Avatar className="w-full h-full" />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;