import React from "react";
import { useState } from "react";
import "./TodosPage.css";

function TodosPage(){
    // create initial task states
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDueDate, setTaskDueDate] = useState('');
    const [taskPriority, setTaskPriority] = useState('medium'); // default priority medium
    const [taskStarred, setTaskStarred] = useState(false);

    // input error state
    const [inputError, setInputError] = useState(false);

    // initalize task list state
    const [tasks, setTasks] = useState([]);

    // initial filter states
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    // array of tips to rotate through and display
    const tips = [
        "Tip: Prioritize your tasks to stay focused.",
        "Tip: Use the star to mark important tasks.",
        "Tip: Filter tasks by status or priority.",
    ];

    // initial tip state
    const [tipIndex, setTipIndex] = useState(0);


    // function to add a new task
    function addTask(){
        // error if task name is empty
        if(!taskTitle.trim()){
            setInputError(true);
            setTimeout(() => setInputError(false), 400);
        }

        // create a new task object with all relevent info
        const newTask = {
            id: Date.now(), // use the instantanous date as the unique id
            title: taskTitle.trim(),
            dueDate: taskDueDate,
            priority: taskPriority,
            starred: taskStarred,
            completed: false
        }

        // update state with all previous tasks and the new one
        setTasks([...tasks, newTask]);

        // reset form
        setTaskTitle('');
        setTaskDueDate('');
        setTaskPriority('medium'); 
        setTaskStarred(false);
    }


    // function to toggle completion
    function toggleComplete(id){
        // loop through task array to find the unique task and update the state
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task // if the id matches, create new task obj with completed boolean flipped
        ));
    }


    // filter logic
    // array of tasks to be shown based on status, priority, and search
    const visibleTasks = tasks.filter(task => {
        // filter by status
        const matchesStatus = 
            filterStatus === 'all' || // all tasks
            (filterStatus === 'active' && !task.completed) || // non completed 
            (filterStatus === 'completed' && task.completed); // completed

        // by priority
        const matchesPriority = 
            filterPriority === 'all' || task.priority === filterPriority;

        const matchesSearch = 
            task.title.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesPriority && matchesSearch;
    });


    return (
        <div className="tasks-page">
            <h1 className="tasks-header">Tasks</h1>

            {/* add task sections*/}
            <div className="task-inputs">
                <input
                    type="text"
                    placeholder="Enter a task"
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                />
                <input
                    type="date"
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                />
                <select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <label>
                    <input type="checkbox" checked={taskStarred} onChange={() => setTaskStarred(!taskStarred)}/>
                    Starred
                </label>
                <button onClick={addTask}>Add Task</button>
            </div>

            {/* Filter section */}
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

                <input type="text" placeholder="Search Tasks" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
            </div>

            {/* Task List */}
            <div className="task-list">
                {visibleTasks.length === 0 ? (
                    <p className="task-placeholder">No tasks to show.</p>
                ) : (
                    <ul>
                        {visibleTasks.map(task => (
                            <li key={task.id} className={task.completed ? 'completed' : ''}>
                                <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)}/>
                                <span>{task.title}</span>
                                {task.starred && <span> ⭐</span>}
                                <div className="meta">
                                    <small>Due: {task.dueDate || '—'}</small>
                                    <small>Priority: {task.priority}</small>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Tip Box */}
            <div className="task-tip">
                <p>{tips[tipIndex]}</p>
                <button onClick={() => setTipIndex((tipIndex + 1) % tips.length)}>New Tip</button>
            </div>
        </div>
    );
}

export default TodosPage;