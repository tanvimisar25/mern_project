import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css'; // This component can reuse the same CSS
import { useAuth } from './AuthContext';

// ✅ 1. DEFINE THE MAIN CATEGORY TITLE
const MAIN_CATEGORY_TITLE = "Cloud Computing";

// ✅ 2. ADD 'id' PROPERTY TO EACH CATEGORY
const categories = [
    {
        id: "cloud_platforms",
        title: "Cloud Platforms",
        description: "Explore the services and architectures of major cloud providers.",
        link: "/cloudplatforms"
    },
    {
        id: "containerization",
        title: "Containerization",
        description: "Package and run applications consistently with Docker and Kubernetes.",
        link: "/containerization"
    },
    {
        id: "cicd_pipelines",
        title: "CI/CD Pipelines",
        description: "Automate your build, test, and deployment workflows.",
        link: "/pipelines"
    },
    {
        id: "infrastructure_as_code",
        title: "Infrastructure as Code",
        description: "Manage and provision infrastructure through code with tools like Terraform.",
        link: "/infrastructure"
    }
];

// --- HeartIcon Component (Unchanged) ---
const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

// --- Main CloudComputing Page Component (Refactored for MERN) ---
const CloudComputing = () => {
    const { currentUser, updateUserProfile, fetchUserProfile } = useAuth();

    // Fetch user profile on component load to ensure favorites are up-to-date
    useEffect(() => {
        if (currentUser?.email) {
            fetchUserProfile(currentUser.email);
        }
    }, [currentUser?.email, fetchUserProfile]);

    // ✅ 3. REWRITTEN: Favorite handler creates a nested object structure.
    const handleFavoriteClick = async (e, deckTitle) => {
        e.preventDefault();
        e.stopPropagation();
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
    
    // ✅ 4. UPDATED: Check for favorites within the nested structure.
    const cloudFavorites = currentUser?.favoriteDecks?.[MAIN_CATEGORY_TITLE] || {};

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    <p className="subtitle">
                        Understand the core concepts of modern cloud infrastructure and deployment.
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
                                        // ✅ 5. UPDATED: Check and update using the category TITLE.
                                        className={`favorite-btn ${cloudFavorites[category.title] ? 'favorited' : ''}`}
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

export default CloudComputing;
