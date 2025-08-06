//import logo from './logo.svg';
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import DashboardPage from "./DashboardPage";
import TodosPage from "./TodosPage";
import FeedbackPage from "./FeedbackPage";
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme(){
    setDarkMode(prev => !prev);
  }

  return (
    <div className={darkMode ? 'app dark' : 'app'}>
      <Sidebar toggleTheme={toggleTheme} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TodosPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
