import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import AgentDashboardPage from "./AgentDashboardPage";
import CustomerDashboardPage from "./CustomerDashboardPage";
import AdminDashboard from "../components/AdminDashboard";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
   if (user.role === 'Admin') {
      return <AdminDashboard />;
  }

console.log(user);

  // Show the correct dashboard based on the user's role
  return user.role === "Agent" ? <AgentDashboardPage /> : <CustomerDashboardPage />;
};

export default DashboardLayout;
