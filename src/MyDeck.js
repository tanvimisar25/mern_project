import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BSON } from 'realm-web';
import './MyDeck.css';
import { useAuth } from './AuthContext';

// --- SVG Icon Components (Unchanged) ---
const AddIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg>);
const TrashIcon = ({ className }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /> </svg>);

// --- Master list of all possible decks ---
const ALL_DECK_INFO = {
    // Core Interview Skills
    "general_hr": { id: "general_hr", title: "General HR Questions", path: "/generalquestions" },
    "general_hr_test": { id: "general_hr_test", title: "General HR Questions Test", path: "/generalquestions" },
    "behave": { id: "behave", title: "Behavioral Questions", path: "/behavioralquestions" },
    "behave_test": { id: "behave_test", title: "Behavioral Questions Test", path: "/behavioralquestions" },
    "situate": { id: "situate", title: "Situational Questions", path: "/situationalquestions" },
    "situate_test": { id: "situate_test", title: "Situational Questions Test", path: "/situationalquestions" },
    "resume": { id: "resume", title: "Resume & Project Deep Dive", path: "/resumedive" },
    "resume_test": { id: "resume_test", title: "Resume & Project Deep Dive Test", path: "/resumedive" },

    // DSA
    "array_string": { id: "array_string", title: "Arrays & Strings", path: "/arraystring" },
    "array_string_test": { id: "array_string_test", title: "Arrays & Strings Test", path: "/arraystring" },
    "tree_graph": { id: "tree_graph", title: "Trees & Graphs", path: "/treegraph" },
    "tree_graph_test": { id: "tree_graph_test", title: "Trees & Graphs Test", path: "/treegraph" },
    "dynamic": { id: "dynamic", title: "Dynamic Programming", path: "/dynamic" },
    "dynamic_test": { id: "dynamic_test", title: "Dynamic Programming Test", path: "/dynamic" },
    "search_sort": { id: "search_sort", title: "Searching & Sorting", path: "/searchsort" },
    "search_sort_test": { id: "search_sort_test", title: "Searching & Sorting Test", path: "/searchsort" },
    
    // Web Development
    "frontend_frameworks": { id: "frontend_frameworks", title: "Front-End Frameworks", path: "/frontend" },
    "frontend_frameworks_test": { id: "frontend_frameworks_test", title: "Front-End Frameworks Test", path: "/frontend" },
    "backend_development": { id: "backend_development", title: "Back-End Development", path: "/backend" },
    "backend_development_test": { id: "backend_development_test", title: "Back-End Development Test", path: "/backend" },
    "javascript_fundamentals": { id: "javascript_fundamentals", title: "JavaScript & Browser Fundamentals", path: "/js" },
    "javascript_fundamentals_test": { id: "javascript_fundamentals_test", title: "JavaScript & Browser Fundamentals Test", path: "/js" },
    "version_control_deployment": { id: "version_control_deployment", title: "Version Control & Deployment", path: "/versioncontrol" },
    "version_control_deployment_test": { id: "version_control_deployment_test", title: "Version Control & Deployment Test", path: "/versioncontrol" },

    // Data Science & AI
    "machine_learning_algorithms": { id: "machine_learning_algorithms", title: "Machine Learning Algorithms", path: "/machinelearning" },
    "machine_learning_algorithms_test": { id: "machine_learning_algorithms_test", title: "Machine Learning Algorithms Test", path: "/machinelearning" },
    "python_data_libraries": { id: "python_data_libraries", title: "Python & Data Analysis Libraries", path: "/python" },
    "python_data_libraries_test": { id: "python_data_libraries_test", title: "Python & Data Analysis Libraries Test", path: "/python" },
    "statistics_probability": { id: "statistics_probability", title: "Statistics & Probability", path: "/stats" },
    "statistics_probability_test": { id: "statistics_probability_test", title: "Statistics & Probability Test", path: "/stats" },
    "deep_learning": { id: "deep_learning", title: "Deep Learning", path: "/deeplearning" },
    "deep_learning_test": { id: "deep_learning_test", title: "Deep Learning Test", path: "/deeplearning" },

    // Cloud Computing
    "cloud_platforms": { id: "cloud_platforms", title: "Cloud Platforms", path: "/cloudplatforms" },
    "cloud_platforms_test": { id: "cloud_platforms_test", title: "Cloud Platforms Test", path: "/cloudplatforms" },
    "containerization": { id: "containerization", title: "Containerization", path: "/containerization" },
    "containerization_test": { id: "containerization_test", title: "Containerization Test", path: "/containerization" },
    "cicd_pipelines": { id: "cicd_pipelines", title: "CI/CD Pipelines", path: "/pipelines" },
    "cicd_pipelines_test": { id: "cicd_pipelines_test", title: "CI/CD Pipelines Test", path: "/pipelines" },
    "infrastructure_as_code": { id: "infrastructure_as_code", title: "Infrastructure as Code", path: "/infrastructure" },
    "infrastructure_as_code_test": { id: "infrastructure_as_code_test", title: "Infrastructure as Code Test", path: "/infrastructure" },

    // Cybersecurity
    "network_security_fundamentals": { id: "network_security_fundamentals", title: "Network Security Fundamentals", path: "/network-security" },
    "network_security_fundamentals_test": { id: "network_security_fundamentals_test", title: "Network Security Fundamentals Test", path: "/network-security" },
    "application_security": { id: "application_security", title: "Application Security", path: "/application-security" },
    "application_security_test": { id: "application_security_test", title: "Application Security Test", path: "/application-security" },
    "cryptography_concepts": { id: "cryptography_concepts", title: "Cryptography Concepts", path: "/cryptography" },
    "cryptography_concepts_test": { id: "cryptography_concepts_test", title: "Cryptography Concepts Test", path: "/cryptography" },
    "ethical_hacking_pen_testing": { id: "ethical_hacking_pen_testing", title: "Ethical Hacking & Pen Testing", path: "/pen-testing" },
    "ethical_hacking_pen_testing_test": { id: "ethical_hacking_pen_testing_test", title: "Ethical Hacking & Pen Testing Test", path: "/pen-testing" },
};

// =================================================================
// --- To-Do List Component (Unchanged) ---
// =================================================================
const TodoList = ({ initialTodos, onUpdate }) => {
    const [todos, setTodos] = useState(initialTodos);
    const [newTodo, setNewTodo] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => { setTodos(initialTodos); }, [initialTodos]);

    const handleAddTodo = async (e) => {
        if (e) e.preventDefault();
        if (newTodo.trim() === '' || !currentUser) return;
        const newTodoItem = { _id: new BSON.ObjectId(), text: newTodo, completed: false };
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            await usersCollection.updateOne({ "auth_id": currentUser.id }, { "$push": { "todos": newTodoItem } });
            const updatedTodos = [...todos, newTodoItem];
            setTodos(updatedTodos);
            onUpdate(updatedTodos);
            setNewTodo('');
        } catch (error) { console.error("Failed to add todo:", error); }
    };

    const toggleTodo = async (id) => {
        if (!currentUser) return;
        const localTodos = todos.map(todo => todo._id.toString() === id.toString() ? { ...todo, completed: !todo.completed } : todo);
        setTodos(localTodos);
        onUpdate(localTodos);
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const originalTodo = todos.find(t => t._id.toString() === id.toString());
            await usersCollection.updateOne({ "auth_id": currentUser.id, "todos._id": id }, { "$set": { "todos.$.completed": !originalTodo.completed } });
        } catch (error) { console.error("Failed to toggle todo:", error); setTodos(todos); onUpdate(todos); }
    };

    const deleteTodo = async (id) => {
        if (!currentUser) return;
        const updatedTodos = todos.filter(todo => todo._id.toString() !== id.toString());
        setTodos(updatedTodos);
        onUpdate(updatedTodos);
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            await usersCollection.updateOne({ "auth_id": currentUser.id }, { "$pull": { "todos": { "_id": id } } });
        } catch (error) { console.error("Failed to delete todo:", error); setTodos(todos); onUpdate(todos); }
    };

    return (
        <div className="todo-list-card">
            <h3>To-Do List</h3>
            <form onSubmit={handleAddTodo} className="todo-form">
                <input type="text" value={newTodo} onChange={(e) => setNewTodo(e.target.value)} placeholder="Add a new task..." />
                <button type="submit"><AddIcon className="add-icon" /></button>
            </form>
            <ul className="todo-items">
                {todos.map(todo => (
                    <li key={todo._id.toString()} className={todo.completed ? 'completed' : ''}>
                        <div className="todo-content" onClick={() => toggleTodo(todo._id)}>
                            <input type="checkbox" checked={todo.completed} readOnly />
                            <span>{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo._id)} className="delete-btn"><TrashIcon className="trash-icon" /></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ========================================================
// --- Main My Decks Page Component (Unchanged) ---
// ========================================================
const MyDeck = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [completedExpanded, setCompletedExpanded] = useState(false);
    const [masteredExpanded, setMasteredExpanded] = useState(false);

    const fetchUserProfile = useCallback(async () => {
        if (!currentUser) { setIsLoading(false); return; }
        setIsLoading(true);
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const profile = await usersCollection.findOne({ "auth_id": currentUser.id });
            setUserProfile(profile);
        } catch (error) { console.error("Failed to fetch user profile:", error); } 
        finally { setIsLoading(false); }
    }, [currentUser]);

    useEffect(() => { fetchUserProfile(); }, [fetchUserProfile]);
    useEffect(() => {
        window.addEventListener('focus', fetchUserProfile);
        return () => window.removeEventListener('focus', fetchUserProfile);
    }, [fetchUserProfile]);

    const handleRemoveDeck = async (deckId, deckType, category, listName) => {
        if (!currentUser || !userProfile) return;

        const originalProfile = JSON.parse(JSON.stringify(userProfile));
        const newProfile = JSON.parse(JSON.stringify(userProfile));

        const deckArray = newProfile[listName]?.[deckType]?.[category];
        if (deckArray) {
            newProfile[listName][deckType][category] = deckArray.filter(id => id !== deckId);
            setUserProfile(newProfile); // Optimistic UI update
        }

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const fieldPath = `${listName}.${deckType}.${category}`; 
            
            await usersCollection.updateOne(
                { "auth_id": currentUser.id },
                { "$pull": { [fieldPath]: deckId } }
            );
        } catch (error) {
            console.error("Failed to remove deck:", error);
            setUserProfile(originalProfile);
            alert("Failed to remove the deck. Please try again.");
        }
    };

    const handleTodoUpdate = (updatedTodos) => { setUserProfile(prev => ({ ...prev, todos: updatedTodos })); };

    if (isLoading) { return <div className="loading-fullscreen">Loading Your Decks...</div>; }
    if (!currentUser || !userProfile) { return (<div className="loading-fullscreen">Please <Link to="/login">log in</Link> to see your decks.</div>); }

    const processDecks = (deckObject) => {
        if (!deckObject) return { decks: {}, count: 0 };
        let totalCount = 0;
        const groupedDecks = {};
        
        for (const [deckType, categories] of Object.entries(deckObject)) {
            groupedDecks[deckType] = {};
            for (const [category, ids] of Object.entries(categories)) {
                const mappedDecks = ids.map(id => ALL_DECK_INFO[id]).filter(Boolean);
                if (mappedDecks.length > 0) {
                    groupedDecks[deckType][category] = mappedDecks;
                    totalCount += mappedDecks.length;
                }
            }
        }
        return { decks: groupedDecks, count: totalCount };
    };

    const favoriteCategories = Object.entries(userProfile.favs || {});
    const favoriteDecksCount = Object.values(userProfile.favs || {}).reduce((total, decks) => total + decks.length, 0);

    const { decks: completedDecks, count: completedDecksCount } = processDecks(userProfile.completedDecks);
    const { decks: masteredDecks, count: masteredDecksCount } = processDecks(userProfile.masteredDecks);

    const titleToDeckInfoMap = Object.values(ALL_DECK_INFO).reduce((acc, deck) => {
        acc[deck.title] = deck;
        return acc;
    }, {});

    return (
        <div className="my-decks-layout">
            <main className="center-content">
                <div className="mmain-header"><h1>Your Decks</h1><p className="subtitle">Track your progress and organize your study materials.</p></div>
                <div className="progress-overview-card">
                    <h3>Progress Overview</h3>
                    <div className="progress-grid">
                        <motion.div className="progress-card favorites-card" onClick={() => setFavoritesExpanded(!favoritesExpanded)} whileHover={{ scale: 1.02 }}>
                            <div className="favorites-header-inline"><h4>Your Favourites</h4><p>{favoriteDecksCount} {favoriteDecksCount === 1 ? 'deck' : 'decks'}</p></div>
                            <AnimatePresence>
                                {favoritesExpanded && (
                                    <motion.div className="favorites-list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                                        {favoriteCategories.length > 0 ? (
                                            favoriteCategories.map(([category, subcategories]) => (
                                                <div key={category} className="favorite-category-group">
                                                    <h5>{category}</h5>
                                                    <div className="favorite-items">
                                                        {subcategories.map(itemTitle => {
                                                            const deckInfo = titleToDeckInfoMap[itemTitle];
                                                            if (!deckInfo || !deckInfo.path) return <div key={itemTitle} className="favorite-item">{itemTitle}</div>;
                                                            return (<Link key={deckInfo.id} to={deckInfo.path} className="favorite-item-link"><div className="favorite-item">{itemTitle}</div></Link>);
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (<p className="empty-state-message">You haven't favorited any items yet.</p>)}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                        
                        <ExpandableDeckSection title="Completed" groupedDecks={completedDecks} totalCount={completedDecksCount} isExpanded={completedExpanded} toggleExpand={() => setCompletedExpanded(!completedExpanded)} onRemove={(...args) => handleRemoveDeck(...args, "completedDecks")} />
                        <ExpandableDeckSection title="Mastered" groupedDecks={masteredDecks} totalCount={masteredDecksCount} isExpanded={masteredExpanded} toggleExpand={() => setMasteredExpanded(!masteredExpanded)} onRemove={(...args) => handleRemoveDeck(...args, "masteredDecks")} />
                    </div>
                </div>
            </main>
            <aside className="right-sidebar">
                <TodoList initialTodos={userProfile.todos || []} onUpdate={handleTodoUpdate} />
            </aside>
        </div>
    );
};

const ExpandableDeckSection = ({ title, groupedDecks, totalCount, isExpanded, toggleExpand, onRemove }) => (
    <motion.div className="progress-card favorites-card" whileHover={{ scale: 1.02 }}>
        <div className="favorites-header-inline" onClick={toggleExpand} style={{ cursor: 'pointer' }}>
            <h4>{title}</h4>
            <p>{totalCount} {totalCount === 1 ? 'deck' : 'decks'}</p>
        </div>
        <AnimatePresence>
            {isExpanded && (
                <motion.div className="favorites-list" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                    {totalCount > 0 ? (
                        Object.entries(groupedDecks).map(([type, categories]) => (
                            Object.keys(categories).length > 0 && (
                                <div key={type} className="deck-type-group">
                                    <h5>{type}</h5>
                                    {Object.entries(categories).map(([category, decks]) => (
                                        <div key={category} className="deck-category-group">
                                            <div className="favorite-items">
                                                {decks.map((deck) => (
                                                    <div key={deck.id} className="favorite-item-wrapper">
                                                        <Link to={deck.path} className="favorite-item-link">
                                                            <motion.div className="favorite-item" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                                                                <span>{deck.title}</span>
                                                            </motion.div>
                                                        </Link>
                                                        <button className="remove-deck-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            onRemove(deck.id, type, category);
                                                        }}>
                                                            <TrashIcon className="trash-icon"/>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ))
                    ) : (<p className="empty-state-message">No decks in this category yet.</p>)}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export default MyDeck;