//import logo from './logo.svg';
import React, { useState } from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import TodosPage from "./pages/TodosPage";
import FeedbackPage from "./pages/FeedbackPage";
import './App.css';

function App() {
  // initalize dark mode state (default is light)
  const [darkMode, setDarkMode] = useState(false);

  // function to toggle the theme
  function toggleTheme(){
    setDarkMode(prev => !prev); // return the input of the previous state
  }

  return (
    <Router>
      // dynamically set className based on current state of darkMode
      <div className={`app ${darkMode ? 'dark' : 'light'}`}>
        <Sidebar toggleTheme={toggleTheme} />
        <main className="main-content">
          <Routes>
            {/* Landing Page = Dashboard */}
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TodosPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="*" element={<Navigate to ="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
