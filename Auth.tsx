
import React, { useState } from "react";
import { auth } from "../services/firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../Styles/auth.css"; // Import styles

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAuth = async () => {
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate("/booking"); // Redirect after login
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      {error && <p className="error-message">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
      />
      <button onClick={handleAuth} className="button">
        {isSignUp ? "Sign Up" : "Login"}
      </button>
      <p onClick={() => setIsSignUp(!isSignUp)} className="toggle-link">
        {isSignUp ? "Already have an account? Login" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

export default Auth;
