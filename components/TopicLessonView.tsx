import React, { useState, useEffect } from 'react';
import { TopicInfo, Question, StructuredLesson } from '../types';
import { generateStructuredTopicLesson } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
);

const QuestionDisplay: React.FC<{ question: Question }> = ({ question }) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
    };
    
    const getButtonClass = (option: string) => {
        if (!isAnswered) return "bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600";
        if (option === question.correctAnswer) return "bg-green-200 dark:bg-green-800 border-green-500 text-green-800 dark:text-green-200";
        if (option === selectedAnswer) return "bg-red-200 dark:bg-red-800 border-red-500 text-red-800 dark:text-red-200";
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed";
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Concept Check</h2>
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                {question.passage && (
                    <div className="mb-4 p-3 bg-slate-100/70 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.passage}</p>
                    </div>
                )}
                <p className="font-medium text-slate-800 dark:text-slate-200 mb-4 whitespace-pre-wrap">{question.question}</p>
                <div className="space-y-3">
                    {question.options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(option)} disabled={isAnswered} className={`w-full text-left p-3 rounded-lg border dark:border-slate-600 transition-colors duration-200 ${getButtonClass(option)}`}>
                            <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                        </button>
                    ))}
                </div>
                {isAnswered && (
                    <div className="mt-4 p-4 bg-slate-100/70 dark:bg-slate-900/70 rounded-lg">
                        {selectedAnswer !== question.correctAnswer && (
                            <p className="font-semibold mb-2">The correct answer is: <strong className="text-green-700 dark:text-green-400">{question.correctAnswer}</strong></p>
                        )}
                        <h5 className="font-bold text-slate-800 dark:text-slate-200">Explanation:</h5>
                        <p className="mt-1 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{question.explanation}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

interface TopicLessonViewProps {
    lessonTopic: { mainTopic: TopicInfo; subTopic: string };
    onBack: () => void;
}

const TopicLessonView: React.FC<TopicLessonViewProps> = ({ lessonTopic, onBack }) => {
    const [lesson, setLesson] = useState<StructuredLesson | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLesson = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const lessonData = await generateStructuredTopicLesson(lessonTopic.mainTopic.name, lessonTopic.subTopic);
                setLesson(lessonData);
            } catch (err) {
                console.error("Failed to load topic lesson:", err);
                setError("Sorry, we couldn't load the lesson for this topic. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchLesson();
    }, [lessonTopic]);

    return (
        <div className="animate-fade-in max-w-4xl mx-auto">
            <button onClick={onBack} className="mb-6 px-4 py-2 bg-slate-200/70 dark:bg-slate-700/70 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors font-semibold">
                &larr; Back to Topics
            </button>

            <header className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6 sm:p-8 mb-8">
                <div className="flex items-center">
                    <lessonTopic.mainTopic.icon className="w-8 h-8 text-indigo-500 mr-4 flex-shrink-0" />
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{lessonTopic.subTopic}</h1>
                        <p className="text-slate-500 dark:text-slate-400">{lessonTopic.mainTopic.name}</p>
                    </div>
                </div>
            </header>

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500 my-8 bg-red-100/80 dark:bg-red-900/80 backdrop-blur-md p-4 rounded-lg">{error}</p>}
            
            {lesson && (
                <div className="space-y-12">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6">
                         <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap text-lg leading-relaxed">{lesson.introduction}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Key Concepts</h2>
                        <div className="space-y-6">
                        {lesson.keyConcepts.map(concept => (
                            <div key={concept.title} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{concept.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{concept.content}</p>
                            </div>
                        ))}
                        </div>
                    </div>

                    {lesson.workedExample && (
                         <div>
                            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Worked Example</h2>
                            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-6">
                                <div className="border-b border-slate-200 dark:border-slate-700 pb-4 mb-4">
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Problem:</h4>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{lesson.workedExample.problem}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">Solution:</h4>
                                    <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{lesson.workedExample.solution}</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {lesson.commonMistakes.length > 0 && (
                        <div>
                             <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Common Mistakes to Avoid</h2>
                             <div className="space-y-6">
                                {lesson.commonMistakes.map((item, index) => (
                                    <div key={index} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md overflow-hidden">
                                        <div className="p-6">
                                            <h4 className="font-semibold text-red-600 dark:text-red-400 mb-2">Mistake:</h4>
                                            <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{item.mistake}</p>
                                            <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">Correction:</h4>
                                            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{item.correction}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {lesson.conceptCheckQuestion && <QuestionDisplay question={lesson.conceptCheckQuestion} />}
                </div>
            )}
        </div>
    );
};

export default TopicLessonView;