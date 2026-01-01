import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function Settings() {
  const [sessionActive, setSessionActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // seconds

  // Session duration MUST match backend (PT05 = 5 minutes)
  const SESSION_DURATION = 5 * 60;

  /* STEP 1: Check session when Settings loads */
  useEffect(() => {
    const checkSession = async () => {
      try {
        await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        });

        // If server says session is valid
        setSessionActive(true);
        setTimeLeft(SESSION_DURATION);
      } catch {
        // Session does not exist or expired
        setSessionActive(false);
        setTimeLeft(null);
      }
    };

    checkSession();
  }, []);

  /* STEP 2: Countdown timer (runs every second) */
  useEffect(() => {
    if (!sessionActive || timeLeft === null) return;

    // When timer reaches zero
    if (timeLeft <= 0) {
      setSessionActive(false);
      setTimeLeft(null);
      toast.error("Session expired");
      return;
    }

    // Decrease remaining time every second
    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [sessionActive, timeLeft]);

  /* STEP 3: Ask server every minute if session is still valid */
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await axios.get("http://localhost:8080/auth/me", {
          withCredentials: true,
        });
      } catch {
        // Server says session expired
        setSessionActive(false);
        setTimeLeft(null);
        toast.error("Session expired");
      }
    }, 60_000); // every 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="settings-container">
      <h2>Settings</h2>

      {/* SESSION STATUS DISPLAY */}
      {sessionActive ? (
        <div style={{ color: "green", marginBottom: "1rem" }}>
          <p>Session Active ✅</p>
          <p>
            Time left: {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
          </p>
        </div>
      ) : (
        <div style={{ color: "red", marginBottom: "1rem" }}>
          <p>No active session ❌</p>
        </div>
      )}
    </div>
  );
}

export default Settings;
