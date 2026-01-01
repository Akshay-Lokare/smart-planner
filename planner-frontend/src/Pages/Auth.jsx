import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginOption, setLoginOption] = useState(true);

  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // seconds remaining

  const navigate = useNavigate();

  /* SESSION CONFIG
     Must match server (PT05 = 5 min)
     You said you're testing with 4 min */
  const SESSION_DURATION = 4 * 60; // 4 minutes (TESTING)

  /* CHECK EXISTING SESSION ON LOAD
     If already logged in → go home */
  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        });

        // Session exists
        setSessionActive(true);
        setTimeLeft(SESSION_DURATION);
        navigate("/home");
      } catch {
        // Not logged in → stay on auth page
      }
    };

    checkSession();
  }, [navigate]);

  /* COUNTDOWN TIMER (NEW)
     Runs every second */
  useEffect(() => {
    if (!sessionActive || timeLeft === null) return;

    if (timeLeft <= 0) {
      setSessionActive(false);
      setTimeLeft(null);
      toast.error("Session expired. Logged out.");
      navigate("/auth");
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, sessionActive, navigate]);

  /* SERVER SESSION VALIDATION
     Server is ALWAYS the source of truth
     Runs every 1 minute */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        });
      } catch {
        setSessionActive(false);
        setTimeLeft(null);
        toast.error("Session expired. Logged out.");
        navigate("/auth");
      }
    }, 60_000); // every 1 min

    return () => clearInterval(interval);
  }, [navigate]);

  const handleRegister = async () => {
    try {
      await axios.post(
        "http://localhost:8080/auth/register",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Registered successfully! Please login.");
      setLoginOption(true);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };


  const handleLogin = async () => {
    try {
      await axios.post(
        "http://localhost:8080/auth/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // ✅ Start session tracking
      setSessionActive(true);
      setTimeLeft(SESSION_DURATION);

      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="auth-container">
      <Toaster />

      {/* SESSION DEBUG UI (NEW)
         REMOVE IN PRODUCTION
     */}
      {sessionActive && (
        <div style={{ marginBottom: "10px", color: "green" }}>
          <p>Session Active ✅</p>
          <p>
            Time left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
          </p>
        </div>
      )}

      <button onClick={() => setLoginOption(!loginOption)}>
        {loginOption ? "Switch to Register" : "Switch to Login"}
      </button>

      {loginOption ? (

        <div className="login-container">
          <h2>Login</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (

        <div className="register-container">
          <h2>Register</h2>

          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister}>Sign Up</button>
        </div>
      )}
    </div>
  );
}

export default Auth;
