import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css'; 
import { useAuth } from './AuthContext';

// Defines the main category title used for storing user data (like favorites) in a structured way.
const MAIN_CATEGORY_TITLE = "CyberSecurity";

// An array of objects representing the different subcategories within Cybersecurity.
// Each object has a unique ID, a display title, a description, and a link for navigation.
const categories = [
    {
        id: "network_security_fundamentals",
        title: "Network Security Fundamentals",
        description: "Understand core concepts of securing networks, traffic, and firewalls.",
        link: "/networksecurity"
    },
    {
        id: "application_security",
        title: "Application Security",
        description: "Learn to identify and mitigate common vulnerabilities in software.",
        link: "/appsecurity"
    },
    {
        id: "cryptography_concepts",
        title: "Cryptography Concepts",
        description: "Explore the basics of encryption, hashing, and secure communication.",
        link: "/cryptography"
    },
    {
        id: "ethical_hacking_pen_testing",
        title: "Ethical Hacking & Pen Testing",
        description: "Discover methods for finding and exploiting security weaknesses.",
        link: "/ethicalhacking"
    }
];

// A reusable SVG icon component for the 'favorite' button.
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

// The main component for the Cybersecurity category page.
const CyberSecurity = () => {
    // Access user data and authentication functions from the AuthContext.
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();

    // This effect runs when the component mounts or when the user's email changes.
    // It ensures that the latest user data (including favorites) is loaded.
    useEffect(() => {
        if (currentUser?.email) {
            fetchUserProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchUserProfile]);

    // Handles the click event on the favorite (heart) icon for a subcategory.
    const handleFavoriteClick = async (e, deckTitle) => {
        e.preventDefault(); // Prevents navigation when clicking the button inside the link.
        e.stopPropagation(); // Stops the event from bubbling up to the parent Link component.
        
        if (!currentUser?.email) return;

        // Create a deep copy of the user's favorites to avoid direct state mutation.
        const updatedFavorites = JSON.parse(JSON.stringify(currentUser.favoriteDecks || {}));
        const categoryFavorites = updatedFavorites[MAIN_CATEGORY_TITLE] || {};

        // Check if the deck is already favorited.
        const isCurrentlyFavorited = categoryFavorites.hasOwnProperty(deckTitle);

        // Toggle the favorite status.
        if (isCurrentlyFavorited) {
            delete categoryFavorites[deckTitle];
        } else {
            categoryFavorites[deckTitle] = true;
        }

        // Clean up the main category object if it becomes empty.
        if (Object.keys(categoryFavorites).length === 0) {
            delete updatedFavorites[MAIN_CATEGORY_TITLE];
        } else {
            updatedFavorites[MAIN_CATEGORY_TITLE] = categoryFavorites;
        }

        // Update the user's profile in the backend with the new favorites object.
        try {
            await updateUserProfile(currentUser.email, { favoriteDecks: updatedFavorites });
        } catch (error) {
            console.error("Failed to update favorites:", error);
        }
    };
    
    // Safely access the favorites for this specific main category.
    const cybersecurityFavorites = currentUser?.favoriteDecks?.[MAIN_CATEGORY_TITLE] || {};

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    <p className="subtitle">
                        Learn to protect systems, networks, and data from digital attacks.
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
                                        className={`favorite-btn ${cybersecurityFavorites[category.title] ? 'favorited' : ''}`}
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

export default CyberSecurity;