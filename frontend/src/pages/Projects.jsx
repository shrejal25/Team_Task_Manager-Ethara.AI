import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchProjects();
    if (user.role === 'Admin') {
      fetchUsers();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="loader">Loading Projects...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Projects</h1>
        {user.role === 'Admin' && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <Link to={`/projects/${project._id}`} key={project._id} className="project-card">
            <h3>{project.name}</h3>
            <p className="project-desc">{project.description}</p>
            <div className="project-footer">
              <span className="member-count">{project.members.length} members</span>
            </div>
          </Link>
        ))}
        {projects.length === 0 && <p className="text-gray">No projects found.</p>}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create New Project</h2>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" value={newProject.name} onChange={(e) => setNewProject({...newProject, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newProject.description} onChange={(e) => setNewProject({...newProject, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Assign Members</label>
                <div className="checkbox-list">
                  {users.filter(u => u.role === 'Member').map(u => (
                    <label key={u._id} className="checkbox-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        value={u._id}
                        checked={newProject.members.includes(u._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewProject({...newProject, members: [...newProject.members, u._id]});
                          } else {
                            setNewProject({...newProject, members: newProject.members.filter(id => id !== u._id)});
                          }
                        }}
                        style={{ width: 'auto', cursor: 'pointer', margin: 0 }}
                      />
                      <span className="text-gray">{u.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
