// src/App.tsx
import React, { useContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import Header from "./components/Header";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Home from "./pages/Home"; // New Home page
import ColorGenerator from "./pages/ColorGenerator"; // New Color Generator page
import PaletteGenerator from "./pages/PaletteGenerator";
import Notification from "./components/Notification";
import "./App.css";

const App = () => {
  const { user } = useContext(AuthContext);
  const [notification, setNotification] = useState<{ message: string; duration: number }>({
    message: "",
    duration: 3000,
  });

  const handleCloseNotification = () => {
    setNotification({ message: "", duration: 0 });
  };

  return (
    <Router>
      <Header />
      <div className="App">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/color-generator" element={<ColorGenerator setNotification={setNotification} />} />
            <Route path="/palette-generator" element={<PaletteGenerator setNotification={setNotification} />} />
          </Routes>

          {notification.message && (
            <Notification
              message={notification.message}
              duration={notification.duration}
              onClose={handleCloseNotification}
            />
          )}
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
