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
const MAIN_CATEGORY_TITLE = "Cloud Computing";
const SUB_CATEGORY_TITLE = "Cloud Platforms & Services";

// The default set of flashcard questions for this topic.
const initialFlashcardQuestions = [
    { id: "cp_1", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "Difference between IaaS, PaaS, and SaaS?", back: "IaaS provides cloud infrastructure like servers and storage (e.g., AWS EC2), PaaS offers a platform to build and deploy apps without managing infrastructure (e.g., Heroku), and SaaS delivers ready-to-use software online (e.g., Google Workspace)." },
    { id: "cp_2", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "Explain the concept of an 'Availability Zone' (AZ) in a cloud platform.", back: "An Availability Zone (AZ) is one or more discrete data centers with redundant power, networking, and cooling, housed in separate facilities within a specific geographic Region. Deploying applications across multiple AZs provides high availability and fault tolerance, as it protects them from a single data center failure." },
    { id: "cp_3", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is AWS S3, and what type of storage is it?", back: "Amazon S3 (Simple Storage Service) is a highly scalable object storage service. It is designed to store and retrieve any amount of data from anywhere. It's not a file system for an OS, but is ideal for storing unstructured data like images, videos, backups, and static website assets." },
    { id: "cp_4", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is the primary 'compute' service in AWS, Azure, and GCP?", back: "These services provide virtual servers in the cloud:\nAWS: EC2 (Elastic Compute Cloud)\nAzure: Virtual Machines (VMs)\nGCP: Compute Engine" },
    { id: "cp_5", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is 'serverless' computing? Name one serverless service.", back: "Serverless computing is a cloud execution model where the cloud provider dynamically manages the allocation and provisioning of servers. Developers write and deploy code in functions without worrying about the underlying infrastructure. A popular example is AWS Lambda, Azure Functions, or Google Cloud Functions." },
    { id: "cp_6", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is a Virtual Private Cloud (VPC)?", back: "A VPC (Virtual Private Cloud), or VNet in Azure, is a logically isolated section of a public cloud where you can launch resources in a virtual network that you define. It gives you full control over your virtual networking environment, including a range of IP addresses, creation of subnets, and configuration of route tables and network gateways." },
    { id: "cp_7", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "Explain the Shared Responsibility Model in the cloud.", back: "The Shared Responsibility Model defines the security obligations of the cloud provider versus the customer. The provider (e.g., AWS) is responsible for the security 'of' the cloud (the infrastructure, hardware, and software that runs the services). The customer is responsible for security 'in' the cloud (managing their data, configuring access controls, and patching guest operating systems)." },
    { id: "cp_8", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is Auto Scaling?", back: "Auto Scaling is a cloud feature that automatically adjusts the number of compute resources (like EC2 instances or VMs) allocated to your application based on its current load or on a defined schedule. It helps to ensure performance during demand spikes and to minimize costs during quiet periods." },
    { id: "cp_9", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is a managed database service like Amazon RDS?", back: "A managed database service (like Amazon RDS, Azure SQL Database, or Google Cloud SQL) is a cloud service that automates the time-consuming administrative tasks of a database, such as hardware provisioning, setup, patching, and backups. This allows developers to focus on their application instead of database management." },
    { id: "cp_10", deckId: "cloud_platforms", title: SUB_CATEGORY_TITLE, front: "What is a Content Delivery Network (CDN)?", back: "A CDN is a globally distributed network of proxy servers that cache content closer to end-users. When a user requests content, the CDN redirects the request to the server with the lowest latency. This speeds up the delivery of static and dynamic content like images, videos, and web pages. Examples include AWS CloudFront and Azure CDN." }
];

// The questions for the multiple-choice practice test.
const practiceTestQuestions = [
    { question: "AWS Lambda is an example of which cloud computing model?", options: ["Infrastructure as a Service (IaaS)", "Platform as a Service (PaaS)", "Software as a Service (SaaS)", "Function as a Service (FaaS)"], correctAnswer: "Function as a Service (FaaS)" },
    { question: "To host a relational database like PostgreSQL with managed backups and scaling, which AWS service is the most appropriate choice?", options: ["Amazon S3", "Amazon EC2", "Amazon RDS", "Amazon DynamoDB"], correctAnswer: "Amazon RDS" },
    { question: "In cloud terminology, the ability of a system to automatically add or remove resources to precisely match fluctuating demand is known as:", options: ["High Availability", "Fault Tolerance", "Elasticity", "Durability"], correctAnswer: "Elasticity" },
    { question: "Which of the following is an example of an object storage service?", options: ["Amazon EBS (Elastic Block Store)", "Azure Disk Storage", "Google Cloud Storage", "A local hard drive"], correctAnswer: "Google Cloud Storage" },
    { question: "A company wants to lift-and-shift a legacy application to the cloud, giving them full control over the operating system and server environment. Which service model should they choose?", options: ["IaaS (Infrastructure as a Service)", "PaaS (Platform as a Service)", "SaaS (Software as a Service)", "FaaS (Function as a Service)"], correctAnswer: "IaaS (Infrastructure as a Service)" },
    { question: "Under the AWS Shared Responsibility Model, which of the following is the customer's responsibility?", options: ["Managing the physical security of data centers.", "Patching the host operating system of an EC2 instance.", "Configuring security groups and network ACLs.", "Maintaining the networking hardware."], correctAnswer: "Configuring security groups and network ACLs." },
    { question: "Amazon EC2, Azure Virtual Machines, and Google Compute Engine are all examples of which service model?", options: ["SaaS", "PaaS", "IaaS", "FaaS"], correctAnswer: "IaaS" },
    { question: "Which service is designed to deliver web content to end-users with low latency by caching it at locations around the world?", options: ["A Virtual Private Cloud (VPC)", "An Auto Scaling Group", "A Content Delivery Network (CDN)", "An Object Storage bucket"], correctAnswer: "A Content Delivery Network (CDN)" },
    { question: "Azure's globally distributed, multi-model NoSQL database service, designed for high availability and low latency, is called:", options: ["Azure SQL Database", "Azure Blob Storage", "Azure Cosmos DB", "Azure Synapse"], correctAnswer: "Azure Cosmos DB" },
    { question: "A geographic area containing two or more Availability Zones is known as a:", options: ["Edge Location", "Region", "Data Center", "Local Zone"], correctAnswer: "Region" }
];

function CloudPlatforms() {
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

export default CloudPlatforms;