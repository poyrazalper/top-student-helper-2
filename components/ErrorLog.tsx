import React, { useState, useMemo } from 'react';
import { IncorrectQuestion, Question, TestResult } from '../types';
import { regenerateMistakeQuestions } from '../services/geminiService';

const ErrorLog: React.FC<{
    errorLog: IncorrectQuestion[];
    onStartCustomTest: (questions: Question[], isRetake: boolean) => void;
}> = ({ errorLog, onStartCustomTest }) => {
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [activeTab, setActiveTab] = useState<'All' | 'Mock Test' | 'Question Bank' | 'Flashcard'>('All');

    const handleToggle = (index: number) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };
    
    const handleStartTest = async () => {
        if (errorLog.length === 0) return;
        setIsRegenerating(true);
        try {
            const newQuestions = await regenerateMistakeQuestions(errorLog.filter(e => e.source !== 'Flashcard'));
            if (newQuestions.length > 0) {
                onStartCustomTest(newQuestions, true);
            } else {
                alert("No question-based mistakes to retake!");
            }
        } catch(e) {
            console.error(e);
            alert("Failed to regenerate questions for your retake test. Please try again.");
        } finally {
            setIsRegenerating(false);
        }
    };

    const filteredErrors = useMemo(() => {
        if (activeTab === 'All') return errorLog;
        return errorLog.filter(e => e.source === activeTab);
    }, [errorLog, activeTab]);

    const TabButton: React.FC<{tabName: typeof activeTab}> = ({ tabName }) => {
        const isActive = activeTab === tabName;
        const count = tabName === 'All' ? errorLog.length : errorLog.filter(e => e.source === tabName).length;
        if (count === 0 && tabName !== 'All') return null;

        return (
            <button
                onClick={() => setActiveTab(tabName)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-200/70 dark:bg-slate-700/70 hover:bg-slate-300 dark:hover:bg-slate-600'}`}
            >
                {tabName} ({count})
            </button>
        )
    };

    if (errorLog.length === 0) {
        return (
            <div className="animate-fade-in text-center py-16">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Error Log</h1>
                <p className="mt-4 text-green-600 dark:text-green-400 font-semibold">Congratulations! Your error log is empty.</p>
            </div>
        );
    }
    
    const questionBasedErrorsCount = errorLog.filter(e => e.source !== 'Flashcard').length;

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Error Log</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Review your past mistakes and retake them in a custom test.</p>
            </div>

            {questionBasedErrorsCount > 0 && (
                <div className="mb-8 text-center">
                    <button
                        onClick={handleStartTest}
                        disabled={isRegenerating}
                        className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition-colors duration-200 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center justify-center mx-auto"
                    >
                        {isRegenerating && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>}
                        {isRegenerating ? 'Preparing Your Test...' : `Retake Mistakes (${questionBasedErrorsCount} Questions)`}
                    </button>
                </div>
            )}
            
            <div className="mb-6 flex justify-center space-x-2">
                <TabButton tabName="All" />
                <TabButton tabName="Mock Test" />
                <TabButton tabName="Question Bank" />
                <TabButton tabName="Flashcard" />
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md">
                {filteredErrors.length > 0 ? (
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {filteredErrors.map((item, index) => (
                            <li key={item.timestamp + index} className="p-4 sm:p-6">
                                <div className="flex justify-between items-start cursor-pointer" onClick={() => handleToggle(index)}>
                                    <div className="flex-1">
                                        <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs font-medium px-2 py-1 rounded-full mb-2">{item.question.topic}</span>
                                        <p className="font-medium text-slate-800 dark:text-slate-200">{item.question.question}</p>
                                    </div>
                                    <div className="ml-4 flex-shrink-0">
                                        <svg className={`w-5 h-5 text-slate-500 transform transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>
                                {expandedIndex === index && (
                                    <div className="mt-4 pl-4 border-l-2 border-indigo-500">
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            <strong>Your Answer:</strong> {item.userAnswer}
                                        </p>
                                        <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                            <strong>Correct Answer:</strong> {item.question.correctAnswer}
                                        </p>
                                        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                                            <p className="text-sm text-slate-600 dark:text-slate-400 whitespace-pre-wrap">
                                                <strong>Explanation:</strong> {item.question.explanation}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="p-8 text-center text-slate-500 dark:text-slate-400">No mistakes in this category. Well done!</p>
                )}
            </div>
        </div>
    );
};

export default ErrorLog;