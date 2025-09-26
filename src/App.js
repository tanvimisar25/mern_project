import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ 1. IMPORT THE AUTH PROVIDER
import { AuthProvider } from "./AuthContext";

// Import all your page and layout components
import SidebarLayout from "./SidebarLayout";
import Homepage from "./Homepage"; // Your public homepage
// Homepage2 is no longer needed here for routing
import Login from "./Login";
import Signup from "./Signup";
import MyDeck from "./MyDeck";
import PracticeTest from "./PracticeTest";
import DeckOwn from "./DeckOwn";
import GeneralQuestions from "./GeneralQuestions";

// The main App component's ONLY job is to provide the context and router
function App() {
  return (
    // The AuthProvider is still essential for your login system to work correctly
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
          <Routes>
            <Route element={<SidebarLayout />}>
              
              {/* --- THIS IS THE KEY CHANGE --- */}
              {/* The index route now ALWAYS points to your main homepage */}
              <Route index element={<Homepage />} />

              {/* The rest of your routes */}
              <Route path="/mydecks" element={<MyDeck />} />
              <Route path="/practicetests" element={<PracticeTest />} />
              <Route path="/deckowns" element={<DeckOwn />} />
              <Route path="/generalquestions" element={<GeneralQuestions />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

