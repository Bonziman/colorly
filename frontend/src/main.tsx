// src/index.tsx or src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);