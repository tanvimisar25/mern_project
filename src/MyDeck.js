import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import './MyDeck.css';
import { useAuth } from './AuthContext';

// --- (SVG Icons and ALL_DECK_INFO are unchanged) ---
const AddIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>);
const TrashIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /> </svg>);
const ALL_DECK_INFO = {
    "general_hr": { id: "general_hr", title: "General HR Questions", path: "/generalquestions" },
    "general_hr_test": { id: "general_hr_test", title: "General HR Questions Test", path: "/generalquestions" },
    "behave": { id: "behave", title: "Behavioral Questions", path: "/behavioralquestions" },
    "behave_test": { id: "behave_test", title: "Behavioral Questions Test", path: "/behavioralquestions" },
    "situate": { id: "situate", title: "Situational Questions", path: "/situationalquestions" },
    "situate_test": { id: "situate_test", title: "Situational Questions Test", path: "/situationalquestions" },
    "resume": { id: "resume", title: "Resume & Project Deep Dive", path: "/resumedive" },
    "resume_test": { id: "resume_test", title: "Resume & Project Deep Dive Test", path: "/resumedive" },
    "array_string": { id: "array_string", title: "Arrays & Strings", path: "/arraystring" },
    "array_string_test": { id: "array_string_test", title: "Arrays & Strings Test", path: "/arraystring" },
    "tree_graph": { id: "tree_graph", title: "Trees & Graphs", path: "/treegraph" },
    "tree_graph_test": { id: "tree_graph_test", title: "Trees & Graphs Test", path: "/treegraph" },
    "dynamic": { id: "dynamic", title: "Dynamic Programming & Recursion", path: "/dynamic" },
    "dynamic_test": { id: "dynamic_test", title: "Dynamic Programming & Recursion Test", path: "/dynamic" },
    "search_sort": { id: "search_sort", title: "Searching & Sorting Algorithms", path: "/searchsort" },
    "search_sort_test": { id: "search_sort_test", title: "Searching & Sorting Algorithms Test", path: "/searchsort" },
    "frontend_frameworks": { id: "frontend_frameworks", title: "Front-End Frameworks", path: "/frontend" },
    "frontend_frameworks_test": { id: "frontend_frameworks_test", title: "Front-End Frameworks Test", path: "/frontend" },
    "backend_development": { id: "backend_development", title: "Back-End Development", path: "/backend" },
    "backend_development_test": { id: "backend_development_test", title: "Back-End Development Test", path: "/backend" },
    "javascript_fundamentals": { id: "javascript_fundamentals", title: "JavaScript Fundamentals", path: "/js" },
    "javascript_fundamentals_test": { id: "javascript_fundamentals_test", title: "JavaScript Fundamentals Test", path: "/js" },
    "version_control_deployment": { id: "version_control_deployment", title: "Version Control & Deployment", path: "/versioncontrol" },
    "version_control_deployment_test": { id: "version_control_deployment_test", title: "Version Control & Deployment Test", path: "/versioncontrol" },
    "machine_learning_algorithms": { id: "machine_learning_algorithms", title: "Machine Learning Algorithms", path: "/machinelearning" },
    "machine_learning_algorithms_test": { id: "machine_learning_algorithms_test", title: "Machine Learning Algorithms Test", path: "/machinelearning" },
    "python_data_libraries": { id: "python_data_libraries", title: "Python & Data Analysis Libraries", path: "/python" },
    "python_data_libraries_test": { id: "python_data_libraries_test", title: "Python & Data Analysis Libraries Test", path: "/python" },
    "statistics_probability": { id: "statistics_probability", title: "Statistics & Probability", path: "/stats" },
    "statistics_probability_test": { id: "statistics_probability_test", title: "Statistics & Probability Test", path: "/stats" },
    "deep_learning": { id: "deep_learning", title: "Deep Learning", path: "/deeplearning" },
    "deep_learning_test": { id: "deep_learning_test", title: "Deep Learning Test", path: "/deeplearning" },
    "cloud_platforms": { id: "cloud_platforms", title: "Cloud Platforms & Services", path: "/cloudplatforms" },
    "cloud_platforms_test": { id: "cloud_platforms_test", title: "Cloud Platforms & Services Test", path: "/cloudplatforms" },
    "containerization": { id: "containerization", title: "Containerization", path: "/containerization" },
    "containerization_test": { id: "containerization_test", title: "Containerization Test", path: "/containerization" },
    "cicd_pipelines": { id: "cicd_pipelines", title: "CI/CD Pipelines", path: "/pipelines" },
    "cicd_pipelines_test": { id: "cicd_pipelines_test", title: "CI/CD Pipelines Test", path: "/pipelines" },
    "infrastructure_as_code": { id: "infrastructure_as_code", title: "Infrastructure as Code", path: "/infrastructure" },
    "infrastructure_as_code_test": { id: "infrastructure_as_code_test", title: "Infrastructure as Code Test", path: "/infrastructure" },
    "network_security_fundamentals": { id: "network_security_fundamentals", title: "Network Security Fundamentals", path: "/networksecurity" },
    "network_security_fundamentals_test": { id: "network_security_fundamentals_test", title: "Network Security Fundamentals Test", path: "/networksecurity" },
    "application_security": { id: "application_security", title: "Application Security", path: "/appsecurity" },
    "application_security_test": { id: "application_security_test", title: "Application Security Test", path: "/appsecurity" },
    "cryptography_concepts": { id: "cryptography_concepts", title: "Cryptography Concepts", path: "/cryptography" },
    "cryptography_concepts_test": { id: "cryptography_concepts_test", title: "Cryptography Concepts Test", path: "/cryptography" },
    "ethical_hacking_pen_testing": { id: "ethical_hacking_pen_testing", title: "Ethical Hacking & Pen Testing", path: "/ethicalhacking" },
    "ethical_hacking_pen_testing_test": { id: "ethical_hacking_pen_testing_test", title: "Ethical Hacking & Pen Testing Test", path: "/ethicalhacking" },
};

// (TodoList component remains unchanged)
const TodoList = ({ todos = [], onAdd, onToggle, onDelete }) => {
    const [newTodo, setNewTodo] = useState('');
    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (newTodo.trim()) {
            onAdd(newTodo);
            setNewTodo('');
        }
    };
    return (
        <div className="todo-list-card">
            <h3>To-Do List</h3>
            <form onSubmit={handleAddSubmit} className="todo-form">
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." />
                <button type="submit"><AddIcon className="add-icon" /></button>
            </form>
            <ul className="todo-items">
                {todos.map((todo, index) => (
                    <li key={index} className={todo.completed ? 'completed' : ''}>
                        <div className="todo-content" onClick={() => onToggle(index)}>
                            <input type="checkbox" checked={todo.completed} readOnly />
                            <span>{todo.text}</span>
                        </div>
                        <button onClick={() => onDelete(index)} className="delete-btn"><TrashIcon className="trash-icon" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MyDeck = () => {
    //Get the 'loading' state from the AuthContext.
    const { currentUser, loading, updateUserProfile, fetchUserProfile } = useAuth();
    
    //The local 'isLoading' state is no longer needed.
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [completedExpanded, setCompletedExpanded] = useState(false);
    const [masteredExpanded, setMasteredExpanded] = useState(false);

    //(To-Do and Deck handlers remain unchanged)
    const handleAddTodo = async (text) => {
        const newTodo = { text, completed: false };
        const updatedTodos = [...(currentUser.todos || []), newTodo];
        await updateUserProfile(currentUser.email, { todos: updatedTodos });
    };

    const handleToggleTodo = async (index) => {
        const updatedTodos = [...currentUser.todos];
        updatedTodos[index].completed = !updatedTodos[index].completed;
        await updateUserProfile(currentUser.email, { todos: updatedTodos });
    };

    const handleDeleteTodo = async (index) => {
        const updatedTodos = currentUser.todos.filter((_, i) => i !== index);
        await updateUserProfile(currentUser.email, { todos: updatedTodos });
    };
    
    const handleRemoveDeck = async (listName, deckTitle) => {
        if (!currentUser?.email) return;
        const deckType = deckTitle.includes("Test") ? "Tests" : "Flashcards";
        const updatedList = JSON.parse(JSON.stringify(currentUser[listName] || {}));
        if (updatedList[deckType]?.[deckTitle]) {
            delete updatedList[deckType][deckTitle];
            if (Object.keys(updatedList[deckType]).length === 0) {
                delete updatedList[deckType];
            }
            try {
                await updateUserProfile(currentUser.email, { [listName]: updatedList });
            } catch (error) {
                console.error(`Failed to remove deck from ${listName}:`, error);
            }
        }
    };

    // Render Logic


    // 1. First, check if the Auth context is still loading. This prevents any UI flash.
    if (loading) {
        return <div className="loading-fullscreen">Initializing...</div>;
    }

    // 2. After the auth check is complete, if there's no user, show the login prompt.
    if (!currentUser) {
        return (
            <div className="loading-fullscreen">
                Please <Link to="/login" style={{ marginLeft: '5px' }}>log in</Link> to see your decks.
            </div>
        );
    }
    
    // 3. If we have a user, render the full page content.
    const favoriteDecks = currentUser.favoriteDecks || {};
    const completedDecks = currentUser.completedDecks || {};
    const masteredDecks = currentUser.masteredDecks || {};

    return (
        <div className="my-decks-layout">
            <main className="center-content">
                <div className="mmain-header">
                    <h1>Your Decks</h1>
                    <p className="subtitle">Track your progress and organize your study materials.</p>
                </div>
                <div className="progress-overview-card">
                    <h3>Progress Overview</h3>
                    <div className="progress-grid">
                        <ExpandableDeckSection title="Your Favourites" deckGroups={favoriteDecks} isExpanded={favoritesExpanded} toggleExpand={() => setFavoritesExpanded(!favoritesExpanded)} />
                        <ExpandableDeckSection title="Completed" deckGroups={completedDecks} isExpanded={completedExpanded} toggleExpand={() => setCompletedExpanded(!completedExpanded)} onRemove={handleRemoveDeck} listName="completedDecks" />
                        <ExpandableDeckSection title="Mastered" deckGroups={masteredDecks} isExpanded={masteredExpanded} toggleExpand={() => setMasteredExpanded(!masteredExpanded)} onRemove={handleRemoveDeck} listName="masteredDecks" />
                    </div>
                </div>
            </main>
            <aside className="right-sidebar">
                <TodoList 
                    todos={currentUser.todos || []}
                    onAdd={handleAddTodo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                />
            </aside>
        </div>
    );
};

const ExpandableDeckSection = ({ title, deckGroups = {}, isExpanded, toggleExpand, onRemove, listName }) => {
    const titleToDeckInfoMap = Object.values(ALL_DECK_INFO).reduce((acc, deck) => {
        acc[deck.title] = deck;
        return acc;
    }, {});
    const totalCount = Object.values(deckGroups).reduce((count, subCategories) => count + Object.keys(subCategories).length, 0);

    return (
        <motion.div className="progress-card favorites-card" whileHover={{ scale: 1.02 }}>
            <div className="favorites-header-inline" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
                <h4>{title}</h4>
                <p>{totalCount} {totalCount === 1 ? 'deck' : 'decks'}</p>
            </div>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div 
                        className="favorites-list" 
                        initial={{ height: 0, opacity: 0 }} 
                        animate={{ height: "auto", opacity: 1 }} 
                        exit={{ height: 0, opacity: 0 }} 
                        transition={{ duration: 0.3 }}
                    >
                        {totalCount > 0 ? (
                            Object.entries(deckGroups).map(([mainGroup, subCategories]) => {
                                const hasItems = Object.keys(subCategories).length > 0;
                                return hasItems && (
                                    <div key={mainGroup} className="favorite-category-group">
                                        <h5>{mainGroup}</h5>
                                        <div className="favorite-items">
                                            {Object.keys(subCategories).map(subCategoryTitle => {
                                                const deckInfo = titleToDeckInfoMap[subCategoryTitle];
                                                if (!deckInfo) return null;
                                                return (
                                                    <div key={deckInfo.id} className="favorite-item-wrapper">
                                                        <Link to={deckInfo.path} className="favorite-item-link">
                                                            <motion.div 
                                                                className="favorite-item" 
                                                                initial={{ y: 10, opacity: 0 }} 
                                                                animate={{ y: 0, opacity: 1 }}
                                                            >
                                                                <span>{deckInfo.title}</span>
                                                            </motion.div>
                                                        </Link>
                                                        {onRemove && (
                                                            <button
                                                                className="remove-deck-btn"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    onRemove(listName, deckInfo.title);
                                                                }}
                                                            >
                                                                <TrashIcon className="trash-icon" />
                                                            </button>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (<p className="empty-state-message">No decks in this category yet.</p>)}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MyDeck;