import React, { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
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

    if (user && user.role === 'Admin') {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [user]);

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
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-gray" style={{ padding: '16px' }}>No users found.</p>}
      </div>
    </div>
  );
};

export default Users;
