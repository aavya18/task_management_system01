import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../utils/api';
import TaskCard from '../components/TaskCard';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      // Update local state
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) return <div>Loading tasks...</div>;

  const todoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');

  return (
    <div className="tasks-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">My Tasks</h1>
      </div>

      <div className="kanban-board">
        <div className="kanban-column">
          <div className="kanban-header">
            <h3>To Do</h3>
            <span className="task-count">{todoTasks.length}</span>
          </div>
          <div className="kanban-cards">
            {todoTasks.map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
            ))}
            {todoTasks.length === 0 && <div className="empty-column">No tasks here</div>}
          </div>
        </div>

        <div className="kanban-column">
          <div className="kanban-header">
            <h3>In Progress</h3>
            <span className="task-count">{inProgressTasks.length}</span>
          </div>
          <div className="kanban-cards">
            {inProgressTasks.map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
            ))}
            {inProgressTasks.length === 0 && <div className="empty-column">No tasks here</div>}
          </div>
        </div>

        <div className="kanban-column">
          <div className="kanban-header">
            <h3>Done</h3>
            <span className="task-count">{doneTasks.length}</span>
          </div>
          <div className="kanban-cards">
            {doneTasks.map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
            ))}
            {doneTasks.length === 0 && <div className="empty-column">No tasks here</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
