import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

const AgentDashboardPage = () => {
  const [tickets, setTickets] = useState([]);
  const { token } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBreached, setShowBreached] = useState(false);

  useEffect(() => {
    const fetchAllTickets = async () => {
      if (!token) return;
      try {
        const config = { headers: { "x-auth-token": token } , params: {} };

        if (searchTerm) {
          config.params.search = searchTerm;
        }
        if (showBreached) {
          config.params.breached = true;
        }

        const res = await axios.get(
          "http://localhost:5001/api/tickets",
          config
        );
        setTickets(res.data.items);
      } catch (err) {
        console.error("Failed to fetch tickets:", err);
      }
    };
    fetchAllTickets();
  }, [token, searchTerm, showBreached]);

  return (
    <div>
      <h1 className="text-center font-bold text-2xl my-10">Agent dashboard</h1>
      <div className="flex gap-5 mx-20 my-10">
        <div className="flex flex-col justify-between items-start w-full">
          <div className="flex justify-between w-full">
            <h1 className="text-lg my-10">
              All active support tickets from all users.
            </h1>
            <div className="flex items-center">
              <input
                type="search"
                name=""
                id=""
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Tickets..."
                className="border-2 border-gray-200 rounded-lg p-2 w-full outline-none"
              />
              <button className="text-white bg-black py-2 px-1 mx-1 rounded-lg cursor-pointer text-sm w-full" onClick={() => setShowBreached(!showBreached)}>
                {showBreached
                  ? "Show All Tickets"
                  : "Show Only Breached Tickets"}{" "}
              </button>
            </div>
          </div>

          <table
            style={{
              width: "100%",
              marginTop: "20px",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ background: "#eee" }}>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Title
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Priority
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Status
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Created At
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket._id}>
                  <td
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                    className=""
                  >
                    {ticket.title}
                  </td>
                  <td
                    style={{ padding: "10px", border: "1px solid #ddd" }}
                    className={`text-white ${
                      ticket.priority === "Low"
                        ? "bg-yellow-500"
                        : ticket.priority === "Medium"
                        ? "bg-purple-500"
                        : "bg-red-500"
                    }`}
                  >
                    {ticket.priority}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {ticket.status}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <Link
                      to={`/tickets/${ticket._id}`}
                      className="text-white bg-black py-2 px-4 rounded-lg"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboardPage;
