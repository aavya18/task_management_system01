import React from 'react';
import { Calendar, Flag, User } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, onStatusChange }) => {
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'High': return 'badge-high';
      case 'Medium': return 'badge-medium';
      case 'Low': return 'badge-low';
      default: return 'badge-medium';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'To Do': return 'badge-todo';
      case 'In Progress': return 'badge-inprogress';
      case 'Done': return 'badge-done';
      default: return 'badge-todo';
    }
  };

  const formattedDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date';

  return (
    <div className="task-card card">
      <div className="task-header">
        <span className={`badge ${getPriorityClass(task.priority)}`}>
          {task.priority}
        </span>
        
        {/* Status Dropdown to easily change status */}
        <select 
          className={`status-select badge ${getStatusClass(task.status)}`}
          value={task.status}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>
      
      <h3 className="task-title">{task.title}</h3>
      <p className="task-desc">{task.description}</p>
      
      <div className="task-footer">
        <div className="task-meta">
          <Calendar size={14} />
          <span>{formattedDate}</span>
        </div>
        
        {task.assignedTo && (
          <div className="task-assignee" title={`Assigned to ${task.assignedTo.name || 'someone'}`}>
            <div className="avatar small">
              {task.assignedTo.name ? task.assignedTo.name.charAt(0).toUpperCase() : <User size={14} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
