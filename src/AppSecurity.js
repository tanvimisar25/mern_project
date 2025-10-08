import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Questions.css';
import { useAuth } from './AuthContext';

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

const MAIN_CATEGORY_TITLE = "Cybersecurity";
const SUB_CATEGORY_TITLE = "Application Security";

const initialFlashcardQuestions = [
    { id: "as_1", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is the OWASP Top 10?", back: "The OWASP (Open Web Application Security Project) Top 10 is a standard awareness document for developers and web application security professionals. It represents a broad consensus about the most critical security risks to web applications, updated every few years to reflect the changing threat landscape." },
    { id: "as_2", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is an SQL Injection (SQLi) attack?", back: "SQL Injection is a type of injection attack where an attacker inserts malicious SQL code into a query. If the application does not properly sanitize the user input, the malicious query can be executed against the database, allowing the attacker to bypass authentication, access, modify, or delete data." },
    { id: "as_3", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "How can you prevent SQL Injection?", back: "The primary defense is to use parameterized queries (also known as prepared statements). This practice separates the SQL query's structure from the user-supplied data, ensuring that the input is always treated as data and never as executable code. Input validation and using Object-Relational Mapping (ORM) tools also help." },
    { id: "as_4", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is Cross-Site Scripting (XSS)? Explain one type.", back: "Cross-Site Scripting (XSS) is a vulnerability where an attacker injects malicious scripts (usually JavaScript) into a web page viewed by other users.\nStored XSS: The malicious script is permanently stored on the target server (e.g., in a database via a comment field) and is served to every user who views the page." },
    { id: "as_5", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is 'Broken Access Control'? Give an example.", back: "Broken Access Control refers to flaws in how an application enforces restrictions on what authenticated users are allowed to do. An example is Insecure Direct Object Reference (IDOR), where a user can change a parameter in a URL (like ?invoiceId=100) to access another user's data (?invoiceId=101) without proper authorization checks." },
    { id: "as_6", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "Explain 'Security Misconfiguration.'", back: "Security Misconfiguration occurs when an application or its underlying infrastructure is not configured securely. This is a very common risk and can include things like leaving default usernames and passwords, having unnecessary ports open, displaying overly verbose error messages that leak information, or having misconfigured cloud services (like a publicly open S3 bucket)." },
    { id: "as_7", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What does 'Vulnerable and Outdated Components' refer to?", back: "This risk involves using components—such as libraries, frameworks, and other software modules—that are unsupported, out of date, or have known security vulnerabilities. Attackers can exploit these known flaws to take control of a system or steal data. A famous example is the Log4Shell vulnerability in the Log4j library." },
    { id: "as_8", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is Server-Side Request Forgery (SSRF)?", back: "SSRF is a vulnerability where an attacker can force a server-side application to make HTTP requests to an arbitrary domain of the attacker's choosing. This can be exploited to pivot and attack internal systems that are normally protected behind a firewall and inaccessible from the external network." },
    { id: "as_9", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is a common example of 'Identification and Authentication Failures'?", back: "This category, formerly known as Broken Authentication, covers failures in how an application manages user identity and sessions. A common example is allowing credential stuffing, where an attacker uses lists of compromised usernames and passwords to try and log into the system. Other examples include not enforcing strong password policies or improper session management." },
    { id: "as_10", deckId: "application_security", title: SUB_CATEGORY_TITLE, front: "What is a Content Security Policy (CSP)?", back: "A Content Security Policy (CSP) is an added layer of security, implemented via an HTTP response header, that helps to detect and mitigate certain types of attacks, particularly Cross-Site Scripting (XSS). It allows you to specify a whitelist of trusted sources from which a browser is allowed to load resources like scripts, styles, and images." }
];

const practiceTestQuestions = [
    { question: "An attacker altering a URL parameter like user_id=123 to user_id=124 to access another user's private data is a classic example of what vulnerability?", options: ["SQL Injection", "Cross-Site Scripting (XSS)", "Insecure Direct Object Reference (IDOR)", "Security Misconfiguration"], correctAnswer: "Insecure Direct Object Reference (IDOR)" },
    { question: "What is the most effective and widely recommended defense against SQL Injection attacks?", options: ["Blacklisting dangerous characters like ';'.", "Using a Web Application Firewall (WAF).", "Using parameterized queries (prepared statements).", "Encrypting the entire database."], correctAnswer: "Using parameterized queries (prepared statements)." },
    { question: "An attack where a malicious script is injected into a trusted website, which then executes in the victim's browser when they visit the site, is called:", options: ["Cross-Site Request Forgery (CSRF)", "Server-Side Request Forgery (SSRF)", "Cross-Site Scripting (XSS)", "Command Injection"], correctAnswer: "Cross-Site Scripting (XSS)" },
    { question: "Leaving default administrator credentials on a server, enabling directory listing, or showing detailed stack traces in error messages are examples of:", options: ["Injection", "Broken Access Control", "Security Misconfiguration", "Cryptographic Failures"], correctAnswer: "Security Misconfiguration" },
    { question: "The practice of validating, filtering, and encoding user-supplied data before it is rendered on a page is a primary defense against:", options: ["Broken Authentication", "Server-Side Request Forgery (SSRF)", "Insecure Design", "Cross-Site Scripting (XSS)"], correctAnswer: "Cross-Site Scripting (XSS)" },
    { question: "Which OWASP Top 10 category best describes the risk associated with using a third-party software library that has a publicly known exploit?", options: ["Insecure Design", "Security Misconfiguration", "Vulnerable and Outdated Components", "Software and Data Integrity Failures"], correctAnswer: "Vulnerable and Outdated Components" },
    { question: "Allowing users to set weak passwords, not protecting against brute-force attacks, and having insecure password recovery mechanisms fall under which OWASP category?", options: ["Cryptographic Failures", "Identification and Authentication Failures", "Broken Access Control", "Security Logging and Monitoring Failures"], correctAnswer: "Identification and Authentication Failures" },
    { question: "Storing user passwords in plain text or using a weak, deprecated hashing algorithm like MD5 in a database is an example of which vulnerability?", options: ["A01: Broken Access Control", "A02: Cryptographic Failures", "A03: Injection", "A05: Security Misconfiguration"], correctAnswer: "A02: Cryptographic Failures" },
    { question: "An attack that tricks a server into making a request to an internal service, like http://127.0.0.1/admin, is known as:", options: ["Cross-Site Request Forgery (CSRF)", "Server-Side Request Forgery (SSRF)", "Reflected XSS", "Insecure Deserialization"], correctAnswer: "Server-Side Request Forgery (SSRF)" },
    { question: "An application that does not adequately log security events like login failures makes it difficult to detect an ongoing attack. This issue is categorized under:", options: ["A04: Insecure Design", "A07: Identification and Authentication Failures", "A09: Security Logging and Monitoring Failures", "A01: Broken Access Control"], correctAnswer: "A09: Security Logging and Monitoring Failures" }
];

function AppSecurity() {
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
    const [timeLeft, setTimeLeft] = useState(180); 
    const [testFinished, setTestFinished] = useState(false);

    
    useEffect(() => {
        setIsLoading(true);

        // Copy bana of main question set to be safe. map questions ko separate kar raha hai
        let questionsToLoad = initialFlashcardQuestions.map(q => ({ ...q }));

        // If a user is logged in, check for their saved edits and apply them.
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
        
        setQuestions(questionsToLoad);
        setIsLoading(false);
    }, [currentUser]); 

    // This effect manages the timer for the practice test.
    useEffect(() => {
        if (view !== 'practiceTest' || testFinished) return;
        if (timeLeft === 0) {
            setTestFinished(true);
            return;
        }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId); 
    }, [timeLeft, view, testFinished]);

    // This function updates the user's progress in the database after a round.
    const updateUserDeckProgress = useCallback(async ({ finalScore, totalQuestions, deckTitle }) => {
        if (!currentUser?.email) return;

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
            await updateUserProfile(currentUser.email, {
                completedDecks: updatedCompleted,
                masteredDecks: updatedMastered
            });

            await fetch(`http://localhost:5000/api/user/${currentUser.email}/stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correct: finalScore,
                    total: totalQuestions
                })
            });

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

            // Only update backend progress if this is the end of the full initial deck.
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

    // Shuffles the current set of flashcards and resets the view.
    const handleShuffle = () => {
        if (!questions) return;
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
        handleReset();
    };
    
    // Resets the flashcard session to the beginning.
    const handleReset = () => {
        setCurrentIndex(0);
        setIsFlipped(false);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
        setAnimation('reset');
        setTimeout(() => setAnimation(''), 300);
    };

    // Updates the state when the user types in the textarea in edit mode.
    const handleAnswerChange = (index, newAnswer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].back = newAnswer;
        setQuestions(updatedQuestions);
        
        const questionId = updatedQuestions[index].id;
        setChangedAnswers(prev => ({ ...prev, [questionId]: newAnswer }));
    };

    // Starts a new flashcard round with only the incorrectly answered questions.
    const startPracticeRound = () => {
        setQuestions(roundResults.incorrect);
        handleReset();
    };

    // Saves the user's edited flashcard answers to their profile.
    const handleSaveChanges = async () => {
        if (!currentUser?.email || Object.keys(changedAnswers).length === 0) {
            setIsEditMode(false);
            return;
        }
        
        const updatedEditedCards = JSON.parse(JSON.stringify(currentUser.editedCards || {}));

        // Build the nested object structure for the database update.
        Object.keys(changedAnswers).forEach(cardId => {
            const originalCard = initialFlashcardQuestions.find(q => q.id === cardId);
            if (originalCard) {
                const subCategoryTitle = originalCard.title;
                updatedEditedCards[MAIN_CATEGORY_TITLE] = updatedEditedCards[MAIN_CATEGORY_TITLE] || {};
                updatedEditedCards[MAIN_CATEGORY_TITLE][subCategoryTitle] = updatedEditedCards[MAIN_CATEGORY_TITLE][subCategoryTitle] || {};
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

    //Practice Test Handlers

    const handleAnswerSelect = (answer) => setSelectedAnswer(answer);

    const handleNextQuestion = () => {
        const isCorrect = selectedAnswer === practiceTestQuestions[ptCurrentIndex].correctAnswer;
        const newPtScore = ptScore + (isCorrect ? 1 : 0);
        if (isCorrect) setPtScore(newPtScore);
        
        setUserAnswers(prev => [...prev, {
            question: practiceTestQuestions[ptCurrentIndex].question,
            selected: selectedAnswer,
            correct: practiceTestQuestions[ptCurrentIndex].correctAnswer,
            isCorrect
        }]);
        
        setSelectedAnswer(null);

        // Check if the test is over.
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
        setTimeLeft(180);
        setTestFinished(false);
    };

    // Helper function to format the timer display.
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    //Render Logic

    if (isLoading || !questions) {
        return <div className="loading-fullscreen">Loading Questions...</div>;
    }

    const currentQuestion = questions[currentIndex];

    // Render the initial choice screen.
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

    //Render: Flashcard Mode
    if (view === 'flashcards') {
        // Render the edit mode view.
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
                                    <textarea
                                        className="edit-textarea"
                                        value={q.back}
                                        onChange={(e) => handleAnswerChange(index, e.target.value)}
                                        rows="3"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }

        // Render the completion screen after a flashcard round.
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

        // Render the main flashcard interface.
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
                        <div className="footer-buttons"><button onClick={handleShuffle} title="Shuffle"><Icon path={ICONS.shuffle} /></button></div>
                    </footer>
                </div>
            </div>
        );
    }

    //Render: Practice Test Mode
    if (view === 'practiceTest') {
        const currentPtQuestion = practiceTestQuestions[ptCurrentIndex];
        
        // Render the test results screen.
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
        
        // Render the active practice test view.
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
                            <button
                                key={index}
                                className={`pt-option-btn ${selectedAnswer === option ? 'selected' : ''}`}
                                onClick={() => handleAnswerSelect(option)}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    <button
                        className="pt-next-button"
                        onClick={handleNextQuestion}
                        disabled={!selectedAnswer}
                    >
                        {ptCurrentIndex === practiceTestQuestions.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>
            </div>
        );
    }
}

export default AppSecurity;