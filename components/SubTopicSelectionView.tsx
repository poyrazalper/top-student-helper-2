
import React from 'react';
import { TopicInfo } from '../types';

interface SubTopicSelectionViewProps {
    topic: TopicInfo;
    onSelectSubTopic: (subTopicName: string) => void;
    onBack: () => void;
}

const SubTopicSelectionView: React.FC<SubTopicSelectionViewProps> = ({ topic, onSelectSubTopic, onBack }) => {
    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button
                onClick={onBack}
                className="mb-6 px-4 py-2 bg-slate-200/70 dark:bg-slate-700/70 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold"
            >
                &larr; Back to All Topics
            </button>

            <header className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 sm:p-8 mb-8 text-center">
                 <div className="flex items-center justify-center mb-4">
                    <topic.icon className="w-10 h-10 text-indigo-500 mr-4 flex-shrink-0" />
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{topic.name}</h1>
                </div>
                <p className="text-lg text-slate-600 dark:text-slate-400">{topic.description}</p>
            </header>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">Choose a lesson to start:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topic.subTopics?.map((subTopic) => (
                        <button
                            key={subTopic.name}
                            onClick={() => onSelectSubTopic(subTopic.name)}
                            className="w-full text-left p-4 bg-slate-50/70 dark:bg-slate-700/70 rounded-lg shadow-sm hover:shadow-md hover:bg-indigo-50/70 dark:hover:bg-indigo-900/40 transition-all duration-200 flex items-center"
                        >
                            <span className="flex-grow font-semibold text-slate-700 dark:text-slate-200">{subTopic.name}</span>
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubTopicSelectionView;