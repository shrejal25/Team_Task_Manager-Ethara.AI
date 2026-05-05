import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Edit, Trash2 } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'Admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting user');
        console.error(err);
      }
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/auth/users/${editUser._id}`, editUser);
      setShowEditModal(false);
      fetchUsers(); // Refresh to get updated data
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user');
      console.error(err);
    }
  };

  if (loading) return <div className="loader">Loading Users...</div>;

  if (user.role !== 'Admin') {
    return (
      <div className="page-container">
        <h1 className="page-title text-red">Access Denied</h1>
        <p className="text-gray">You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Users Directory</h1>
      </div>

      <div className="section-card">
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Name</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Email</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Role</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)' }}>Joined</th>
              <th style={{ padding: '12px', color: 'var(--text-secondary)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <td style={{ padding: '16px 12px' }}>{u.name}</td>
                <td style={{ padding: '16px 12px' }} className="text-gray">{u.email}</td>
                <td style={{ padding: '16px 12px' }}>
                  <span className={`status-badge ${u.role === 'Admin' ? 'bg-blue' : 'bg-green'}`}>
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '16px 12px' }} className="text-gray text-sm">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ padding: '6px 8px' }}
                      onClick={() => {
                        setEditUser({ _id: u._id, name: u.name, email: u.email, role: u.role });
                        setShowEditModal(true);
                      }}
                    >
                      <Edit size={14} />
                    </button>
                    {user._id !== u._id && (
                      <button 
                        className="btn-secondary text-red" 
                        style={{ padding: '6px 8px', borderColor: 'var(--danger)' }}
                        onClick={() => handleDeleteUser(u._id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-gray" style={{ padding: '16px' }}>No users found.</p>}
      </div>

      {showEditModal && editUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit User</h2>
            <form onSubmit={handleUpdateUser}>
              <div className="form-group">
                <label>Name</label>
                <input type="text" value={editUser.name} onChange={(e) => setEditUser({...editUser, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={editUser.email} onChange={(e) => setEditUser({...editUser, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select value={editUser.role} onChange={(e) => setEditUser({...editUser, role: e.target.value})} required>
                  <option value="Admin">Admin</option>
                  <option value="Member">Member</option>
                </select>
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

export default Users;
