// src/contexts/AuthContext.tsx
import React, { createContext, useState, ReactNode, useEffect } from "react";

type User = {
  id: number;
  username: string;
  profile_picture: string;
} | null;

type AuthContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
  logout: () => void;
  checkUserStatus: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
  checkUserStatus: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [checkedUserStatus, setCheckedUserStatus] = useState<boolean>(false);

  // Function to check the user status on app load
  const checkUserStatus = async () => {
    const token = localStorage.getItem("jwt_token");
    if (!token) return; // No token found, do nothing
  
    try {
      const response = await fetch("http://127.0.0.1:5000/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (response.ok) {
        // Save profile picture URL along with user data
        setUser({
          id: data.id,
          username: data.username,
          profile_picture: data.profile_picture,  // Add profile_picture URL here
        });
      } else {
        console.error("Failed to fetch user:", data.error);
        localStorage.removeItem("jwt_token"); // Invalidate token if response is bad
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setCheckedUserStatus(true); // Update the status after the check is done
    }
  };
  

  // Fetch user status only once when app loads or when the user is logged out
  useEffect(() => {
    if (!checkedUserStatus) {
      const fetchStatus = async () => {
        await checkUserStatus(); // Ensure this function is awaited
      };
  
      fetchStatus(); // Call the async function inside useEffect
    }
  }, [checkedUserStatus]);

  const logout = async () => {
    try {
      const token = localStorage.getItem("jwt_token");
      if (!token) {
        setUser(null);
        return;
      }

      // Call the backend logout endpoint
      await fetch("http://127.0.0.1:5000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear the token and reset the user state
      localStorage.removeItem("jwt_token");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, checkUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};
