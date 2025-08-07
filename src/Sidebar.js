import React from "react";
import "./Sidebar.css";
import { NavLink } from 'react-router-dom';

function Sidebar({toggleTheme}){
    return (
        <div className="sidebar">
            <h2 className="logo">Task Manager</h2>
            <nav className="nav-links">
                <NavLink to="/" end>Dashboard</NavLink>
                <NavLink to="/tasks">Tasks</NavLink>
                <NavLink to="/feedback">Feedback</NavLink>
            </nav>
            <button className="theme-toggle" onClick={toggleTheme}>
                Toggle Theme
            </button>
        </div>
    );
}

export default Sidebar;