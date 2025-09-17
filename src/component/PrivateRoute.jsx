// src/components/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const [isValid, setIsValid] = useState(null); // null = checking, true/false = result
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    // Verify token with backend
    fetch(`http://localhost:8000/token-request?token=${token}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      })
      .catch(() => setIsValid(false));
  }, [token]);

  // Still verifying → you can show a loading spinner
  if (isValid === null) {
    return <div>Checking authentication...</div>;
  }

  // If invalid → redirect
  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  // If valid → show the page
  return children;
}
