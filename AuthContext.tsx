/*
 * Authentication Context
 * Manages admin authentication state and password verification
 */

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already authenticated (from localStorage)
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token && isValidToken(token)) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (password: string): boolean => {
    // Simple password check (in production, use backend authentication)
    // Default password: "admin123"
    const adminPassword = "admin123";

    if (password === adminPassword) {
      const token = generateToken();
      localStorage.setItem("admin_token", token);
      localStorage.setItem("admin_login_time", new Date().toISOString());
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_login_time");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

// Helper functions
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function isValidToken(token: string): boolean {
  // Check if token exists and session hasn't expired (24 hours)
  const loginTime = localStorage.getItem("admin_login_time");
  if (!loginTime) return false;

  const loginDate = new Date(loginTime);
  const now = new Date();
  const hoursElapsed = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

  return hoursElapsed < 24;
}
