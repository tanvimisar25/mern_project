// --- Dependencies ---
// Import necessary packages for the server.
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing.
const bcrypt = require('bcrypt'); // Library for hashing passwords.
require('dotenv').config(); // Loads environment variables from a .env file.

// --- App Initialization ---
const app = express();
app.use(cors()); // Enable all CORS requests.
app.use(express.json()); // Middleware to parse incoming JSON request bodies.

// --- Database Configuration ---
// Get the MongoDB connection string from environment variables.
const uri = process.env.MONGO_URI;

// Exit the application if the database connection string is not provided.
if (!uri) {
    console.error("MONGO_URI not found in .env file.");
    process.exit(1);
}

// Create a new MongoDB client instance.
const client = new MongoClient(uri);

/**
 * The main asynchronous function to connect to the database and start the server.
 */
async function run() {
    try {
        // Connect to the MongoDB cluster.
        await client.connect();
        console.log("✅ Connected successfully to MongoDB Atlas!");
        
        // Get a reference to the 'prepdeck' database and the 'user' collection.
        const db = client.db("prepdeck");
        const usersCollection = db.collection("user");

        // --- API ENDPOINTS ---

        /**
         * [POST] /api/login
         * Handles user login by verifying email and password.
         */
        app.post('/api/login', async (req, res) => {
            const { email, password } = req.body;
            // Find a user with the provided email.
            const user = await usersCollection.findOne({ email: email });
            
            // If user exists and the provided password matches the hashed password in the DB, login is successful.
            if (user && await bcrypt.compare(password, user.password)) {
                res.status(200).json({ message: "Login successful!", user: user });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        });

        /**
         * [POST] /api/signup
         * Registers a new user, hashes their password, and creates a default user profile.
         */
        app.post('/api/signup', async (req, res) => {
            const { email, password, username } = req.body;
            const saltRounds = 10;
            // Hash the password before storing it.
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Define the default structure for a new user document.
            const newUser = {
                username,
                email,
                password: hashedPassword, 
                favoriteDecks: {}, 
                completedDecks: {},
                masteredDecks: {},
                editedCards: {},
                todos: [],
                totalCorrectAnswers: 0,
                totalAnsweredQuestions: 0
            };
            
            try {
                // Insert the new user into the collection.
                const result = await usersCollection.insertOne(newUser);
                res.status(201).json({ message: "User created!", userId: result.insertedId });
            } catch (e) {
                // MongoDB's duplicate key error code is 11000. This handles cases where the email is already in use.
                if (e.code === 11000) {
                    return res.status(409).json({ message: "Email already in use." });
                }
                res.status(500).json({ message: "Error creating user" });
            }
        });

        /**
         * [POST] /api/user/:email/reset
         * Resets a user's progress (decks and accuracy stats) back to default values.
         */
        app.post('/api/user/:email/reset', async (req, res) => {
            try {
                const email = req.params.email;

                // Find the user by email and set their progress fields to empty/zero values.
                const result = await usersCollection.updateOne(
                    { email: email },
                    { 
                        $set: {
                            completedDecks: {},
                            masteredDecks: {},
                            totalCorrectAnswers: 0,
                            totalAnsweredQuestions: 0
                        } 
                    }
                );

                if (result.matchedCount > 0) {
                    res.status(200).json({ message: "User progress reset successfully" });
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ message: "Error resetting user progress", error });
            }
        });

        /**
         * [POST] /api/user/:email/stats
         * Atomically increments a user's total correct answers and total answered questions.
         */
        app.post('/api/user/:email/stats', async (req, res) => {
            try {
                const email = req.params.email;
                const { correct, total } = req.body; // Expects { correct: 5, total: 10 }

                // Find the user by email and use the '$inc' operator to add the new values to the existing ones.
                const result = await usersCollection.updateOne(
                    { email: email },
                    { $inc: { totalCorrectAnswers: correct, totalAnsweredQuestions: total } }
                );

                if (result.matchedCount > 0) {
                    res.status(200).json({ message: "Stats updated successfully" });
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ message: "Error updating user stats", error });
            }
        });

        /**
         * [GET] /api/user/:email
         * Fetches a single user's complete profile from the database.
         */
        app.get('/api/user/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const user = await usersCollection.findOne({ email: email });
                if (user) {
                    res.status(200).json(user);
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ message: "Error fetching user data", error });
            }
        });

        /**
         * [PUT] /api/user/:email
         * Updates a user's profile with the provided data.
         */
        app.put('/api/user/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const updatedData = req.body;

                // Security measure: never update the password directly via this generic update endpoint.
                if (updatedData.password) {
                    delete updatedData.password;
                }

                // Find the user and set their new data.
                const result = await usersCollection.updateOne(
                    { email: email },
                    { $set: updatedData }
                );
                
                if (result.matchedCount > 0) {
                    res.status(200).json({ message: "User updated successfully" });
                } else {
                    res.status(404).json({ message: "User not found" });
                }
            } catch (error) {
                res.status(500).json({ message: "Error updating user data", error });
            }
        });


        // --- Server Start ---
        // Start the Express server and listen for incoming requests on port 5000.
        app.listen(5000, () => {
            console.log(`🚀 Server is running on http://localhost:5000`);
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

// Execute the main function to start the application.
run();