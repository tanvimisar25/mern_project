import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { BSON } from 'realm-web'; // Import BSON for creating unique IDs
import './MyDeck.css';

// ✅ 1. IMPORT THE USEAUTH HOOK
import { useAuth } from './AuthContext';

// --- SVG Icon Components (No changes) ---
const AddIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}> <path d="M12 4.5v15m7.5-7.5h-15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /> </svg> );
const TrashIcon = ({ className }) => ( <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}> <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /> </svg> );

// --- MOCK DATA FOR ALL DECKS (for display purposes) ---
const ALL_DECK_INFO = {
    "js_fundamentals": { id: "js_fundamentals", title: "JavaScript Fundamentals" },
    "react_hooks": { id: "react_hooks", title: "React Hooks" },
    "sql_queries": { id: "sql_queries", title: "SQL Queries" },
    "data_structures": { id: "data_structures", title: "Data Structures" },
    "css_grid": { id: "css_grid", title: "CSS Grid Layouts"},
    "python_basics": { id: "python_basics", title: "Python Basics"},
};


// =================================================================
// --- To-Do List Component (Now connected to the database) ---
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
            _id: new BSON.ObjectId(), // Generate a unique ID
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
            // Update local state and notify parent
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
        const updatedTodos = todos.map(todo =>
            todo._id.toString() === id.toString() ? { ...todo, completed: !todo.completed } : todo
        );
        setTodos(updatedTodos); // Optimistic UI update
        onUpdate(updatedTodos);

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            await usersCollection.updateOne(
                { "auth_id": currentUser.id, "todos._id": id },
                { "$set": { "todos.$.completed": !todos.find(t => t._id === id).completed } }
            );
        } catch (error) {
            console.error("Failed to toggle todo:", error);
            setTodos(todos); // Revert on error
            onUpdate(todos);
        }
    };
        
    const deleteTodo = async (id) => {
        if (!currentUser) return;
        const updatedTodos = todos.filter(todo => todo._id.toString() !== id.toString());
        setTodos(updatedTodos); // Optimistic UI update
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
            setTodos(todos); // Revert on error
            onUpdate(todos);
        }
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
// --- Main My Decks Page Component (Database Connected) ---
// ========================================================
const MyDeck = () => {
    const { currentUser } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State for each expandable section
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

    // This function allows the TodoList child to update the parent's state
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
    
    // Get full deck info from the IDs in the user's profile
    const favoriteDecks = userProfile.favoriteDecks?.map(id => ALL_DECK_INFO[id]) || [];
    const completedDecks = userProfile.completedDecks?.map(id => ALL_DECK_INFO[id]) || [];
    const masteredDecks = userProfile.masteredDecks?.map(id => ALL_DECK_INFO[id]) || [];

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
                        {/* Favorites Section */}
                        <ExpandableDeckSection 
                            title="Your Favourites"
                            decks={favoriteDecks}
                            isExpanded={favoritesExpanded}
                            toggleExpand={() => setFavoritesExpanded(!favoritesExpanded)}
                        />
                        {/* Completed Section */}
                         <ExpandableDeckSection 
                            title="Completed"
                            decks={completedDecks}
                            isExpanded={completedExpanded}
                            toggleExpand={() => setCompletedExpanded(!completedExpanded)}
                        />
                        {/* Mastered Section */}
                         <ExpandableDeckSection 
                            title="Mastered"
                            decks={masteredDecks}
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

// Helper component for the expandable sections to reduce repetition
const ExpandableDeckSection = ({ title, decks, isExpanded, toggleExpand }) => (
    <motion.div
        className="progress-card favorites-card"
        onClick={toggleExpand}
        whileHover={{ scale: 1.02 }}
    >
        <div className="favorites-header-inline">
            <h4>{title}</h4>
            <p>{decks.length} decks</p>
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
                    <div className="favorite-items">
                        {decks.map((deck, index) => (
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
);

export default MyDeck;
