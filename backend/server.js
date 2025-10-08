const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); 
const bcrypt = require('bcrypt'); // Library for hashing passwords.
require('dotenv').config(); // connect with .env file.
const app = express();

app.use(cors()); // Enable all CORS requests.
app.use(express.json()); // Middleware to parse incoming JSON request bodies.

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

       
        app.post('/api/login', async (req, res) => {
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
                totalCorrectAnswers: 0,
                totalAnsweredQuestions: 0
            };
            
            try {
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

       
        app.post('/api/user/:email/reset', async (req, res) => {
            try {
                const email = req.params.email; /*placeholder for reusabilty*/

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

        
        app.post('/api/user/:email/stats', async (req, res) => {
            try {
                const email = req.params.email;
                const { correct, total } = req.body; 

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

        
        app.put('/api/user/:email', async (req, res) => {
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