import React, { useMemo } from 'react';
import { TestResult, FlashcardResult } from '../types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// FIX: Removed non-existent Squares2X2Icon from imports.
import { BookOpenIcon, CalculatorIcon, AcademicCapIcon } from './icons';

interface StatisticsProps {
    testHistory: TestResult[];
    flashcardHistory: FlashcardResult[];
}

const ChartContainer: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{title}</h3>
        <div className="w-full h-80">
            {children}
        </div>
    </div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-md text-white text-sm">
          <p className="label">{`Date: ${new Date(label).toLocaleDateString()}`}</p>
          <p className="intro">{`${payload[0].name}: ${payload[0].value}${payload[0].unit || ''}`}</p>
          <p className="desc">{`Test Type: ${payload[0].payload.testType}`}</p>
        </div>
      );
    }
    return null;
};


const Statistics: React.FC<StatisticsProps> = ({ testHistory, flashcardHistory }) => {

    const fullSimHistory = useMemo(() => 
        testHistory
            .filter(t => t.testType === 'Full Simulation')
            .sort((a, b) => a.timestamp - b.timestamp), 
        [testHistory]
    );
    
    const quickTestHistory = useMemo(() => 
        testHistory
            .filter(t => t.testType === 'Quick')
            .sort((a, b) => a.timestamp - b.timestamp), 
        [testHistory]
    );

    const topicPerformanceData = useMemo(() => {
        const performance: { [topic: string]: { correct: number, total: number, count: number } } = {};
        testHistory.forEach(result => {
            result.answers.forEach(answer => {
                const topic = answer.question.topic;
                if (!performance[topic]) {
                    performance[topic] = { correct: 0, total: 0, count: 0 };
                }
                performance[topic].total++;
                if (answer.isCorrect) {
                    performance[topic].correct++;
                }
            });
        });
        return Object.entries(performance)
            .map(([topic, data]) => ({
                name: topic,
                accuracy: Math.round((data.correct / data.total) * 100),
            }))
            .sort((a,b) => a.accuracy - b.accuracy);
    }, [testHistory]);

    const overallStats = useMemo(() => {
        const totalTests = testHistory.length;
        const totalFlashcards = flashcardHistory.reduce((acc, curr) => acc + curr.total, 0);
        const avgScore = totalTests > 0 ? testHistory.reduce((acc, curr) => acc + curr.totalScore, 0) / totalTests : 0;
        const avgFlashcardScore = flashcardHistory.length > 0 ? (flashcardHistory.reduce((acc, curr) => acc + curr.score, 0) / flashcardHistory.reduce((acc, curr) => acc + curr.total, 1)) * 100 : 0;

        return {
            totalTests,
            totalFlashcards,
            avgScore: testHistory.some(t=> t.testType === 'Full Simulation') ? Math.round(avgScore) : `${Math.round(avgScore)}%`,
            avgFlashcardScore: `${Math.round(avgFlashcardScore)}%`
        }
    }, [testHistory, flashcardHistory]);

    if (testHistory.length === 0 && flashcardHistory.length === 0) {
        return (
            <div className="text-center py-16 animate-fade-in">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Statistics</h1>
                <p className="mt-4 text-slate-500 dark:text-slate-400">No data available yet. Complete a test or a flashcard deck to see your stats!</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Your Statistics</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Track your progress and identify areas for improvement.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-md flex items-center">
                    <AcademicCapIcon className="w-10 h-10 text-indigo-500 mr-4" />
                    <div>
                        <p className="text-3xl font-bold">{overallStats.totalTests}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Tests Completed</p>
                    </div>
                 </div>
                 <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-md flex items-center">
                    {/* FIX: Replaced missing Squares2X2Icon with BookOpenIcon for consistency. */}
                    <BookOpenIcon className="w-10 h-10 text-pink-500 mr-4" />
                     <div>
                        <p className="text-3xl font-bold">{overallStats.totalFlashcards}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Flashcards Studied</p>
                    </div>
                 </div>
                 <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-md flex items-center">
                    <CalculatorIcon className="w-10 h-10 text-green-500 mr-4" />
                     <div>
                        <p className="text-3xl font-bold">{overallStats.avgScore}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Average Test Score</p>
                    </div>
                 </div>
                 <div className="bg-white/60 dark:bg-slate-800/60 p-6 rounded-lg shadow-md flex items-center">
                    <BookOpenIcon className="w-10 h-10 text-blue-500 mr-4" />
                     <div>
                        <p className="text-3xl font-bold">{overallStats.avgFlashcardScore}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Avg. Flashcard Score</p>
                    </div>
                 </div>
            </div>

            {fullSimHistory.length > 1 && (
                <ChartContainer title="Full Simulation Score Over Time">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={fullSimHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="timestamp" stroke="#64748b" fontSize={12} tickFormatter={(time) => new Date(time).toLocaleDateString()} />
                            <YAxis stroke="#64748b" fontSize={12} domain={[400, 1600]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="totalScore" stroke="#8884d8" name="Total Score" activeDot={{ r: 8 }} />
                            <Line type="monotone" dataKey="englishScore" stroke="#82ca9d" name="English" />
                            <Line type="monotone" dataKey="mathScore" stroke="#ffc658" name="Math" />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}

            {quickTestHistory.length > 1 && (
                <ChartContainer title="Quick Test Score Over Time">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={quickTestHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis dataKey="timestamp" stroke="#64748b" fontSize={12} tickFormatter={(time) => new Date(time).toLocaleDateString()} />
                            <YAxis stroke="#64748b" fontSize={12} domain={[0, 100]} unit="%" />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line type="monotone" dataKey="totalScore" stroke="#38bdf8" name="Score" unit="%" activeDot={{ r: 8 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}

            {topicPerformanceData.length > 0 && (
                 <ChartContainer title="Accuracy by Topic (All Tests)">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topicPerformanceData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                            <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={12} />
                            <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={12} width={150} />
                            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', color: '#e2e8f0', fontSize: '12px' }} formatter={(value) => `${value}%`} />
                            <Bar dataKey="accuracy" fill="#818cf8" name="Accuracy" unit="%" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            )}

        </div>
    );
};

export default Statistics;