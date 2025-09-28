import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BSON } from 'realm-web';
import './MyDeck.css';
import { useAuth } from './AuthContext';

// --- SVG Icon Components ---
const AddIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const TrashIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /> </svg> );

// --- Master list of all possible decks ---
const ALL_DECK_INFO = {
    "js_fundamentals": { id: "js_fundamentals", title: "JavaScript Fundamentals" },
    "react_hooks": { id: "react_hooks", title: "React Hooks" },
    "sql_queries": { id: "sql_queries", title: "SQL Queries" },
    "data_structures": { id: "data_structures", title: "Data Structures" },
    "css_grid": { id: "css_grid", title: "CSS Grid Layouts"},
    "python_basics": { id: "python_basics", title: "Python Basics"},
};

// =================================================================
// --- To-Do List Component ---
// =================================================================
const TodoList = ({ initialTodos, onUpdate }) => {
    const [todos, setTodos] = useState(initialTodos);
    const [newTodo, setNewTodo] = useState('');
    const { currentUser } = useAuth();

    useEffect(() => {
        setTodos(initialTodos);
    }, [initialTodos]);

    const handleAddTodo = async (e) => {
        if (e) e.preventDefault();
        if (newTodo.trim() === '' || !currentUser) return;
        
        const newTodoItem = { 
            _id: new BSON.ObjectId(),
            text: newTodo, 
            completed: false 
        };

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            await usersCollection.updateOne(
                { "auth_id": currentUser.id },
                { "$push": { "todos": newTodoItem } }
            );
            const updatedTodos = [...todos, newTodoItem];
            setTodos(updatedTodos);
            onUpdate(updatedTodos);
            setNewTodo('');
        } catch (error) {
            console.error("Failed to add todo:", error);
        }
    };

    const toggleTodo = async (id) => {
        if (!currentUser) return;
        const localTodos = todos.map(todo =>
            todo._id.toString() === id.toString() ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(localTodos);
        onUpdate(localTodos);

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const originalTodo = todos.find(t => t._id.toString() === id.toString());
            await usersCollection.updateOne(
                { "auth_id": currentUser.id, "todos._id": id },
                { "$set": { "todos.$.completed": !originalTodo.completed } }
            );
        } catch (error) {
            console.error("Failed to toggle todo:", error);
            setTodos(todos);
            onUpdate(todos);
        }
    };
        
    const deleteTodo = async (id) => {
        if (!currentUser) return;
        const updatedTodos = todos.filter(todo => todo._id.toString() !== id.toString());
        setTodos(updatedTodos);
        onUpdate(updatedTodos);

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            await usersCollection.updateOne(
                { "auth_id": currentUser.id },
                { "$pull": { "todos": { "_id": id } } }
            );
        } catch (error) {
            console.error("Failed to delete todo:", error);
            setTodos(todos);
            onUpdate(todos);
        }
    };

    return (
        <div className="todo-list-card">
            <h3>To-Do List</h3>
            <form onSubmit={handleAddTodo} className="todo-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button type="submit"><AddIcon className="add-icon"/></button>
            </form>
            <ul className="todo-items">
                {todos.map(todo => (
                    <li key={todo._id.toString()} className={todo.completed ? 'completed' : ''}>
                        <div className="todo-content" onClick={() => toggleTodo(todo._id)}>
                            <input type="checkbox" checked={todo.completed} readOnly/>
                            <span>{todo.text}</span>
                        </div>
                        <button onClick={() => deleteTodo(todo._id)} className="delete-btn"><TrashIcon className="trash-icon"/></button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// ========================================================
// --- Main My Decks Page Component ---
// ========================================================
const MyDeck = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [favoritesExpanded, setFavoritesExpanded] = useState(false);
    const [completedExpanded, setCompletedExpanded] = useState(false);
    const [masteredExpanded, setMasteredExpanded] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!currentUser) {
                setIsLoading(false);
                return;
            }
            try {
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                const profile = await usersCollection.findOne({ "auth_id": currentUser.id });
                setUserProfile(profile);
            } catch (error) {
                console.error("Failed to fetch user profile:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserProfile();
    }, [currentUser]);

    const handleTodoUpdate = (updatedTodos) => {
        setUserProfile(prev => ({ ...prev, todos: updatedTodos }));
    };

    if (isLoading) {
        return <div className="loading-fullscreen">Loading Your Decks...</div>;
    }

    if (!currentUser || !userProfile) {
        return (
            <div className="loading-fullscreen">
                Please <Link to="/login">log in</Link> to see your decks.
            </div>
        );
    }
    
    const favoriteCategories = Object.entries(userProfile.favs || {});
    const favoriteDecksCount = Object.values(userProfile.favs || {}).reduce((total, decks) => total + decks.length, 0);

    const completedByType = {
        "Flashcards": Object.values(userProfile.completedDecks?.flashcards || {}).flat().map(id => ALL_DECK_INFO[id]).filter(Boolean),
        "Practice Test": Object.values(userProfile.completedDecks?.practiceTest || {}).flat().map(id => ALL_DECK_INFO[id]).filter(Boolean)
    };
    const completedDecksCount = completedByType.Flashcards.length + completedByType["Practice Test"].length;

    const masteredByType = {
        "Flashcards": Object.values(userProfile.masteredDecks?.flashcards || {}).flat().map(id => ALL_DECK_INFO[id]).filter(Boolean),
        "Practice Test": Object.values(userProfile.masteredDecks?.practiceTest || {}).flat().map(id => ALL_DECK_INFO[id]).filter(Boolean)
    };
    const masteredDecksCount = masteredByType.Flashcards.length + masteredByType["Practice Test"].length;

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
                        
                        <motion.div
                            className="progress-card favorites-card"
                            onClick={() => setFavoritesExpanded(!favoritesExpanded)}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="favorites-header-inline">
                                <h4>Your Favourites</h4>
                                <p>{favoriteDecksCount} decks</p>
                            </div>
                            <AnimatePresence>
                                {favoritesExpanded && (
                                    <motion.div
                                        className="favorites-list"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                    >
                                        {favoriteCategories.length > 0 ? (
                                            favoriteCategories.map(([category, subcategories]) => (
                                                <div key={category} className="favorite-category-group">
                                                    <h5>{category}</h5>
                                                    <div className="favorite-items">
                                                        {subcategories.map(item => (
                                                            <div key={item} className="favorite-item">
                                                                {item}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="empty-state-message">You haven't favorited any items yet.</p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        <ExpandableDeckSection 
                            title="Completed"
                            groupedDecks={completedByType}
                            totalCount={completedDecksCount}
                            isExpanded={completedExpanded}
                            toggleExpand={() => setCompletedExpanded(!completedExpanded)}
                        />
                        <ExpandableDeckSection 
                            title="Mastered"
                            groupedDecks={masteredByType}
                            totalCount={masteredDecksCount}
                            isExpanded={masteredExpanded}
                            toggleExpand={() => setMasteredExpanded(!masteredExpanded)}
                        />
                    </div>
                </div>
            </main>
            <aside className="right-sidebar">
                <TodoList initialTodos={userProfile.todos || []} onUpdate={handleTodoUpdate} />
            </aside>
        </div>
    );
};

// --- Helper component for Completed and Mastered sections ---
const ExpandableDeckSection = ({ title, groupedDecks, totalCount, isExpanded, toggleExpand }) => (
    <motion.div
        className="progress-card favorites-card"
        onClick={toggleExpand}
        whileHover={{ scale: 1.02 }}
    >
        <div className="favorites-header-inline">
            <h4>{title}</h4>
            <p>{totalCount} decks</p>
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
                        Object.entries(groupedDecks).map(([type, decks]) => (
                            decks.length > 0 && (
                                <div key={type} className="favorite-category-group">
                                    <h5>{type}</h5>
                                    <div className="favorite-items">
                                        {decks.map((deck, index) => (
                                            <motion.div
                                                key={deck.id || index}
                                                className="favorite-item"
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                {deck.title}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))
                    ) : (
                        <p className="empty-state-message">No decks in this category yet.</p>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
);

export default MyDeck;