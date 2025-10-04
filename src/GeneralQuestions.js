import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Questions.css';

import { useAuth } from './AuthContext'; 

// --- (Reusable Components & Data are unchanged) ---
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

// ✅ ADDED: Main category title for consistency
const MAIN_CATEGORY_TITLE = "Core Interview Questions";

const initialFlashcardQuestions = [
    { id: "gq_1", deckId: "general_hr", title: "General HR Questions", front: "Tell me about yourself.", back: "I am a passionate and results-oriented professional with a proven track record of developing user-friendly web applications. I thrive in collaborative environments and I'm always eager to learn new technologies." },
    { id: "gq_2", deckId: "general_hr", title: "General HR Questions", front: "What are your greatest strengths?", back: "My greatest strengths are my adaptability and problem-solving skills. I can quickly learn new frameworks and effectively debug complex issues to ensure project deadlines are met." },
    { id: "gq_3", deckId: "general_hr", title: "General HR Questions", front: "What are your weaknesses?", back: "I used to focus too much on minor details, but I've learned to prioritize tasks for the bigger picture. This helps me deliver high-impact work more efficiently." },
    { id: "gq_4", deckId: "general_hr", title: "General HR Questions", front: "Why do you want to work for this company?", back: "I'm impressed with this company's innovation in the tech space and its commitment to a positive work culture. I believe my skills in React and UI development would be a great asset to your team." },
    { id: "gq_5", deckId: "general_hr", title: "General HR Questions", front: "Where do you see yourself in 5 years?", back: "In five years, I aim to be a senior developer, mentoring junior team members and taking the lead on challenging projects. I am eager to grow with a company that invests in its employees." },
    { id: "gq_6", deckId: "general_hr", title: "General HR Questions", front: "Why should we hire you?", back: "You should hire me because my skills in front-end development align perfectly with this role. My experience in building responsive and performant applications will allow me to contribute to your team from day one." },
    { id: "gq_7", deckId: "general_hr", title: "General HR Questions", front: "What is your greatest professional achievement?", back: "My greatest achievement was leading the redesign of a client's e-commerce site, which resulted in a 20% increase in user engagement and a 15% boost in sales." },
    { id: "gq_8", deckId: "general_hr", title: "General HR Questions", front: "How do you handle pressure?", back: "I stay calm under pressure by breaking down large tasks into smaller, manageable steps. Clear communication with my team is also key to managing expectations and resolving issues collaboratively." },
    { id: "gq_9", deckId: "general_hr", title: "General HR Questions", front: "What are your salary expectations?", back: "Based on my experience and the market rate for this role, I am expecting a competitive salary. I am open to discussing a number that is fair for both parties." },
    { id: "gq_10", deckId: "general_hr", title: "General HR Questions", front: "Do you have any questions for us?", back: "Yes, thank you. Could you describe the team's development process? What are the biggest challenges the team is currently facing, and what are the opportunities for professional growth here?" }
];

const practiceTestQuestions = [
    {
        question: "When an interviewer says, 'Tell me about yourself,' what is the best approach?",
        options: [
            "A detailed, 5-minute summary of your life story.", 
            "A brief, professional summary of your skills and experience relevant to the job.", 
            "Asking them to read your resume instead.", 
            "Talking about your hobbies unrelated to work."
        ],
        correctAnswer: "A brief, professional summary of your skills and experience relevant to the job."
    },
    {
        question: "How should you answer 'What are your greatest strengths?' in an interview?",
        options: [
            "By listing generic strengths like 'hard-working' without context.",
            "By highlighting skills relevant to the job, supported by examples.",
            "By saying you don't have any weaknesses, only strengths.",
            "By mentioning personal strengths that are not related to the job."
        ],
        correctAnswer: "By highlighting skills relevant to the job, supported by examples."
    },
    {
        question: "What is the most effective way to discuss your weaknesses?",
        options: [
            "Claiming you have no weaknesses.",
            "Disguising a strength as a weakness, like 'I'm a perfectionist'.",
            "Mentioning a real weakness and explaining the steps you've taken to improve.",
            "Mentioning a critical weakness that would make you unfit for the job."
        ],
        correctAnswer: "Mention a real weakness and explaining the steps you've taken to improve."
    },
    {
        question: "A strong answer to 'Why do you want to work here?' primarily demonstrates what?",
        options: [
            "That you are actively looking for any job.",
            "That you've researched the company and see a mutual fit for your skills and goals.",
            "That you only care about the salary and benefits.",
            "That you haven't applied anywhere else."
        ],
        correctAnswer: "That you've researched the company and see a mutual fit for your skills and goals."
    },
    {
        question: "What is an interviewer typically assessing with the 'Where do you see yourself in 5 years?' question?",
        options: [
            "Your specific life plan, including personal goals.",
            "Your career ambitions and whether they align with the company's growth opportunities.",
            "Whether you plan to leave the company for a competitor soon.",
            "Your ability to predict the future accurately."
        ],
        correctAnswer: "Your career ambitions and whether they align with the company's growth opportunities."
    },
    {
        question: "Your answer to 'Why should we hire you?' should be a concise summary of what?",
        options: [
            "A repetition of your entire resume.",
            "How your skills and experience directly match the job description and will benefit the company.",
            "Why you are better than other candidates you don't know.",
            "Your personal need for the job."
        ],
        correctAnswer: "How your skills and experience directly match the job description and will benefit the company."
    },
    {
        question: "What makes an answer about your greatest achievement most impactful?",
        options: [
            "Describing a project without mentioning the outcome.",
            "Using a specific example with a measurable, positive result (e.g., increased sales by 15%).",
            "Talking about an achievement from your personal life.",
            "Taking credit for the entire team's work."
        ],
        correctAnswer: "Using a specific example with a measurable, positive result (e.g., increased sales by 15%)."
    },
    {
        question: "A good response about handling pressure should demonstrate what?",
        options: [
            "That you never feel pressure or stress.",
            "Positive coping strategies like prioritization, organization, and clear communication.",
            "That you complain to coworkers to relieve stress.",
            "That you avoid stressful situations altogether."
        ],
        correctAnswer: "Positive coping strategies like prioritization, organization, and clear communication."
    },
    {
        question: "When asked about salary expectations, it is best to:",
        options: [
            "Give a single, non-negotiable number.",
            "Say 'I'll take whatever you're offering.'",
            "Provide a well-researched range and express flexibility.",
            "Avoid answering the question entirely."
        ],
        correctAnswer: "Provide a well-researched range and express flexibility."
    },
    {
        question: "Asking thoughtful questions at the end of an interview primarily shows:",
        options: [
            "That you weren't paying attention during the interview.",
            "You are only interested in vacation days and benefits.",
            "That you have no questions, which is a sign of confidence.",
            "Your genuine interest in the role and that you are evaluating the company as well."
        ],
        correctAnswer: "Your genuine interest in the role and that you are evaluating the company as well."
    }
];

function GeneralQuestions() {
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();
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

    // ✅ UPDATED: useEffect now reads from the new nested structure
   useEffect(() => {
        setIsLoading(true);
        
        // First, explicitly reset the questions to the default state.
        // This is crucial for when a user logs out and currentUser becomes null.
        let questionsToLoad = initialFlashcardQuestions.map(q => ({...q}));

        // THEN, if a user is logged in and has edits, apply them.
        if (currentUser && currentUser.editedCards) {
            const userEdits = currentUser.editedCards;
            questionsToLoad = questionsToLoad.map(q => {
                const subCategoryTitle = q.title;
                const editedAnswer = userEdits[MAIN_CATEGORY_TITLE]?.[subCategoryTitle]?.[q.id];
                if (editedAnswer) {
                    return { ...q, back: editedAnswer };
                }
                return q;
            });
        }
        
        // Set the final state, which will be the default for new/logged-out users
        // or personalized for returning users.
        setQuestions(questionsToLoad);
        setIsLoading(false);
        
        // This effect now correctly depends on currentUser.
    }, [currentUser]);
    
    useEffect(() => {
        if (view !== 'practiceTest' || testFinished) return;
        if (timeLeft === 0) { setTestFinished(true); return; }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, view, testFinished]);

 // ✅ UPDATED: Now uses updateUserProfile from AuthContext
     const updateUserDeckProgress = useCallback(async ({ finalScore, totalQuestions, deckTitle }) => {
     if (!currentUser?.email) return;
 
     // ... (all the logic for preparing deck data remains the same) ...
     const percentage = totalQuestions > 0 ? finalScore / totalQuestions : 0;
     const isMastered = percentage >= 0.9;
     const deckType = deckTitle.endsWith(" Test") ? "Tests" : "Flashcards";
     const updatedCompleted = JSON.parse(JSON.stringify(currentUser.completedDecks || {}));
     const updatedMastered = JSON.parse(JSON.stringify(currentUser.masteredDecks || {}));
     
     if (isMastered) {
         updatedMastered[deckType] = updatedMastered[deckType] || {};
         updatedMastered[deckType][deckTitle] = true;
         if (updatedCompleted[deckType]?.[deckTitle]) {
             delete updatedCompleted[deckType][deckTitle];
         }
     } else {
         updatedCompleted[deckType] = updatedCompleted[deckType] || {};
         updatedCompleted[deckType][deckTitle] = true;
         if (updatedMastered[deckType]?.[deckTitle]) {
             delete updatedMastered[deckType][deckTitle];
         }
     }
 
     try {
         // Update completed/mastered decks
         await updateUserProfile(currentUser.email, {
             completedDecks: updatedCompleted,
             masteredDecks: updatedMastered
         });
 
         // Update accuracy stats
         await fetch(`http://localhost:5000/api/user/${currentUser.email}/stats`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 correct: finalScore,
                 total: totalQuestions
             })
         });
 
         // ✅ FIXED: Call the correct function from your AuthContext
         await fetchUserProfile(currentUser.email);
 
     } catch (error) {
         console.error("Failed to update user progress:", error);
     }
 }, [currentUser, updateUserProfile, fetchUserProfile]); 
 

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
            
        if (currentIndex + 1 === questions.length && questions.length === initialFlashcardQuestions.length) {
                updateUserDeckProgress({
                    finalScore: newCorrectCount,
                    totalQuestions: questions.length,
                    deckTitle: "General HR Questions",
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

    // ✅ UPDATED: handleSaveChanges now builds the nested object structure
    const handleSaveChanges = async () => {
        if (!currentUser?.email || Object.keys(changedAnswers).length === 0) {
            setIsEditMode(false);
            return;
        }
        const updatedEditedCards = JSON.parse(JSON.stringify(currentUser.editedCards || {}));

        Object.keys(changedAnswers).forEach(cardId => {
            const originalCard = initialFlashcardQuestions.find(q => q.id === cardId);
            if (originalCard) {
                const subCategoryTitle = originalCard.title;
                // Ensure nested structure exists
                updatedEditedCards[MAIN_CATEGORY_TITLE] = updatedEditedCards[MAIN_CATEGORY_TITLE] || {};
                updatedEditedCards[MAIN_CATEGORY_TITLE][subCategoryTitle] = updatedEditedCards[MAIN_CATEGORY_TITLE][subCategoryTitle] || {};
                // Set the new answer
                updatedEditedCards[MAIN_CATEGORY_TITLE][subCategoryTitle][cardId] = changedAnswers[cardId];
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
    
    // (Practice Test handlers are unchanged)
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
                deckTitle: "General HR Questions Test",
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

export default GeneralQuestions;

