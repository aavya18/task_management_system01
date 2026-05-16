import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Users, Shield, UserPlus } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import './ProjectDetails.css';

const ProjectDetails = () => {
  const { id } = useParams();
  const [projectData, setProjectData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // for adding members
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const { user } = useContext(AuthContext);

  const [newTask, setNewTask] = useState({
    title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: ''
  });
  const [newMemberId, setNewMemberId] = useState('');

  const fetchData = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?projectId=${id}`)
      ]);
      setProjectData(projectRes.data);
      setTasks(tasksRes.data);
      
      if (user?.role === 'Admin') {
        const usersRes = await api.get('/auth/users');
        setUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Failed to fetch project details', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post('/tasks', { ...newTask, project: id });
      setShowTaskModal(false);
      setNewTask({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '' });
      fetchData(); // refresh
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/projects/${id}/members`, { userId: newMemberId });
      setShowMemberModal(false);
      setNewMemberId('');
      fetchData(); // refresh
    } catch (error) {
      console.error('Failed to add member', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  if (loading) return <div>Loading project details...</div>;
  if (!projectData) return <div>Project not found.</div>;

  const isAdmin = user?.role === 'Admin' || projectData.creator._id === user?._id;

  return (
    <div className="project-details animate-fade-in">
      <div className="project-header">
        <div>
          <h1 className="page-title">{projectData.name}</h1>
          <p className="project-desc-large">{projectData.description}</p>
        </div>
        <div className="header-actions">
          {isAdmin && (
            <button className="btn btn-outline" onClick={() => setShowMemberModal(true)}>
              <UserPlus size={18} /> Add Member
            </button>
          )}
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </div>

      <div className="project-content">
        <div className="tasks-section">
          <h2>Project Tasks</h2>
          <div className="task-grid">
            {tasks.map(task => (
              <TaskCard key={task._id} task={task} onStatusChange={handleStatusChange} />
            ))}
            {tasks.length === 0 && <div className="empty-state">No tasks created yet.</div>}
          </div>
        </div>

        <div className="members-sidebar">
          <h2>Team Members</h2>
          <ul className="member-list">
            <li className="member-item">
              <div className="avatar small">{projectData.creator.name.charAt(0).toUpperCase()}</div>
              <div className="member-info">
                <span className="member-name">{projectData.creator.name}</span>
                <span className="member-role badge badge-done">Creator</span>
              </div>
            </li>
            {projectData.members.filter(m => m._id !== projectData.creator._id).map(member => (
              <li key={member._id} className="member-item">
                <div className="avatar small">{member.name.charAt(0).toUpperCase()}</div>
                <div className="member-info">
                  <span className="member-name">{member.name}</span>
                  <span className="member-role">Member</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Create New Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label>Task Title</label>
                <input type="text" className="input-field" required value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea className="input-field" rows="3" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label>Due Date</label>
                  <input type="date" className="input-field" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div className="input-group">
                  <label>Priority</label>
                  <select className="input-field" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label>Assign To</label>
                <select className="input-field" value={newTask.assignedTo} onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned</option>
                  <option value={projectData.creator._id}>{projectData.creator.name}</option>
                  {projectData.members.filter(m => m._id !== projectData.creator._id).map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Modal */}
      {showMemberModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <h2>Add Team Member</h2>
            <form onSubmit={handleAddMember}>
              <div className="input-group">
                <label>Select User</label>
                <select className="input-field" required value={newMemberId} onChange={e => setNewMemberId(e.target.value)}>
                  <option value="">Select a user...</option>
                  {users.filter(u => !projectData.members.some(m => m._id === u._id)).map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowMemberModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Member</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
