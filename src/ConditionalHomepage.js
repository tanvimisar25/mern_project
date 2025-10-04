import React from 'react';

// Import the custom authentication hook to check the user's login status.
import { useAuth } from './AuthContext'; 
// Import the component to show for logged-out users.
import Homepage from './Homepage';      
// Import the component to show for logged-in users.
import Homepage2 from './Homepage2';      

/**
 * This component acts as a router or switch. Its only job is to display the correct
 * homepage based on whether a user is logged in or not.
 */
export default function ConditionalHomepage() {
  // Get the current user's data from the authentication context.
  // `currentUser` will be an object if the user is logged in, or null if they are not.
  const { currentUser } = useAuth();

  // Use a ternary operator to conditionally render the correct component:
  // If `currentUser` exists (is not null), render the logged-in homepage (`Homepage2`).
  // Otherwise, render the public, logged-out homepage (`Homepage`).
  return currentUser ? <Homepage2 /> : <Homepage />;
}