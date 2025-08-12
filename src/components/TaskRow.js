import React, {useState, useEffect} from "react";
import "../pages/TodosPage.css";

function TaskRow({ task, onToggleComplete, onToggleStar, onDelete, onStartEdit, onCancelEdit, onSaveEdit, isOverdue, isToday }) {
  
  // initial states
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDue, setEditDue] = useState(task.dueDate);
  const [editPriority, setEditPriority] = useState(task.priority);

  // initalize edit fields with current task row values
  useEffect(() => {
    if (task.editing) {
      setEditTitle(task.title);
      setEditDue(task.dueDate);
      setEditPriority(task.priority);
    }
  }, [task.editing, task.title, task.dueDate, task.priority]);

  // function to pass edited values to TodosPage
  function handleSave() {
    if (!editTitle.trim() || !editDue) return;
    onSaveEdit({ title: editTitle.trim(), dueDate: editDue, priority: editPriority });
  }


  return (
    <li className={`task-row ${task.completed ? "completed" : ""}`}>
      <div className="main">
        {/* checkbox */}
        <input type="checkbox" title="Toggle Complete" checked={task.completed} onChange={onToggleComplete}/>

        {/* conditional rendering*/}
        {task.editing ? (
          <>
            {/* edit mode */}
            <input
              className="edit-title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); if (e.key === "Escape") onCancelEdit(); }}
              autoFocus
            />
            <input
              type="date"
              value={editDue}
              onChange={(e) => setEditDue(e.target.value)}
            />
            <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </>
        ) : (
          <>
            {/* view mode */}
            <span className="title">{task.title}</span>
            {task.starred && <span className="star" title="Starred">⭐</span>}
            {isToday && <span className="badge today">Today</span>}
            {isOverdue && !task.completed && <span className="badge overdue">Overdue</span>}
          </>
        )}
      </div>

      {/* actions */}
      <div className="actions">
        {task.editing ? (
          <>
            <button className="btn primary sm" onClick={handleSave} title="Save">Save</button>
            <button className="btn subtle sm" onClick={onCancelEdit} title="Cancel">Cancel</button>
          </>
        ) : (
          <>
            <button className="icon-btn" onClick={onStartEdit} title="Edit">✎</button>
            <button className="icon-btn" onClick={onToggleStar} title="Star/Unstar">{task.starred ? "★" : "☆"}</button>
            <button className="icon-btn danger" onClick={onDelete} title="Delete">✕</button>
          </>
        )}
      </div>

      {/* meta */}
      <div className="meta">
        <small>Due: {task.dueDate || "—"}</small>
        <small>Priority: {task.priority}</small>
      </div>
    </li>
  );
}

export default TaskRow;