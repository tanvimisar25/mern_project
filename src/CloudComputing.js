import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import './Core.css';
import { useAuth } from './AuthContext';

// --- (1) MAIN CATEGORY TITLE UPDATED ---
const MAIN_CATEGORY_TITLE = "Cloud Computing";

// --- (2) SUBCATEGORIES UPDATED ---
const categories = [
    {
        title: "Cloud Platforms",
        description: "Explore the services and architectures of major cloud providers.",
        link: "/cloudplatforms"
    },
    {
        title: "Containerization",
        description: "Package and run applications consistently with Docker and Kubernetes.",
        link: "/containerization"
    },
    {
        title: "CI/CD Pipelines",
        description: "Automate your build, test, and deployment workflows.",
        link: "/pipelines"
    },
    {
        title: "Infrastructure as Code",
        description: "Manage and provision infrastructure through code with tools like Terraform.",
        link: "/infrastructure"
    }
];

const HeartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
    </svg>
);

// --- (4) COMPONENT RENAMED ---
const CloudComputing = () => {
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

    const handleFavoriteClick = async (e, subCategoryTitle) => {
        e.preventDefault();
        e.stopPropagation();
        if (!currentUser) return;

        const isCurrentlyFavorited = favs[MAIN_CATEGORY_TITLE]?.includes(subCategoryTitle);
        const originalFavs = favs;

        setFavs(currentFavs => {
            const newFavs = JSON.parse(JSON.stringify(currentFavs));

            if (isCurrentlyFavorited) {
                const updatedList = (newFavs[MAIN_CATEGORY_TITLE] || []).filter(
                    title => title !== subCategoryTitle
                );
                if (updatedList.length === 0) {
                    delete newFavs[MAIN_CATEGORY_TITLE];
                } else {
                    newFavs[MAIN_CATEGORY_TITLE] = updatedList;
                }
            } else {
                if (!newFavs[MAIN_CATEGORY_TITLE]) {
                    newFavs[MAIN_CATEGORY_TITLE] = [];
                }
                newFavs[MAIN_CATEGORY_TITLE].push(subCategoryTitle);
            }
            return newFavs;
        });

        try {
            const mongo = currentUser.mongoClient("mongodb-atlas");
            const usersCollection = mongo.db("prepdeck").collection("user");
            const fieldPath = `favs.${MAIN_CATEGORY_TITLE}`;
            
            let updateOperation;
            if (isCurrentlyFavorited) {
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
            setFavs(originalFavs);
        }
    };

    const favoritedForThisPage = new Set(favs[MAIN_CATEGORY_TITLE] || []);

    return (
        <div className="core-page-layout">
            <main className="core-main-content">
                <div className="core-header">
                    <h1>{MAIN_CATEGORY_TITLE}</h1>
                    {/* --- (3) MAIN SUBTITLE UPDATED --- */}
                    <p className="subtitle">
                        Understand the core concepts of modern cloud infrastructure and deployment.
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

// --- (4) EXPORT RENAMED ---
export default CloudComputing;