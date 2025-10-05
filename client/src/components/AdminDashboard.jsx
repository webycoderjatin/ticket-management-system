import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ToastContainer , toast , Bounce } from 'react-toastify';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const { token } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const config = { headers: { 'x-auth-token': token } };
      const res = await axios.get('http://localhost:5001/api/users', config);
      setUsers(res.data);
      
    } catch (err) {
      console.error("Failed to fetch users:", err);
      
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const handleRoleChange = async (userId, newRole) => {
    try {
        const config = { headers: { 'x-auth-token': token } };
        await axios.patch(`http://localhost:5001/api/users/${userId}/role`, { role: newRole }, config);
        fetchUsers(); 
        toast.success('Role updated successfully!');
    } catch (err) {
        alert('Failed to update role.');
        console.error(err);
        toast.error('Failed to update role.');
    }
  };

  return (
    <div className='m-10'>
      <h1 className="text-3xl font-bold mb-4 text-center">Admin Dashboard: User Management</h1>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Email</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Current Role</th>
            <th style={{ padding: '10px', border: '1px solid #ddd' }}>Change Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.email}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.role}</td>
              <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                  <option value="Customer">Customer</option>
                  <option value="Agent">Agent</option>
                  <option value="Admin">Admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </div>
  );
};

export default AdminDashboard;