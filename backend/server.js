const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
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
            const { email, password } = req.body;
            console.log(`Login attempt for email: ${email}`);
            
            const user = await usersCollection.findOne({ email: email });

            if (user && user.password === password) {
                console.log("Login successful");
                // IMPORTANT: We send the whole user object back on login now
                res.status(200).json({ message: "Login successful!", user: user });
            } else {
                console.log("Login failed: Invalid credentials");
                res.status(401).json({ message: "Invalid email or password" });
            }
        });

        app.post('/api/signup', async (req, res) => {
            const { email, password, username } = req.body;
            console.log(`Signup attempt for email: ${email}`);
            
            // --- ✅ CORRECTION: Changed deck properties to be arrays ---
            const newUser = {
                username,
                email,
                password, 
                favoriteDecks: {}, 
                completedDecks: {},
                masteredDecks: {},
                accuracy_score: 0,
                editedCards: {},
                todos: []
            };
            
            try {
                const result = await usersCollection.insertOne(newUser);
                res.status(201).json({ message: "User created!", userId: result.insertedId });
            } catch (e) {
                console.error("Error creating user:", e);
                if (e.code === 11000) {
                    return res.status(409).json({ message: "Email already in use." });
                }
                res.status(500).json({ message: "Error creating user" });
            }
        });

        // --- ✅ NEW ENDPOINT 1: Get a user's full profile data ---
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

        // --- ✅ NEW ENDPOINT 2: Update a user's profile (for todos, decks, etc.) ---
        app.put('/api/user/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const updatedData = req.body; // e.g., { todos: newTodosArray }

                const result = await usersCollection.updateOne(
                    { email: email },
                    { $set: updatedData } // Use $set to update specific fields
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
