import React, { useEffect, useMemo, useRef, useState } from "react";
import TaskRow from "../components/TaskRow";
import "./TodosPage.css";

function TodosPage() {
 // Initalize states
  // Form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskStarred, setTaskStarred] = useState(false);

  // Array of all tasks
  const [tasks, setTasks] = useState([]);

  // filter states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("dueAsc"); // dueAsc, dueDesc, prioDesc, starred, createdDesc
  
  // tip index state
  const [tipIndex, setTipIndex] = useState(0);

  // reference to the task title input element
  const titleRef = useRef(null);

  // array of tips
  const tips = [
    "Tip: Use the star to pin important tasks.",
    "Tip: Write titles as actions (e.g., 'Email professor').",
    "Tip: Keep due dates realistic to avoid overwhelm.",
    "Tip: Batch similar tasks together for focus."
  ];
 
  // Check for saved data in local storage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("todos.v1");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setTasks(parsed);
      }
    } catch {}
  }, []);


  // Save any added tasks in local storage
  useEffect(() => {
    try {
      localStorage.setItem("todos.v1", JSON.stringify(tasks));
    } catch {}
  }, [tasks]);



  // Helper Functions

  // generate a unique ID for every task created
  const newId = () =>
    (crypto?.randomUUID?.() || `${Date.now()}_${Math.random().toString(36).slice(2)}`);


  // boolean function to check if a date is before today (overdue task)
  const isOverdue = (dateStr) => {
    if (!dateStr) return false;

    const d = new Date(dateStr);
    const today = new Date();

    // just compare dates
    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return d < today;
  };

  // boolean function to check if a date is exactly today
  const isToday = (dateStr) => {
    if (!dateStr) return false;

    const d = new Date(dateStr);
    const today = new Date();

    d.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return d.getTime() === today.getTime();
  };



  // Add task
  function addTask() {

    // validate inputs
    if (!taskTitle.trim() || !taskDueDate) {
      titleRef.current?.focus();
      return;
    }

    // task object
    const newTask = {
      id: newId(),
      title: taskTitle.trim(),
      dueDate: taskDueDate,
      priority: taskPriority, 
      starred: taskStarred,
      completed: false,
      createdAt: Date.now(),
      editing: false
    };

    // insert new task into state
    setTasks((prev) => [newTask, ...prev]);

    // reset form
    setTaskTitle("");
    setTaskDueDate("");
    setTaskPriority("medium");
    setTaskStarred(false);
    titleRef.current?.focus();
  }

  // Toggle complete
  function toggleComplete(id) {
    setTasks((curr) => curr.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  // Toggle star
  function toggleStar(id) {
    setTasks((curr) => curr.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  }

  // Delete
  function deleteTask(id) {
    setTasks((curr) => curr.filter(t => t.id !== id));
  }

  // edit true
  function startEdit(id) {
    setTasks(curr => curr.map(t => t.id === id ? { ...t, editing: true } : t));
  }

  // edit false
  function cancelEdit(id) {
    setTasks(curr => curr.map(t => t.id === id ? { ...t, editing: false } : t));
  }

  // pass new values into task to be edited
  function saveEdit(id, values) {
    setTasks(curr => curr.map(t => t.id === id ? { ...t, ...values, title: values.title.trim(), editing: false } : t));
  }

  // Filter logic 
  const filtered = useMemo(() => { // useMemo() for optimization
    return tasks.filter(t => {

      // status
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "active" && !t.completed) ||
        (filterStatus === "completed" && t.completed);

      // priority
      const matchesPriority = filterPriority === "all" || t.priority === filterPriority;

      // search term
      const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase().trim());

      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, filterStatus, filterPriority, searchTerm]);

  // sort logic
  const visibleTasks = useMemo(() => { // useMemo() for optimization
    const prioScore = { high: 3, medium: 2, low: 1 };
    const copy = [...filtered];
    switch (sortBy) {
      case "dueAsc":
        return copy.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
      case "dueDesc":
        return copy.sort((a, b) => (b.dueDate || "").localeCompare(a.dueDate || ""));
      case "prioDesc":
        return copy.sort((a, b) => prioScore[b.priority] - prioScore[a.priority]);
      case "starred":
        return copy.sort((a, b) => Number(b.starred) - Number(a.starred));
      case "createdDesc":
      default:
        return copy.sort((a, b) => b.createdAt - a.createdAt);
    }
  }, [filtered, sortBy]);

  // number of completed tasks
  const completedCount = tasks.filter(t => t.completed).length;

  // clear all completed tasks
  function clearCompleted() {
    if (!completedCount) return;
    setTasks(prev => prev.filter(t => !t.completed));
  }

  // clear all tasks
  function clearAll() {
    if (!tasks.length) return;
    setTasks([]);
  }

  const canAdd = taskTitle.trim() && taskDueDate;

  const todayLocal = (() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  })();


  return (
    <div className="tasks-page">
      <header className="tasks-header">
        <h1>Tasks</h1>
        <div className="stats">
          <span>{tasks.length} total</span>
          <span>• {tasks.filter(t => !t.completed).length} active</span>
          <span>• {completedCount} completed</span>
        </div>
      </header>

      {/* Add Task */}
      <form className="task-inputs card" onSubmit={(e) => {e.preventDefault(); if (canAdd) addTask(); }}>
        <input
          ref={titleRef}
          type="text"
          placeholder="Task title (e.g., Email TA)"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />
        <input
          type="date"
          value={taskDueDate}
          onChange={(e) => setTaskDueDate(e.target.value)}
          min={todayLocal}
        />
        <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <label className="star-toggle">
          <input type="checkbox" checked={taskStarred} onChange={() => setTaskStarred(!taskStarred)} />
          <span>Star</span>
        </label>
        <button type="submit" disabled={!canAdd} className="btn primary">
          Add Task
        </button>
      </form>

      {/* Filters / Sort */}
      <div className="task-filters">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>

        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="dueAsc">Due date ↑</option>
          <option value="dueDesc">Due date ↓</option>
          <option value="prioDesc">Priority (High→Low)</option>
          <option value="starred">Starred first</option>
          <option value="createdDesc">Newest first</option>
        </select>

        <div className="bulk-actions">
          <button className="btn subtle" onClick={clearCompleted} disabled={!completedCount}>Clear Completed</button>
          <button className="btn danger" onClick={clearAll} disabled={!tasks.length}>Clear All</button>
        </div>
      </div>

      {/* Task List */}
      <div className="task-list">
        {!visibleTasks.length ? (
          <p className="task-placeholder">No tasks to show. Add your first one above 👆</p>
        ) : (
          <ul>
            {visibleTasks.map(task => (
              <TaskRow
                key={task.id}
                task={task}
                onToggleComplete={() => toggleComplete(task.id)}
                onToggleStar={() => toggleStar(task.id)}
                onDelete={() => deleteTask(task.id)}
                onStartEdit={() => startEdit(task.id)}
                onCancelEdit={() => cancelEdit(task.id)}
                onSaveEdit={(values) => saveEdit(task.id, values)}
                isOverdue={isOverdue(task.dueDate)}
                isToday={isToday(task.dueDate)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Tip Box */}
      <div className="task-tip card">
        <p>{tips[tipIndex]}</p>
        <button className="btn subtle" onClick={() => setTipIndex(i => (i + 1) % tips.length)}>New Tip</button>
      </div>
    </div>
  );
}



export default TodosPage;
