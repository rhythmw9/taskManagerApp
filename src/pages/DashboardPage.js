import React, { useEffect, useMemo, useState } from "react";
import "./DashboardPage.css";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);

  // load tasks from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("todos.v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {}
  }, []);

  // helpers
  const isToday = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const t = new Date();
    d.setHours(0,0,0,0);
    t.setHours(0,0,0,0);
    return d.getTime() === t.getTime();
  };

  const isFuture = (dateStr) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const t = new Date();
    d.setHours(0,0,0,0);
    t.setHours(0,0,0,0);
    return d.getTime() > t.getTime();
  };

  // computed metrics
  const { total, completed, dueToday, upcoming } = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const dueToday = tasks.filter(t => isToday(t.dueDate) && !t.completed).length;

    // upcoming (future due dates, not completed), sorted soonest first
    const upcoming = tasks
      .filter(t => !t.completed && isFuture(t.dueDate))
      .sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""))
      .slice(0, 5);

    return { total, completed, dueToday, upcoming };
  }, [tasks]);

  return (
    <div className="dashboard">
      <h1 className="dashboard-header">Welcome to Your Dashboard</h1>

      <div className="summary-cards">
        <div className="card">
          <h2>Total Tasks</h2>
          <p>{total}</p>
        </div>
        <div className="card">
          <h2>Completed</h2>
          <p>{completed}</p>
        </div>
        <div className="card">
          <h2>Due Today</h2>
          <p>{dueToday}</p>
        </div>
      </div>

      <div className="upcoming-tasks">
        <h2>Upcoming Tasks</h2>
        {upcoming.length ? (
          <ul>
            {upcoming.map(t => (
              <li key={t.id}>
                {t.title} <small>({t.dueDate})</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tasks</p>
        )}
      </div>

      <div className="quote">
        <p>"Progress, not perfection."</p>
      </div>
    </div>
  );
}

export default DashboardPage;
