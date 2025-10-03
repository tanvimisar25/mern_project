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
const SUB_CATEGORY_TITLE = "Resume & Project Deep Dive";

const initialFlashcardQuestions = [
    { id: "rd_1", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "Can you walk me through your resume, highlighting the experience most relevant to this role?", back: "I started my journey at [Company/University], where I developed a strong foundation in [Skill]. My most relevant experience was on [Project Name], where I used [Technology relevant to the job] to achieve [Specific outcome], aligning directly with this position." },
    { id: "rd_2", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "Looking at [Project Name] on your resume, can you explain what the project was about and its main goal?", back: "[Project Name] was a [web/mobile/backend] application designed to solve [problem]. The goal was to [e.g., improve user engagement by 20%], achieved by implementing [key features]." },
    { id: "rd_3", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "What was your specific role and what were your key contributions to that project?", back: "I was the [Role, e.g., Front-End Developer] responsible for [main responsibility]. My contributions included building [feature], integrating the [API name] API, and writing unit tests that increased coverage by [percentage]." },
    { id: "rd_4", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "What was the biggest technical challenge you faced during this project, and how did you overcome it?", back: "The biggest challenge was [e.g., optimizing slow database queries]. I solved it by [action, e.g., indexing tables and adding caching], which led to a [result, e.g., 50% faster response time]." },
    { id: "rd_5", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "Why did you and your team choose [Specific Technology] for this project? What alternatives did you consider?", back: "We chose [Tech, e.g., React] for its component-based architecture and community support. We considered [Alternative, e.g., Angular], but avoided it due to its steeper learning curve." },
    { id: "rd_6", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "If you could go back and do this project again, what would you do differently?", back: "I would implement a stronger CI/CD pipeline from the start. We initially used manual deployments, which were slow and error-prone. Automating earlier would have saved time and reduced risks." },
    { id: "rd_7", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "How did you handle version control and collaboration with your team on this project?", back: "We used Git with GitFlow branching. I created pull requests for features, which were peer-reviewed before merging into the main branch, ensuring quality and collaboration." },
    { id: "rd_8", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "Can you explain the architecture of the application you built in [Project Name]?", back: "It was a three-tier architecture: front-end built with [Tech], communicating with a RESTful API on [Backend Tech], storing data in [Database] and hosted on [Cloud Platform]." },
    { id: "rd_9", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "What was the outcome or business impact of this project? How did you measure its success?", back: "The project increased [e.g., user sign-ups by 15%]. Success was measured with analytics tools like Google Analytics, tracking KPIs such as conversion rates." },
    { id: "rd_10", deckId: "resume", title: SUB_CATEGORY_TITLE, front: "You've listed [Specific Skill, e.g., Docker] on your resume. Can you tell me about a time you used it?", back: "In my last project, I used Docker to containerize our Node.js app. I wrote a Dockerfile to define the environment, ensuring consistent development and deployment, saving hours in setup time." }
];

const practiceTestQuestions = [
    { question: "When an interviewer asks you to 'walk through a project,' what is the MOST critical element to include in your explanation?", options: ["Every single line of code you wrote.", "The names of all your team members.", "Your specific contributions and the measurable results or impact of the project.", "The project's budget and financial details."], correctAnswer: "Your specific contributions and the measurable results or impact of the project." },
    { question: "How should you describe a project that was a team effort?", options: ["Take credit for the entire project to look more capable.", "Clearly state it was a team project, specify your exact role, and use 'I' when describing your own contributions.", "Only mention what your teammates did.", "Downplay your role to appear humble."], correctAnswer: "Clearly state it was a team project, specify your exact role, and use 'I' when describing your own contributions." },
    { question: "What is the BEST way to answer, 'Why did you choose this technology?'", options: ["Because it was the only one I knew.", "It was my manager's decision, so I just followed it.", "Explain the technical reasons, such as performance or scalability, and mention any trade-offs you considered.", "It's the most popular technology, so we used it."], correctAnswer: "Explain the technical reasons, such as performance or scalability, and mention any trade-offs you considered." },
    { question: "If a project on your resume did not succeed or was never launched, how should you talk about it?", options: ["Avoid mentioning it or lie about its success.", "Blame the company or your manager for the failure.", "Be honest about the outcome, and focus on the technical skills you gained and the lessons you learned from the experience.", "Describe the project as if it were a major success."], correctAnswer: "Be honest about the outcome, and focus on the technical skills you gained and the lessons you learned from the experience." },
    { question: "When explaining a technical challenge, which approach is most effective?", options: ["Using highly complex jargon to sound intelligent, even if the interviewer may not understand it.", "Briefly stating the problem, the specific steps you took to solve it, and the positive result of your actions.", "Complaining about how difficult the challenge was.", "Giving a vague answer without providing any technical details."], correctAnswer: "Briefly stating the problem, the specific steps you took to solve it, and the positive result of your actions." },
    { question: "What is the main purpose of an interviewer asking deep-dive questions about your resume?", options: ["To catch you in a lie.", "To verify that you have the skills you claim and to understand the depth of your experience.", "To fill time during the interview.", "To test your memory."], correctAnswer: "To verify that you have the skills you claim and to understand the depth of your experience." },
    { question: "If there's a short employment gap on your resume, how should you address it if asked?", options: ["Make up a job you didn't have.", "Get defensive and refuse to answer.", "Explain it briefly and positively, focusing on any productive activities like learning a new skill, personal projects, or travel.", "Say it's a private matter."], correctAnswer: "Explain it briefly and positively, focusing on any productive activities like learning a new skill, personal projects, or travel." },
    { question: "When describing your achievements on your resume or in an interview, it is best to:", options: ["Use vague statements like 'was responsible for coding.'", "Quantify your impact with numbers and metrics whenever possible (e.g., 'Reduced page load time by 30%').", "Exaggerate the results to make them sound better.", "Focus only on the tasks you performed, not the results."], correctAnswer: "Quantify your impact with numbers and metrics whenever possible (e.g., 'Reduced page load time by 30%')." },
    { question: "If an interviewer asks about a skill on your resume that you are not an expert in, what should you do?", options: ["Pretend to be an expert and hope they don't ask follow-up questions.", "Be honest about your level of proficiency and give an example of how you have used it.", "Say you listed it by mistake.", "Quickly change the subject to a skill you are more comfortable with."], correctAnswer: "Be honest about your level of proficiency and give an example of how you have used it." },
    { question: "Before a deep-dive interview, what is the most crucial preparation step?", options: ["Memorize your entire resume word-for-word.", "Review every project on your resume, recall specific details, and practice explaining your role, challenges, and outcomes for each.", "Prepare excuses for any projects that didn't go well.", "Search for the interviewer's social media profiles."], correctAnswer: "Review every project on your resume, recall specific details, and practice explaining your role, challenges, and outcomes for each." }
];

function ResumeDive() {
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

export default ResumeDive;
