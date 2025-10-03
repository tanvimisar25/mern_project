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
const MAIN_CATEGORY_TITLE = "Data Structure and Algorithm";
const SUB_CATEGORY_TITLE = "Trees & Graphs";

const initialFlashcardQuestions = [
    { id: "tg_1", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What is the difference between a Tree and a Graph?", back: "A tree is a special type of graph that is acyclic and connected. A graph can have cycles and multiple disconnected components." },
    { id: "tg_2", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "Explain the difference between BFS and DFS.", back: "BFS (Breadth-First Search) explores neighbor nodes first, using a queue. DFS (Depth-First Search) explores as far as possible along each branch before backtracking, using a stack or recursion." },
    { id: "tg_3", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What are the three main types of Binary Tree Traversal?", back: "In-order (Left, Root, Right), Pre-order (Root, Left, Right), and Post-order (Left, Right, Root)." },
    { id: "tg_4", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What is a Binary Search Tree (BST)? What is its main property?", back: "A BST is a binary tree where for each node, all values in its left subtree are less than the node's value, and all values in its right subtree are greater." },
    { id: "tg_5", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What is a Trie (Prefix Tree) and what is it used for?", back: "A Trie is a tree-like data structure used for efficient retrieval of keys in a dataset of strings. It's commonly used for autocomplete and spell-checking features." },
    { id: "tg_6", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "Explain Dijkstra's algorithm.", back: "Dijkstra's is a greedy algorithm that finds the shortest path between nodes in a weighted graph. It maintains a set of unvisited nodes and iteratively selects the one with the smallest distance." },
    { id: "tg_7", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What is an Adjacency List representation of a graph?", back: "An array of lists where the size of the array is the number of vertices. Each entry `array[i]` is a list of vertices adjacent to vertex `i`." },
    { id: "tg_8", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What is a heap? What is a min-heap vs a max-heap?", back: "A heap is a specialized tree-based data structure satisfying the heap property. In a max-heap, the parent node is always greater than or equal to its children. In a min-heap, it's always less than or equal to." },
    { id: "tg_9", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "How do you find the Lowest Common Ancestor (LCA) of two nodes in a BST?", back: "Starting from the root, if both nodes are smaller, move to the left child. If both are larger, move to the right. The first node where they split (or one is the node itself) is the LCA." },
    { id: "tg_10", deckId: "trgr", title: SUB_CATEGORY_TITLE, front: "What does it mean for a graph to be 'undirected' vs 'directed'?", back: "In an undirected graph, edges have no orientation (if A is connected to B, B is connected to A). In a directed graph, edges have a direction (A can point to B without B pointing to A)." }
];

const practiceTestQuestions = [
    { question: "For a balanced Binary Search Tree, what is the average time complexity for search, insert, and delete operations?", options: ["O(n)", "O(log n)", "O(1)", "O(n^2)"], correctAnswer: "O(log n)" },
    { question: "Which traversal of a Binary Search Tree will result in the nodes being visited in ascending order?", options: ["Pre-order", "Post-order", "Level-order", "In-order"], correctAnswer: "In-order" },
    { question: "Which data structure is typically used to implement a Breadth-First Search (BFS)?", options: ["Stack", "Queue", "HashMap", "Array"], correctAnswer: "Queue" },
    { question: "Dijkstra's algorithm is used to find the shortest path in which type of graph?", options: ["Unweighted graphs only", "Graphs with negative weight edges", "Directed Acyclic Graphs (DAGs)", "Weighted graphs with non-negative edges"], correctAnswer: "Weighted graphs with non-negative edges" },
    { question: "What is the maximum number of nodes in a binary tree of height 'h'? (Root is at height 0)", options: ["2^h", "h+1", "2^(h+1) - 1", "h^2"], correctAnswer: "2^(h+1) - 1" },
    { question: "Which graph representation is more space-efficient for a sparse graph (a graph with few edges)?", options: ["Adjacency Matrix", "Adjacency List", "Incidence Matrix", "Both are equally efficient"], correctAnswer: "Adjacency List" },
    { question: "A graph is considered 'cyclic' if:", options: ["It has more vertices than edges.", "It is not connected.", "There is at least one path that starts and ends on the same vertex.", "All vertices have a degree of 2."], correctAnswer: "There is at least one path that starts and ends on the same vertex." },
    { question: "In a max-heap, where is the largest element always located?", options: ["At the leftmost leaf node", "In the middle of the array representation", "At the root node", "At the rightmost leaf node"], correctAnswer: "At the root node" },
    { question: "Which of the following is NOT a tree?", options: ["A Binary Search Tree", "A linked list with a cycle", "A Trie", "A heap"], correctAnswer: "A linked list with a cycle" },
    { question: "Topological Sort is an algorithm that can be used on which type of graph?", options: ["Undirected cyclic graphs", "Directed Acyclic Graphs (DAGs)", "Complete graphs", "Unweighted graphs"], correctAnswer: "Directed Acyclic Graphs (DAGs)" }
];

function TreeGraph() {
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

export default TreeGraph;
