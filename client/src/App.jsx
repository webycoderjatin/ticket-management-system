import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './pages/DashboardLayout';  
import './App.css';
import AccountSettings from './components/AccountSettings';
import PrivateRoute from './components/PrivateRoute';
import YourTickets from './components/YourTickets'; // This is now our main dashboard router
import CreateTicket from './components/CreateTicket';
import TicketDetailPage from './pages/TicketDetailPage';

const App = () => {
  console.log("VITE_API_BASE_URL from build:", import.meta.env.VITE_API_BASE_URL);
  return (
     <div>
      <h1 className='text-3xl text-start font-bold text-purple-600'>HelpDesk Mini<span className='text-green-500 text-4xl'>.</span></h1>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- Protected Routes (All use the main layout) --- */}
        <Route
          element={
            <PrivateRoute>
              <DashboardLayout />
            </PrivateRoute>
          }
        >
          {/* This is the default page for logged-in users */}
          <Route path="/tickets" element={<YourTickets />} />
          <Route path="/tickets/new" element={<CreateTicket />} />
          <Route path="/settings" element={<AccountSettings />} />
        </Route>

        {/* --- Standalone Protected Route (No Sidebar) --- */}
        <Route
          path="/tickets/:id"
          element={
            <PrivateRoute>
              <TicketDetailPage />
            </PrivateRoute>
          }
        />

        {/* --- Redirects --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Redirect any old /dashboard links to the new /tickets page */}
        <Route path="/dashboard/*" element={<Navigate to="/tickets" />} />
      </Routes>
    </div>
  );
};

export default App;