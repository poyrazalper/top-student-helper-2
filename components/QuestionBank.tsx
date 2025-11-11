import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { Question } from '../types';
import { SAT_TOPIC_CATEGORIES } from '../constants';
import { generateSatQuestionBatch, getMistakeFeedback, generateQuickPracticeQuiz } from '../services/geminiService';

type Difficulty = 'Easy' | 'Medium' | 'Hard';

interface QuestionBankProps {
    addToErrorLog: (question: Question, userAnswer: string, source: 'Question Bank') => void;
}

const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
    </div>
);

const QuestionDisplay: React.FC<{ question: Question; onAnswer: (answer: string, isCorrect: boolean) => void; selectedAnswer: string | null; isAnswered: boolean; }> = ({ question, onAnswer, selectedAnswer, isAnswered }) => {
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

    useEffect(() => {
        setFeedback(null);
    }, [question]);

    const handleAnswerClick = async (option: string) => {
        const isCorrect = option === question.correctAnswer;
        onAnswer(option, isCorrect);
        if (!isCorrect) {
            setIsFeedbackLoading(true);
            try {
                const mistakeFeedback = await getMistakeFeedback(question, option);
                setFeedback(mistakeFeedback);
            } catch (err) {
                console.error("Failed to get feedback", err);
                setFeedback("Could not load feedback for this mistake.");
            } finally {
                setIsFeedbackLoading(false);
            }
        }
    };

    const getButtonClass = (option: string) => {
        if (!isAnswered) return "bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600";
        if (option === question.correctAnswer) return "bg-green-200 dark:bg-green-800 border-green-500 text-green-800 dark:text-green-200";
        if (option === selectedAnswer) return "bg-red-200 dark:bg-red-800 border-red-500 text-red-800 dark:text-red-200";
        return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed";
    };

    return (
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
            <span className="inline-block bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-medium px-3 py-1 rounded-full mb-4">{question.topic}</span>
            {question.passage && (
                <div className="mb-6 p-4 bg-slate-100/70 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
                    <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.passage}</p>
                </div>
            )}
            <p className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-6 whitespace-pre-wrap">{question.question}</p>
            <div className="space-y-3">
                {question.options.map((option, index) => (
                    <button key={index} onClick={() => handleAnswerClick(option)} disabled={isAnswered} className={`w-full text-left p-4 rounded-lg border dark:border-slate-600 transition-colors duration-200 ${getButtonClass(option)}`}>
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span> {option}
                    </button>
                ))}
            </div>
            {isAnswered && (
                <div className="mt-6 p-4 bg-slate-100/70 dark:bg-slate-900/70 rounded-lg space-y-4">
                    {selectedAnswer !== question.correctAnswer && (
                        <p className="font-semibold">The correct answer is: <strong className="text-green-700 dark:text-green-400">{question.correctAnswer}</strong></p>
                    )}
                    <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Explanation:</h4>
                        <p className="mt-2 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{question.explanation}</p>
                    </div>
                    {isFeedbackLoading && <LoadingSpinner />}
                    {feedback && (
                         <div className="border-t border-slate-300 dark:border-slate-700 pt-4">
                            <h4 className="font-bold text-indigo-700 dark:text-indigo-300">How to Improve:</h4>
                            <p className="mt-2 text-slate-600 dark:text-slate-400 whitespace-pre-wrap">{feedback}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
};

const QuickPractice: React.FC<{ addToErrorLog: (question: Question, userAnswer: string, source: 'Question Bank') => void }> = ({ addToErrorLog }) => {
    const [quizState, setQuizState] = useState<'idle' | 'loading' | 'active' | 'completed'>('idle');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<string[]>([]);
    const [subject, setSubject] = useState<'Math' | 'English' | 'Mixed'>('Mixed');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
    const [quizTime, setQuizTime] = useState(0);
    const timerRef = useRef<number | null>(null);

    useEffect(() => {
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, []);

    const startQuiz = async () => {
        setQuizState('loading');
        try {
            const quizQuestions = await generateQuickPracticeQuiz(5, subject, difficulty);
            setQuestions(quizQuestions);
            setAnswers(new Array(quizQuestions.length).fill(''));
            setCurrentQ(0);
            setQuizState('active');
            setQuizTime(0);
            timerRef.current = window.setInterval(() => setQuizTime(prev => prev + 1), 1000);
        } catch (err) {
            console.error(err);
            setQuizState('idle');
            alert("Failed to start a quick practice quiz. Please try again.");
        }
    };

    const handleAnswer = (answer: string) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQ] = answer;
            return newAnswers;
        });
    };

    const finishQuiz = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        questions.forEach((q, i) => {
            if (answers[i] && answers[i] !== q.correctAnswer) {
                addToErrorLog(q, answers[i], 'Question Bank');
            }
        });
        setQuizState('completed');
    };

    if (quizState === 'idle') {
        return (
            <div className="bg-slate-100/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner mb-8 border border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Quick Practice Quiz</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4">Take a short, 5-question quiz on a specific subject and difficulty.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                     <div>
                        <label htmlFor="quiz-subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Subject</label>
                        <select id="quiz-subject" value={subject} onChange={e => setSubject(e.target.value as 'Math' | 'English' | 'Mixed')} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Mixed</option>
                            <option>Math</option>
                            <option>English</option>
                        </select>
                    </div>
                     <div>
                        <label htmlFor="quiz-difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Difficulty</label>
                        <select id="quiz-difficulty" value={difficulty} onChange={e => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                        </select>
                    </div>
                </div>
                <button onClick={startQuiz} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors">
                    Start Quiz
                </button>
            </div>
        );
    }
    
    if (quizState === 'loading') {
        return (
             <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner mb-8 flex flex-col items-center justify-center">
                <LoadingSpinner />
                <p className="mt-4 text-slate-600 dark:text-slate-400">Generating your quiz...</p>
            </div>
        );
    }
    
    if (quizState === 'completed') {
        const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);
        return (
             <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner mb-8 text-center">
                 <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Quiz Complete!</h3>
                 <p className="text-4xl font-bold my-4 text-indigo-600 dark:text-indigo-400">{score} / {questions.length}</p>
                 <p className="text-slate-600 dark:text-slate-400 mb-4">Time taken: {formatTime(quizTime)}</p>
                 <button onClick={() => setQuizState('idle')} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700">
                    Take Another
                </button>
            </div>
        )
    }
    
    if (quizState === 'active' && questions.length > 0) {
        const question = questions[currentQ];
        return (
            <div className="bg-slate-50/50 dark:bg-slate-800/50 p-6 rounded-lg shadow-inner mb-8 border border-slate-200 dark:border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Quick Quiz - Question {currentQ + 1} of {questions.length}</h3>
                    <div className="font-mono text-sm">{formatTime(quizTime)}</div>
                </div>

                <div className="bg-white/60 dark:bg-slate-800/60 p-4 rounded-md">
                     {question.passage && (
                         <div className="mb-4 p-3 bg-slate-100/70 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 max-h-40 overflow-y-auto">
                            <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">{question.passage}</p>
                         </div>
                     )}
                     <p className="font-medium mb-4 whitespace-pre-wrap">{question.question}</p>
                     <div className="space-y-2">
                         {question.options.map((opt, idx) => (
                             <button
                                key={idx}
                                onClick={() => handleAnswer(opt)}
                                className={`w-full text-left p-3 rounded-md border dark:border-slate-600 transition-colors ${answers[currentQ] === opt ? 'bg-indigo-100 dark:bg-indigo-900 border-indigo-500' : 'bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600'}`}
                            >
                                <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span> {opt}
                            </button>
                         ))}
                     </div>
                </div>
                 <div className="mt-4 flex justify-between">
                     <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50">
                        Back
                    </button>
                    {currentQ < questions.length - 1 ? (
                         <button onClick={() => setCurrentQ(p => p + 1)} className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                            Next
                        </button>
                    ) : (
                         <button onClick={finishQuiz} className="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                            Finish
                        </button>
                    )}
                 </div>
            </div>
        );
    }
    
    return null;
};

const QuestionBank: React.FC<QuestionBankProps> = ({ addToErrorLog }) => {
    const [category, setCategory] = useState(SAT_TOPIC_CATEGORIES[0].categoryName);
    const [topic, setTopic] = useState(SAT_TOPIC_CATEGORIES[0].topics[0].name);
    
    const [questionCache, setQuestionCache] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState<boolean>(false);

    const availableTopics = useMemo(() => SAT_TOPIC_CATEGORIES.find(c => c.categoryName === category)?.topics || [], [category]);
    const currentQuestion = useMemo(() => questionCache[currentQuestionIndex], [questionCache, currentQuestionIndex]);

    const loadInitialQuestions = useCallback(async (selectedTopic: string) => {
        if (!selectedTopic) {
            setError("Please select a valid topic.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setQuestionCache([]);
        setCurrentQuestionIndex(0);
        try {
            const newQuestions = await generateSatQuestionBatch(selectedTopic, 25);
            setQuestionCache(newQuestions);
        } catch (err) {
            setError('Failed to generate questions. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    useEffect(() => {
        const newTopic = availableTopics[0]?.name;
        if (newTopic) {
            setTopic(newTopic);
            loadInitialQuestions(newTopic);
        }
    }, [category, availableTopics, loadInitialQuestions]);

    const handleTopicChange = (newTopic: string) => {
        setTopic(newTopic);
        loadInitialQuestions(newTopic);
    };

    const fetchMoreQuestions = useCallback(async () => {
        if (!topic) return;
        setIsFetchingMore(true);
        try {
            const newQuestions = await generateSatQuestionBatch(topic, 10);
            setQuestionCache(prev => [...prev, ...newQuestions]);
            // Automatically advance to the new question
            setCurrentQuestionIndex(prev => prev + 1);
        } catch (err) {
            setError('Failed to generate more questions. Please try again.');
        } finally {
            setIsFetchingMore(false);
        }
    }, [topic]);

    const handleNextQuestion = () => {
        setSelectedAnswer(null);
        setIsAnswered(false);
        
        if (currentQuestionIndex < questionCache.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            fetchMoreQuestions();
        }
    };

    const handleAnswer = (answer: string, isCorrect: boolean) => {
        setSelectedAnswer(answer);
        setIsAnswered(true);
        if (!isCorrect && currentQuestion) {
            addToErrorLog(currentQuestion, answer, 'Question Bank');
        }
    };
    
    const atEndOfCache = currentQuestionIndex === questionCache.length - 1;
    let buttonText = 'Next Question';
    if (isLoading) buttonText = 'Generating...';
    else if (questionCache.length === 0 && !error) buttonText = 'Generate Questions';
    else if (atEndOfCache) {
        buttonText = isFetchingMore ? 'Generating...' : 'Generate More Questions';
    }

    return (
        <div className="max-w-3xl mx-auto animate-fade-in">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Question Bank</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Sharpen your skills with practice questions or a quick practice quiz.</p>
            </div>
            
            <QuickPractice addToErrorLog={addToErrorLog} />

            <div className="mt-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Single Question Practice</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="category-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select a Category</label>
                        <select id="category-select" value={category} onChange={(e) => setCategory(e.target.value as 'English' | 'Math')} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                            {SAT_TOPIC_CATEGORIES.map(c => <option key={c.categoryName} value={c.categoryName}>{c.categoryName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="topic-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select a Topic</label>
                        <select id="topic-select" value={topic} onChange={(e) => handleTopicChange(e.target.value)} className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-indigo-500 focus:border-indigo-500">
                            {availableTopics.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                        </select>
                    </div>
                </div>
                {isAnswered && (
                    <button onClick={handleNextQuestion} disabled={isLoading || isFetchingMore} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors duration-200 flex justify-center items-center">
                        {isFetchingMore && <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>}
                        {buttonText}
                    </button>
                )}
            </div>

            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500">{error}</p>}
            {currentQuestion && (
                <QuestionDisplay
                    question={currentQuestion}
                    onAnswer={handleAnswer}
                    selectedAnswer={selectedAnswer}
                    isAnswered={isAnswered}
                />
            )}
        </div>
    );
};

export default QuestionBank;