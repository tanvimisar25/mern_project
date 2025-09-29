import React from 'react';
import { useState, useEffect, useCallback } from 'react'; // This line might have been the issue
import { Link } from "react-router-dom";
import './Questions.css';

// ✅ 1. IMPORT THE USEAUTH HOOK - This is the correct way to get user info.
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

const initialFlashcardQuestions = [
    { id: "ns_1", deckId: "network_security_fundamentals", front: "What is the CIA Triad in cybersecurity?", back: "The CIA Triad is a foundational model that guides security policies. It stands for:\nConfidentiality: Ensuring that data is accessible only to authorized users. (Achieved via encryption, access controls).\nIntegrity: Maintaining the consistency, accuracy, and trustworthiness of data over its entire lifecycle. (Achieved via hashing, digital signatures).\nAvailability: Ensuring that systems and data are operational and accessible to authorized users when needed. (Achieved via redundancy, disaster recovery)." },
    { id: "ns_2", deckId: "network_security_fundamentals", front: "What is the primary function of a firewall?", back: "A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on a predefined set of security rules. It acts as a barrier between a trusted internal network and an untrusted external network (like the internet) to block malicious traffic." },
    { id: "ns_3", deckId: "network_security_fundamentals", front: "Explain what a VPN (Virtual Private Network) is used for.", back: "A VPN is used to create a secure, encrypted connection over a public network, like the internet. It establishes a 'tunnel' that encrypts all the user's internet traffic, providing confidentiality and privacy by hiding their IP address and online activities from eavesdroppers." },
    { id: "ns_4", deckId: "network_security_fundamentals", front: "What is the difference between an Intrusion Detection System (IDS) and an Intrusion Prevention System (IPS)?", back: "An IDS is a passive system that monitors network traffic for suspicious activity or policy violations and sends an alert when it detects a potential threat. It only detects and reports.\nAn IPS is an active system that sits in-line with traffic. It not only detects malicious activity but also takes automatic action to block or prevent it." },
    { id: "ns_5", deckId: "network_security_fundamentals", front: "What security guarantee does HTTPS provide that HTTP does not?", back: "HTTPS (Hypertext Transfer Protocol Secure) uses encryption (via TLS/SSL protocols) to secure the communication between a client and a server. This provides confidentiality (preventing eavesdropping) and integrity (preventing data tampering) for the data in transit, which the standard HTTP protocol lacks." },
    { id: "ns_6", deckId: "network_security_fundamentals", front: "Describe a Distributed Denial-of-Service (DDoS) attack.", back: "A DDoS attack is a malicious attempt to make an online service unavailable to legitimate users by overwhelming it with a flood of internet traffic from multiple sources. These sources are often a 'botnet' of compromised computers. The goal is to exhaust the target's resources, like bandwidth or server capacity." },
    { id: "ns_7", deckId: "network_security_fundamentals", front: "What is a 'man-in-the-middle' (MitM) attack?", back: "A man-in-the-middle (MitM) attack is a form of eavesdropping where an attacker secretly relays and possibly alters the communication between two parties who believe they are directly communicating with each other. The attacker intercepts the entire conversation and can inject malicious data or steal sensitive information." },
    { id: "ns_8", deckId: "network_security_fundamentals", front: "What is a DMZ (Demilitarized Zone) in the context of network security?", back: "A DMZ is a perimeter network that protects an organization's internal local-area network (LAN) from an untrusted network, usually the internet. It's a subnetwork that sits between the internal network and the internet, hosting external-facing services like web servers or email servers. This isolates them so that if a service in the DMZ is compromised, the internal network remains secure." },
    { id: "ns_9", deckId: "network_security_fundamentals", front: "Explain the principle of 'least privilege.'", back: "The principle of least privilege is a security concept in which a user is given only the minimum levels of access—or permissions—needed to perform their job functions. This minimizes the potential damage that can be caused by a compromised user account or an insider threat." },
    { id: "ns_10", deckId: "network_security_fundamentals", front: "What is phishing?", back: "Phishing is a type of social engineering attack where an attacker sends a fraudulent message (often an email) designed to trick a person into revealing sensitive information (like passwords or credit card numbers) or to deploy malicious software on the victim's machine." }
];

const practiceTestQuestions = [
    {
        question: "The 'A' in the CIA Triad of cybersecurity stands for:",
        options: [
            "Authentication",
            "Authorization",
            "Availability",
            "Auditing"
        ],
        correctAnswer: "Availability"
    },
    {
        question: "A security device that filters network traffic based on a set of predefined rules is called a:",
        options: [
            "Router",
            "Switch",
            "Firewall",
            "Hub"
        ],
        correctAnswer: "Firewall"
    },
    {
        question: "Which protocol is most commonly used to provide a secure, encrypted command-line interface to a remote server?",
        options: [
            "FTP",
            "Telnet",
            "SSH",
            "HTTP"
        ],
        correctAnswer: "SSH"
    },
    {
        question: "A system that can only monitor and alert on suspicious network activity but cannot take action to block it is a(n):",
        options: [
            "Intrusion Prevention System (IPS)",
            "VPN Concentrator",
            "Intrusion Detection System (IDS)",
            "Stateful Firewall"
        ],
        correctAnswer: "Intrusion Detection System (IDS)"
    },
    {
        question: "An attack that overwhelms a server with traffic from many different compromised computers is known as:",
        options: [
            "Phishing",
            "Man-in-the-Middle",
            "Distributed Denial-of-Service (DDoS)",
            "SQL Injection"
        ],
        correctAnswer: "Distributed Denial-of-Service (DDoS)"
    },
    {
        question: "The encryption protocol that secures communications for HTTPS is:",
        options: [
            "IPsec",
            "WPA2",
            "TLS/SSL",
            "SSH"
        ],
        correctAnswer: "TLS/SSL"
    },
    {
        question: "The security principle of providing a user with only the minimum level of access necessary to perform their job is called:",
        options: [
            "Defense in Depth",
            "Zero Trust",
            "Principle of Least Privilege",
            "Access Control"
        ],
        correctAnswer: "Principle of Least Privilege"
    },
    {
        question: "An email that appears to be from your bank and asks you to click a link to verify your password is a common form of what attack?",
        options: [
            "DDoS",
            "Phishing",
            "Cross-Site Scripting (XSS)",
            "Ransomware"
        ],
        correctAnswer: "Phishing"
    },
    {
        question: "In the OSI model, which layer is responsible for routing and forwarding IP packets between networks?",
        options: [
            "Layer 2 (Data Link)",
            "Layer 7 (Application)",
            "Layer 4 (Transport)",
            "Layer 3 (Network)"
        ],
        correctAnswer: "Layer 3 (Network)"
    },
    {
        question: "A VPN creates a secure, encrypted connection over a public network. This connection is often referred to as a:",
        options: [
            "Tunnel",
            "Pipe",
            "Channel",
            "DMZ"
        ],
        correctAnswer: "Tunnel"
    }
];

function NetworkSecurity() {
    // ✅ 2. GET THE LOGGED-IN USER FROM THE CENTRAL AUTH CONTEXT
    const { currentUser } = useAuth();

    // --- State Management ---
    const [view, setView] = useState('options');
    const [questions, setQuestions] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [animation, setAnimation] = useState('');
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [isEditMode, setIsEditMode] = useState(false);
    const [roundResults, setRoundResults] = useState({ correct: [], incorrect: [] });
    const [changedAnswers, setChangedAnswers] = useState({});
    
    // (Practice test states are unchanged)
    const [ptCurrentIndex, setPtCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [ptScore, setPtScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [testFinished, setTestFinished] = useState(false);

    // --- Data Loading Effect ---
    useEffect(() => {
        const loadUserQuestions = async () => {
            setIsLoading(true);
            if (!currentUser) {
                // If no user is logged in, show the default questions
                setQuestions(initialFlashcardQuestions);
                setIsLoading(false);
                return;
            }
            try {
                // Get the user's data from their profile
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                const userProfile = await usersCollection.findOne({ "auth_id": currentUser.id });

                if (userProfile && userProfile.editedDecks) {
    const personalizedQuestions = initialFlashcardQuestions.map(q => {
        const deckEdits = userProfile.editedDecks[q.deckId];  // e.g., "behave"
        if (deckEdits && deckEdits[q.id]) {
            return { ...q, back: deckEdits[q.id] };
        }
        return q;
    });
    setQuestions(personalizedQuestions);
} else {
    setQuestions(initialFlashcardQuestions);
}
            } catch (error) {
                console.error("Failed to load user data:", error);
                setQuestions(initialFlashcardQuestions); // Fallback on error
            } finally {
                setIsLoading(false);
            }
        };
        if (currentUser) {
        // If a user IS logged in, load their specific data.
        loadUserQuestions();
    } else {
        // If NO user is logged in (i.e., on logout), reset the state.
        // This "wipes the whiteboard clean" and prevents showing the previous user's data.
        console.log("User logged out. Resetting component state.");
        setQuestions(initialFlashcardQuestions);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
        setCurrentIndex(0);
        setIsFlipped(false);
        setChangedAnswers({});
        setIsLoading(false); // We aren't loading, so stop the loading indicator.
    }
}, [currentUser]);

    // --- Other Effects (No changes) ---
    useEffect(() => {
        if (!isLoading) { // Prevent resetting index while loading new questions
            setCurrentIndex(0);
            setIsFlipped(false);
            setAnimation('');
        }
    }, [questions, isLoading]);
    
    useEffect(() => {
        if (view !== 'practiceTest' || testFinished) return;
        if (timeLeft === 0) { setTestFinished(true); return; }
        const timerId = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, view, testFinished]);

    // ✅ REPLACE THIS ENTIRE FUNCTION IN BehavioralQuestions.js

    const updateUserDeckProgress = useCallback(async ({ finalScore, totalQuestions, deckId, deckType, deckCategory }) => {
        if (!currentUser) return;

        const percentage = finalScore / totalQuestions;
        const isMastered = percentage >= 0.9; // Mastery threshold: 90%

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");

            let updateOperation;

            if (isMastered) {
                const masteredPath = `masteredDecks.${deckType}.${deckCategory}`;
                const completedPath = `completedDecks.${deckType}.${deckCategory}`;
                updateOperation = {
                    $addToSet: { [masteredPath]: deckId }, // Add to mastered list
                    $pull: { [completedPath]: deckId }      // Remove from completed list
                };
                console.log(`Deck '${deckId}' mastered! Moving to Mastered list.`);
            } else {
                // --- THIS IS THE FIX ---
                const completedPath = `completedDecks.${deckType}.${deckCategory}`;
                const masteredPath = `masteredDecks.${deckType}.${deckCategory}`;
                updateOperation = {
                    $addToSet: { [completedPath]: deckId }, // Add to completed list
                    $pull: { [masteredPath]: deckId }       // AND REMOVE from mastered list
                };
                console.log(`Score for '${deckId}' was below 90%. Moving to Completed and removing from Mastered.`);
            }

            await usersCollection.updateOne({ "auth_id": currentUser.id }, updateOperation);

        } catch (error) {
            console.error("Failed to update user deck progress:", error);
        }
    }, [currentUser]);

    // --- Handlers ---
    const handleFlip = () => !animation && setIsFlipped(!isFlipped);
    
    // This is the only function you need to replace in your BehavioralQuestions.js file

// Replace the existing handleAnswer function with this one

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
            
            // Check if this was the last question
            if (currentIndex + 1 === questions.length) {
                updateUserDeckProgress({
                    finalScore: newCorrectCount,
                    totalQuestions: questions.length,
                    deckId: "network_security_fundamentals",
                    deckType: "Flashcards",
                    deckCategory: "Network Security"
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
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
    };

// This is the only function you need to replace in your BehavioralQuestions.js file

const handleReset = () => {
    setIsLoading(true); // Show loading feedback while we re-fetch

    // THIS IS THE FIX:
    // This is the exact same, correct data-loading logic from your useEffect hook.
    // By re-using it here, we ensure that restarting the deck always fetches
    // the latest saved answers from your 'editedDecks' object in the database.
    const loadData = async () => {
        if (currentUser) {
            try {
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                const userProfile = await usersCollection.findOne({ "auth_id": currentUser.id });

                const userEdits = userProfile?.editedDecks || {};
                const personalizedQuestions = initialFlashcardQuestions.map(q => {
                    const deckId = q.deckId;
                    const cardId = q.id;
                    if (userEdits[deckId] && userEdits[deckId][cardId]) {
                        return { ...q, back: userEdits[deckId][cardId] };
                    }
                    return q;
                });
                setQuestions(personalizedQuestions);
            } catch (error) {
                console.error("Failed to re-load user data on reset:", error);
                setQuestions(initialFlashcardQuestions); // Fallback on error
            }
        } else {
            // If logged out, just reset to the default questions
            setQuestions(initialFlashcardQuestions);
        }
        setIsLoading(false);
    };

    loadData(); // Execute the data-loading function

    // Reset all the progress states
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
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
    };

    // In BehavioralQuestions.js, replace your entire handleSaveChanges function with this one.

const handleSaveChanges = async () => {
    // For debugging, let's see which user is saving.
    console.log("Attempting to save changes for user:", currentUser);

    
    if (Object.keys(changedAnswers).length === 0) {
        setIsEditMode(false);
        return;
    }
    try {
        const mongo = currentUser.mongoClient("mongodb-atlas");
        const usersCollection = mongo.db("prepdeck").collection("user");
        
        const updates = {};
        Object.keys(changedAnswers).forEach(cardId => {
            const originalCard = initialFlashcardQuestions.find(q => q.id === cardId);
            if (originalCard) {
                updates[`editedDecks.${originalCard.deckId}.${cardId}`] = changedAnswers[cardId];
            }
        });

        console.log("Sending these updates to the database:", updates);

        // --- ✅ THIS IS THE FIX ---
        // We are simplifying the query to ONLY use currentUser.id.
        // This makes it consistent with how users are created and prevents the bug.
        const result = await usersCollection.updateOne(
            { "auth_id": currentUser.id }, // The corrected, reliable query
            { $set: updates }
        );

        console.log("MongoDB update result:", result);

        // Check if the update actually found a user to modify.
        if (result.matchedCount === 0) {
            alert("Error: Could not find your user profile to save the changes.");
        } 
        
        setChangedAnswers({});
        setIsEditMode(false);
    } catch (error) {
        console.error("Failed to save edited cards:", error);
        alert("An error occurred while saving your changes. Please check the console.");
    }
};
    
    // Practice Test handlers are unchanged
    const handleAnswerSelect = (answer) => setSelectedAnswer(answer);
    // Replace the existing handleNextQuestion function with this one

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
                deckId: "network_security_fundamentals_test",
                deckType: "Tests",
                deckCategory: "Network Security"
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

    // --- Render Logic ---
    if (isLoading || !questions) {
        return <div className="loading-fullscreen">Loading Questions...</div>;
    }
    
    const currentQuestion = questions[currentIndex];

    if (view === 'options') {
        return (
            <div className="app-container">
                <div className="start-options-container">
                    <div className="start-screen">
                        <h1> Prep Flashcards</h1>
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

export default NetworkSecurity;