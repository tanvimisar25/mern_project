import React from 'react';

// 1. Import the tools you need
import { useAuth } from './AuthContext'; // Make sure this path is correct
import Homepage from './Homepage';       // Your public homepage component
import Homepage2 from './Homepage2';      // Your logged-in homepage component

export default function ConditionalHomepage() {
  // 2. Check the user's login status
  const { currentUser } = useAuth();

  // 3. Return the correct component based on the status
  // This is a ternary operator: (if this is true) ? (do this) : (else do this)
  return currentUser ? <Homepage2 /> : <Homepage />;
}