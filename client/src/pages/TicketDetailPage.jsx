import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useState } from "react";
import AgentControls from "../components/AgentControls";
import PersonPlaceholder from "../assets/person-placeholder.jpg";
import { ToastContainer , toast , Bounce} from "react-toastify";

const TicketDetailPage = () => {
  const param = useParams();
  const { token, user } = useContext(AuthContext);
  const [ticketDetail, setTicketDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      if (!token) {
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${param.id}`,
          { headers: { "x-auth-token": token } }
        );
        setLoading(false);
        setTicketDetail(response.data);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (comment.trim() === "") {
      alert("Please enter a comment.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      };

      const body = JSON.stringify({ text: comment });

      
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/tickets/${param.id}/comments`, // Assumes 'id' is from useParams
        body,
        config
      );

      // 3. Update the component's state with the new ticket data from the server
      // The response 'res.data' contains the full ticket object with the new comment included.
      setTicketDetail(res.data);
      toast.success("Comment added successfully!");
      // 4. Clear the input box for the next comment
      setComment("");
    } catch (err) {
      console.error("Failed to post comment:", err.response.data);
      alert("Error: Could not add your comment.");
      toast.error("Error: Could not add your comment.");
    }
  };

  const timeAgo = (createdAt) => {
    const diff = Date.now() - new Date(createdAt).getTime(); // ms
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return `${seconds}s ago`;
  };

  return (
    <div className="w-2/3 mx-auto">
      {loading || !ticketDetail ? (
        <div className="text-3xl text-center font-bold absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          Loading...
        </div>
      ) : (
        <div>
          <div
            className={` mt-15 border border-3 rounded-lg border-dashed p-3 relative w-full my-3 ${
              ticketDetail.priority == "Low"
                ? "border-yellow-500 bg-yellow-100"
                : ticketDetail.priority == "Medium"
                ? "border-purple-500 bg-purple-100"
                : "border-red-500 bg-red-100"
            }`}
          >
            <p
              className={`absolute top-3 right-3 text-white px-2 rounded-lg ${
                ticketDetail.priority == "Low"
                  ? "bg-yellow-500"
                  : ticketDetail.priority == "Medium"
                  ? "bg-purple-500"
                  : "bg-red-500"
              }`}
            >
              {ticketDetail.priority}
            </p>
            <h1 className="text-2xl font-bold mb-3">{ticketDetail.title}</h1>
            <p>{ticketDetail.description}</p>
            <p>
              Status :{" "}
              <span
                className={`font-bold ${
                  ticketDetail.status === "Open"
                    ? "text-green-500"
                    : ticketDetail.status === "Closed"
                    ? "text-red-500"
                    : "text-yellow-500"
                }`}
              >
                {ticketDetail.status}
              </span>
            </p>
            <p>
              Date Created :{" "}
              {ticketDetail.createdAt &&
                new Date(ticketDetail.createdAt).toLocaleDateString()}
            </p>
          </div>
          {user && user.role === "Agent" && (
            <AgentControls
              ticket={ticketDetail}
              onUpdateSuccess={setTicketDetail}
            />
          )}
          <h1 className="text-xl font-bold mt-10">Comments</h1>
          {ticketDetail.comments && ticketDetail.comments.length > 0 ? (
            ticketDetail.comments.map((comment) => (
              <div
                className={` rounded-lg p-3 relative w-full my-2 ${comment.author.role === "Agent" ? "bg-green-200" : "bg-gray-100"}`}
                key={comment._id}
              >
                <div className="flex gap-3 items-center">
                  <img
                    src={PersonPlaceholder}
                    alt=""
                    className="w-9 h-9 rounded-full border border-1 border-gray-500"
                  />

                  <div className="flex flex-col gap-0 items-start">
                    <h1 className="text-sm font-medium">{comment.author.role === "Agent" ? "HelpDesk Agent" : "Anonymous"}</h1>
                    <p>{timeAgo(comment.createdAt)}</p>
                  </div>
                </div>
                <h1 className="text-lg mb-3 mt-2">{comment.text}</h1>
              </div>
            ))
          ) : (
            <h1 className="text-2xl font-bold text-gray-400 m-10 text-center">
              {ticketDetail.status === "Closed"
                ? "Ticket Closed"
                : "No comments yet"}
            </h1>
          )}
          <form onSubmit={handleComment}>
            <h1 className="text-xl font-bold mb-1">Add a comment</h1>
            <div className="flex gap-3">
              <input
                type="text"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
                disabled={!token || ticketDetail.status === "Closed"}
                placeholder="Enter your comment here"
                className="w-full p-2 border border-2 border-gray-200 rounded-lg outline-none"
              />
              <button
                className={`bg-black text-white p-2 rounded-lg ${
                  ticketDetail.status === "Closed"
                    ? "opacity-50 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                type="submit"
                disabled={!token || ticketDetail.status === "Closed"}
              >
                Comment
              </button>
            </div>
          </form>
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
      )}
    </div>
  );
};

export default TicketDetailPage;
