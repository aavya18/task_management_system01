import React, { useState, useEffect } from 'react';
import { BarChart3, Clock, CheckCircle2, ListTodo, Shield } from 'lucide-react';
import api from '../utils/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="dashboard animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard Overview</h1>
      </div>

      <div className="stats-grid">
        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent)' }}>
            <ListTodo size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Total Tasks</p>
            <h3 className="stat-value">{stats?.totalTasks || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
            <Shield size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Projects</p>
            <h3 className="stat-value">{stats?.totalProjects || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)' }}>
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Overdue Tasks</p>
            <h3 className="stat-value">{stats?.overdueTasksCount || 0}</h3>
          </div>
        </div>

        <div className="stat-card card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <p className="stat-label">Completed</p>
            <h3 className="stat-value">{stats?.tasksByStatus?.done || 0}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="card dashboard-chart-area">
          <h3>Task Status Distribution</h3>
          <div className="status-bars">
            <div className="status-bar-container">
              <div className="status-label">To Do ({stats?.tasksByStatus?.toDo || 0})</div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${(stats?.tasksByStatus?.toDo / (stats?.totalTasks || 1)) * 100}%`, backgroundColor: '#94a3b8' }}></div>
              </div>
            </div>
            <div className="status-bar-container">
              <div className="status-label">In Progress ({stats?.tasksByStatus?.inProgress || 0})</div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${(stats?.tasksByStatus?.inProgress / (stats?.totalTasks || 1)) * 100}%`, backgroundColor: 'var(--warning)' }}></div>
              </div>
            </div>
            <div className="status-bar-container">
              <div className="status-label">Done ({stats?.tasksByStatus?.done || 0})</div>
              <div className="progress-bg">
                <div className="progress-fill" style={{ width: `${(stats?.tasksByStatus?.done / (stats?.totalTasks || 1)) * 100}%`, backgroundColor: 'var(--success)' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card recent-activity">
          <h3>Recent Tasks</h3>
          <div className="activity-list">
            {stats?.recentTasks?.map(task => (
              <div key={task._id} className="activity-item">
                <div className="activity-info">
                  <span className="activity-task">{task.title}</span>
                  <span className="activity-project">{task.project?.name}</span>
                </div>
                <div className={`badge badge-${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </div>
              </div>
            ))}
            {(!stats?.recentTasks || stats.recentTasks.length === 0) && (
              <div className="empty-state">No recent tasks.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
