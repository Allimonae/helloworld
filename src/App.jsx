import { useState, useEffect } from "react"; 
// Import useState and useEffect hooks from React for state management and side effects.
import { GoogleOAuthProvider } from '@react-oauth/google';
// Import GoogleOAuthProvider for integrating Google OAuth authentication.
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
// Import routing components from react-router-dom: BrowserRouter for routing context, 
// Routes and Route for defining paths, Navigate for redirection, and useNavigate for programmatic navigation.

import LoginPage from "./pages/LoginPage";
// Import LoginPage component for the login route.
import HomePage from "./pages/HomePage";
// Import HomePage component for the main/home route.
import CreateAccountPage from "./pages/CreateAccountPage";
// Import CreateAccountPage component for the account creation route.

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Define a state variable isAuthenticated to track if the user is logged in; initialized to false.
  const navigate = useNavigate();
  // Get the navigate function from react-router-dom to allow for programmatic navigation.

  useEffect(() => {
    console.log("Authentication status:", isAuthenticated);
    // Log the current authentication status to the console for debugging.
    if (isAuthenticated) {
      console.log("Navigating to home page");
      // If isAuthenticated is true, log a message indicating redirection to the home page.
      navigate("/");
      // Navigate to the home page ("/") if the user is authenticated.
    }
  }, [isAuthenticated, navigate]);
  // useEffect runs whenever isAuthenticated or navigate changes.
  // This checks the authentication status and navigates if necessary.

  return (
    <Routes>
      {/* Define all routes within the Routes component */}
      <Route
        path="/"
        element={isAuthenticated ? <HomePage /> : <Navigate to="/login" />}
      />
      {/* If user is authenticated, render HomePage at the root path ("/");
          otherwise, redirect to "/login". */}
      <Route
        path="/login"
        element={<LoginPage setIsAuthenticated={setIsAuthenticated} />}
      />
      {/* Render LoginPage at "/login" path and pass setIsAuthenticated to update authentication status. */}
      <Route path="/createAccount" element={<CreateAccountPage />} />
      {/* Render CreateAccountPage at "/createAccount" path */}
    </Routes>
  );
}

export default function RootApp() {
  return (
    <GoogleOAuthProvider clientId="584140172046-gkgm53jvaso7vqrvh75r1lsc3dvdk1qa.apps.googleusercontent.com">
      {/* Wrap the application in GoogleOAuthProvider to enable Google OAuth login,
          with the clientId from Google Cloud Console */}
      <BrowserRouter>
        {/* Wrap App with BrowserRouter to enable routing throughout the application */}
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}


