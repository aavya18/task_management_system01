import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Folder, Users } from 'lucide-react';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const { user } = useContext(AuthContext);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
    } catch (error) {
      console.error('Failed to fetch projects', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project', error);
    }
  };

  if (loading) return <div>Loading projects...</div>;

  return (
    <div className="projects-page animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Project
        </button>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card card">
            <div className="project-icon">
              <Folder size={24} />
            </div>
            <h3 className="project-title">{project.name}</h3>
            <p className="project-desc">{project.description || 'No description provided.'}</p>
            
            <div className="project-footer">
              <div className="project-members">
                <Users size={16} />
                <span>{project.members?.length || 0} Members</span>
              </div>
              {project.creator === user?._id && <span className="badge badge-done">Admin</span>}
            </div>
          </Link>
        ))}
        {projects.length === 0 && (
          <div className="empty-state">
            <Folder size={48} />
            <h3>No projects found</h3>
            <p>Create your first project to get started.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel animate-fade-in">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="input-group">
                <label>Project Name</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={newProject.name} 
                  onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  className="input-field" 
                  rows="3"
                  value={newProject.description} 
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
