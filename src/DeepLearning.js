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
const SUB_CATEGORY_TITLE = "Deep Learning";

const initialFlashcardQuestions = [
    { id: "dl_1", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is a neuron in a neural network?", back: "A neuron, or perceptron, is the fundamental processing unit of a neural network. It receives one or more inputs, applies a weight to each, sums them up, adds a bias, and then passes the result through an activation function to produce an output." },
    { id: "dl_2", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is the purpose of an activation function? Name a common one.", back: "An activation function introduces non-linearity into the output of a neuron. Without non-linearity, a neural network, no matter how many layers it has, would behave just like a single-layer linear model. A very common activation function is ReLU (Rectified Linear Unit)." },
    { id: "dl_3", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "Explain the process of backpropagation.", back: "Backpropagation is the algorithm used to train neural networks. After a forward pass and loss calculation, it sends the error backward through the layers, computes gradients for weights and biases, and updates them (using optimizers like Gradient Descent) to improve the model." },
    { id: "dl_4", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is a Convolutional Neural Network (CNN) and what is it used for?", back: "A CNN is a specialized type of neural network designed to process grid-like data, such as images. It uses special layers called convolutional layers that apply filters to input data to capture spatial hierarchies and patterns (like edges, textures, and objects). They are primarily used for tasks like image classification, object detection, and segmentation." },
    { id: "dl_5", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What kind of problems are Recurrent Neural Networks (RNNs) suited for?", back: "RNNs are designed to work with sequential data. They have connections that form a directed cycle, allowing them to maintain a 'memory' or a hidden state that captures information about what has been processed so far. This makes them ideal for tasks like natural language processing (NLP), time series analysis, and speech recognition." },
    { id: "dl_6", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is the vanishing gradient problem?", back: "The vanishing gradient problem is an issue that can occur during the training of deep neural networks, especially RNNs. During backpropagation, the gradients can become exponentially small as they are propagated back through many layers. This means the weights of the initial layers do not get updated effectively, and the network fails to learn." },
    { id: "dl_7", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is a loss function?", back: "A loss function (or cost function) is a function that quantifies the difference between the model's predicted output and the actual target values. The goal of training is to adjust the model's weights to minimize the value of this loss function. Common examples include Mean Squared Error (MSE) for regression and Cross-Entropy Loss for classification." },
    { id: "dl_8", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "Explain the difference between an epoch, a batch, and an iteration.", back: "Epoch: One complete pass of the entire training dataset through the neural network.\nBatch: A subset of the training dataset. Instead of the entire dataset, the model processes data in smaller batches.\nIteration: A single update of the model's weights. This happens once per batch. If you have 1000 samples and a batch size of 100, one epoch consists of 10 iterations." },
    { id: "dl_9", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is a pooling layer in a CNN?", back: "A pooling layer (e.g., Max Pooling) is used in a CNN to progressively reduce the spatial size (width and height) of the feature maps. This reduces the number of parameters and computation in the network, which helps to control overfitting and makes the detected features more robust to changes in position." },
    { id: "dl_10", deckId: "deep_learning", title: SUB_CATEGORY_TITLE, front: "What is the main advantage of the ReLU activation function over Sigmoid?", back: "The main advantage of ReLU (Rectified Linear Unit) is that it does not saturate in the positive region, which helps to mitigate the vanishing gradient problem. It is also computationally very efficient, as it only involves a simple max(0, x) operation, leading to faster training times compared to the more complex exponential calculations in Sigmoid." }
];

const practiceTestQuestions = [
    {
        question: "Convolutional Neural Networks (CNNs) are most commonly and effectively used for which type of task?",
        options: [
            "Time series forecasting",
            "Text translation",
            "Image recognition",
            "Customer segmentation"
        ],
        correctAnswer: "Image recognition"
    },
    {
        question: "The core algorithm used to calculate gradients and update the weights in a neural network is called:",
        options: [
            "Gradient Descent",
            "Forward Propagation",
            "Backpropagation",
            "K-Means Clustering"
        ],
        correctAnswer: "Backpropagation"
    },
    {
        question: "Which activation function helps to mitigate the vanishing gradient problem and is the most widely used choice for hidden layers in deep neural networks?",
        options: [
            "Sigmoid",
            "Tanh",
            "ReLU (Rectified Linear Unit)",
            "Linear"
        ],
        correctAnswer: "ReLU (Rectified Linear Unit)"
    },
    {
        question: "In a neural network, the process of feeding an input through the layers to generate an output is known as:",
        options: [
            "Backpropagation",
            "Gradient Descent",
            "Forward Propagation (or Inference)",
            "An Epoch"
        ],
        correctAnswer: "Forward Propagation (or Inference)"
    },
    {
        question: "LSTMs and GRUs are advanced types of RNNs developed primarily to address which specific issue?",
        options: [
            "Overfitting on image data",
            "The inability to process text",
            "The vanishing and exploding gradient problems",
            "Slow computation on GPUs"
        ],
        correctAnswer: "The vanishing and exploding gradient problems"
    },
    {
        question: "For a multi-class classification problem with 10 classes, which activation function is most appropriate for the output layer?",
        options: [
            "ReLU",
            "Sigmoid",
            "Softmax",
            "Tanh"
        ],
        correctAnswer: "Softmax"
    },
    {
        question: "A single pass of the entire training dataset through the learning algorithm is called:",
        options: [
            "An iteration",
            "A batch",
            "An epoch",
            "A step"
        ],
        correctAnswer: "An epoch"
    },
    {
        question: "Which of the following is an advanced optimization algorithm, often used as an alternative to standard Stochastic Gradient Descent, to train deep learning models?",
        options: [
            "PCA",
            "Adam",
            "K-Means",
            "SVM"
        ],
        correctAnswer: "Adam"
    },
    {
        question: "For a binary classification problem (e.g., cat vs. dog), which loss function is the most suitable choice?",
        options: [
            "Mean Squared Error (MSE)",
            "Binary Cross-Entropy",
            "Hinge Loss",
            "Categorical Cross-Entropy"
        ],
        correctAnswer: "Binary Cross-Entropy"
    },
    {
        question: "Recurrent Neural Networks (RNNs) are distinguished from standard feedforward networks by the presence of:",
        options: [
            "Convolutional layers",
            "More hidden layers",
            "Feedback loops (cycles) allowing them to maintain a state",
            "Pooling layers"
        ],
        correctAnswer: "Feedback loops (cycles) allowing them to maintain a state"
    }
];

function DeepLearning() {
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

export default DeepLearning; 