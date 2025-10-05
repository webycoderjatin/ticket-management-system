import React from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useContext } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const YourTickets = () => {

    const {token} = useContext(AuthContext);
    const [tickets , setTickets] = useState([])

    useEffect(() => {
      const fetchTickets = async () => {
          if(!token){
            return
          }

          try{
            const config = {
                headers : {
                    'x-auth-token': token,
                }
            }
          const response = await axios.get("http://localhost:5001/api/tickets", config)
          setTickets(response.data.items)
          }catch(err){
            console.log(err);
          }

      }

      fetchTickets()
    }, []);

  return (
    <div className='w-full'>
      <h1 className='text-xl font-bold mb-5'>Your Tickets</h1>
      {
        tickets.map((ticket , index) => {
            return(
                <div key={index} className={`border border-3 rounded-lg border-dashed p-3 relative w-full my-3 ${ticket.priority == "Low" ? "border-yellow-500 bg-yellow-100" : ticket.priority == "Medium" ? "border-purple-500 bg-purple-100" : "border-red-500 bg-red-100"}`}>
                    <div className='absolute top-3 right-3'>{ticket.createdAt.split("T")[0]}</div>
                    <p className={`inline-block px-2 rounded-sm text-white mb-3 ${ticket.priority == "Low" ? "bg-yellow-500" : ticket.priority == "Medium" ? "bg-purple-500" : "bg-red-500"}`}>{ticket.priority}</p>
                    <h2 className='text-xl font-medium'>{ticket.title}</h2>
                    <p>{ticket.description}</p>
                    <Link to={`/tickets/${ticket._id}`}><button className='bg-black text-white px-3 py-2 rounded-lg mt-3 cursor-pointer'>View Details</button></Link>
                </div>
            )
        })
      }
    </div>
  );
}

export default YourTickets;
