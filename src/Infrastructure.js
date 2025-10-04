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
const MAIN_CATEGORY_TITLE = "DevOps & CI/CD";
const SUB_CATEGORY_TITLE = "Infrastructure as Code";

const initialFlashcardQuestions = [
    { id: "iac_1", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is Infrastructure as Code (IaC)?", back: "Infrastructure as Code (IaC) is the practice of managing and provisioning computing infrastructure (like networks, virtual machines, and load balancers) through machine-readable definition files, rather than through physical hardware configuration or interactive configuration tools. This allows for automation, versioning, and repeatability." },
    { id: "iac_2", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "Explain the difference between a declarative and an imperative approach to IaC.", back: "Declarative (What): You define the desired end state of the system, and the IaC tool is responsible for figuring out how to achieve that state. (Example: Terraform, CloudFormation).\nImperative (How): You write scripts that specify the exact steps needed to achieve the desired configuration. (Example: A traditional shell script)." },
    { id: "iac_3", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is 'idempotency' in the context of IaC?", back: "Idempotency is the property that an operation can be applied multiple times without changing the result beyond the initial application. In IaC, this means running the same configuration script multiple times will always result in the same defined infrastructure state, ensuring consistency and preventing unintended changes." },
    { id: "iac_4", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is Terraform, and what is its main advantage over a tool like AWS CloudFormation?", back: "Terraform is an open-source IaC tool created by HashiCorp. Its main advantage over a cloud-specific tool like AWS CloudFormation is that it is cloud-agnostic. It uses 'providers' to manage resources on multiple cloud platforms (like AWS, Azure, and GCP) and other services using a single, consistent workflow." },
    { id: "iac_5", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is the purpose of the terraform.tfstate file?", back: "The Terraform state file (terraform.tfstate) is a crucial file that Terraform uses to store the state of the managed infrastructure. It maps the resources defined in your configuration files to the real-world resources that have been created, tracks metadata, and helps improve performance by caching resource attributes." },
    { id: "iac_6", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is the difference between terraform plan and terraform apply?", back: "terraform plan is a dry run command. It creates an execution plan by comparing the desired state in your configuration files with the current state in the .tfstate file and shows you what changes (creations, updates, or destructions) will be made.\nterraform apply is the command that executes the plan, applying the proposed changes to create or modify the infrastructure." },
    { id: "iac_7", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is 'configuration drift' and how does IaC help prevent it?", back: "Configuration drift is what happens when the actual configuration of your infrastructure diverges from the intended, defined configuration over time, often due to manual changes. IaC helps prevent this by providing a single source of truth; you can periodically run your IaC tool to detect and correct any drift, realigning the live environment with the code." },
    { id: "iac_8", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is the primary difference between a provisioning tool (like Terraform) and a configuration management tool (like Ansible)?", back: "Provisioning tools (like Terraform) are used to create the foundational infrastructure itself (e.g., servers, VPCs, databases). Configuration management tools (like Ansible, Chef, Puppet) are typically used to install and manage software and configure the state of systems after they have been provisioned." },
    { id: "iac_9", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is a 'provider' in Terraform?", back: "A provider in Terraform is a plugin that is responsible for understanding API interactions and exposing resources for a specific service. For example, the AWS provider allows Terraform to interact with AWS APIs to manage resources like EC2 instances and S3 buckets." },
    { id: "iac_10", deckId: "infrastructure_as_code", title: SUB_CATEGORY_TITLE, front: "What is an AWS CloudFormation 'Stack'?", back: "A CloudFormation Stack is a collection of AWS resources that you can manage as a single unit. You create, update, and delete a collection of resources by creating, updating, and deleting stacks. All the resources in a stack are defined by the stack's CloudFormation template." }
];

const practiceTestQuestions = [
    {
        question: "The practice of managing and provisioning infrastructure through version-controlled, machine-readable definition files is known as:",
        options: [
            "Continuous Integration",
            "Manual Configuration",
            "Infrastructure as Code (IaC)",
            "Agile Development"
        ],
        correctAnswer: "Infrastructure as Code (IaC)"
    },
    {
        question: "A tool that requires you to specify the desired end state of your infrastructure, without defining the explicit steps to get there, is using which approach?",
        options: [
            "Procedural",
            "Imperative",
            "Declarative",
            "Object-Oriented"
        ],
        correctAnswer: "Declarative"
    },
    {
        question: "Which of the following is a popular cloud-agnostic (multi-cloud) IaC provisioning tool?",
        options: [
            "AWS CloudFormation",
            "Azure Resource Manager",
            "Terraform",
            "Google Cloud Deployment Manager"
        ],
        correctAnswer: "Terraform"
    },
    {
        question: "In Terraform, what is the first command you should run when starting with a new or existing configuration directory?",
        options: [
            "terraform apply",
            "terraform plan",
            "terraform init",
            "terraform validate"
        ],
        correctAnswer: "terraform init"
    },
    {
        question: "The property of an operation that ensures it can be applied multiple times without changing the result beyond the initial application is called:",
        options: [
            "Scalability",
            "Idempotency",
            "Availability",
            "Durability"
        ],
        correctAnswer: "Idempotency"
    },
    {
        question: "The JSON or YAML files used to define a collection of AWS resources that are provisioned together are the core of which AWS service?",
        options: [
            "AWS EC2",
            "AWS Lambda",
            "AWS CloudFormation",
            "AWS IAM"
        ],
        correctAnswer: "AWS CloudFormation"
    },
    {
        question: "Which IaC tool is primarily used for configuration management (not provisioning) and is known for its agentless, imperative approach using YAML 'playbooks'?",
        options: [
            "Terraform",
            "Ansible",
            "Packer",
            "Vagrant"
        ],
        correctAnswer: "Ansible"
    },
    {
        question: "Terraform's configuration files are written using which language?",
        options: [
            "YAML",
            "JSON",
            "HCL (HashiCorp Configuration Language)",
            "Python"
        ],
        correctAnswer: "HCL (HashiCorp Configuration Language)"
    },
    {
        question: "What is the primary purpose of the terraform plan command?",
        options: [
            "To immediately create the infrastructure.",
            "To destroy all managed infrastructure.",
            "To show a preview of the changes Terraform will make before you apply them.",
            "To initialize the backend and download providers."
        ],
        correctAnswer: "To show a preview of the changes Terraform will make before you apply them."
    },
    {
        question: "When the actual, live state of your infrastructure differs from the state defined in your version-controlled code, this is known as:",
        options: [
            "A merge conflict",
            "A syntax error",
            "Configuration Drift",
            "A race condition"
        ],
        correctAnswer: "Configuration Drift"
    }
];

function Infrastructure() {
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

export default Infrastructure; 