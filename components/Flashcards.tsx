import React, { useState, useEffect, useCallback } from 'react';
import { Flashcard, Question, Page, FlashcardResult } from '../types';
import { generateFlashcards } from '../services/geminiService';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
    </div>
);

const ResultModal: React.FC<{ score: number, total: number, onNextDeck: () => void, onGoBack: () => void }> = ({ score, total, onNextDeck, onGoBack }) => (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Deck Complete!</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">You've finished this set of flashcards.</p>
            <p className="text-6xl font-bold my-4 text-indigo-600 dark:text-indigo-400">{score}<span className="text-4xl text-slate-500 dark:text-slate-400">/{total}</span></p>
            <div className="space-y-3">
                <button onClick={onNextDeck} className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 transition-colors">
                    Start New Deck
                </button>
                <button onClick={onGoBack} className="w-full px-6 py-3 bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-200 font-semibold rounded-md shadow-sm hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                    Back to Topics
                </button>
            </div>
        </div>
    </div>
);


const FlashcardView: React.FC<{ card: Flashcard, onAnswer: (isCorrect: boolean, userAnswer: string) => void }> = ({ card, onAnswer }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    useEffect(() => {
        setIsFlipped(false);
        setSelectedOption(null);
    }, [card]);

    const handleSelectOption = (option: string) => {
        if (selectedOption) return;
        setSelectedOption(option);
        onAnswer(option === card.definition, option);
    };

    const getButtonClass = (option: string) => {
        if (!selectedOption) {
            return "bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600";
        }
        if (option === card.definition) {
            return "bg-green-200 dark:bg-green-800 border-green-500";
        }
        if (option === selectedOption) {
            return "bg-red-200 dark:bg-red-800 border-red-500";
        }
        return "bg-slate-100 dark:bg-slate-800 opacity-50 cursor-not-allowed";
    };

    return (
        <div className="w-full max-w-lg mx-auto">
            <div className="relative [transform-style:preserve-3d] transition-transform duration-500 h-64 mb-6" style={{ transform: isFlipped ? 'rotateY(180deg)' : '' }}>
                {/* Front */}
                <div className="absolute w-full h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg flex items-center justify-center p-6 [backface-visibility:hidden]">
                    <h2 className="text-4xl font-bold text-slate-900 dark:text-white capitalize">{card.word}</h2>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-6 [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-center">
                    <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400 capitalize">{card.word}</h3>
                    <p className="mt-2 text-slate-700 dark:text-slate-300">{card.definition}</p>
                    <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-400">"{card.sentence}"</p>
                </div>
            </div>

            <div className="flex justify-center mb-6">
                 <button onClick={() => setIsFlipped(!isFlipped)} className="px-5 py-2 bg-slate-200 dark:bg-slate-700 rounded-md font-semibold">
                    Flip Card
                </button>
            </div>

            <div className="space-y-3">
                {card.options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleSelectOption(option)}
                        disabled={!!selectedOption}
                        className={`w-full text-left p-3 rounded-lg border dark:border-slate-600 transition-colors ${getButtonClass(option)}`}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
};


const Flashcards: React.FC<{
    onDeckComplete: (result: FlashcardResult) => void;
    addToErrorLog: (question: Question, userAnswer: string, source: 'Flashcard') => void;
    onNavigate: (page: Page) => void;
}> = ({ onDeckComplete, addToErrorLog, onNavigate }) => {
    const [cards, setCards] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<(boolean | null)[]>([]);
    const [isDeckFinished, setIsDeckFinished] = useState(false);

    const fetchCards = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setIsDeckFinished(false);
        try {
            const newCards = await generateFlashcards(10);
            setCards(newCards);
            setAnswers(new Array(newCards.length).fill(null));
            setCurrentIndex(0);
        } catch (err) {
            console.error(err);
            setError("Could not load flashcards. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCards();
    }, [fetchCards]);

    const handleAnswer = (isCorrect: boolean, userAnswer: string) => {
        setAnswers(prev => {
            const newAnswers = [...prev];
            newAnswers[currentIndex] = isCorrect;
            return newAnswers;
        });

        if (!isCorrect) {
            const currentCard = cards[currentIndex];
            const errorQuestion: Question = {
                question: `What is the definition of "${currentCard.word}"?`,
                options: currentCard.options,
                correctAnswer: currentCard.definition,
                explanation: `The word "${currentCard.word}" means: ${currentCard.definition}. Example: "${currentCard.sentence}"`,
                topic: 'Vocabulary',
                category: 'English',
            };
            addToErrorLog(errorQuestion, userAnswer, 'Flashcard');
        }
    };
    
    const finishDeck = () => {
        const score = answers.filter(a => a === true).length;
        onDeckComplete({ score, total: cards.length, timestamp: Date.now() });
        setIsDeckFinished(true);
    }

    const goToNext = () => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            finishDeck();
        }
    };

    const goToPrev = () => {
        setCurrentIndex(p => Math.max(0, p - 1));
    };

    const score = answers.filter(a => a === true).length;

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
             {isDeckFinished && <ResultModal score={score} total={cards.length} onNextDeck={fetchCards} onGoBack={() => onNavigate('topics')} />}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Vocabulary Flashcards</h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">Boost your vocabulary with these common SAT words.</p>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!isLoading && cards.length > 0 && (
                <div>
                    <FlashcardView card={cards[currentIndex]} onAnswer={handleAnswer} />
                    <div className="mt-8 flex justify-between items-center max-w-lg mx-auto">
                        <button onClick={goToPrev} disabled={currentIndex === 0} className="px-6 py-2 bg-slate-200 dark:bg-slate-700 rounded-md font-semibold disabled:opacity-50">
                            Previous
                        </button>
                        <span className="font-semibold">{currentIndex + 1} / {cards.length}</span>
                        <button onClick={goToNext} disabled={answers[currentIndex] === null} className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-400">
                            {currentIndex === cards.length - 1 ? 'Finish Deck' : 'Next'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flashcards;