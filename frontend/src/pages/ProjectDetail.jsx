import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // New task state
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });

  // Edit task state
  const [showTaskEditModal, setShowTaskEditModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // Edit project state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editProject, setEditProject] = useState({ name: '', description: '', members: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, tasksRes, usersRes] = await Promise.all([
          api.get(`/projects/${id}`),
          api.get(`/tasks?project=${id}`),
          user.role === 'Admin' ? api.get('/auth/users') : Promise.resolve({ data: [] })
        ]);
        setProject(projRes.data);
        setTasks(tasksRes.data);
        if (user.role === 'Admin') setUsers(usersRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user.role]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { ...newTask, project: id });
      setTasks([...tasks, res.data]);
      setShowModal(false);
      setNewTask({ title: '', description: '', assignedTo: '', dueDate: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { status: newStatus });
      setTasks(tasks.map(t => t._id === taskId ? res.data : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/tasks/${editTask._id}`, editTask);
      setTasks(tasks.map(t => t._id === editTask._id ? res.data : t));
      setShowTaskEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/projects/${id}`, editProject);
      // Backend populate doesn't return full user objects for members if we just passed IDs, 
      // but in our modified controller, we should re-fetch or populate. 
      // For simplicity, we can just re-fetch the project.
      const projRes = await api.get(`/projects/${id}`);
      setProject(projRes.data);
      setShowEditModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        navigate('/projects');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) return <div className="loader">Loading Project...</div>;

  const columns = ['To Do', 'In Progress', 'Done'];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">{project.name}</h1>
          <p className="text-gray">{project.description}</p>
        </div>
        {user.role === 'Admin' && (
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn-secondary" onClick={() => {
              setEditProject({ 
                name: project.name, 
                description: project.description, 
                members: project.members.map(m => m._id) 
              });
              setShowEditModal(true);
            }}>
              <Edit size={18} /> Edit Project
            </button>
            <button className="btn-secondary text-red" onClick={handleDeleteProject} style={{ border: '1px solid var(--danger)' }}>
              <Trash2 size={18} /> Delete
            </button>
            <button className="btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={18} /> Add Task
            </button>
          </div>
        )}
      </div>

      <div className="kanban-board">
        {columns.map(status => (
          <div key={status} className="kanban-column">
            <h3>{status}</h3>
            <div className="kanban-tasks">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} className="task-card">
                  <h4>{task.title}</h4>
                  <p className="task-desc">{task.description}</p>
                  <div className="task-meta">
                    {task.assignedTo && <span className="assignee">{task.assignedTo.name || 'Assigned'}</span>}
                    {task.dueDate && <span className="due-date text-sm text-gray">{new Date(task.dueDate).toLocaleDateString('en-GB')}</span>}
                  </div>
                  <div className="task-actions" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <select 
                      value={task.status} 
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                      disabled={user.role !== 'Admin' && task.assignedTo?._id !== user._id}
                    >
                      {columns.map(col => (
                        <option key={col} value={col}>{col}</option>
                      ))}
                    </select>
                    {user.role === 'Admin' && (
                      <button 
                        className="btn-secondary" 
                        style={{ padding: '6px 8px' }}
                        onClick={() => {
                          setEditTask({
                            _id: task._id,
                            title: task.title,
                            description: task.description || '',
                            assignedTo: task.assignedTo?._id || '',
                            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
                            status: task.status
                          });
                          setShowTaskEditModal(true);
                        }}
                      >
                        <Edit size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={newTask.title} onChange={(e) => setNewTask({...newTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={newTask.description} onChange={(e) => setNewTask({...newTask, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={newTask.assignedTo} onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.filter(u => u.role === 'Member').map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTaskEditModal && editTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Task</h2>
            <form onSubmit={handleUpdateTask}>
              <div className="form-group">
                <label>Title</label>
                <input type="text" value={editTask.title} onChange={(e) => setEditTask({...editTask, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={editTask.description} onChange={(e) => setEditTask({...editTask, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Assign To</label>
                <select value={editTask.assignedTo} onChange={(e) => setEditTask({...editTask, assignedTo: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.filter(u => u.role === 'Member').map(u => (
                    <option key={u._id} value={u._id}>{u.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input type="date" value={editTask.dueDate} onChange={(e) => setEditTask({...editTask, dueDate: e.target.value})} />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowTaskEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Project</h2>
            <form onSubmit={handleUpdateProject}>
              <div className="form-group">
                <label>Project Name</label>
                <input type="text" value={editProject.name} onChange={(e) => setEditProject({...editProject, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea value={editProject.description} onChange={(e) => setEditProject({...editProject, description: e.target.value})} rows="3"></textarea>
              </div>
              <div className="form-group">
                <label>Assign Members</label>
                <div className="checkbox-list">
                  {users.filter(u => u.role === 'Member').map(u => (
                    <label key={u._id} className="checkbox-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        value={u._id}
                        checked={editProject.members.includes(u._id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEditProject({...editProject, members: [...editProject.members, u._id]});
                          } else {
                            setEditProject({...editProject, members: editProject.members.filter(id => id !== u._id)});
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
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
