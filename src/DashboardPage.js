import React from "react";
import "./DashboardPage.css";

function DashboardPage(){
    return (
        <div className="dashboard">
            <h1>Welcome to Your Dashboard</h1>

            <div className="summary-cards">
                <div className="card">
                    <h2>Total Tasks</h2>
                    <p>12</p>
                </div>
                <div className="card">
                    <h2>Completed</h2>
                    <p>7</p>
                </div>
                <div className="card">
                    <h2>Due Today</h2>
                    <p>3</p>
                </div>
            </div>

            <div className="recent-tasks">
                <h2>Recent Tasks</h2>
                <ul>
                    <li>Finish wireframe for Project X</li>
                    <li>Update landing page styling</li>
                    <li>Submit team feedback</li>
                </ul>
            </div>

            <div className="quote">
                <p>"Progress, not perfection."</p>
            </div>
        </div>
    );
}

export default DashboardPage;