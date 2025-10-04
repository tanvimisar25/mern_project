import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Questions.css';
import { useAuth } from './AuthContext';

// --- (Reusable Components & Data) ---

// A simple, reusable SVG icon component.
const Icon = ({ path, className = "icon" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

// Central object to store SVG paths for all icons used in the component.
const ICONS = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    x: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
    undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
    shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
};

// Defines the titles for categorizing user's edited cards in the database.
const MAIN_CATEGORY_TITLE = "Web Development Concepts";
const SUB_CATEGORY_TITLE = "Front-End Frameworks";

// The default set of flashcard questions for this topic.
const initialFlashcardQuestions = [
    { id: "fe_1", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What is the Virtual DOM?", back: "The Virtual DOM (VDOM) is a concept where a virtual copy of the UI is kept in memory and synced with the real DOM. When a component’s state changes, the new VDOM is compared with the old one ('diffing'), and only the necessary updates are applied to the real DOM, making it faster." },
    { id: "fe_2", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "In React, what is the main difference between state and props?", back: "Props (properties) are read-only and are passed down from a parent component to a child component to communicate data. State is a private, mutable data structure managed within a component that holds data that can change over time, causing the component to re-render when it does." },
    { id: "fe_3", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What is a component lifecycle in a framework like React or Angular?", back: "A component lifecycle is a sequence of phases a component goes through from its creation (mounting) to its removal from the DOM (unmounting). Developers can tap into these phases using lifecycle methods (e.g., componentDidMount in class components or useEffect in functional React) to run code at specific times." },
    { id: "fe_4", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "Explain what two-way data binding is in a framework like Angular.", back: "Two-way data binding is a mechanism where changes in the UI (e.g., a user typing in an input field) automatically update the underlying component's model (state), and changes in the model automatically update the UI. Angular achieves this with the [(ngModel)] directive." },
    { id: "fe_5", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What are directives in Angular?", back: "Directives are markers on a DOM element that tell Angular to attach a specific behavior to that element or even transform it and its children. Examples include *ngIf to conditionally add/remove elements and *ngFor to render a list of items." },
    { id: "fe_6", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What is a primary architectural difference between React and Angular?", back: "React is a library focused only on the view layer, providing flexibility to choose other libraries for state management or routing. Angular is a full-fledged framework that is more opinionated, providing a comprehensive solution out-of-the-box for state management, routing, and HTTP requests." },
    { id: "fe_7", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What is a 'computed property' in Vue.js?", back: "A computed property is a value that is derived from other data properties. Vue caches computed properties based on their reactive dependencies; they only re-evaluate when a dependency has changed, making them more performant than calling a method in the template." },
    { id: "fe_8", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "How does a React Hook like useEffect work?", back: "The useEffect hook in React functional components allows you to perform side effects, such as data fetching, subscriptions, or manually changing the DOM. It runs after every render by default but can be configured to run only when specific state or props values change." },
    { id: "fe_9", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "How does state management work in a large-scale application?", back: "In large applications, passing state through many layers of components (prop drilling) becomes complex. Libraries like Redux (for React), Vuex (for Vue), or NgRx (for Angular) are used to manage a centralized, global state store that any component can access directly, making state management predictable and easier to debug." },
    { id: "fe_10", deckId: "frontend_frameworks", title: SUB_CATEGORY_TITLE, front: "What is JSX?", back: "JSX (JavaScript XML) is a syntax extension for JavaScript, commonly used with React. It allows you to write HTML-like code directly within your JavaScript, which is then transpiled into standard React.createElement() calls, making UI code more readable and easier to write." }
];

// The questions for the multiple-choice practice test.
const practiceTestQuestions = [
    { question: "In React, why is it a bad practice to directly modify the state object?", options: ["It will throw a syntax error.", "It does not trigger a re-render of the component to reflect the UI changes.", "It makes the component less secure.", "It is slower than using the setState method."], correctAnswer: "It does not trigger a re-render of the component to reflect the UI changes." },
    { question: "Which of the following is a key feature of Angular but NOT of React?", options: ["A Virtual DOM for performance optimization.", "A component-based architecture.", "An opinionated, built-in dependency injection system.", "The use of a syntax extension like JSX."], correctAnswer: "An opinionated, built-in dependency injection system." },
    { question: "In Vue.js, what is the primary purpose of the v-if directive?", options: ["To hide an element using CSS by setting display: none;.", "To conditionally render an element by actually adding or removing it from the DOM.", "To loop through an array of items and render them.", "To bind an element's visibility to a component's method."], correctAnswer: "To conditionally render an element by actually adding or removing it from the DOM." },
    { question: "What does the React hook useState return?", options: ["Only the current state value.", "A single function to update the state.", "An object containing the state and its update function.", "An array containing the current state value and a function to update it."], correctAnswer: "An array containing the current state value and a function to update it." },
    { question: "In Angular, what is the role of a 'Service'?", options: ["To define the HTML structure of a component.", "To handle styling and animations for the application.", "To encapsulate business logic or share data/functions across different components.", "To manage the application's routing configuration."], correctAnswer: "To encapsulate business logic or share data/functions across different components." },
    { question: "Which statement best describes Vue's reactivity system?", options: ["It requires manually calling a function like setState to track changes.", "It uses a Virtual DOM exclusively to detect changes.", "It automatically tracks dependencies and re-renders components only when dependent data changes.", "It re-renders the entire application on every state change."], correctAnswer: "It automatically tracks dependencies and re-renders components only when dependent data changes." },
    { question: "What is the primary advantage of using a component-based architecture in modern front-end frameworks?", options: ["It makes the application run faster by default.", "It allows developers to write code in a single massive file.", "It improves code reusability, maintainability, and encapsulation.", "It eliminates the need for CSS."], correctAnswer: "It improves code reusability, maintainability, and encapsulation." },
    { question: "In React, what are 'keys' used for when rendering a list of elements?", options: ["To provide a unique CSS class for each element in the list.", "To help React identify which items have changed, been added, or been removed for efficient updates.", "To act as a unique route for each item in the list.", "To store a secret value associated with the data."], correctAnswer: "To help React identify which items have changed, been added, or been removed for efficient updates." },
    { question: "Which of these is a structural directive in Angular?", options: ["ngModel", "ngStyle", "*ngFor", "ngClass"], correctAnswer: "*ngFor" },
    { question: "How does Redux maintain a predictable state container?", options: ["By allowing any part of the application to modify the state directly.", "By using a mutable state tree that can be changed by reference.", "By enforcing that all state mutations happen through pure functions called 'reducers.'", "By storing all application state in the browser's local storage."], correctAnswer: "By enforcing that all state mutations happen through pure functions called 'reducers.'" }
];

function FrontEnd() {
    // --- State Management ---
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();

    // Tracks the current view: 'options', 'flashcards', or 'practiceTest'.
    const [view, setView] = useState('options');
    // Holds the array of flashcard questions being displayed.
    const [questions, setQuestions] = useState(initialFlashcardQuestions);
    // Manages the loading state, e.g., while fetching user data.
    const [isLoading, setIsLoading] = useState(false);
    // Index of the current flashcard being viewed.
    const [currentIndex, setCurrentIndex] = useState(0);
    // Tracks if the current flashcard is flipped to its back.
    const [isFlipped, setIsFlipped] = useState(false);
    // Controls the animation class for card transitions.
    const [animation, setAnimation] = useState('');
    // Stores the user's score for the current flashcard round.
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    // Toggles the edit mode for flashcard answers.
    const [isEditMode, setIsEditMode] = useState(false);
    // Stores the results of a flashcard round to show on the completion screen.
    const [roundResults, setRoundResults] = useState({ correct: [], incorrect: [] });
    // Tracks which flashcard answers have been changed by the user in edit mode.
    const [changedAnswers, setChangedAnswers] = useState({});

    // --- State for Practice Test ---
    const [ptCurrentIndex, setPtCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [ptScore, setPtScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180); // Test timer set to 3 minutes.
    const [testFinished, setTestFinished] = useState(false);

    // This effect runs when the component mounts or when the user logs in/out.
    // It loads the initial questions and applies any personalized edits the user has saved.
    useEffect(() => {
        setIsLoading(true);

        // Always start by resetting to the default questions. This handles user logout.
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

        // Set the final state with either default or personalized cards.
        setQuestions(questionsToLoad);
        setIsLoading(false);
    }, [currentUser]); // Re-run this effect whenever the currentUser object changes.

    // This effect manages the timer for the practice test.
    useEffect(() => {
        if (view !== 'practiceTest' || testFinished) return;
        if (timeLeft === 0) {
            setTestFinished(true);
            return;
        }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId); // Cleanup function to prevent memory leaks.
    }, [timeLeft, view, testFinished]);

    // This function updates the user's progress in the database after a round.
    const updateUserDeckProgress = useCallback(async ({ finalScore, totalQuestions, deckTitle }) => {
        if (!currentUser?.email) return;

        const percentage = totalQuestions > 0 ? finalScore / totalQuestions : 0;
        const isMastered = percentage >= 0.9;
        const deckType = deckTitle.endsWith(" Test") ? "Tests" : "Flashcards";
        
        // Deep copy existing progress to avoid direct state mutation.
        const updatedCompleted = JSON.parse(JSON.stringify(currentUser.completedDecks || {}));
        const updatedMastered = JSON.parse(JSON.stringify(currentUser.masteredDecks || {}));
        
        // Logic to update either 'mastered' or 'completed' status.
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
            // Update the user's profile with completion/mastery data.
            await updateUserProfile(currentUser.email, {
                completedDecks: updatedCompleted,
                masteredDecks: updatedMastered
            });

            // Update the user's overall accuracy statistics.
            await fetch(`http://localhost:5000/api/user/${currentUser.email}/stats`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    correct: finalScore,
                    total: totalQuestions
                })
            });

            // Refresh the local user profile to reflect the changes.
            await fetchUserProfile(currentUser.email);

        } catch (error) {
            console.error("Failed to update user progress:", error);
        }
    }, [currentUser, updateUserProfile, fetchUserProfile]);

    // Toggles the flipped state of the flashcard.
    const handleFlip = () => !animation && setIsFlipped(!isFlipped);

    // Handles the user's response (correct or incorrect) to a flashcard.
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

            // Only update backend progress if this is the *end* of the *full* initial deck.
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

    // --- Practice Test Handlers ---

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
        setTimeLeft(180); // Reset timer to 3 minutes on restart.
        setTestFinished(false);
    };

    // Helper function to format the timer display.
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // --- Render Logic ---

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

    // --- Render: Flashcard Mode ---
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

    // --- Render: Practice Test Mode ---
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

export default FrontEnd;