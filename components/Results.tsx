import React, { useMemo } from 'react';
import { TestResult, Page } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ResultsProps {
    result: TestResult | null;
    onNavigate: (view: Page) => void;
}

const Results: React.FC<ResultsProps> = ({ result, onNavigate }) => {
    
    const topicPerformanceData = useMemo(() => {
        if (!result) return [];
        const performance: { [topic: string]: { correct: number, total: number } } = {};
        result.answers.forEach(answer => {
            const topic = answer.question.topic;
            if (!performance[topic]) {
                performance[topic] = { correct: 0, total: 0 };
            }
            performance[topic].total++;
            if (answer.isCorrect) {
                performance[topic].correct++;
            }
        });
        return Object.entries(performance).map(([topic, data]) => ({
            name: topic,
            accuracy: Math.round((data.correct / data.total) * 100),
        }));
    }, [result]);

    if (!result) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold">No test result available.</h1>
                <button onClick={() => onNavigate('mock-test')} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-md">Take a Test</button>
            </div>
        );
    }
    
    const isFullSim = result.testType === 'Full Simulation';

    return (
        <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{isFullSim ? 'Full Simulation' : 'Quick Test'} Results</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Here's how you performed on your latest test.</p>
            </div>

            <div className={`grid grid-cols-1 ${isFullSim ? 'md:grid-cols-3' : 'md:grid-cols-1'} gap-6 text-center`}>
                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                    <p className="text-6xl font-bold text-indigo-600 dark:text-indigo-400">{result.totalScore}</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-700 dark:text-slate-300">Total Score {isFullSim ? '/ 1600' : '/ 100'}</h2>
                </div>
                {isFullSim && (
                    <>
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                            <p className="text-4xl font-bold">{result.englishScore}</p>
                            <h2 className="mt-2 font-semibold text-slate-700 dark:text-slate-300">English Score</h2>
                        </div>
                        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                            <p className="text-4xl font-bold">{result.mathScore}</p>
                            <h2 className="mt-2 font-semibold text-slate-700 dark:text-slate-300">Math Score</h2>
                        </div>
                    </>
                )}
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Performance by Topic</h3>
                <div className="w-full h-80">
                     <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topicPerformanceData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                            <YAxis stroke="#64748b" fontSize={12} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#e2e8f0', fontSize: '12px' }} />
                            <Legend />
                            <Bar dataKey="accuracy" fill="#818cf8" name="Accuracy" unit="%" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Next Steps</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <button onClick={() => onNavigate('error-log')} className="p-4 bg-red-100/70 dark:bg-red-900/40 rounded-lg text-red-800 dark:text-red-200 hover:bg-red-200/70 dark:hover:bg-red-900/60 text-left transition-colors">
                        <h4 className="font-bold">Review Mistakes</h4>
                        <p className="text-sm">Go to your Error Log to see what you got wrong and why.</p>
                    </button>
                    <button onClick={() => onNavigate('mock-test')} className="p-4 bg-indigo-100/70 dark:bg-indigo-900/40 rounded-lg text-indigo-800 dark:text-indigo-200 hover:bg-indigo-200/70 dark:hover:bg-indigo-900/60 text-left transition-colors">
                        <h4 className="font-bold">Take Another Test</h4>
                        <p className="text-sm">Challenge yourself with another mock test to keep improving.</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Results;
