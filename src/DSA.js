import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './DSA.css';
import { useAuth } from './AuthContext';

// Define the main category title as a constant to ensure consistency.
const MAIN_CATEGORY_TITLE = "Data Structure and Algorithm";

const categories = [
    {
        title: "Arrays & Strings",
        description: "Master fundamental data structures and manipulate sequences efficiently.",
        link: "/arraystring"
    },
    {
        title: "Trees & Graphs",
        description: "Navigate hierarchical and interconnected data with optimized algorithms.",
        link: "/treegraph"
    },
    {
        title: "Dynamic Programming & Recursion",
        description: "Solve complex problems by breaking them into manageable subproblems.",
        link: "/dynamic"
    },
    {
        title: "Searching & Sorting Algorithms",
        description: "Organize and retrieve data effectively using key algorithmic strategies.",
        link: "/searchsort"
    }
];

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

const DSA = () => {
    const { currentUser } = useAuth();
    const [favs, setFavs] = useState({});

    useEffect(() => {
        const fetchUserFavorites = async () => {
            if (!currentUser) return;
            try {
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                const userProfile = await usersCollection.findOne({ "auth_id": currentUser.id });
                
                setFavs(userProfile?.favs || {});

            } catch (error) {
                console.error("Failed to fetch favs:", error);
            }
        };
        fetchUserFavorites();
    }, [currentUser]);

    // ✅ --- UPDATED FAVORITE HANDLER ---
    const handleFavoriteClick = async (e, subCategoryTitle) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;

        const isCurrentlyFavorited = favs[MAIN_CATEGORY_TITLE]?.includes(subCategoryTitle);
        const originalFavs = favs; // Keep a copy in case of DB error

        // Optimistic UI Update using functional form for safety
        setFavs(currentFavs => {
            const newFavs = JSON.parse(JSON.stringify(currentFavs)); // Deep copy

            if (isCurrentlyFavorited) {
                // Remove the item
                const updatedList = (newFavs[MAIN_CATEGORY_TITLE] || []).filter(
                    title => title !== subCategoryTitle
                );
                // If the list is now empty, remove the category key
                if (updatedList.length === 0) {
                    delete newFavs[MAIN_CATEGORY_TITLE];
                } else {
                    newFavs[MAIN_CATEGORY_TITLE] = updatedList;
                }
            } else {
                // Add the item
                if (!newFavs[MAIN_CATEGORY_TITLE]) {
                    newFavs[MAIN_CATEGORY_TITLE] = [];
                }
                newFavs[MAIN_CATEGORY_TITLE].push(subCategoryTitle);
            }
            return newFavs;
        });

        // Database Update using atomic operators
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const fieldPath = `favs.${MAIN_CATEGORY_TITLE}`;
            
            let updateOperation;
            if (isCurrentlyFavorited) {
                // If the array will become empty, we can use $unset to remove the field
                if (originalFavs[MAIN_CATEGORY_TITLE]?.length === 1) {
                    updateOperation = { "$unset": { [`favs.${MAIN_CATEGORY_TITLE}`]: "" } };
                } else {
                    updateOperation = { "$pull": { [fieldPath]: subCategoryTitle } };
                }
            } else {
                updateOperation = { "$addToSet": { [fieldPath]: subCategoryTitle } };
            }

            await usersCollection.updateOne(
                { "auth_id": currentUser.id },
                updateOperation
            );

        } catch (error) {
            console.error("Failed to update favs in database:", error);
            setFavs(originalFavs); // Revert UI on error
        }
    };

    const favoritedForThisPage = new Set(favs[MAIN_CATEGORY_TITLE] || []);

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
                            <Link to={category.link} key={category.title} className="category-link-wrapper">
                                <motion.div
                                    className="category-box"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <button
                                        className={`favorite-btn ${favoritedForThisPage.has(category.title) ? 'favorited' : ''}`}
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