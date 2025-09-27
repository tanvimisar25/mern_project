import React, { useState, useEffect } from "react"; // NEW: Imported useEffect
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css';
import { useAuth } from './AuthContext'; // NEW: Imported your AuthContext hook

const categories = [
    // ... (category data remains the same)
    {
        title: "Behavioral Questions",
        description: "Prove your past skills and behaviors through real-life examples.",
        link: "/behavioralquestions"
    },
    {
        title: "Situational Questions",
        description: "Assess your judgment with hypothetical 'what would you do if' scenarios.",
        link: "/situational-questions"
    },
    {
        title: "Resume & Project Deep Dive",
        description: "A detailed examination of the projects and experiences on your resume.",
        link: "/resume-deep-dive"
    },
    {
        title: "Company & Role Motivation",
        description: "Demonstrate your research and genuine interest in this specific role.",
        link: "/company-motivation"
    }
];

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

const Core = () => {
    // NEW: Get the current user from your AuthContext
    const { currentUser } = useAuth();

    // NEW: State now holds a Set for efficient checking (e.g., favorites.has('...'))
    const [favorites, setFavorites] = useState(new Set());

    // NEW: useEffect to fetch the user's favorites when the component loads
    useEffect(() => {
        const fetchUserFavorites = async () => {
            if (!currentUser) return; // Don't run if the user isn't logged in yet

            try {
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                
                // Find the user's document
                const userProfile = await usersCollection.findOne({ "auth_id": currentUser.id });
                
                // If the user and their favoriteDecks exist, update our state
                if (userProfile && userProfile.favoriteDecks) {
                    setFavorites(new Set(userProfile.favoriteDecks));
                }
            } catch (error) {
                console.error("Failed to fetch user favorites:", error);
            }
        };

        fetchUserFavorites();
    }, [currentUser]); // This effect re-runs if the user logs in or out


    // NEW: The function is now async and connects to the database
    const handleFavoriteClick = async (e, title) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentUser) {
            console.log("Please log in to save favorites.");
            return;
        }

        const isCurrentlyFavorited = favorites.has(title);

        // --- 1. Optimistic UI Update ---
        // Update the local state immediately for a fast user experience.
        const newFavorites = new Set(favorites);
        if (isCurrentlyFavorited) {
            newFavorites.delete(title);
        } else {
            newFavorites.add(title);
        }
        setFavorites(newFavorites);

        // --- 2. Database Update ---
        // Now, tell the database what changed.
        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");

            // Use $pull to remove an item, or $push to add it.
            const updateOperation = isCurrentlyFavorited
                ? { "$pull": { "favoriteDecks": title } }
                : { "$push": { "favoriteDecks": title } };

            await usersCollection.updateOne(
                { "auth_id": currentUser.id }, // Find the correct user
                updateOperation // Apply the add or remove operation
            );

        } catch (error) {
            console.error("Failed to update favorites in database:", error);
            // Optional: Revert the UI change if the database update fails
            setFavorites(favorites);
        }
    };

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>Core Interview Questions</h1>
                    <p className="subtitle">
                        Master the four key types of questions asked in every interview.
                    </p>
                </div>
                <div className="core-category-container">
                    <h3>Subcategories</h3>
                    <div className="category-grid">
                        {categories.map((category, index) => (
                            <Link to={category.link} key={index} className="category-link-wrapper">
                                <motion.div
                                    className="category-box"
                                    whileHover={{ scale: 1.03 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                >
                                    <button
                                        // NEW: The 'favorited' class now checks the Set
                                        className={`favorite-btn ${favorites.has(category.title) ? 'favorited' : ''}`}
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

export default Core;