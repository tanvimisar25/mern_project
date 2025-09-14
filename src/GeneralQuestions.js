import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import './GeneralQuestions.css';


// Helper component for SVG icons
const Icon = ({ path, className = "icon" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d={path} />
    </svg>
);

// Icon paths
const ICONS = {
    check: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
    x: "M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z",
    undo: "M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z",
    shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
    edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z",
};

const initialQuestions = [
    { front: "Tell me about yourself.", back: "I am a passionate and results-oriented professional with a proven track record of developing user-friendly web applications. I thrive in collaborative environments and I'm always eager to learn new technologies." },
    { front: "What are your greatest strengths?", back: "My greatest strengths are my adaptability and problem-solving skills. I can quickly learn new frameworks and effectively debug complex issues to ensure project deadlines are met." },
    { front: "What are your weaknesses?", back: "I used to focus too much on minor details, but I've learned to prioritize tasks for the bigger picture. This helps me deliver high-impact work more efficiently." },
    { front: "Why do you want to work for this company?", back: "I'm impressed with this company's innovation in the tech space and its commitment to a positive work culture. I believe my skills in React and UI development would be a great asset to your team." },
    { front: "Where do you see yourself in 5 years?", back: "In five years, I aim to be a senior developer, mentoring junior team members and taking the lead on challenging projects. I am eager to grow with a company that invests in its employees." },
    { front: "Why should we hire you?", back: "You should hire me because my skills in front-end development align perfectly with this role. My experience in building responsive and performant applications will allow me to contribute to your team from day one." },
    { front: "What is your greatest professional achievement?", back: "My greatest achievement was leading the redesign of a client's e-commerce site, which resulted in a 20% increase in user engagement and a 15% boost in sales." },
    { front: "How do you handle pressure?", back: "I stay calm under pressure by breaking down large tasks into smaller, manageable steps. Clear communication with my team is also key to managing expectations and resolving issues collaboratively." },
    { front: "What are your salary expectations?", back: "Based on my experience and the market rate for this role, I am expecting a competitive salary. I am open to discussing a number that is fair for both parties." },
    { front: "Do you have any questions for us?", back: "Yes, thank you. Could you describe the team's development process? What are the biggest challenges the team is currently facing, and what are the opportunities for professional growth here?" }
];

function GeneralQuestions() {
    const [questions, setQuestions] = useState(initialQuestions);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [animation, setAnimation] = useState('');
    const [score, setScore] = useState({ correct: 0, wrong: 0 });
    const [isEditMode, setIsEditMode] = useState(false);
    const [roundResults, setRoundResults] = useState({ correct: [], incorrect: [] });
    const [isStarted, setIsStarted] = useState(false);

    const currentQuestion = questions[currentIndex];

    useEffect(() => {
        setIsFlipped(false);
        setAnimation('');
    }, [currentIndex]);

    const handleFlip = () => {
        if (!animation) setIsFlipped(!isFlipped);
    };

    const handleAnswer = (isCorrect) => {
        if (animation) return;
        setAnimation(isCorrect ? 'slide-out-right' : 'slide-out-left');
        setRoundResults(prev => ({
            correct: isCorrect ? [...prev.correct, currentQuestion] : prev.correct,
            incorrect: !isCorrect ? [...prev.incorrect, currentQuestion] : prev.incorrect,
        }));
        setTimeout(() => {
            setScore(prev => ({
                ...prev,
                correct: prev.correct + (isCorrect ? 1 : 0),
                wrong: prev.wrong + (!isCorrect ? 1 : 0),
            }));
            setCurrentIndex(prev => (prev + 1));
        }, 500);
    };

    const handleShuffle = () => {
        setQuestions(prev => [...prev].sort(() => Math.random() - 0.5));
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
        setAnimation('shuffle');
        setTimeout(() => setAnimation(''), 300);
    };

    const handleReset = () => {
        setQuestions(initialQuestions);
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
        setAnimation('reset');
        setTimeout(() => setAnimation(''), 300);
    };

    const handleAnswerChange = (index, newAnswer) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].back = newAnswer;
        setQuestions(updatedQuestions);
    };

    const startPracticeRound = () => {
        setQuestions(roundResults.incorrect);
        setCurrentIndex(0);
        setScore({ correct: 0, wrong: 0 });
        setRoundResults({ correct: [], incorrect: [] });
    };

    if (!isStarted) {
        return (
            <div className="app-container">
                <div className="back-homepage">
                    <Link to="/">&larr; Back to Homepage</Link>
                </div>
                 <div className="start-screen">
                    <h1>Interview Prep Flashcards</h1>
                    <p>These are general questions asked in many interviews. Use these cards to practice your responses.</p>
                    <button onClick={() => setIsStarted(true)} className="start-button">Start Flashcards</button>
                </div>
            </div>
        );
    }
    
    if (isEditMode) {
        return (
            <div className="app-container">
                <div className="back-homepage">
                    <Link to="/">&larr; Back to Homepage</Link>
                </div>
                <div className="edit-mode-container">
                    <header className="edit-header">
                        <h2>Edit Answers</h2>
                        <button onClick={() => setIsEditMode(false)} className="done-button" title="Save changes">Save</button>
                    </header>
                    <div className="questions-list">
                        {initialQuestions.map((q, index) => (
                            <div key={index} className="edit-question-item">
                                <label className="edit-question-label">{q.front}</label>
                                <textarea
                                    className="edit-textarea"
                                    value={questions[index].back}
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

    if (currentIndex >= questions.length && questions.length > 0) {
        const totalAnswered = score.correct + score.wrong;
        const percentage = totalAnswered > 0 ? Math.round((score.correct / totalAnswered) * 100) : 0;
        let titleMessage;
        if (percentage >= 75) {
            titleMessage = "You're doing brilliantly! Keep it up!";
        } else if (percentage >= 50) {
            titleMessage = "Good job! A little more practice will help.";
        } else {
            titleMessage = "Keep practicing, you'll get there!";
        }
        return (
            <div className="app-container">
                 <div className="back-homepage">
                    <Link to="/">&larr; Back to Homepage</Link>
                </div>
                <div className="completion-wrapper">
                    <div className="completion-screen-new">
                        <div className="completion-header">
                            <h1>{titleMessage}</h1>
                        </div>
                        <div className="stats-container">
                            <h2>How you're doing</h2>
                            <div className="stats-main">
                                <div className="stats-percentage">{percentage}%</div>
                                <div className="stats-bars">
                                    <div className="stat-item">
                                        <span className="stat-label">Know</span>
                                        <div className="stat-bar-container">
                                            <div className="stat-bar know-bar" style={{ width: `${(score.correct / totalAnswered) * 100}%` }}></div>
                                        </div>
                                        <span className="stat-count">{score.correct}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Still learning</span>
                                        <div className="stat-bar-container">
                                            <div className="stat-bar learning-bar" style={{ width: `${(score.wrong / totalAnswered) * 100}%` }}></div>
                                        </div>
                                        <span className="stat-count">{score.wrong}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button onClick={handleReset} className="restart-button-alt" title="Restart Flashcards">
                            Restart Flashcards
                        </button>
                    </div>
                    <div className="your-stats-container">
                        <h2>Your stats</h2>
                        <div className="results-list-section">
                            <h3>Know ({roundResults.correct.length})</h3>
                            {roundResults.correct.map((q, i) => (
                                <div key={`correct-${i}`} className="result-item know-item">
                                    <p className="result-item-question">{q.front}</p>
                                    <p className="result-item-answer">{q.back}</p>
                                </div>
                            ))}
                        </div>
                        {roundResults.incorrect.length > 0 && (
                            <div className="results-list-section">
                                <h3>Still learning ({roundResults.incorrect.length})</h3>
                                {roundResults.incorrect.map((q, i) => (
                                    <div key={`incorrect-${i}`} className="result-item learning-item">
                                        <p className="result-item-question">{q.front}</p>
                                        <p className="result-item-answer">{q.back}</p>
                                    </div>
                                ))}
                                <button onClick={startPracticeRound} className="practice-button" title="Practice 'Still Learning' Cards">
                                    Practice 'Still Learning' Cards
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app-container">
            <div className="back-homepage">
                <Link to="/">&larr; Back to Homepage</Link>
            </div>
            <div className="flashcard-container">
                <header className="header">
                    <button className="header-button" onClick={handleReset} title="Restart Flashcards">
                        <Icon path={ICONS.undo} />
                    </button>
                    <button className="header-button" onClick={() => setIsEditMode(true)} title="Edit Answers">
                        <Icon path={ICONS.edit} />
                    </button>
                </header>
                <main className="main-content">
                    <div className={`card ${isFlipped ? 'is-flipped' : ''} ${animation}`} onClick={handleFlip}>
                        <div className="card-face card-front">
                            <p>{currentQuestion?.front}</p>
                        </div>
                        <div className="card-face card-back">
                            <p>{currentQuestion?.back}</p>
                        </div>
                    </div>
                </main>
                <div className="controls">
                    <button className="control-button wrong-button" onClick={() => handleAnswer(false)} title="Mark as Wrong">
                        <Icon path={ICONS.x} className="icon large-icon" />
                    </button>
                    <div className="progress-text">
                        <span>{currentIndex + 1} / {questions.length}</span>
                        <div className="score-tracker">
                            <span className="score-item score-wrong">
                                <Icon path={ICONS.x} className="icon score-icon" /> {score.wrong}
                            </span>
                            <span className="score-item score-correct">
                                <Icon path={ICONS.check} className="icon score-icon" /> {score.correct}
                            </span>
                        </div>
                    </div>
                    <button className="control-button correct-button" onClick={() => handleAnswer(true)} title="Mark as Correct">
                        <Icon path={ICONS.check} className="icon large-icon" />
                    </button>
                </div>
                <footer className="footer">
                    <div className="footer-buttons">
                        <button onClick={handleShuffle} title="Shuffle Cards">
                            <Icon path={ICONS.shuffle}/>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default GeneralQuestions;

