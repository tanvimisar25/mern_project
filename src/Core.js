import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css';
import { useAuth } from './AuthContext';

// Define the main category title as a constant to ensure consistency.
const MAIN_CATEGORY_TITLE = "Core Interview Questions";

const categories = [
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
    <svg xmlns="http://www.w.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

const Core = () => {
    const { currentUser } = useAuth();
    const [favs, setFavs] = useState({});

    useEffect(() => {
        const fetchUserFavorites = async () => {
            if (!currentUser) return;
            try {
                const mongo = currentUser.mongoClient("mongodb-atlas");
                const usersCollection = mongo.db("prepdeck").collection("user");
                const userProfile = await usersCollection.findOne({ "auth_id": currentUser.id });
                
                // This is now safe. New users have a `favs: {}` field from sign-up.
                // The `|| {}` is an extra fallback for safety.
                setFavs(userProfile?.favs || {});

            } catch (error) {
                console.error("Failed to fetch favs:", error);
            }
        };
        fetchUserFavorites();
    }, [currentUser]);

    const handleFavoriteClick = async (e, subCategoryTitle) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;

        const isCurrentlyFavorited = favs[MAIN_CATEGORY_TITLE]?.includes(subCategoryTitle);
        // Create a deep copy to safely modify the state before updating
        const newFavsState = JSON.parse(JSON.stringify(favs));
        
        if (!newFavsState[MAIN_CATEGORY_TITLE]) {
            newFavsState[MAIN_CATEGORY_TITLE] = [];
        }

        if (isCurrentlyFavorited) {
            newFavsState[MAIN_CATEGORY_TITLE] = newFavsState[MAIN_CATEGORY_TITLE].filter(
                title => title !== subCategoryTitle
            );
        } else {
            newFavsState[MAIN_CATEGORY_TITLE].push(subCategoryTitle);
        }
        setFavs(newFavsState);

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");

            // Use dot notation to target the nested array.
            // $set is the safest operator as it creates the fields if they don't exist.
            const fieldPath = `favs.${MAIN_CATEGORY_TITLE}`;
            
            await usersCollection.updateOne(
                { "auth_id": currentUser.id },
                { "$set": { [fieldPath]: newFavsState[MAIN_CATEGORY_TITLE] } }
            );
        } catch (error) {
            console.error("Failed to update favs in database:", error);
            setFavs(favs); // Revert UI on error
        }
    };

    const favoritedForThisPage = new Set(favs[MAIN_CATEGORY_TITLE] || []);

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    <p className="subtitle">
                        Master the four key types of questions asked in every interview.
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

export default Core;