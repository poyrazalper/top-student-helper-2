import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Question, TestResult } from '../types';
import { generateMockTest, generateAdaptiveSatModule } from '../services/geminiService';

interface MockTestProps {
    onTestComplete: (result: TestResult) => void;
}

const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        <h2 className="mt-6 text-2xl font-semibold text-slate-800 dark:text-slate-200">{message}</h2>
        <p className="mt-2 text-slate-500 dark:text-slate-400">This may take a moment...</p>
    </div>
);

type TestMode = 'selection' | 'quick' | 'full_simulation';
type SimulationStage = 'english_module1' | 'english_module2' | 'math_module1' | 'math_module2' | 'complete';
const QUESTION_TIME_LIMIT = 90; // 1.5 minutes per question

const MockTest: React.FC<MockTestProps> = ({ onTestComplete }) => {
    const [testMode, setTestMode] = useState<TestMode>('selection');
    const [isLoading, setIsLoading] = useState(false);
    
    // Shared state for both test types
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [answers, setAnswers] = useState<(string | null)[]>([]);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [questionTimeLeft, setQuestionTimeLeft] = useState(QUESTION_TIME_LIMIT);
    const timerRef = useRef<number | null>(null);
    const questionTimerRef = useRef<number | null>(null);

    // State specific to full simulation
    const [simStage, setSimStage] = useState<SimulationStage>('english_module1');
    const [fullTestAnswers, setFullTestAnswers] = useState<Map<string, (string | null)[]>>(new Map());
    const [fullTestQuestions, setFullTestQuestions] = useState<Map<string, Question[]>>(new Map());

    const advanceQuestion = useCallback(() => {
        const isLastQuestionInModule = currentQ === questions.length - 1;
        if (isLastQuestionInModule) {
            if (testMode === 'full_simulation') {
                advanceSimulation();
            } else {
                finishQuickTest();
            }
        } else {
            setCurrentQ(prev => prev + 1);
        }
    }, [currentQ, questions, testMode]);


    // Timers logic
    useEffect(() => {
        if (startTime) {
            timerRef.current = window.setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [startTime]);

    useEffect(() => {
        if (testMode === 'quick' || testMode === 'full_simulation') {
            setQuestionTimeLeft(QUESTION_TIME_LIMIT);
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
            questionTimerRef.current = window.setInterval(() => {
                setQuestionTimeLeft(prev => {
                    if (prev <= 1) {
                        clearInterval(questionTimerRef.current!);
                        advanceQuestion();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        }
    }, [currentQ, questions, testMode, advanceQuestion]);

    const startTimer = () => {
        setStartTime(Date.now());
        setElapsedTime(0);
    };

    const startQuickTest = async () => {
        setIsLoading(true);
        try {
            const qs = await generateMockTest();
            setQuestions(qs);
            setAnswers(new Array(qs.length).fill(null));
            setCurrentQ(0);
            setTestMode('quick');
            startTimer();
        } catch (e) {
            console.error("Failed to generate quick test:", e);
            alert("Could not load a quick test. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const startFullSimulation = async () => {
        setIsLoading(true);
        setSimStage('english_module1');
        setFullTestAnswers(new Map());
        setFullTestQuestions(new Map());
        try {
            const qs = await generateAdaptiveSatModule('English', 'medium', 27);
            setQuestions(qs);
            setFullTestQuestions(prev => new Map(prev).set('english_module1', qs));
            setAnswers(new Array(qs.length).fill(null));
            setCurrentQ(0);
            setTestMode('full_simulation');
            startTimer();
        } catch (e) {
            console.error("Failed to start full simulation:", e);
            alert("Could not start the simulation. Please try again.");
            setTestMode('selection');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleAnswer = (answer: string) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentQ] = answer;
            return newAnswers;
        });
    };

    const finishQuickTest = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        
        const result: TestResult = {
            testType: 'Quick',
            totalScore: Math.round(questions.reduce((acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0), 0) / questions.length * 100),
            englishScore: 0,
            mathScore: 0,
            answers: questions.map((q, i) => ({ question: q, userAnswer: answers[i], isCorrect: answers[i] === q.correctAnswer })),
            duration: elapsedTime,
            timestamp: Date.now()
        };
        onTestComplete(result);
    };

    const advanceSimulation = async () => {
        setIsLoading(true);
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);
        
        // FIX: Explicitly type `updatedAnswers` to resolve a type inference issue.
        const updatedAnswers: Map<string, (string | null)[]> = new Map(fullTestAnswers).set(simStage, answers);
        setFullTestAnswers(updatedAnswers);

        let nextStage: SimulationStage = simStage;
        let nextSection: 'English' | 'Math' = 'English';
        let nextDifficulty: 'medium' | 'easy' | 'hard' = 'easy';
        let nextQuestionCount = 27;

        const currentScore = answers.reduce((acc, ans, i) => acc + (ans === questions[i].correctAnswer ? 1 : 0), 0);
        const performance = currentScore / questions.length;

        switch (simStage) {
            case 'english_module1':
                nextStage = 'english_module2';
                nextSection = 'English';
                nextDifficulty = performance >= 0.6 ? 'hard' : 'easy';
                nextQuestionCount = 27;
                break;
            case 'english_module2':
                nextStage = 'math_module1';
                nextSection = 'Math';
                nextDifficulty = 'medium';
                nextQuestionCount = 22;
                break;
            case 'math_module1':
                nextStage = 'math_module2';
                nextSection = 'Math';
                nextDifficulty = performance >= 0.6 ? 'hard' : 'easy';
                nextQuestionCount = 22;
                break;
            case 'math_module2':
                finishFullSimulation(updatedAnswers);
                return;
        }
        
        try {
            const qs = await generateAdaptiveSatModule(nextSection, nextDifficulty, nextQuestionCount);
            setQuestions(qs);
            setFullTestQuestions(prev => new Map(prev).set(nextStage, qs));
            setAnswers(new Array(qs.length).fill(null));
            setCurrentQ(0);
            setSimStage(nextStage);
        } catch (e) {
            console.error(`Failed to generate ${nextStage}:`, e);
            alert(`Could not load the next test module. The test will now end.`);
            finishFullSimulation(updatedAnswers);
        } finally {
            setIsLoading(false);
        }
    };
    
    const finishFullSimulation = (finalAnswers: Map<string, (string | null)[]>) => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (questionTimerRef.current) clearInterval(questionTimerRef.current);

        const allAnsweredQuestions: TestResult['answers'] = [];
        let correctEnglish = 0;
        let totalEnglish = 0;
        let correctMath = 0;
        let totalMath = 0;

        finalAnswers.forEach((moduleAnswers, stage) => {
            const moduleQuestions = fullTestQuestions.get(stage) || [];
            moduleAnswers.forEach((ans, i) => {
                const q = moduleQuestions[i];
                if (!q) return;
                const isCorrect = ans === q.correctAnswer;
                allAnsweredQuestions.push({ question: q, userAnswer: ans, isCorrect });
                if (stage.startsWith('english')) {
                    totalEnglish++;
                    if (isCorrect) correctEnglish++;
                }
                if (stage.startsWith('math')) {
                    totalMath++;
                    if (isCorrect) correctMath++;
                }
            });
        });
        
        const scaleScore = (correct: number, total: number) => total > 0 ? 200 + Math.round((correct / total) * 600) : 200;
        const englishScore = scaleScore(correctEnglish, totalEnglish);
        const mathScore = scaleScore(correctMath, totalMath);
        const totalScore = englishScore + mathScore;

        const result: TestResult = {
            testType: 'Full Simulation',
            totalScore,
            englishScore,
            mathScore,
            answers: allAnsweredQuestions,
            duration: elapsedTime,
            timestamp: Date.now()
        };
        onTestComplete(result);
    };

    if (isLoading) {
        return <LoadingScreen message="Generating Your Test..." />;
    }

    if (testMode === 'selection') {
        return (
            <div className="max-w-4xl mx-auto animate-fade-in text-center">
                 <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Choose Your Mock Test</h1>
                <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">Select a quick practice or a full, realistic SAT simulation.</p>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <button onClick={startQuickTest} className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md hover:shadow-xl hover:border-indigo-500 transition-all duration-300 group">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Quick Test</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">A 10-question mixed test to quickly check your skills.</p>
                        <p className="mt-4 font-semibold text-indigo-600 dark:text-indigo-400">~15 minutes</p>
                    </button>
                    <button onClick={startFullSimulation} className="p-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md hover:shadow-xl hover:border-indigo-500 transition-all duration-300 group">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Full SAT Simulation</h2>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">A realistic, adaptive test with 98 questions and 1600-point scoring.</p>
                        <p className="mt-4 font-semibold text-indigo-600 dark:text-indigo-400">~2 hours 14 minutes</p>
                    </button>
                </div>
            </div>
        );
    }
    
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const isFullSim = testMode === 'full_simulation';
    const totalQuestions = questions.length;
    const progress = ((currentQ + 1) / totalQuestions) * 100;
    const question = questions[currentQ];
    
    const stageTitles: Record<SimulationStage, string> = {
        english_module1: "English - Module 1 of 2",
        english_module2: "English - Module 2 of 2",
        math_module1: "Math - Module 1 of 2",
        math_module2: "Math - Module 2 of 2",
        complete: "Test Complete"
    };

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{isFullSim ? 'Full SAT Simulation' : 'Quick Test'}</h1>
                        {isFullSim && <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{stageTitles[simStage]}</p>}
                    </div>
                     <div className="text-right">
                        <div className="font-mono text-lg font-semibold">{formatTime(elapsedTime)}</div>
                        <div className={`font-mono text-sm font-semibold ${questionTimeLeft <= 10 ? 'text-red-500' : 'text-slate-500 dark:text-slate-400'}`}>
                            {formatTime(questionTimeLeft)}
                        </div>
                    </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                    <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 p-6 rounded-lg shadow-md">
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Question {currentQ + 1} of {totalQuestions} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">({question.topic})</span></h2>
                {question.passage && (
                    <div className="mb-6 p-4 bg-slate-100/70 dark:bg-slate-900/50 rounded-md border border-slate-200 dark:border-slate-700 max-h-60 overflow-y-auto">
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
                <button onClick={() => setCurrentQ(p => Math.max(0, p - 1))} disabled={currentQ === 0} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-md disabled:opacity-50 font-semibold">Previous</button>
                <button onClick={advanceQuestion} className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-semibold">
                    {currentQ < totalQuestions - 1 ? 'Next' : (isFullSim && simStage !== 'math_module2' ? 'Finish Module' : 'Finish Test')}
                </button>
            </div>
        </div>
    );
};

export default MockTest;