const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;

if (!uri) {
    console.error("MONGO_URI not found in .env file.");
    process.exit(1);
}

const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        console.log("✅ Connected successfully to MongoDB Atlas!");
        
        const db = client.db("prepdeck");
        const usersCollection = db.collection("user");

        // --- API ENDPOINTS ---

        app.post('/api/login', async (req, res) => {
            // ... (login logic is unchanged)
            const { email, password } = req.body;
            const user = await usersCollection.findOne({ email: email });
            if (user && await bcrypt.compare(password, user.password)) {
                res.status(200).json({ message: "Login successful!", user: user });
            } else {
                res.status(401).json({ message: "Invalid email or password" });
            }
        });

        app.post('/api/signup', async (req, res) => {
            const { email, password, username } = req.body;
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const newUser = {
                username,
                email,
                password: hashedPassword, 
                favoriteDecks: {}, 
                completedDecks: {},
                masteredDecks: {},
                editedCards: {},
                todos: [],
                // ✅ 1. Add new fields for tracking accuracy
                totalCorrectAnswers: 0,
                totalAnsweredQuestions: 0
            };
            
            try {
                const result = await usersCollection.insertOne(newUser);
                res.status(201).json({ message: "User created!", userId: result.insertedId });
            } catch (e) {
                if (e.code === 11000) {
                    return res.status(409).json({ message: "Email already in use." });
                }
                res.status(500).json({ message: "Error creating user" });
            }
        });

        // ✅ NEW ENDPOINT: Reset a user's progress and stats
app.post('/api/user/:email/reset', async (req, res) => {
    try {
        const email = req.params.email;

        const result = await usersCollection.updateOne(
            { email: email },
            // Set all progress-related fields back to their default, empty state
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

        
        // --- ✅ 2. NEW ENDPOINT: Update a user's accuracy stats ---
        app.post('/api/user/:email/stats', async (req, res) => {
            try {
                const email = req.params.email;
                const { correct, total } = req.body; // Expecting { correct: 5, total: 10 }

                const result = await usersCollection.updateOne(
                    { email: email },
                    // Use $inc to atomically increment the fields
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

        app.get('/api/user/:email', async (req, res) => {
            // ... (this endpoint is unchanged)
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

        app.put('/api/user/:email', async (req, res) => {
            // ... (this endpoint is unchanged)
            try {
                const email = req.params.email;
                const updatedData = req.body;
                if (updatedData.password) {
                    delete updatedData.password;
                }
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


        app.listen(5000, () => {
            console.log(`🚀 Server is running on http://localhost:5000`);
        });

    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
}

run();