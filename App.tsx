import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Header from './components/Header';
import Topics from './components/Topics';
import QuestionBank from './components/QuestionBank';
import MockTest from './components/MockTest';
import Results from './components/Results';
import ErrorLog from './components/ErrorLog';
import Flashcards from './components/Flashcards';
import Profile from './components/Profile';
import PlacementQuiz from './components/PlacementQuiz';
import SubTopicSelectionView from './components/SubTopicSelectionView';
import TopicLessonView from './components/TopicLessonView';
import Statistics from './components/Statistics';
import Settings from './components/Settings';
import { TopicInfo, Question, TestResult, IncorrectQuestion, Page, UserProfile, FlashcardResult } from './types';
import { TASKS } from './constants';

const App: React.FC = () => {
    const [user, setUser] = useState<string | null>(null);
    const [view, setView] = useState<Page>('topics');
    const [userProfile, setUserProfile] = useState<UserProfile>({ level: 1, xp: 0, xpToNextLevel: 1000, avatarId: 0, dreamScore: 1400, completedTasks: [] });
    
    const [hasTakenPlacementQuiz, setHasTakenPlacementQuiz] = useState(false);

    const [testQuestions, setTestQuestions] = useState<Question[]>([]);
    const [latestTestResult, setLatestTestResult] = useState<TestResult | null>(null);
    const [testHistory, setTestHistory] = useState<TestResult[]>([]);

    const [selectedTopic, setSelectedTopic] = useState<TopicInfo | null>(null);
    const [selectedSubTopic, setSelectedSubTopic] = useState<string | null>(null);

    const [errorLog, setErrorLog] = useState<IncorrectQuestion[]>([]);
    const [flashcardHistory, setFlashcardHistory] = useState<FlashcardResult[]>([]);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('sat-prep-user');
        if (loggedInUser) {
            setUser(loggedInUser);
            const takenQuiz = localStorage.getItem('sat-prep-placement-quiz-taken') === 'true';
            setHasTakenPlacementQuiz(takenQuiz);
            
            const storedErrorLog = localStorage.getItem('sat-prep-error-log');
            if (storedErrorLog) setErrorLog(JSON.parse(storedErrorLog));

            const storedHistory = localStorage.getItem('sat-prep-test-history');
            if (storedHistory) setTestHistory(JSON.parse(storedHistory));
            
            const storedFlashcardHistory = localStorage.getItem('sat-prep-flashcard-history');
            if (storedFlashcardHistory) setFlashcardHistory(JSON.parse(storedFlashcardHistory));

            const storedProfile = localStorage.getItem('sat-prep-user-profile');
            if (storedProfile) {
                const parsedProfile = JSON.parse(storedProfile);
                // Initialize new fields if they don't exist for returning users
                const defaultProfile = { avatarId: 0, dreamScore: 1400, completedTasks: [], ...parsedProfile };
                setUserProfile(defaultProfile);
            }
        }
    }, []);

    const handleLogin = (username: string) => {
        setUser(username);
        localStorage.setItem('sat-prep-user', username);
    };
    
    const handleLogout = () => {
        setUser(null);
        setView('topics');
        localStorage.clear();
        setHasTakenPlacementQuiz(false);
        setErrorLog([]);
        setTestHistory([]);
        setFlashcardHistory([]);
        setUserProfile({ level: 1, xp: 0, xpToNextLevel: 1000, avatarId: 0, dreamScore: 1400, completedTasks: [] });
    };

    const handlePlacementQuizComplete = () => {
        setHasTakenPlacementQuiz(true);
        localStorage.setItem('sat-prep-placement-quiz-taken', 'true');
        setView('topics');
    };

    const handleStartTest = (questions: Question[]) => {
        setTestQuestions(questions);
        setView('mock-test');
    };

    const handleXpUpdate = (newXp: number, message?: string) => {
        let currentXp = userProfile.xp + newXp;
        let currentLevel = userProfile.level;
        let xpToNext = userProfile.xpToNextLevel;

        while (currentXp >= xpToNext) {
            currentXp -= xpToNext;
            currentLevel++;
            xpToNext = Math.floor(xpToNext * 1.2);
            // TODO: Add a level up notification
        }

        const updatedProfile = { ...userProfile, level: currentLevel, xp: currentXp, xpToNextLevel: xpToNext };
        // This setState will be batched with the one in handleProfileUpdate if called from there
        setUserProfile(updatedProfile); 
    };

    const handleProfileUpdate = (partialProfile: Partial<UserProfile>) => {
        const updatedProfile = { ...userProfile, ...partialProfile };
        setUserProfile(updatedProfile);
        localStorage.setItem('sat-prep-user-profile', JSON.stringify(updatedProfile));
    };
    
    const checkForTaskCompletion = (currentProfile: UserProfile, updatedTestHistory: TestResult[], updatedFlashcardHistory: FlashcardResult[]) => {
        const newlyCompletedTasks: string[] = [];
        let bonusXp = 0;

        TASKS.forEach(task => {
            const isAlreadyCompleted = currentProfile.completedTasks?.includes(task.id);
            if (!isAlreadyCompleted && task.isCompleted(currentProfile, updatedTestHistory, updatedFlashcardHistory)) {
                newlyCompletedTasks.push(task.id);
                bonusXp += task.xp;
            }
        });

        if (newlyCompletedTasks.length > 0) {
            handleXpUpdate(bonusXp, `Achievement Unlocked!`);
            const updatedTasks = [...(currentProfile.completedTasks || []), ...newlyCompletedTasks];
            handleProfileUpdate({ completedTasks: updatedTasks });
        }
    };
    
    const handleTestComplete = (result: TestResult) => {
        setLatestTestResult(result);

        const updatedHistory = [...testHistory, result];
        setTestHistory(updatedHistory);
        localStorage.setItem('sat-prep-test-history', JSON.stringify(updatedHistory));
        
        const xpEarned = result.testType === 'Full Simulation' ? result.totalScore / 10 : result.totalScore;
        handleXpUpdate(xpEarned, 'Test Complete!');

        const newErrors = result.answers
            .filter(a => !a.isCorrect && a.userAnswer)
            .map(a => ({
                question: a.question,
                userAnswer: a.userAnswer!,
                timestamp: Date.now(),
                source: 'Mock Test' as const
            }));
        
        const updatedLog = [...errorLog, ...newErrors];
        setErrorLog(updatedLog);
        localStorage.setItem('sat-prep-error-log', JSON.stringify(updatedLog));
        
        checkForTaskCompletion(userProfile, updatedHistory, flashcardHistory);

        setView('results');
    };

    const handleFlashcardDeckComplete = (result: FlashcardResult) => {
        const updatedHistory = [...flashcardHistory, result];
        setFlashcardHistory(updatedHistory);
        localStorage.setItem('sat-prep-flashcard-history', JSON.stringify(updatedHistory));

        const xpEarned = result.score * 10;
        handleXpUpdate(xpEarned, 'Deck Complete!');
        checkForTaskCompletion(userProfile, testHistory, updatedHistory);
    };
    
    const addToErrorLog = (question: Question, userAnswer: string, source: 'Question Bank' | 'Mock Test' | 'Flashcard') => {
        const newError: IncorrectQuestion = { question, userAnswer, timestamp: Date.now(), source };
        if (!errorLog.some(e => e.question.question === question.question)) {
            const updatedLog = [...errorLog, newError];
            setErrorLog(updatedLog);
            localStorage.setItem('sat-prep-error-log', JSON.stringify(updatedLog));
        }
    };

    const handleSelectTopic = (topic: TopicInfo) => {
        setSelectedTopic(topic);
        setView('sub-topics');
    };
    
    const handleSelectSubTopic = (subTopicName: string) => {
        setSelectedSubTopic(subTopicName);
        setView('lesson');
    };

    const renderView = () => {
        switch (view) {
            case 'topics':
                return <Topics onSelectTopic={handleSelectTopic} showPlacementPrompt={!hasTakenPlacementQuiz} onStartPlacementQuiz={() => setView('placement-quiz')} />;
            case 'placement-quiz':
                return <PlacementQuiz onQuizComplete={handlePlacementQuizComplete} />;
            case 'sub-topics':
                return selectedTopic && <SubTopicSelectionView topic={selectedTopic} onSelectSubTopic={handleSelectSubTopic} onBack={() => setView('topics')} />;
            case 'lesson':
                return selectedTopic && selectedSubTopic && <TopicLessonView lessonTopic={{ mainTopic: selectedTopic, subTopic: selectedSubTopic }} onBack={() => setView('sub-topics')} />;
            case 'question-bank':
                return <QuestionBank addToErrorLog={addToErrorLog} />;
            case 'mock-test':
                return <MockTest onTestComplete={handleTestComplete} />;
            case 'statistics':
                return <Statistics testHistory={testHistory} flashcardHistory={flashcardHistory} />;
            case 'results':
                return <Results result={latestTestResult} onNavigate={setView} />;
            case 'error-log':
                return <ErrorLog errorLog={errorLog} onStartCustomTest={handleStartTest} />;
            case 'flashcards':
                return <Flashcards onDeckComplete={handleFlashcardDeckComplete} addToErrorLog={addToErrorLog} onNavigate={setView} />;
            case 'profile':
                return <Profile username={user!} profile={userProfile} testHistory={testHistory} onAvatarChange={(id) => handleProfileUpdate({ avatarId: id })} />;
            case 'settings':
                return <Settings profile={userProfile} onProfileUpdate={handleProfileUpdate} onNavigate={setView} />;
            default:
                return <Topics onSelectTopic={handleSelectTopic} showPlacementPrompt={!hasTakenPlacementQuiz} onStartPlacementQuiz={() => setView('placement-quiz')} />;
        }
    };

    if (!user) {
        return (
            <div className="bg-slate-50 dark:bg-slate-900 animate-gradient">
                 <div className="min-h-screen bg-white/10 backdrop-blur-3xl">
                    <Login onLogin={handleLogin} />
                 </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans animate-gradient">
             <div className="min-h-screen bg-white/10 backdrop-blur-3xl">
                <Header currentView={view} onNavigate={setView} username={user} profile={userProfile} onLogout={handleLogout} />
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderView()}
                </main>
            </div>
        </div>
    );
};

export default App;