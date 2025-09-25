import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import cardLogo from "./flash.png"; // Make sure path is correct
import './MyDeck.css';

// --- SVG Icon Components (No changes needed here, keeping them for context) ---
const HomeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.122 0l8.954 8.955M2.25 12V21a.75.75 0 00.75.75H21a.75.75 0 00.75-.75V12M9 21V15a2.25 2.25 0 012.25-2.25h1.5A2.25 2.25 0 0115 15v6" /> </svg> );
const DecksIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-5.571 3-5.571-3zM2.25 12l5.571 3 5.571-3m0 0l5.571 3L12 21.75l-9.75-5.25 5.571-3z" /> </svg> );
const SkillIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-1.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" /> </svg> );
const AptitudeIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 1.085-1.085-1.085m0 0V14.25h2.17m-2.17 0H12m0 0v2.25m0 0h1.5m-1.5 0H9.75m4.5 0H12m0 0V3.75m0 0h-1.5m1.5 0H12m0 0h1.5m-1.5 0H9.75" /> </svg> );
const VerbalIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /> </svg> );
const AffairsIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" /> </svg> );
const ProfileIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /> </svg> );
const AddIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const TrashIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /> </svg> );
const ChevronDownIcon = () => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"> <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" /> </svg> );


// --- To-Do List Component (No changes) ---
const TodoList = () => {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Review Data Structures', completed: true },
        { id: 2, text: 'Practice SQL queries', completed: false },
        { id: 3, text: 'Finish UI/UX principles deck', completed: false },
    ]);
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = (e) => {
        if (e) e.preventDefault();
        if (newTodo.trim() === '') return;
        setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
        setNewTodo('');
    };

    const toggleTodo = (id) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };
        
    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="todo-list-card">
            <h3>To-Do List</h3>
            <div onSubmit={handleAddTodo} className="todo-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button type="button" onClick={handleAddTodo}><AddIcon className="add-icon"/></button>
            </div>
            <ul className="todo-items">
                {todos.map(todo => (
                    <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                        <div className="todo-content" onClick={() => toggleTodo(todo.id)}>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                readOnly
                            />
                            <span>{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo.id)} className="delete-btn"><TrashIcon className="trash-icon"/></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// --- Mock Data ---
const favoriteDecks = [
    { id: 1, title: "JavaScript Fundamentals" },
    { id: 2, title: "React Hooks" },
    { id: 3, title: "SQL Queries" },
    { id: 4, title: "Data Structures" },
    { id: 5, title: "UI/UX Principles" }
];

// NEW: Mock data for Completed and Mastered decks
const completedDecks = [
    { id: 1, title: "CSS Grid Layouts"},
    { id: 2, title: "Python Basics"},
    { id: 3, title: "Async JavaScript"},
];

const masteredDecks = [
    { id: 1, title: "HTML Semantics"},
    { id: 2, title: "Git & Version Control"},
];


// --- Main My Decks Page Component ---
const MyDeck = () => {
    // State for each expandable section
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [completedExpanded, setCompletedExpanded] = useState(false);
    const [masteredExpanded, setMasteredExpanded] = useState(false);

    // Toggle functions for each section
    const toggleFavorites = () => setFavoritesExpanded(!favoritesExpanded);
    const toggleCompleted = () => setCompletedExpanded(!completedExpanded);
    const toggleMastered = () => setMasteredExpanded(!masteredExpanded);

    return (
        <div className="my-decks-layout">
            {/* --- Column 1: Sidebar (No changes) --- */}
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <motion.img src={cardLogo} alt="Prepdeck logo" className="logo-img" whileHover={{ rotateY: 180 }}/>
                        <span className="logo-text">PrepDeck</span>
                    </div>
                </div>
                <div className="sidebar-content">
                    <div className="sidebar-section">
                        <p className="section-title">DISCOVER</p>
                        <ul className="sidebar-menu">
                            <li><NavLink to="/" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}><HomeIcon /> <span className="link-text">Home</span></NavLink></li>
                            <li><NavLink to="/mydecks" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}><DecksIcon /> <span className="link-text">My Decks</span></NavLink></li>
                        </ul>
                    </div>
                    <div className="sidebar-section">
                        <p className="section-title">CATEGORY</p>
                        <ul className="sidebar-menu">
                            <li><a className="sidebar-link"><SkillIcon /><span className="link-text">Technical & Professional</span></a></li>
                            <li><a className="sidebar-link"><AptitudeIcon /><span className="link-text">General Aptitude</span></a></li>
                            <li><a className="sidebar-link"><VerbalIcon /><span className="link-text">Verbal and Reasoning</span></a></li>
                            <li><a className="sidebar-link"><AffairsIcon /><span className="link-text">Current Affairs</span></a></li>
                            <li><a className="sidebar-link"><SkillIcon /><span className="link-text">Computer Science</span></a></li>
                            <li><a className="sidebar-link"><AptitudeIcon /><span className="link-text">Engineering</span></a></li>
                        </ul>
                    </div>
                </div>
                <div className="sidebar-footer">
                    <a href="/login" className="login-link">
                        <ProfileIcon /> <span className="link-text">Login</span>
                    </a>
                </div>
            </aside>

            {/* --- Column 2: Center Content (UPDATED) --- */}
            <main className="center-content">
                <div className="mmain-header">
                    <h1>Your Decks</h1>
                    <p className="subtitle">Track your progress and organize your study materials.</p>
                </div>
                
                <div className="progress-overview-card">
                    <h3>Progress Overview</h3>
                    <div className="progress-grid">
                        {/* Expandable Your Favorites */}
                        <motion.div 
                            className="progress-card favorites-card"
                            onClick={toggleFavorites}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="favorites-header-inline">
                                <h4>Your Favourites</h4>
                                <p>{favoriteDecks.length} decks</p>
                            </div>
                            
                            <AnimatePresence>
                                {favoritesExpanded && (
                                    <motion.div
                                        className="favorites-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="favorite-items">
                                            {favoriteDecks.map((deck, index) => (
                                                <motion.div
                                                    key={deck.id}
                                                    className="favorite-item"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {deck.title}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        {/* NEW: Expandable Completed Card */}
                        <motion.div
                            className={`progress-card favorites-card ${completedExpanded ? 'full-width' : ''}`}
                            onClick={toggleCompleted}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="favorites-header-inline">
                                <h4>Completed</h4>
                                <p>{completedDecks.length} decks</p>
                            </div>
                            <AnimatePresence>
                                {completedExpanded && (
                                     <motion.div
                                        className="favorites-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="favorite-items">
                                            {completedDecks.map((deck, index) => (
                                                <motion.div
                                                    key={deck.id}
                                                    className="favorite-item"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {deck.title}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* NEW: Expandable Mastered Card */}
                        <motion.div
                            className={`progress-card favorites-card ${masteredExpanded ? 'full-width' : ''}`}
                            onClick={toggleMastered}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="favorites-header-inline">
                                <h4>Mastered</h4>
                                <p>{masteredDecks.length} decks</p>
                            </div>
                            <AnimatePresence>
                                {masteredExpanded && (
                                     <motion.div
                                        className="favorites-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="favorite-items">
                                            {masteredDecks.map((deck, index) => (
                                                <motion.div
                                                    key={deck.id}
                                                    className="favorite-item"
                                                    initial={{ y: 10, opacity: 0 }}
                                                    animate={{ y: 0, opacity: 1 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    {deck.title}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </main>
                        
            {/* --- Column 3: Right Column (To-Do List) --- */}
            <aside className="right-sidebar">
                <TodoList />
            </aside>
        </div>
    );
};

export default MyDeck;