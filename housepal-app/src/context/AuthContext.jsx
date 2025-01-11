import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Named export for consistency with HMR
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("AuthProvider - Token from storage:", token);
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log("AuthProvider - Decoded token:", decoded);
        if (!decoded.role) {
          console.error("No role in token payload!");
          localStorage.clear();
          setUser(null);
        } else {
          setUser({ ...decoded, token });
        }
      } catch (err) {
        console.error("AuthProvider - Error decoding token:", err);
        localStorage.clear();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, role) => {
    console.log("Login - Received token:", token, "Provided role:", role);
    localStorage.setItem("token", token);
    const decoded = JSON.parse(atob(token.split('.')[1]));
    console.log("Login - Decoded token:", decoded);
    if (!decoded.role) {
      console.error("Role missing in token, using provided role:", role);
    }
    setUser({ ...decoded, token, role: decoded.role || role }); // Fallback to provided role
    navigate(decoded.role === "helper" || role === "Helper" ? "/helper" : "/seeker");
    console.log("Navigated to:", decoded.role === "helper" || role === "Helper" ? "/helper" : "/seeker");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
    console.log("Logged out and cleared local storage");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Consistent named export
export default AuthProvider;