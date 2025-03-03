import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Booking from "./pages/Booking";
import logo from "./logo.svg";
import "./App.css";
import Auth from "./components/Auth";
import Admin from "./pages/Admin";
import { auth } from "./services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

/**
 * The main App component handles:
 * - Routing
 * - Navigation visibility (admin access)
 * - User authentication state
 */
function App() {
  // State to track the current user
  const [user, setUser] = useState<any>(null);
  // State to determine if the user has admin privileges
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Effect runs once when the component mounts, listening for authentication state changes.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // 🔹 Fetch user role and update state (assuming we store user roles in Firestore or Firebase Auth claims)
        fetchUserRole(currentUser.uid);
      } else {
        setIsAdmin(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // 🔹 Function to fetch user role from Firebase (replace with actual implementation)
  const fetchUserRole = async (userId: string) => {
    try {
      // Placeholder: Replace this with an API call to fetch user role
      const role = "admin"; // Simulating fetched role; adjust according to actual role retrieval logic

      if (role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
      setIsAdmin(false);
    }
  };

  // 🔹 Function to handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAdmin(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Router>
      <div className="App">
        {/* 🔹 Navigation Bar */}
        <nav className="navbar">
          <img src={logo} className="logo" alt="logo" />
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Home
              </NavLink>
            </li>
            {/* 🔹 Booking page is available to all authenticated users */}
            {user && (
              <li>
                <NavLink to="/booking" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Booking
                </NavLink>
              </li>
            )}
            {/* 🔹 Admin panel is only visible to users with admin privileges */}
            {isAdmin && (
              <li>
                <NavLink to="/admin" className={({ isActive }) => (isActive ? "active-link" : "")}>
                  Admin
                </NavLink>
              </li>
            )}
          </ul>

          {/* 🔹 Logout button appears only when a user is logged in */}
          {user && (
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </nav>

        {/* 🔹 Page Content (Homepage Message) */}
        <div className="content">
          <h1>Welcome to Relationary</h1>
          <p>Your mental health matters. Book an appointment with ease.</p>
        </div>

        {/* 🔹 Routes - Defining Page Navigation */}
        <Routes>
          <Route path="/" element={<Auth />} />
          {user && <Route path="/booking" element={<Booking />} />}
          {isAdmin && <Route path="/admin" element={<Admin />} />}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
