import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Questions.css';

// ✅ 1. IMPORT FROM OUR CUSTOM AUTH CONTEXT
import { useAuth } from './AuthContext'; 

// --- Reusable Components & Data ---
const Icon = ({ path, className = "icon" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

const ICONS = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    x: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
    undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
    shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
};

// ✅ ADDED: Constants for consistency
const MAIN_CATEGORY_TITLE = "Core Interview Questions";
const SUB_CATEGORY_TITLE = "Situational Questions";

const initialFlashcardQuestions = [
    { id: "sq_1", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "What would you do if you were assigned a project with an unfamiliar technology?", back: "I would research the basics, seek guidance from teammates, and build small prototypes to gain hands-on experience before contributing." },
    { id: "sq_2", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "How would you handle a situation where two teammates strongly disagree on an approach?", back: "I would listen to both perspectives, evaluate pros and cons objectively, encourage data-driven decision-making, and involve the lead if necessary." },
    { id: "sq_3", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "If you are given multiple urgent tasks with the same deadline, how would you prioritize?", back: "I would clarify expectations with my manager, focus on the highest business impact tasks first, and create a timeline to deliver critical items on time." },
    { id: "sq_4", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "How would you react if your manager criticizes your work harshly?", back: "I would stay calm, listen carefully, ask for specific feedback, and use it as an opportunity to improve without taking it personally." },
    { id: "sq_5", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "What would you do if you discovered a mistake in your code just before deployment?", back: "I would immediately notify the team, explain the issue, suggest a fix, and resolve it quickly to prevent production problems." },
    { id: "sq_6", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "How would you handle a client who constantly changes requirements?", back: "I would document all changes, communicate their impact on timelines, suggest feasible alternatives, and keep my manager updated." },
    { id: "sq_7", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "What would you do if you didn’t agree with your manager’s decision?", back: "I would respectfully share my perspective with facts, but align with the final decision and execute it professionally." },
    { id: "sq_8", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "How would you approach a situation where you’re stuck on a problem for too long?", back: "I would try different strategies, review documentation, and if still stuck, reach out to peers with specifics to avoid blocking progress." },
    { id: "sq_9", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "What would you do if a teammate wasn’t contributing equally to a project?", back: "I would talk to them privately to understand challenges, offer help, and escalate politely to the manager if the issue persisted." },
    { id: "sq_10", deckId: "situate", title: SUB_CATEGORY_TITLE, front: "If you were asked to take the lead on a project for the first time, how would you proceed?", back: "I would understand requirements, assign tasks based on strengths, set clear timelines, and ensure open communication for smooth execution." }
];

const practiceTestQuestions = [
    { question: "If you are assigned work in a new programming language, what is the BEST way to handle it?", options: ["Refuse to work until you’re trained.", "Learn proactively, use online resources, and ask for help when needed.", "Wait until the last moment to study.", "Pretend you know it and risk mistakes."], correctAnswer: "Learn proactively, use online resources, and ask for help when needed." },
    { question: "If two team members are in conflict, what should you do first?", options: ["Take sides immediately.", "Encourage both to share their perspectives and mediate calmly.", "Ignore the conflict and continue working.", "Report them without trying to solve the issue."], correctAnswer: "Encourage both to share their perspectives and mediate calmly." },
    { question: "When facing multiple urgent deadlines, what is the smartest action?", options: ["Randomly pick tasks.", "Clarify priorities with your manager and focus on highest impact tasks.", "Try to do everything at once without planning.", "Delay all tasks until you feel less stressed."], correctAnswer: "Clarify priorities with your manager and focus on highest impact tasks." },
    { question: "If your manager criticizes your work harshly, what should you do?", options: ["Argue immediately.", "Stay calm, listen carefully, and ask for actionable feedback.", "Take it personally and lose motivation.", "Ignore their feedback."], correctAnswer: "Stay calm, listen carefully, and ask for actionable feedback." },
    { question: "What’s the BEST step if you find a bug in your code before deployment?", options: ["Hide it to avoid blame.", "Fix it silently without informing anyone.", "Immediately report it, suggest a fix, and resolve it.", "Delay deployment indefinitely."], correctAnswer: "Immediately report it, suggest a fix, and resolve it." },
    { question: "How should you respond if a client keeps changing requirements?", options: ["Get frustrated and refuse to continue.", "Document changes, explain impact on timelines, and suggest solutions.", "Ignore the changes and continue as planned.", "Complain to teammates."], correctAnswer: "Document changes, explain impact on timelines, and suggest solutions." },
    { question: "If you don’t agree with your manager’s decision, the professional approach is to:", options: ["Argue until they change their mind.", "Respectfully share your view, but align once the decision is final.", "Refuse to follow their instructions.", "Complain to coworkers about the decision."], correctAnswer: "Respectfully share your view, but align once the decision is final." },
    { question: "When you’re stuck on a task for too long, what’s the best course of action?", options: ["Keep struggling silently.", "Review resources, try alternatives, and ask peers/mentors with specifics.", "Leave the task unfinished.", "Wait until someone notices."], correctAnswer: "Review resources, try alternatives, and ask peers/mentors with specifics." },
    { question: "If a teammate isn’t contributing enough, what’s the correct step?", options: ["Publicly blame them.", "Ignore and do all the work yourself.", "Have a private conversation to understand issues, escalate if unresolved.", "Immediately complain to HR."], correctAnswer: "Have a private conversation to understand issues, escalate if unresolved." },
    { question: "If you are leading a project for the first time, what’s the best approach?", options: ["Take all decisions alone.", "Understand requirements, delegate based on strengths, and ensure communication.", "Avoid responsibility and let someone else lead.", "Focus only on technical work, not team coordination."], correctAnswer: "Understand requirements, delegate based on strengths, and ensure communication." }
];

function SituationalQuestions() {
    const { currentUser, updateUserProfile } = useAuth();
    const [view, setView] = useState('options');
    const [questions, setQuestions] = useState(initialFlashcardQuestions); 
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [animation, setAnimation] = useState('');
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [isEditMode, setIsEditMode] = useState(false);
    const [roundResults, setRoundResults] = useState({ correct: [], incorrect: [] });
    const [changedAnswers, setChangedAnswers] = useState({});
    const [ptCurrentIndex, setPtCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [ptScore, setPtScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [testFinished, setTestFinished] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        if (currentUser && currentUser.editedCards) {
            const userEdits = currentUser.editedCards;
            const personalizedQuestions = initialFlashcardQuestions.map(q => {
                const editedAnswer = userEdits[MAIN_CATEGORY_TITLE]?.[SUB_CATEGORY_TITLE]?.[q.id];
                if (editedAnswer) {
                    return { ...q, back: editedAnswer };
                }
                return q;
            });
            setQuestions(personalizedQuestions);
        } else {
            setQuestions(initialFlashcardQuestions);
        }
        setIsLoading(false);
    }, [currentUser]);
    
    useEffect(() => {
        if (view !== 'practiceTest' || testFinished) return;
        if (timeLeft === 0) { setTestFinished(true); return; }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, view, testFinished]);

    const updateUserDeckProgress = useCallback(async ({ finalScore, totalQuestions, deckTitle }) => {
        if (!currentUser?.email) return;

        const percentage = totalQuestions > 0 ? finalScore / totalQuestions : 0;
        const isMastered = percentage >= 0.9;
        const deckType = deckTitle.includes("Test") ? "Tests" : "Flashcards";

        const updatedCompleted = JSON.parse(JSON.stringify(currentUser.completedDecks || {}));
        const updatedMastered = JSON.parse(JSON.stringify(currentUser.masteredDecks || {}));
        
        if (isMastered) {
            updatedMastered[deckType] = updatedMastered[deckType] || {};
            updatedMastered[deckType][deckTitle] = true;
            if (updatedCompleted[deckType]?.[deckTitle]) {
                delete updatedCompleted[deckType][deckTitle];
                if (Object.keys(updatedCompleted[deckType]).length === 0) delete updatedCompleted[deckType];
            }
        } else {
            updatedCompleted[deckType] = updatedCompleted[deckType] || {};
            updatedCompleted[deckType][deckTitle] = true;
            if (updatedMastered[deckType]?.[deckTitle]) {
                delete updatedMastered[deckType][deckTitle];
                if (Object.keys(updatedMastered[deckType]).length === 0) delete updatedMastered[deckType];
            }
        }

        try {
            await updateUserProfile(currentUser.email, {
                completedDecks: updatedCompleted,
                masteredDecks: updatedMastered
            });
        } catch (error) {
            console.error("Failed to update user deck progress:", error);
        }
    }, [currentUser, updateUserProfile]);

    const handleFlip = () => !animation && setIsFlipped(!isFlipped);
    
    const handleAnswer = (isCorrect) => {
        if (animation || !questions) return;
        const currentQ = questions[currentIndex];
        setAnimation(isCorrect ? 'slide-out-right' : 'slide-out-left'); 
        setRoundResults(prev => ({
            correct: isCorrect ? [...prev.correct, currentQ] : prev.correct,
            incorrect: !isCorrect ? [...prev.incorrect, currentQ] : prev.incorrect,
        }));

        setTimeout(() => {
            const newCorrectCount = score.correct + (isCorrect ? 1 : 0);
            const newWrongCount = score.wrong + (!isCorrect ? 1 : 0);
            setScore({ correct: newCorrectCount, wrong: newWrongCount });
            
            if (currentIndex + 1 === questions.length) {
                updateUserDeckProgress({
                    finalScore: newCorrectCount,
                    totalQuestions: questions.length,
                    deckTitle: SUB_CATEGORY_TITLE,
                });
            }
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
            setAnimation(''); 
        }, 500);
    };

    const handleShuffle = () => {
        if (!questions) return;
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
        handleReset();
    };

    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
        setAnimation('reset');
        setTimeout(() => setAnimation(''), 300);
    };

    const handleAnswerChange = (index, newAnswer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].back = newAnswer;
        setQuestions(updatedQuestions);
        const questionId = updatedQuestions[index].id;
        setChangedAnswers(prev => ({ ...prev, [questionId]: newAnswer }));
    };

    const startPracticeRound = () => {
        setQuestions(roundResults.incorrect);
        handleReset();
    };

    const handleSaveChanges = async () => {
        if (!currentUser?.email || Object.keys(changedAnswers).length === 0) {
            setIsEditMode(false);
            return;
        }
        const updatedEditedCards = JSON.parse(JSON.stringify(currentUser.editedCards || {}));

        Object.keys(changedAnswers).forEach(cardId => {
            const originalCard = initialFlashcardQuestions.find(q => q.id === cardId);
            if (originalCard) {
                updatedEditedCards[MAIN_CATEGORY_TITLE] = updatedEditedCards[MAIN_CATEGORY_TITLE] || {};
                updatedEditedCards[MAIN_CATEGORY_TITLE][SUB_CATEGORY_TITLE] = updatedEditedCards[MAIN_CATEGORY_TITLE][SUB_CATEGORY_TITLE] || {};
                updatedEditedCards[MAIN_CATEGORY_TITLE][SUB_CATEGORY_TITLE][cardId] = changedAnswers[cardId];
            }
        });

        try {
            await updateUserProfile(currentUser.email, { editedCards: updatedEditedCards });
            setChangedAnswers({});
            setIsEditMode(false);
        } catch (error) {
            console.error("Failed to save edited cards:", error);
            alert("An error occurred while saving your changes.");
        }
    };
    
    const handleAnswerSelect = (answer) => setSelectedAnswer(answer);
    
    const handleNextQuestion = () => {
        const isCorrect = selectedAnswer === practiceTestQuestions[ptCurrentIndex].correctAnswer;
        const newPtScore = ptScore + (isCorrect ? 1 : 0);
        if (isCorrect) setPtScore(newPtScore);
        setUserAnswers(prev => [...prev, { question: practiceTestQuestions[ptCurrentIndex].question, selected: selectedAnswer, correct: practiceTestQuestions[ptCurrentIndex].correctAnswer, isCorrect }]);
        setSelectedAnswer(null);

        if (ptCurrentIndex + 1 === practiceTestQuestions.length) {
            setTestFinished(true);
            updateUserDeckProgress({
                finalScore: newPtScore,
                totalQuestions: practiceTestQuestions.length,
                deckTitle: `${SUB_CATEGORY_TITLE} Test`,
            });
        } else {
            setPtCurrentIndex(prev => prev + 1);
        }
    };

    const handleTestRestart = () => {
        setView('practiceTest');
        setPtCurrentIndex(0);
        setSelectedAnswer(null);
        setUserAnswers([]);
        setPtScore(0);
        setTimeLeft(60);
        setTestFinished(false);
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (isLoading || !questions) {
        return <div className="loading-fullscreen">Loading Questions...</div>;
    }
    
    const currentQuestion = questions[currentIndex];

    // --- (The rest of the rendering JSX is unchanged) ---
    if (view === 'options') {
        return (
            <div className="app-container">
                <div className="start-options-container">
                    <div className="start-screen">
                        <h1>Prep Flashcards</h1>
                        <p>Use these cards to practice your responses.</p>
                        <button onClick={() => setView('flashcards')} className="start-button">Start Flashcards</button>
                    </div>
                    <div className="start-screen">
                        <h1>Practice Test</h1>
                        <p>Test your knowledge with multiple-choice questions.</p>
                        <button onClick={handleTestRestart} className="start-button">Start Practice Test</button>
                    </div>
                </div>
            </div>
        );
    }

    if (view === 'flashcards') {
        if (isEditMode) {
            return (
                <div className="app-container">
                    <div className="edit-mode-container">
                        <header className="edit-header">
                            <h2>Edit Answers</h2>
                            <button onClick={handleSaveChanges} className="done-button" title="Save changes">Save</button>
                        </header>
                        <div className="questions-list">
                            {questions.map((q, index) => (
                                <div key={q.id} className="edit-question-item">
                                    <label className="edit-question-label">{q.front}</label>
                                    <textarea className="edit-textarea" value={q.back} onChange={(e) => handleAnswerChange(index, e.target.value)} rows="3" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        if (currentIndex >= questions.length && questions.length > 0) {
            const totalAnswered = score.correct + score.wrong;
            const percentage = totalAnswered > 0 ? Math.round((score.correct / totalAnswered) * 100) : 0;
            let titleMessage = "Round Complete!";
            if (totalAnswered > 0) {
                titleMessage = percentage >= 75 ? "You're doing brilliantly!" : percentage >= 50 ? "Good job! Keep practicing." : "Keep practicing, you'll get there!";
            }
            return (
                <div className="app-container">
                    <div className="completion-wrapper">
                        <div className="completion-screen-new">
                            <div className="completion-header"><h1>{titleMessage}</h1></div>
                            <div className="stats-container">
                                <h2>How you're doing</h2>
                                <div className="stats-main">
                                    <div className="stats-percentage">{percentage}%</div>
                                    <div className="stats-bars">
                                        <div className="stat-item">
                                            <span className="stat-label">Know</span>
                                            <div className="stat-bar-container"><div className="stat-bar know-bar" style={{ width: `${(score.correct / totalAnswered) * 100}%` }}></div></div>
                                            <span className="stat-count">{score.correct}</span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Still learning</span>
                                            <div className="stat-bar-container"><div className="stat-bar learning-bar" style={{ width: `${(score.wrong / totalAnswered) * 100}%` }}></div></div>
                                            <span className="stat-count">{score.wrong}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleReset} className="restart-button-alt" title="Restart Flashcards">Restart Flashcards</button>
                        </div>
                        <div className="your-stats-container">
                            <h2>Your stats</h2>
                            <div className="results-scroll-container">
                                <div className="results-list-section">
                                    <h3>Know ({roundResults.correct.length})</h3>
                                    {roundResults.correct.map((q, i) => <div key={`c-${i}`} className="result-item"><p className="result-item-question">{q.front}</p><p className="result-item-answer">{q.back}</p></div>)}
                                </div>
                                {roundResults.incorrect.length > 0 && (
                                    <div className="results-list-section">
                                        <h3>Still learning ({roundResults.incorrect.length})</h3>
                                        {roundResults.incorrect.map((q, i) => <div key={`i-${i}`} className="result-item"><p className="result-item-question">{q.front}</p><p className="result-item-answer">{q.back}</p></div>)}
                                        <button onClick={startPracticeRound} className="practice-button">Practice 'Still Learning' Cards</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="app-container">
                 <div className="flashcard-container">
                     <header className="header">
                         <button className="header-button" onClick={handleReset} title="Restart"><Icon path={ICONS.undo} /></button>
                         <button className="header-button" onClick={() => setIsEditMode(true)} title="Edit"><Icon path={ICONS.edit} /></button>
                     </header>
                     <main className="main-content">
                         <div className={`card ${isFlipped ? 'is-flipped' : ''} ${animation}`} onClick={handleFlip}>
                             <div className="card-face card-front"><p>{currentQuestion?.front}</p></div>
                             <div className="card-face card-back"><p>{currentQuestion?.back}</p></div>
                         </div>
                     </main>
                     <div className="controls">
                         <button className="control-button wrong-button" onClick={() => handleAnswer(false)}><Icon path={ICONS.x} className="icon large-icon" /></button>
                         <div className="progress-text">
                             <span>{currentIndex + 1} / {questions.length}</span>
                             <div className="score-tracker">
                                 <span className="score-item score-wrong"><Icon path={ICONS.x} className="icon score-icon" /> {score.wrong}</span>
                                 <span className="score-item score-correct"><Icon path={ICONS.check} className="icon score-icon" /> {score.correct}</span>
                             </div>
                         </div>
                         <button className="control-button correct-button" onClick={() => handleAnswer(true)}><Icon path={ICONS.check} className="icon large-icon" /></button>
                     </div>
                     <footer className="footer">
                         <div className="footer-buttons"><button onClick={handleShuffle} title="Shuffle"><Icon path={ICONS.shuffle}/></button></div>
                     </footer>
                 </div>
            </div>
        );
    }

    if (view === 'practiceTest') {
        const currentPtQuestion = practiceTestQuestions[ptCurrentIndex];
        if (testFinished) {
            return (
                <div className="pt-app-container">
                    <div className="pt-results-screen">
                        <h1>Test Complete!</h1>
                        <h2>Your Score: {ptScore} / {practiceTestQuestions.length}</h2>
                        <div className="pt-results-summary">
                            {userAnswers.map((answer, index) => (
                                <div key={index} className={`pt-result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                                    <p className="pt-result-question">{index + 1}. {answer.question}</p>
                                    <p>Your answer: {answer.selected || "Not Answered"}</p>
                                    {!answer.isCorrect && <p className="pt-correct-answer">Correct answer: {answer.correct}</p>}
                                </div>
                            ))}
                        </div>
                        <button onClick={handleTestRestart} className="pt-start-button">Try Again</button>
                    </div>
                </div>
            );
        }

        return (
            <div className="pt-app-container">
                <div className="pt-test-header">
                    <div className="pt-progress-bar-container">
                        <div className="pt-progress-bar" style={{ width: `${((ptCurrentIndex + 1) / practiceTestQuestions.length) * 100}%` }}></div>
                    </div>
                    <div className="pt-timer">{formatTime(timeLeft)}</div>
                </div>
                <div className="pt-question-container">
                    <h2>Question {ptCurrentIndex + 1} of {practiceTestQuestions.length}</h2>
                    <p className="pt-question-text">{currentPtQuestion.question}</p>
                    <div className="pt-options">
                        {currentPtQuestion.options.map((option, index) => (
                            <button key={index} className={`pt-option-btn ${selectedAnswer === option ? 'selected' : ''}`} onClick={() => handleAnswerSelect(option)}>
                                {option}
                            </button>
                        ))}
                    </div>
                    <button className="pt-next-button" onClick={handleNextQuestion} disabled={!selectedAnswer}>
                        {ptCurrentIndex === practiceTestQuestions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        );
    }
}

export default SituationalQuestions;
