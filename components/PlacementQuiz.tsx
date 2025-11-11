import React, { useState, useEffect } from 'react';
import { Question } from '../types';
import { generatePlacementQuiz } from '../services/geminiService';
import { PLACEMENT_QUIZ_QUESTIONS_COUNT } from '../constants';

interface PlacementQuizProps {
    onQuizComplete: () => void;
}

const LoadingScreen: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <h2 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">Building Your Placement Quiz...</h2>
            <p className="mt-2 text-slate-600 dark:text-slate-400">This will help us tailor your experience.</p>
        </div>
    </div>
);

const ResultModal: React.FC<{ score: number, onContinue: () => void }> = ({ score, onContinue }) => {
    const percentage = Math.round((score / PLACEMENT_QUIZ_QUESTIONS_COUNT) * 100);
    let recommendation = '';
    if (percentage < 40) {
        recommendation = "It looks like you're just getting started. We recommend exploring the 'Topics' section to build a strong foundation in each subject area.";
    } else if (percentage < 70) {
        recommendation = "You have a solid base! We suggest using the 'Question Bank' to practice specific topics and strengthen your skills.";
    } else {
        recommendation = "You're off to a great start! You seem ready to challenge yourself with 'Mock Tests' to simulate the real exam experience.";
    }

    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-8 max-w-lg w-full text-center animate-fade-in">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quiz Complete!</h2>
                <p className="text-5xl font-bold my-4 text-indigo-600 dark:text-indigo-400">{percentage}%</p>
                <p className="text-slate-600 dark:text-slate-400 mb-6">{recommendation}</p>
                <button onClick={onContinue} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition-colors">
                    Start Prepping
                </button>
            </div>
        </div>
    );
};


const PlacementQuiz: React.FC<PlacementQuizProps> = ({ onQuizComplete }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [isFinished, setIsFinished] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const qs = await generatePlacementQuiz();
                setQuestions(qs);
                setAnswers(new Array(qs.length).fill(''));
            } catch (e) {
                console.error(e);
                alert("Failed to load the placement quiz. Please refresh the page to try again.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchQuiz();
    }, []);

    const handleAnswer = (answer: string) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQ] = answer;
            return newAnswers;
        });
    };
    
    if (isLoading) return <LoadingScreen />;

    if (isFinished) {
        const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
        return <ResultModal score={score} onContinue={onQuizComplete} />;
    }
    
    if (questions.length === 0 && !isLoading) {
         return (
             <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg rounded-xl shadow-lg">
                     <h2 className="text-2xl font-semibold text-red-500">Error</h2>
                     <p className="mt-2 text-slate-600 dark:text-slate-400">Could not load the quiz. Please check your connection and refresh.</p>
                </div>
            </div>
         );
    }
    
    const question = questions[currentQ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome! Let's see where you're at.</h1>
                    <p className="text-slate-600 dark:text-slate-400">This short quiz will help us guide your studies.</p>
                </div>

                <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Question {currentQ + 1} of {questions.length}</h2>
                    {question.passage && (
                        <div className="mb-4 p-3 bg-slate-100/70 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                           <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.passage}</p>
                        </div>
                    )}
                    <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 whitespace-pre-wrap">{question.question}</p>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(option)}
                                className={`w-full text-left p-4 rounded-lg border dark:border-slate-600 transition-colors duration-200 ${answers[currentQ] === option ? 'bg-indigo-200 dark:bg-indigo-900 border-indigo-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                            >
                                <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <button onClick={() => setCurrentQ(p => p - 1)} disabled={currentQ === 0} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50">Previous</button>
                    {currentQ < questions.length - 1 
                        ? <button onClick={() => setCurrentQ(p => p + 1)} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Next</button>
                        : <button onClick={() => setIsFinished(true)} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Finish Quiz</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default PlacementQuiz;