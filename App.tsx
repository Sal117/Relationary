import React, { useEffect, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Booking from "./pages/Booking";
import logo from "./logo.svg";
import "./App.css";
import Auth from "./components/Auth";
import Admin from "./pages/Admin";
import { auth } from "./services/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  // State to store the authenticated user
  const [user, setUser] = useState<any>(null);
  // State to check if the user is an admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Hook for programmatic navigation
  const navigate = useNavigate(); 

  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Update user state
      if (currentUser) fetchUserRole(currentUser.uid); // Fetch role if user is logged in
      else setIsAdmin(false); // Reset admin status when logged out
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Function to fetch user role (simulate API call)
  const fetchUserRole = async (userId: string) => {
    try {
      const role = "admin"; // Simulated role assignment
      setIsAdmin(role === "admin"); // Set admin state accordingly
    } catch (error) {
      console.error("Error fetching user role:", error);
      setIsAdmin(false);
    }
  };

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Firebase sign-out
      setUser(null); // Reset user state
      setIsAdmin(false); // Reset admin state
      navigate("/"); // Redirect to home page
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="App">
      {/* Navigation Bar */}
      <nav className="navbar">
        <img src={logo} className="logo" alt="logo" />
        <ul className="nav-links">
          <li>
            <NavLink to="/" className={({ isActive }) => (isActive ? "active-link" : "")}>
              Home
            </NavLink>
          </li>
          {user && (
            <li>
              <NavLink to="/booking" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Booking
              </NavLink>
            </li>
          )}
          {isAdmin && (
            <li>
              <NavLink to="/admin" className={({ isActive }) => (isActive ? "active-link" : "")}>
                Admin
              </NavLink>
            </li>
          )}
        </ul>
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </nav>

      {/* Page Content */}
      <div className="content">
        <h1>Welcome to Relationary</h1>
        <p>Your mental health matters. Book an appointment with ease.</p>
      </div>

      {/* Application Routes */}
      <Routes>
        <Route path="/" element={<Auth />} />
        {user && <Route path="/booking" element={<Booking />} />}
        {isAdmin && <Route path="/admin" element={<Admin />} />}
      </Routes>
    </div>
  );
}

export default App;
