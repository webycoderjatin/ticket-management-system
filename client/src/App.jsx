import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout'; 
import PrivateRoute from './components/PrivateRoute';
import YourTickets from './components/YourTickets'; 
import CreateTicket from './components/CreateTicket'; 
import TicketDetailPage from './pages/TicketDetailPage'; 
import './App.css';
import AccountSettings from './components/AccountSettings';

const App = () => {
  return (
    <div>
      <Routes>
        
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

       
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          <Route path='/settings' element={<AccountSettings/>}/>
          <Route path="/tickets" element={<YourTickets />} />
          <Route path="/tickets/new" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetailPage />} />
        </Route>

        
        <Route path="/" element={<Navigate to="/login" />} />
        
      </Routes>
    </div>
  );
};

export default App;