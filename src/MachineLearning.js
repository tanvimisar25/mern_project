import React, { useState, useEffect, useCallback } from 'react';
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Questions.css';

import { useAuth } from './AuthContext';

// --- (Reusable Components & Data) ---
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

// ✅ ADDED: Main and sub-category titles for the new data structure
const MAIN_CATEGORY_TITLE = "Data Science & ML";
const SUB_CATEGORY_TITLE = "Machine Learning Algorithms";

const initialFlashcardQuestions = [
    { id: "ml_1", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What is the main difference between Supervised and Unsupervised learning?", back: "Supervised learning uses labeled data to train a model, meaning each data point is tagged with a correct output or target. The goal is to learn a mapping function to predict outputs for new, unseen data (e.g., predicting house prices). Unsupervised learning uses unlabeled data to find patterns or structures within the data itself, without any predefined target variables (e.g., customer segmentation)." },
    { id: "ml_2", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "Explain what 'overfitting' is in a machine learning model.", back: "Overfitting occurs when a model learns the training data too well, including its noise and random fluctuations. As a result, the model has low error on the training data but performs poorly on new, unseen data because it fails to generalize." },
    { id: "ml_3", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "How does a Decision Tree work?", back: "A Decision Tree is a supervised learning algorithm that works by splitting the data into subsets based on the value of input features. It starts at a single root node and recursively splits the data at each node by selecting the feature that best separates the data (e.g., using Gini impurity or information gain), creating a tree-like structure of decisions." },
    { id: "ml_4", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What is the main idea behind a Support Vector Machine (SVM)?", back: "A Support Vector Machine is a classification algorithm that finds the optimal hyperplane that best separates data points of different classes in a high-dimensional space. The 'best' hyperplane is the one with the largest margin, which is the distance between the hyperplane and the nearest data points from each class (the 'support vectors')." },
    { id: "ml_5", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What is K-Means Clustering used for?", back: "K-Means Clustering is an unsupervised algorithm used to partition a dataset into a predefined number of K clusters. It works by iteratively assigning each data point to the nearest cluster centroid (mean) and then recalculating the centroids based on the new assignments until the clusters stabilize." },
    { id: "ml_6", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "Explain the difference between classification and regression.", back: "Both are types of supervised learning. Classification is used to predict a discrete categorical label (e.g., 'spam' or 'not spam'). Regression is used to predict a continuous numerical value (e.g., the price of a stock)." },
    { id: "ml_7", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What is a Random Forest, and why is it often better than a single Decision Tree?", back: "A Random Forest is an ensemble learning method that builds multiple decision trees during training and outputs the mode of the classes (classification) or the mean prediction (regression) of the individual trees. It is generally better because it reduces overfitting by averaging the results of many decorrelated trees, leading to higher accuracy and better generalization." },
    { id: "ml_8", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What is the Bias-Variance Tradeoff?", back: "The Bias-Variance Tradeoff is a fundamental concept in machine learning. Bias is the error from overly simplistic assumptions in the learning algorithm (underfitting), while Variance is the error from being too sensitive to small fluctuations in the training data (overfitting). The tradeoff is that decreasing one tends to increase the other, and the goal is to find a balance that minimizes the total error." },
    { id: "ml_9", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "How does the K-Nearest Neighbors (KNN) algorithm work?", back: "KNN is a simple, 'lazy' supervised learning algorithm. For a new data point, it finds the K closest data points in the training set (the 'neighbors'). For classification, it assigns the new point the most common class among its neighbors. For regression, it assigns the average of the values of its neighbors." },
    { id: "ml_10", deckId: "machine_learning_algorithms", title: SUB_CATEGORY_TITLE, front: "What are Precision and Recall, and when would you prefer one over the other?", back: "Precision measures the accuracy of positive predictions (of all positive predictions, how many were actually correct?). Recall measures the model's ability to find all actual positives (of all actual positives, how many did the model find?). You would prefer Precision when the cost of a false positive is high (e.g., spam detection). You would prefer Recall when the cost of a false negative is high (e.g., medical disease diagnosis)." }
];

const practiceTestQuestions = [
    {
        question: "Logistic Regression is a statistical model primarily used for which type of machine learning task?",
        options: [
            "Regression",
            "Clustering",
            "Classification",
            "Dimensionality Reduction"
        ],
        correctAnswer: "Classification"
    },
    {
        question: "To reduce the dimensionality of a dataset while preserving as much variance as possible, which algorithm is most suitable?",
        options: [
            "K-Means Clustering",
            "Linear Regression",
            "Principal Component Analysis (PCA)",
            "K-Nearest Neighbors (KNN)"
        ],
        correctAnswer: "Principal Component Analysis (PCA)"
    },
    {
        question: "A model that performs poorly on the training data and also poorly on the test data is likely suffering from:",
        options: [
            "Low bias",
            "High variance",
            "Overfitting",
            "High bias (underfitting)"
        ],
        correctAnswer: "High bias (underfitting)"
    },
    {
        question: "Which of the following is an example of an 'ensemble' learning method?",
        options: [
            "Support Vector Machine (SVM)",
            "Logistic Regression",
            "Random Forest",
            "K-Means Clustering"
        ],
        correctAnswer: "Random Forest"
    },
    {
        question: "Mean Squared Error (MSE) is a common metric used to evaluate the performance of which type of model?",
        options: [
            "Classification",
            "Regression",
            "Clustering",
            "Association Rule"
        ],
        correctAnswer: "Regression"
    },
    {
        question: "Which algorithm explicitly finds the optimal hyperplane to separate data points into classes?",
        options: [
            "K-Nearest Neighbors (KNN)",
            "Decision Tree",
            "Support Vector Machine (SVM)",
            "Naive Bayes"
        ],
        correctAnswer: "Support Vector Machine (SVM)"
    },
    {
        question: "In a medical screening test where it is critical to identify all individuals with a disease, even at the cost of misidentifying some healthy individuals, which metric should be prioritized?",
        options: [
            "Accuracy",
            "Precision",
            "Recall",
            "F1-Score"
        ],
        correctAnswer: "Recall"
    },
    {
        question: "Which of these is known as a 'lazy learning' algorithm because it doesn't build a model until a prediction is needed?",
        options: [
            "Decision Tree",
            "Support Vector Machine (SVM)",
            "K-Nearest Neighbors (KNN)",
            "Logistic Regression"
        ],
        correctAnswer: "K-Nearest Neighbors (KNN)"
    },
    {
        question: "Regularization techniques like L1 (Lasso) and L2 (Ridge) are primarily used in models like linear regression to:",
        options: [
            "Increase the model's bias.",
            "Speed up the training process.",
            "Prevent overfitting by penalizing large coefficients.",
            "Improve the model's performance on the training set."
        ],
        correctAnswer: "Prevent overfitting by penalizing large coefficients."
    },
    {
        question: "The 'K' in the K-Means Clustering algorithm refers to:",
        options: [
            "The number of iterations the algorithm runs.",
            "The number of data points in the dataset.",
            "The number of features for each data point.",
            "The number of clusters to be created."
        ],
        correctAnswer: "The number of clusters to be created."
    }
];

function MachineLearning() {
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
        if (currentUser && currentUser.editedCards) {
            const userEdits = currentUser.editedCards;
            const personalizedQuestions = initialFlashcardQuestions.map(q => {
                const subCategoryTitle = q.title;
                const editedAnswer = userEdits[MAIN_CATEGORY_TITLE]?.[subCategoryTitle]?.[q.id];
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

    // ✅ FIXED: Now includes the check to prevent firing on practice rounds
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

            // Only update progress if the user has just finished the FULL deck.
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
    
    // ✅ UPDATED: Simplified reset function
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
                        <div className="footer-buttons"><button onClick={handleShuffle} title="Shuffle"><Icon path={ICONS.shuffle} /></button></div>
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

export default MachineLearning; 