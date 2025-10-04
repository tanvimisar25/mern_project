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
const MAIN_CATEGORY_TITLE = "Data Science & ML";
const SUB_CATEGORY_TITLE = "Statistics & Probability";

// The default set of flashcard questions for this topic.
const initialFlashcardQuestions = [
    { id: "sp_1", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is the difference between mean, median, and mode?", back: "They are all measures of central tendency.\nMean is the average of all data points.\nMedian is the middle value in a sorted dataset. It's robust to outliers.\nMode is the value that appears most frequently in a dataset." },
    { id: "sp_2", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "Explain what a p-value is in the context of hypothesis testing.", back: "A p-value is the probability of observing results as extreme as, or more extreme than, the ones actually observed, assuming the null hypothesis is true. A small p-value (typically < 0.05) suggests that the observed data is unlikely under the null hypothesis, leading us to reject it." },
    { id: "sp_3", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is the Central Limit Theorem (CLT)?", back: "The Central Limit Theorem states that the sampling distribution of the sample mean will approach a normal distribution as the sample size gets larger, regardless of the shape of the population distribution. This theorem is foundational to many statistical procedures." },
    { id: "sp_4", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "Describe the difference between Type I and Type II errors.", back: "In hypothesis testing:\nA Type I error is a 'false positive': rejecting the null hypothesis when it is actually true.\nA Type II error is a 'false negative': failing to reject the null hypothesis when it is actually false." },
    { id: "sp_5", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is Bayes' Theorem used for?", back: "Bayes' Theorem is used to calculate conditional probability. It describes the probability of an event based on prior knowledge of conditions that might be related to the event. It allows us to update our beliefs about a hypothesis as we gather more evidence. P(A|B) = P(B|A) * P(A) / P(B)" },
    { id: "sp_6", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "Explain the difference between correlation and causation.", back: "Correlation is a statistical measure that indicates the extent to which two or more variables fluctuate together. A positive correlation means they move in the same direction, while a negative correlation means they move in opposite directions. Causation indicates that one event is the result of the occurrence of the other event. Correlation does not imply causation." },
    { id: "sp_7", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is a Normal Distribution and what are its key properties?", back: "A Normal Distribution, also known as a Gaussian distribution or 'bell curve,' is a probability distribution that is symmetric about the mean. Its key properties are that the mean, median, and mode are all equal, and it is defined by its mean (μ) and standard deviation (σ)." },
    { id: "sp_8", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is selection bias?", back: "Selection bias is a systematic error that occurs when the sample population is not a proper representation of the population being studied. This happens when the process of selecting subjects or data for analysis is not random, leading to skewed and inaccurate conclusions." },
    { id: "sp_9", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is a confidence interval?", back: "A confidence interval is a range of values, derived from a sample, that is likely to contain the true value of an unknown population parameter. For example, a 95% confidence interval means that if we were to take many samples and construct an interval for each, 95% of those intervals would contain the true population parameter." },
    { id: "sp_10", deckId: "statistics_probability", title: SUB_CATEGORY_TITLE, front: "What is the difference between descriptive and inferential statistics?", back: "Descriptive statistics summarize or describe the characteristics of a known dataset (e.g., calculating the mean or standard deviation). Inferential statistics use data from a sample to make inferences or predictions about a larger population (e.g., conducting a hypothesis test or creating a confidence interval)." }
];

// The questions for the multiple-choice practice test.
const practiceTestQuestions = [
    { question: "In a dataset that is skewed by a few very high-income individuals, which measure of central tendency would be the most representative of a typical person's income?", options: ["Mean", "Median", "Mode", "Standard Deviation"], correctAnswer: "Median" },
    { question: "You conduct a statistical test and get a p-value of 0.02. If you are using a standard alpha level of 0.05, what is the most appropriate conclusion?", options: ["Accept the null hypothesis.", "Reject the null hypothesis.", "The test is inconclusive.", "The alternative hypothesis is false."], correctAnswer: "Reject the null hypothesis." },
    { question: "The bell-shaped curve is characteristic of which probability distribution?", options: ["Binomial Distribution", "Poisson Distribution", "Normal Distribution", "Uniform Distribution"], correctAnswer: "Normal Distribution" },
    { question: "A medical test incorrectly identifies a healthy person as having a disease. This is an example of which type of error?", options: ["Type I Error", "Type II Error", "Random Error", "Sampling Error"], correctAnswer: "Type I Error" },
    { question: "If the correlation coefficient between two variables is -0.9, what does this indicate?", options: ["A strong positive linear relationship.", "A weak negative linear relationship.", "A strong negative linear relationship.", "No linear relationship."], correctAnswer: "A strong negative linear relationship." },
    { question: "According to the Central Limit Theorem, what happens to the shape of the sampling distribution of the sample mean as the sample size gets larger?", options: ["It becomes skewed to the right.", "It approaches a normal distribution.", "It becomes uniform.", "It depends on the underlying population distribution."], correctAnswer: "It approaches a normal distribution." },
    { question: "If two events, A and B, are independent, the probability that both occur, P(A and B), is:", options: ["P(A) + P(B)", "P(A) / P(B)", "P(A | B)", "P(A) * P(B)"], correctAnswer: "P(A) * P(B)" },
    { question: "The range of values between the 25th percentile (Q1) and the 75th percentile (Q3) is known as:", options: ["The standard deviation", "The variance", "The Interquartile Range (IQR)", "The Z-score"], correctAnswer: "The Interquartile Range (IQR)" },
    { question: "A standard normal distribution is a normal distribution with:", options: ["A mean of 1 and a standard deviation of 1.", "A mean of 0 and a standard deviation of 1.", "A mean of 0 and a standard deviation of 0.", "Any mean and a standard deviation of 1."], correctAnswer: "A mean of 0 and a standard deviation of 1." },
    { question: "The process of using a sample of data to make conclusions about a larger population is called:", options: ["Descriptive Statistics", "Data Wrangling", "Inferential Statistics", "Data Visualization"], correctAnswer: "Inferential Statistics" }
];

function Stats() {
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

export default Stats;