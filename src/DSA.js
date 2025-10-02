import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css';
import { useAuth } from './AuthContext';

// ✅ 1. DEFINE THE MAIN CATEGORY TITLE
// This will be used as the key in our new nested data structure.
const MAIN_CATEGORY_TITLE = "Data Structure and Algorithm";

const categories = [
    {
        id: "array_string",
        title: "Arrays & Strings",
        description: "Master fundamental data structures and manipulate sequences efficiently.",
        link: "/arraystring"
    },
    {
        id: "tree_graph",
        title: "Trees & Graphs",
        description: "Navigate hierarchical and interconnected data with optimized algorithms.",
        link: "/treegraph"
    },
    {
        id: "dynamic",
        title: "Dynamic Programming & Recursion",
        description: "Solve complex problems by breaking them into manageable subproblems.",
        link: "/dynamic"
    },
    {
        id: "search_sort",
        title: "Searching & Sorting Algorithms",
        description: "Organize and retrieve data effectively using key algorithmic strategies.",
        link: "/searchsort"
    }
];

// --- HeartIcon Component (Unchanged) ---
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

// --- Main DSA Page Component (Refactored for MERN) ---
const DSA = () => {
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();

    // Fetch user profile on component load to ensure favorites are up-to-date
    useEffect(() => {
        if (currentUser?.email) {
            fetchUserProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchUserProfile]);


    // ✅ 2. UPDATED: Favorite handler now uses the sub-category TITLE as the key.
    const handleFavoriteClick = async (e, deckTitle) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser?.email) return;

        // Deep copy the favorites object to avoid direct state mutation
        const updatedFavorites = JSON.parse(JSON.stringify(currentUser.favoriteDecks || {}));

        // Get the sub-object for our main category, or create it if it doesn't exist
        const categoryFavorites = updatedFavorites[MAIN_CATEGORY_TITLE] || {};

        const isCurrentlyFavorited = categoryFavorites.hasOwnProperty(deckTitle);

        if (isCurrentlyFavorited) {
            // Remove the sub-category using its title
            delete categoryFavorites[deckTitle];
        } else {
            // Add the sub-category using its title
            categoryFavorites[deckTitle] = true;
        }

        // If the main category object is now empty, remove it from the top-level favorites
        if (Object.keys(categoryFavorites).length === 0) {
            delete updatedFavorites[MAIN_CATEGORY_TITLE];
        } else {
            // Otherwise, update the favorites with the modified category object
            updatedFavorites[MAIN_CATEGORY_TITLE] = categoryFavorites;
        }

        try {
            // Call the context function to save the entire updated favorites object
            await updateUserProfile(currentUser.email, { favoriteDecks: updatedFavorites });
        } catch (error) {
            console.error("Failed to update favorites:", error);
        }
    };
    
    // ✅ 3. UPDATED: Check for favorites within the nested structure.
    const dsaFavorites = currentUser?.favoriteDecks?.[MAIN_CATEGORY_TITLE] || {};

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    <p className="subtitle">
                        Sharpen problem-solving skills with essential coding patterns and techniques.
                    </p>
                </div>
                <div className="core-category-container">
                    <h3>Subcategories</h3>
                    <div className="category-grid">
                        {categories.map((category) => (
                            <Link to={category.link} key={category.id} className="category-link-wrapper">
                                <motion.div
                                    className="category-box"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <button
                                        // ✅ 4. UPDATED: Check and update using the category TITLE.
                                        className={`favorite-btn ${dsaFavorites[category.title] ? 'favorited' : ''}`}
                                        onClick={(e) => handleFavoriteClick(e, category.title)}
                                        aria-label={`Favorite ${category.title}`}
                                    >
                                        <HeartIcon />
                                    </button>
                                    <h3>{category.title}</h3>
                                    <p>{category.description}</p>
                                </motion.div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DSA;

