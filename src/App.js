import React from "react";
// ✅ 1. Necessary imports are already here
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

// ✅ 2. Import AuthProvider and useAuth
import { AuthProvider, useAuth } from "./AuthContext";

// Import all your page and layout components
import Homepage2 from "./Homepage2";
import SidebarLayout from "./SidebarLayout";
import Homepage from "./Homepage";
import Login from "./Login";
import Signup from "./Signup";
import MyDeck from "./MyDeck";
import PracticeTest from "./PracticeTest";
import BehavioralQuestions from "./BehavioralQuestions";
import Core from "./Core";


// This is your existing ProtectedRoute component
const ProtectedRoute = () => {
  const { currentUser } = useAuth();

  // If the user is NOT logged in, redirect them to the /login page
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If the user IS logged in, show the page they were trying to access
  return <Outlet />;
};

// ✅ 3. CREATE THE NEW PUBLICROUTE COMPONENT
// This component does the opposite of ProtectedRoute.
// It keeps logged-in users away from public-only pages.
const PublicRoute = () => {
    const { currentUser } = useAuth();

    // If a user IS logged in, redirect them away from the public page to their dashboard.
    if (currentUser) {
        return <Navigate to="/dashboard" />;
    }

    // If they are NOT logged in, show the public page they were trying to access.
    return <Outlet />;
};


// The main App component with the final, robust routing structure
function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
          <Routes>
            <Route element={<SidebarLayout />}>
              
              {/* --- Public Routes --- */}
              {/* ✅ 4. WRAP PUBLIC ROUTES WITH THE NEW GUARD */}
              {/* This ensures logged-in users can't see the public homepage, login, or signup pages. */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* --- Protected Routes --- */}
              {/* This section remains the same. */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Homepage2 />} />
                <Route path="/mydecks" element={<MyDeck />} />
                <Route path="/practicetests" element={<PracticeTest />} />
                <Route path="/behavioralquestions" element={<BehavioralQuestions />} />
                <Route path="/core" element={<Core />} />
              </Route>

            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;