import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        setTasks(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tasks', err);
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="loader">Loading Dashboard...</div>;

  const today = new Date();
  
  const toDoTasks = tasks.filter(t => t.status === 'To Do');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');
  const overdueTasks = tasks.filter(t => t.dueDate && new Date(t.dueDate) < today && t.status !== 'Done');

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Welcome back, {user.name} 👋</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon bg-blue"><Clock /></div>
          <div className="stat-details">
            <h3>{toDoTasks.length}</h3>
            <p>To Do</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-yellow"><Clock /></div>
          <div className="stat-details">
            <h3>{inProgressTasks.length}</h3>
            <p>In Progress</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon bg-green"><CheckCircle /></div>
          <div className="stat-details">
            <h3>{doneTasks.length}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card border-red">
          <div className="stat-icon bg-red"><AlertCircle /></div>
          <div className="stat-details">
            <h3 className="text-red">{overdueTasks.length}</h3>
            <p className="text-red">Overdue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h2>Recent Tasks</h2>
          {tasks.slice(0, 5).map(task => (
            <div key={task._id} className="task-list-item">
              <div>
                <h4>{task.title}</h4>
                <p className="text-sm text-gray">{task.project?.name}</p>
              </div>
              <span className={`status-badge status-${task.status.replace(' ', '').toLowerCase()}`}>
                {task.status}
              </span>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-gray">No tasks assigned yet.</p>}
        </div>
        <div className="section-card">
          <h2 className="text-red">Overdue Tasks</h2>
          {overdueTasks.map(task => (
            <div key={task._id} className="task-list-item">
              <div>
                <h4>{task.title}</h4>
                <p className="text-sm text-red">Due: {new Date(task.dueDate).toLocaleDateString('en-GB')}</p>
              </div>
            </div>
          ))}
          {overdueTasks.length === 0 && <p className="text-gray">No overdue tasks. Great job!</p>}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
