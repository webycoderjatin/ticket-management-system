// src/components/AgentControls.jsx
import React, { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast , ToastContainer  , Bounce} from 'react-toastify';

const AgentControls = ({ ticket, onUpdateSuccess }) => {
  const { token } = useContext(AuthContext);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const config = {
        headers: { 'x-auth-token': token },
      };
      
      const body = {
        status: newStatus,
        version: ticket.__v, // Send the ticket's version for optimistic locking
      };

      const res = await axios.patch(
        `/api/tickets/${ticket._id}`,
        body,
        config
      );

      // Call the parent's update function to refresh the UI
      onUpdateSuccess(res.data);
      toast.success('Status updated successfully!');

    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Handle the optimistic locking conflict
        alert('Conflict: This ticket was updated by someone else. Please refresh the page.');
      } else {
        console.error('Failed to update status:', err);
        alert('An error occurred while updating the status.');
      }
    }
  };

  return (
    <div style={{ background: '#eef', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
      <label htmlFor="status-select">Change Status: </label>
      <select 
        id="status-select" 
        value={ticket.status} 
        className={`border-2 border-gray-200 rounded-lg p-2 outline-none ${ticket.status === 'Open' ? 'text-green-500 font-bold' : ticket.status === 'In Progress' ? 'text-yellow-500 font-bold' : 'text-red-500 font-bold'}`}
        onChange={handleStatusChange}
      >
        <option value="Open" className='text-green-500 font-bold'>Open</option>
        <option value="In Progress" className='text-yellow-500 font-bold'>In Progress</option>
        <option value="Closed" className='text-red-500 font-bold'>Closed</option>
      </select>
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

export default AgentControls;