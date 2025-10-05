import React from "react";
import { useState } from "react";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { Bounce, ToastContainer, toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const CreateTicket = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const { token } = useContext(AuthContext);

  const showToast = () => {
    toast.success("Ticket Submitted Successfully!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      return;
    }

    try {
      const idempotencyKey = uuidv4()

      const config = {
        headers: {
          "x-auth-token": token,
          'Idempotency-Key': idempotencyKey
        },
      };
      await axios.post(
        "http://localhost:5001/api/tickets",
        {
          title,
          description,
          priority,
        },
        config
      );

      showToast();
    } catch (err) {
      console.log(err);

    }
  };

  return (
    <div className="ml-20">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="">Title</label>
          <input
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            required
            placeholder="e.g. Urgent Concern About..."
            className="text-lg p-2 rounded-lg w-[500px] outline-none border border-2 border-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Description</label>
          <textarea
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
            placeholder="Description about the concern..."
            className="text-lg p-2 rounded-lg w-[500px] h-[200px] resize-none outline-none border border-2 border-gray-200"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="">Priority</label>

          <div className="flex gap-7">
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                onChange={() => setPriority("Low")}
                required
                name="priority"
                id="low"
                className="w-4 h-4"
              />
              <label
                htmlFor="low"
                className="text-lg font-bold text-yellow-500 cursor-pointer"
              >
                Low
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                onChange={() => setPriority("Medium")}
                name="priority"
                id="mid"
                className="w-4 h-4"
              />
              <label
                htmlFor="mid"
                required
                className="text-lg font-bold text-purple-500 cursor-pointer"
              >
                Medium
              </label>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="radio"
                onChange={() => setPriority("High")}
                name="priority"
                id="high"
                className="w-4 h-4"
              />
              <label
                htmlFor="high"
                required
                className="text-lg font-bold text-red-500 cursor-pointer"
              >
                High
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-orange-500 text-white font-bold text-lg p-2 rounded-lg w-1/2 mt-5 cursor-pointer"
        >
          Submit Ticket
        </button>
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
  );
};

export default CreateTicket;
