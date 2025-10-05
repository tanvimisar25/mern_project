import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css'; 
import { useAuth } from './AuthContext';

const MAIN_CATEGORY_TITLE = "Web Development";


const categories = [
    {
        id: "frontend_frameworks",
        title: "Front-End Frameworks",
        description: "Build dynamic UIs with popular frameworks and libraries.",
        link: "/frontend"
    },
    {
        id: "backend_development",
        title: "Back-End Development",
        description: "Master server-side logic, databases, and APIs.",
        link: "/backend"
    },
    {
        id: "javascript_fundamentals",
        title: "JavaScript & Browser Fundamentals",
        description: "Explore core JS concepts, the DOM, and browser APIs.",
        link: "/js"
    },
    {
        id: "version_control_deployment",
        title: "Version Control & Deployment",
        description: "Learn to ship code using Git, CI/CD, and modern hosting.",
        link: "/versioncontrol"
    }
];

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);


const WebDev = () => {
    // Access user data and authentication functions from the AuthContext.
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();

  
    useEffect(() => {
        if (currentUser?.email) {
            fetchUserProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchUserProfile]);

    
    const handleFavoriteClick = async (e, deckTitle) => {
        e.preventDefault(); // Prevents navigation when clicking the button inside the link.
        e.stopPropagation(); // Stops the event from bubbling up to the parent Link component.
        
        if (!currentUser?.email) return;

        const updatedFavorites = JSON.parse(JSON.stringify(currentUser.favoriteDecks || {}));
        const categoryFavorites = updatedFavorites[MAIN_CATEGORY_TITLE] || {};

        const isCurrentlyFavorited = categoryFavorites.hasOwnProperty(deckTitle);

        if (isCurrentlyFavorited) {
            delete categoryFavorites[deckTitle];
        } else {
            categoryFavorites[deckTitle] = true;
        }

        if (Object.keys(categoryFavorites).length === 0) {
            delete updatedFavorites[MAIN_CATEGORY_TITLE];
        } else {
            updatedFavorites[MAIN_CATEGORY_TITLE] = categoryFavorites;
        }

        try {
            await updateUserProfile(currentUser.email, { favoriteDecks: updatedFavorites });
        } catch (error) {
            console.error("Failed to update favorites:", error);
        }
    };
    
    // Safely access the favorites for this specific main category.
    const webDevFavorites = currentUser?.favoriteDecks?.[MAIN_CATEGORY_TITLE] || {};

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    <p className="subtitle">
                        Explore the essential pillars of modern web development, from client-side frameworks to server-side logic.
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
                                        // Dynamically set the 'favorited' class based on the user's data.
                                        className={`favorite-btn ${webDevFavorites[category.title] ? 'favorited' : ''}`}
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

export default WebDev;