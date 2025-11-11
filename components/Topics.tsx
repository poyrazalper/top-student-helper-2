
import React, { useState } from 'react';
import { SAT_TOPIC_CATEGORIES } from '../constants';
import { TopicInfo } from '../types';

const PlacementQuizPrompt: React.FC<{ onStart: () => void; onDismiss: () => void }> = ({ onStart, onDismiss }) => (
    <div className="bg-indigo-500/80 backdrop-blur-md text-white rounded-lg shadow-lg p-6 mb-12 flex items-center justify-between border border-indigo-400/50">
        <div>
            <h2 className="text-2xl font-bold">Ready to find your starting point?</h2>
            <p className="mt-1">Take a short placement quiz to get personalized recommendations.</p>
        </div>
        <div className="flex-shrink-0 ml-4">
            <button
                onClick={onStart}
                className="px-5 py-2 bg-white text-indigo-600 font-semibold rounded-md shadow-sm hover:bg-indigo-50 transition-colors duration-200"
            >
                Start Quiz
            </button>
            <button
                onClick={onDismiss}
                className="ml-2 px-3 py-2 text-white font-semibold rounded-md hover:bg-indigo-400/50 transition-colors"
            >
                Later
            </button>
        </div>
    </div>
);

interface TopicsProps {
    onSelectTopic: (topic: TopicInfo) => void;
    showPlacementPrompt: boolean;
    onStartPlacementQuiz: () => void;
}

const Topics: React.FC<TopicsProps> = ({ onSelectTopic, showPlacementPrompt, onStartPlacementQuiz }) => {
    const [promptDismissed, setPromptDismissed] = useState(false);

    return (
        <div className="animate-fade-in">
            {showPlacementPrompt && !promptDismissed && (
                <PlacementQuizPrompt onStart={onStartPlacementQuiz} onDismiss={() => setPromptDismissed(true)} />
            )}

            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Explore SAT Topics</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
                    Build a strong foundation by reviewing key concepts for each section of the SAT.
                </p>
            </div>

            <div className="space-y-10">
                {SAT_TOPIC_CATEGORIES.map((category) => (
                    <div key={category.categoryName}>
                        <div className="flex items-center mb-4">
                            <category.icon className="w-8 h-8 text-indigo-500 mr-3" />
                            <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-200">{category.categoryName}</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {category.topics.map((topic) => (
                                <div key={topic.name} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300">
                                    <div>
                                        <div className="flex items-center mb-3">
                                            <topic.icon className="w-6 h-6 text-indigo-500 mr-3" />
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{topic.name}</h3>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-400 mb-4">{topic.description}</p>
                                    </div>
                                    <button
                                        onClick={() => onSelectTopic(topic)}
                                        className="mt-auto self-start px-4 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition-colors duration-200"
                                    >
                                        Learn Topic
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Topics;
