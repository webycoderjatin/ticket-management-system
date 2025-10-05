import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardLayout = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  
  if (user?.role === "Agent" || user?.role === "Admin") {
    return (
      <div className="mx-10 my-10">
        <Outlet />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl text-center font-bold mt-10">HelpDesk System</h1>
      <div className="flex gap-5 mx-20 my-10">
        <div className="w-[350px] h-100 border-0 border-r-2 border-gray-200 p-5 bg-white fixed">
          <ul className="flex flex-col gap-3 mt-4">
            <Link to="/tickets/new">
              <li className="p-2 mr-5 text-white bg-black text-center font-medium rounded-lg">
                <i className="fa-solid fa-plus"></i> Create New Ticket
              </li>
            </Link>
            <Link to="/tickets">
              <li className="p-2 mr-5 text-gray-600 font-medium">
                <i className="fa-solid fa-ticket"></i> &nbsp; Your Tickets
              </li>
            </Link>
            <Link to="/settings">
              <li className="p-2 mr-5 text-gray-600 font-medium">
                <i className="fa-solid fa-user"></i> &nbsp; Account Settings
              </li>
            </Link>
            <li className="p-2 mr-5 text-gray-600 font-medium">
              <i className="fa-solid fa-circle-question"></i> &nbsp; FAQ
            </li>
            <li
              className="text-red-500 p-2 mr-5 rounded-lg font-medium cursor-pointer"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-power-off"></i> Log Out
            </li>
          </ul>
        </div>
        <div className="w-full ml-[375px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
